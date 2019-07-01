import { Modal, Form, Input, Select, DatePicker } from 'antd';
import React from 'react';
import PicturesWall from './PicturesWall';
import VideosWall from './VideosWall'
import ApiUtils from '../../utils/ApiUtils'
import MyConfig from '../../myConfig/MyConfig'
import editorModalState from '../EditorModal/state'
import EditorModal from '../EditorModal'
import RoleComponent from '../table/RoleComponent'
import roleState from '../table/RoleComponent/state'
import moment from "moment";
import "moment/locale/zh-cn";

const FormItem = Form.Item;

moment.locale("zh-cn");
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {

    state = {
      confirmLoading: false,
      value: '',
      optionValues: {},
      warningText: "",
      warningStatus: true,

      editable: false,

      lessionList: {},
    }


    edit = (_, column) => {
      // 目前仅是editorModal
      ApiUtils.isModal(column) && editorModalState.setVisible(true)
      this.setEditable(true)
    }

    setEditable = (isShow) => {
      this.setState({
        editable: isShow
      })
    }

    setInputValue = v => {

    }

    componentDidMount() {
      this.setState({
        optionValues: this.props.optionValues
      })
    }

    generateOptions = (column) => {
      const { optionValues } = this.state
      const optionsValue = optionValues[column]
      Object.keys(optionsValue).map((val, i) => {
        return <Option key={i} value={val}>{optionsValue[val]}</Option>
      })
    }

    getInitValue = (labelName) => {
      // return apiUtils.isRecorder(labelName) ? apiUtils.getUserInfo().userName : 
      //        apiUtils.isRecordTime(labelName) ? moment() : 
      //        apiUtils.isUpdateTime(labelName) ? moment() : 
      //        apiUtils.isPlanDate(labelName) ? moment('08:00:00', 'HH:mm:ss') : 
      //        apiUtils.isValidDate(labelName) ? moment('08:00:00', 'HH:mm:ss').add(1, 'days') :
      //        undefined
      return undefined
    }

    render() {
      const { visible, onCancel, onCreate, form, optionValues, extraFormDemand, extraFormRulesDemand } = this.props;
      const { getFieldDecorator } = form;
      const { value } = this.state
      const generateItem = (labelName, i) => {
        const optionsValue = optionValues[labelName];
        return (
          <FormItem label={ApiUtils.getColName(labelName)} key={i}>
            {getFieldDecorator(labelName, {
              rules: [{
                required: !(ApiUtils.isAllNeednotInput(labelName) ||
                  (extraFormRulesDemand && ApiUtils.isRulesNeednotInput(labelName))), message: '请输入内容！'
              }],
              // valuePropName: 'checked',
              initialValue: this.getInitValue(labelName),
            })(
              extraFormDemand && ApiUtils.isClassifyId(labelName) ? (
                <Select
                  showSearch
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  /* onChange={(value)=>this.props.form.setFieldsValue({value})} */
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onSelect={ApiUtils.isClassifyId(labelName) ? (classifyid) => ApiUtils.myPostData("/selectNames/queryLessionNamesById", { classifyid: classifyid },
                    (result) => this.setState({ lessionList: result[classifyid] }), () => { console.log("500--error") }) : () => { }}
                >
                  {
                    optionsValue && Object.keys(optionsValue).map((val, i) => {
                      if (optionsValue[val].indexOf(MyConfig.FILTER_KEY) !== -1)
                        return <Option key={i} value={val}>{optionsValue[val]}</Option>
                    })
                  }
                </Select>
              ) : ApiUtils.isSelector(labelName) ? (
                <Select
                  showSearch
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  /* onChange={(value)=>this.props.form.setFieldsValue({value})} */
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onSelect={ApiUtils.isClassifyId(labelName) ? (classifyid) => ApiUtils.myPostData("/selectNames/queryLessionNamesById", { classifyid: classifyid },
                    (result) => this.setState({ lessionList: result[classifyid] }), () => { console.log("500--error") }) : () => { }}
                >
                  {
                    optionsValue && Object.keys(optionsValue).map((val, i) => {
                      return <Option key={i} value={val}>{optionsValue[val]}</Option>
                    })
                  }
                </Select>
              ) :
                  ApiUtils.isDate(labelName) ? (
                    <DatePicker
                      /* initialValue={moment('2018-01-01', 'YYYY-MM-DD')} */
                      showTime={{ defaultValue: moment('08:00:00', 'HH:mm:ss') }}
                      format="YYYY-MM-DD HH:mm:ss"
                      allowClear={false}
                    />
                  ) :
                    ApiUtils.isPhoto(labelName) ? (
                      <PicturesWall position={MyConfig.PIC_POS} isAdd={true} />
                    ) : ApiUtils.isVideo(labelName) ? (
                      <VideosWall position={MyConfig.VID_POS} isAdd={true} />
                    ) : ApiUtils.isLessionId(labelName) ? (
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children">
                        {
                          Object.keys(this.state.lessionList).map((val, i) => {
                            return <Option key={i} value={val}>{this.state.lessionList[val]}</Option>
                          })
                        }
                      </Select>
                    ) : ApiUtils.isModal(labelName) ? (
                      <RoleComponent checkedList={[]} checkList={Object.values(optionsValue)} extraAdd={true} optionsValue={optionsValue} />)
                            // :  ApiUtils.isShrink(labelName) ? (
                            //         <WangEditor />
                            //       ) 
                            : (<Input style={{ width: 200 }}/>)
            )}
          </FormItem>
        )
      }

      const labels = this.props.labels;
      // console.log('ket----', this.props.currentKey)
      return (
        <Modal
          width={'1000px'}
          visible={visible}
          title="添加一条新纪录"
          okText="添加"
          onCancel={onCancel}
          onOk={() => onCreate(
            () => this.setState({ confirmLoading: true }),
            () => this.setState({ confirmLoading: false }),
            () => this.state.warningStatus,
          )}
          confirmLoading={this.state.confirmLoading}
        >
          <Form layout="vertical" style={this.props.key === '2' ? {
            display: 'flex', flexDirection: 'row',
            alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
          } : {}}>
            {
              labels.map((label, i) => generateItem(label, i))
            }
          </Form>
        </Modal>
      );
    }
  }
);


export default CollectionCreateForm;