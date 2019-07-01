import React from 'react'
import { Table, Button, Popconfirm, Form, Modal, Spin } from 'antd';
import CollectionCreateForm from './CollectionCreateForm'
import ApiUtils from '../../utils/ApiUtils'
import SearchCell from './SearchCell'
import DateSearchCell from './DateSearchCell'
import CollectionMultiSearchForm from './CollectionMultiSearchForm';
import EditableCell from './EditableCell'
import axios from '../../utils/axios'
import _ from 'lodash'

export default class MyTable extends React.Component {

  state = {
    addCols: [],
    searchCols: [],
    showCols: [],
    showData: [],
    expandable: true,
    searchText: '',
    optionValues: this.props.optionValues,
    formVisible: false,

    // 数据加载之前
    filtered: false,

    //多重筛选
    multiFormVisible: false,
    multiFilteredData: '',
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.optionValues !== nextProps.optionValues)
      return true
    if (this.state.showData !== nextState.showData)
      return true
    if (this.state.formVisible !== nextState.formVisible)
      return true
    if (this.state.multiFormVisible !== nextState.multiFormVisible)
      return true;
    if (this.state.showCols !== nextState.showCols)
      return true;
    return false;
  }

  componentDidMount() {
    this.selectData()
    this.setState({
      optionValues: this.props.optionValues
    })
  }

  selectData = (isAdd = false) => {
    console.log("table加载")
    let self = this;


    axios.get(self.props.selectUrl)
      .then(
        (result) => {
          let data = result.data;
          if (data.length === 0) {
            self.setState({ filtered: true })
            return
          }
          const keys = data && Object.keys(data[0].data);
          const addCols = data[0].addKey || [];
          const searchCols = data[0].searchKey || [];

          const showCols = keys.map(
            (key) => ({
              title: ApiUtils.getColName(key),
              dataIndex: key,
              render: (text, record) => this.renderColumns(text, record, key),
              sorter: (a, b) => ApiUtils.isNumber(a[key]) && ApiUtils.isNumber(b[key]) ? (a[key] - b[key]) : (a[key] > b[key] ? 1 : -1),
            })
          );

          const showData = data.map((val, key) => ({ ...val.data, key: key, description: val.description, mainKey: val.mainKey }));
          const expandable = _.get(data, '[0].description', false) && _.size(data[0].description) !== 0
          self.setState(
            { addCols, searchCols, showCols, showData, expandable },
            () => {
              if (showCols.length > 0) {
                self.setState({
                  showCols: [
                    ...showCols,

                    this.props.delData ? {
                      title: "操作",
                      dataIndex: "operation",
                      render: (text, record) => {
                        return <Popconfirm
                          title="确认删除？"
                          onConfirm={() => self.handleDelete(record.mainKey.id, record.key)}
                        >
                          <a href="javascript:;">删除</a>
                        </Popconfirm>

                      }
                    } : {}
                  ]
                }, () => { console.log("afterFlash", this.state.showCols) });
                isAdd && this.setState({ showData: [] }, () => this.setState({ showData: showData }))
              }
            }
          );
        }
      )
      .catch((err) => {
        console.log('catch', err)
      })
  }

  renderId2Name = (text, column, condition) => {
    const { optionValues } = this.state;

    if (ApiUtils.isCascader(column)) {
      console.log("text", text, typeof (text))
      let temp = text.split(' / ')
      return temp.length === 0 ? text : temp[0] + ' / ' + _.get(optionValues, column + '[' + temp[0] + '][' + temp[1] + ']', '')
    }

    if (!ApiUtils.isManyID2Name(column) && !ApiUtils.isSelector(column) && !ApiUtils.isLessionId(column)) return text;
    const optionsValue = column === condition ? optionValues[column] || optionsValue : optionValues[column][condition] || optionsValue
    if (!optionsValue) return;
    if (typeof text === "number") text = text + "";
    let value = ""
    // console.log("---text", text)
    text = text.split(",")
    text.map((val, i) => {
      value += ((val in optionsValue ? optionsValue[val] : val) + ",")
    })
    value = value.substring(0, value.length - 1)
    return optionsValue && value;
    // return optionsValue && (text in optionsValue ? optionsValue[text] : text)
  }

  renderColumns = (text, record, column) => {
    let condition = ApiUtils.isLessionId(column) ? record.classifyid : column;
    const { editable } = this.props;
    return (
      <EditableCell
        keyValue={text}
        value={this.renderId2Name(text, column, condition)}
        column={column}
        onChange={(value, successCb, failCb) => this.onCellChange(record.key, column, successCb, failCb)(text, value)}
        optionValues={this.state.optionValues}
        condition={ApiUtils.isLessionId(column) ? { classifyid: record.classifyid } : {}}
        {...this.props}
      />
    )
  }

  renderExpandedRow = (record) => {
    const data = record.description;
    const self = this;
    if (!data) return null;
    const keys = Object.keys(data)
    const column = keys.map((key) => ({
      title: ApiUtils.getColName(key), dataIndex: key,
      render: (text, record) => {
        const value = record[key];
        return ApiUtils.isPhoto(key) ? <img src={value} style={{ width: '100%', height: '20%' }} /> : self.renderId2Name(value, key, column)
      }
    }))

    const dataSource = [{ ...data, key: 0 }];
    return (
      <Table columns={column} dataSource={dataSource} pagination={false} />
    )
  }

  onCellChange = (key, dataIndex, successCb, failCb) => {

    return (text, value) => {
      if (ApiUtils.isSelector(dataIndex) && this.state.optionValues[dataIndex][text] === value) {
        Modal.warning({ content: "修改成功" })
        return;
      }
      const data = [...this.state.showData];
      let target = data.find(item => item.key === key);
      let filterTarget = {}
      let self = this;

      if (target) {
        target[dataIndex] = value;

        axios.post(self.props.upUrl,
          { data: JSON.stringify(target) })
          .then(
            (result) => {
              let msg = result.data;
              let content = msg.status === 200 ? "修改成功" : "修改失败";
              Modal.warning({ content: content })
              if (msg.status === 200) {
                successCb();
                self.setState({ showData: data })
              } else {
                failCb();
              }
            })
          .catch(
            (err) => {
              console.log("catch", err)
              failCb();
            }
          )
      }
    };
  };

  // handleCollectionCreateForm-------------------------------------------------
  handleFormCancel = () => {
    this.setState({ formVisible: false });
  }

  handleFormCreate = (startCb, endCb, extraValidCb) => {
    const form = this.formRef.props.form;
    const isExtraValid = extraValidCb()
    startCb()
    form.validateFields((err, values) => {
      if (err) {
        Modal.warning({
          content: "请填写完整信息！",
        })
        endCb()
        return;
      }

      let dateValues = {}
      Object.keys(values).filter((key) => ApiUtils.isDate(key))
        .forEach((key, i) => {
          {
            dateValues[key] = values[key].format("YYYY-MM-DD HH:mm:ss")
          }
        })
      const sendData = { ...values, ...dateValues }
      axios.post(
        this.props.addUrl,
        { data: JSON.stringify(sendData) })
        .then(
          (result) => {
            let msg = result.data;
            let content = msg.status === 200 ? "添加成功" : "添加失败";
            Modal.warning({ content: content })
            if (msg.status === 200) this.selectData(true)
            endCb()
          })
        .catch(
          (err) => {
            Modal.warning({
              content: "添加失败！"
            })
            endCb()
          }
        )
      form.resetFields();
      this.setState({ formVisible: false });
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  handleAdd = () => {
    this.setState({ formVisible: true });
  }

  // CollectionCreateForm-------------------------------------------------

  // CollectionMultiSearchForm-------------------------------------------------

  handleMultiSearch = () => {
    this.setState({ multiFormVisible: true });
  };

  handleMultiCancel = () => {
    this.setState({ multiFormVisible: false });
  }

  saveMultiFormRef = (formRef) => {
    this.multiFormRef = formRef
  }

  handleMultiSearchForm = (startCb, endCb) => {
    const form = this.multiFormRef.props.form;
    startCb()
    form.validateFields((err, values) => {
      //search这里的检测应该是不可能出现err的情况的
      if (err) {
        Modal.warning({
          content: "请填写完整信息！",
        })
        endCb()
        return;
      }

      //如果条件全部为空
      if (Object.values(values).every(r => (Array.isArray(r) && r.length === 0) || !!!r)) {
        this.setState({ multiFilteredData: this.state.showData, filtered: true, multiFormVisible: false })
        endCb()
        return;
      }

      let dateValues = {}, resultValues = {}
      Object.keys(values).filter(key => values[key])
        .forEach(k => {
          resultValues[k] = values[k]
        })

      Object.keys(resultValues).filter(key => ApiUtils.isDate(key))
        .forEach((key, i) => {
          dateValues[key] = values[key] && values[key].map(v => v.format("YYYY-MM-DD HH:mm:ss"))
        })

      resultValues = {
        ...resultValues,
        ...dateValues
      }

      let resultData = this.state.showData
      resultData = resultData.map(record => {
        return (Object.keys(resultValues).map(
          column => {
            const filterValue = resultValues[column]
            const dataValue = record[column]
            let match = false, matchDate = true, matchInput = true;
            if (ApiUtils.isDate(column)) {
              const [start, end] = filterValue
              matchDate = start <= dataValue && end >= dataValue
            }
            else {
              const renderId2Name = this.renderId2Name;
              const dataValue = ApiUtils.isNumber(record[column]) ? record[column] + "" : record[column]
              const reg = new RegExp(filterValue, "gi");
              //因为下拉框传过来的值也是没render过的 所以直接用datavalue就可以了（datavalue是 id 也就是 123这样的）
              // matchInput = (renderId2Name ? renderId2Name(dataValue, column): dataValue).match(reg) ;
              matchInput = dataValue.match(reg);
            }
            match = matchDate && matchInput
            return match
          }
        ).every(r => !!r) ? record : null)
      }).filter(r => !!r)

      this.setState({ multiFilteredData: resultData, filtered: true })

      endCb()
      this.setState({ multiFormVisible: false });
    });
  }

  renderSearchCell = (column, data) => {
    return (<SearchCell cb={this.cb} column={column} data={data} renderId2Name={this.renderId2Name} />);
  }

  renderDateSearchCell = (column, data) => {
    return (<DateSearchCell cb={this.cb} column={column} data={data} />);

  }


  // CollectionMultiSearchForm-------------------------------------------------

  handleDelete = (dataId, recordKey) => {
    const showData = [...this.state.showData];
    axios.post(
      this.props.delUrl,
      { id: dataId })
      .then(
        (result) => {
          let msg = result.data;
          let content = msg.status === 200 ? "删除成功" : "删除失败";
          Modal.warning({ content: content })
          if (msg.status === 200) this.setState({ showData: showData.filter(item => item.key !== recordKey) });
        })
      .catch(
        (err) => { console.log("catch", err) }
      )
  }



  render() {
    const { addCols, searchCols, showCols, expandable, optionValues } = this.state;
    const data = this.state.multiFilteredData || this.state.showData;
    return (
      (
        data.length === 0 && !this.state.filtered ?
          (
            <div>
              <Spin size="large" />
              <p>正在加载数据...</p>
            </div>
          ) : (
            <div>
              <div style={{
                display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                justifyContent: 'flex-start', alignContent: 'flex-start'
              }}>
                {this.props.addData ? (
                  <div style={{ margin: '0 0 10px 0' }}>
                    <Button type="primary" onClick={this.handleAdd}>
                      增加
                    </Button>
                    <CollectionCreateForm
                      wrappedComponentRef={this.saveFormRef}
                      visible={this.state.formVisible}
                      onCancel={this.handleFormCancel}
                      onCreate={this.handleFormCreate}
                      labels={addCols}

                      optionValues={optionValues}
                      extraFormDemand={this.props.extraFormDemand}
                      extraFormRulesDemand={this.props.extraFormRulesDemand}
                    />
                  </div>
                ) : null}
                {
                  <div style={{ margin: '0 0 10px 10px' }}>
                    <Button type="primary" onClick={this.handleMultiSearch}>
                      多重筛选
                    </Button>
                    <CollectionMultiSearchForm
                      wrappedComponentRef={this.saveMultiFormRef}
                      visible={this.state.multiFormVisible}
                      onCancel={this.handleMultiCancel}
                      onCreate={this.handleMultiSearchForm}
                      labels={this.state.searchCols}

                      optionValues={this.state.optionValues}
                      renderSearchCell={this.renderSearchCell}
                      renderDateSearchCell={this.renderDateSearchCell}
                    />
                  </div>
                }
              </div>
              {
                expandable ? <Table
                  bordered
                  dataSource={data}
                  columns={showCols}
                  expandedRowRender={(record) => this.renderExpandedRow(record)}
                  pagination={{ pageSize: 20, showTotal: (total, range) => `第 ${range[0]} - ${range[1]} 条， 共 ${total} 条` }}
                /> : <Table
                    bordered
                    dataSource={data}
                    columns={showCols}
                    pagination={{ pageSize: 20, showTotal: (total, range) => `第 ${range[0]} - ${range[1]} 条， 共 ${total} 条` }}
                  />
              }
            </div >
          ))
    );
  }
}