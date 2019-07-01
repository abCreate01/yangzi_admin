import React from 'react'
import { Input, Icon, DatePicker, Modal, Select, Cascader, Badge } from 'antd'
import moment from "moment"
import PicturesWall from '../PicturesWall'
import VideosWall from '../VideosWall'
import ApiUtils from '../../../utils/ApiUtils'
import MyConfig from '../../../myConfig/MyConfig'
import editorModalState from '../../EditorModal/state'
import EditorModal from '../../EditorModal'
import { observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'
import _ from 'lodash'
import './cell.css'
import '../index.css'


@observer
export default class EditableCell extends React.Component {
  constructor(props) {
    super(props)
    this.initState()
  }

  @observable value = ''
  @observable column = ''
  @observable preValue = ''
  @observable keyValue = ''
  @observable endKey = undefined

  @observable editable = false
  @observable optionValues = {}
  @observable condition = {}
  @observable extraOptionValue = {}

  @action setValue = value => this.value = value
  @action setColumn = column => this.column = column
  @action setPreValue = preValue => this.preValue = preValue
  @action setKeyValue = keyValue => this.keyValue = keyValue
  @action setEndKey = endKey => this.endKey = endKey

  @action setEditable = editable => this.editable = editable
  @action setOptionValues = optionValues => this.optionValues = optionValues
  @action setCondition = condition => this.condition = condition
  @action setExtraOptionValue = extraOptionValue => this.extraOptionValue = extraOptionValue

  initState = () => {
    this.setValue(this.props.value)
    this.setKeyValue(this.props.keyValue)
    this.setColumn(this.props.column)
    this.setPreValue(this.props.preValue)
  }

  componentDidMount() {
    this.setOptionValues(this.props.optionValues)
    this.setCondition(_.get(this.props, 'condition.classifyid', ''))
    !!this.condition
      && ApiUtils.myPostData("/selectNames/queryLessionNamesById", { classifyid: this.condition },
        result => this.setOptionValues({ ...this.optionValues, ...result }),
        () => console.log("queryLessionNamesById error--500"))
  }

  handleChange = e => this.setValue(e.target.value)

  handleChangeSelect = (data, column) => {
    const optionValues = this.optionValues
    const optionsValue = optionValues[column]
    const value = data in optionsValue ? optionsValue[data] : data
    this.setValue(value)
    this.setEndKey(data)
  }

  handleCascaderOptions = options => {
    let res = [];
    Object.keys(options).map((v, i) => {
      let subChild = [];
      Object.keys(options[v]).map((v1, i1) => {
        subChild.push({ value: v1, label: options[v][v1] })
      })
      res.push({ value: v, label: v, children: subChild })
    })
    // console.log('handleCascaderOptions', res)
    return res;
  }

  handleCascaderChange = (value, selectedOptions) => {
    // console.log("selectedOptions", selectedOptions)
    this.setEndKey(value[0] + ' / ' + value[1])
    this.setValue(_.get(selectedOptions, '[0].label', '') + ' / ' + _.get(selectedOptions, '[1].label', ''))
  }


  handleChangeData = (_, dateString) => this.setValue(dateString)

  check = () => {
    this.setEditable(false)
    if (!this.value) {
      Modal.warning({
        content: "修改值不能为空！（您可以尝试一下添加空格）",
      })
      // console.log('xxxx', this.value, '111', this.preValue)
      this.setValue(this.preValue)
      return
    }
    if (this.props.onChange) {
      const value = this.endKey || this.value
      const self = this
      this.props.onChange(value,
        () => self.setPreValue(self.value),
        () => self.setValue(self.preValue)
      )
    }
  }

  cancel = () => {
    this.setEditable(false)
    console.log('this.value', this.value)
    console.log('this.preValue', this.preValue)
    this.setValue(this.preValue)
  }

  edit = (_, column, value) => {
    // 目前仅是editorModal
    ApiUtils.isModal(column) && editorModalState.setVisible(true)
    console.log("edit", value)
    this.setPreValue(value)
    this.setEditable(true)
  }


  renderId2Name = (text, column, condition) => {

    const productImgClick = (imageUrl) => {
      console.log('...')
      Modal.info({
        title: `预览商品:`,
        content: <img className='productImgPreview' src={imageUrl} />,
        width: 600,
        maskClosable: true
      })
    }

    if (ApiUtils.isDeviceStatus(column)) return <Badge style={{ display: 'inline' }} status={_.get(this.value2Status(text), 'icon', 'default')} text={_.get(this.value2Status(text), 'value', '异常1')} />

    if (ApiUtils.isPhoto(column)) return <img src={text} onClick={() => productImgClick(text)} style={{ width: '100px', height: '100px' }} />
    const { optionValues } = this.props;
    if (!ApiUtils.isManyID2Name(column) && !ApiUtils.isSelector(column) && !ApiUtils.isLessionId(column)) return text;
    const optionsValue = column === condition ? optionValues[column] || optionsValue : optionValues[column][condition] || optionsValue;
    if (!optionsValue) return;
    if (typeof text === "number") text = text + "";
    let value = ""
    text = text.split(",")
  
    text.map((val, i) => {
      value += ((val in optionsValue ? optionsValue[val] : val) + ",")
    })
    value = value.substring(0, value.length - 1)
    return optionsValue && value;
  }

  getImgUrl = img => this.setValue(img)

  getVidUrl = videoUrl => this.setValue(videoUrl)

  value2Status = v => {
    // console.log('---', v)
    this.setValue(v)
    let res = { icon: 'error', value: '异常' }
    switch (v) {
      case '已完成':
        this.setEndKey('0')
        return Object.assign(res, { 'icon': 'success', value: '已完成' })
      case '待完成':
        this.setEndKey('1')
        return Object.assign(res, { 'icon': 'warning', value: '待完成' })
      case '正在生产':
        this.setEndKey('2')
        return Object.assign(res, { 'icon': 'processing', value: '正在生产' })
      default:
        this.setEndKey('3')
        return res
    }
  }

  render() {
    const { value, editable, column, optionValues, keyValue, condition } = this
    const optionsValue = Object.keys(condition).length !== 0 ? optionValues[condition] : optionValues[column]

    return (
      <div className="editable-cell">
        {this.props.editData && editable ? (
          <div className="editable-cell-input-wrapper">
            <div className="editable-cell-text-span">
              {
                ApiUtils.isSelector(column) ? (
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder={value}
                    optionFilterProp="children"
                    onChange={(data) => this.handleChangeSelect(data, column)}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    defaultValue={ApiUtils.isNumber(keyValue) ? undefined : keyValue}
                    mode={''}
                  >
                    {
                      Object.keys(optionsValue).map((val, i) => {
                        return <Select.Option key={i} value={val}>{optionsValue[val]}</Select.Option>
                      })
                    }
                  </Select>
                ) : ApiUtils.isDate(column) ?
                    <DatePicker
                      value={moment(value)}
                      onChange={this.handleChangeData}
                      showTime={{ defaultValue: moment('08:00:00', 'HH:mm:ss') }}
                      format="YYYY-MM-DD HH:mm:ss"
                      allowClear={false}
                    />
                    : ApiUtils.isPhoto(column) ? (<PicturesWall position={MyConfig.PIC_POS} imgUrl={value} isAdd={false} getImgUrl={this.getImgUrl} />)
                      : ApiUtils.isVideo(column) ? (<VideosWall position={MyConfig.VID_POS} isAdd={false} getVidUrl={this.getVidUrl} />)
                        : condition !== undefined && ApiUtils.isLessionId(column) ? (
                          <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder={value}
                            optionFilterProp="children"
                            onChange={(data) => this.handleChangeSelect(data, condition)}
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            defaultValue={ApiUtils.isNumber(keyValue) ? undefined : keyValue}
                            mode={''}
                          >
                            {
                              Object.keys(optionsValue).map((val, i) => <Select.Option key={i} value={val}>{optionsValue[val]}</Select.Option>)
                            }
                          </Select>
                        )
                          : ApiUtils.isModal(column) ? (
                            <EditorModal col={column} value={value} optionsValue={optionsValue} optionValues={optionValues} setInputValue={v => this.setValue(v)} setEditable={this.setEditable} />
                          ) : ApiUtils.isCascader(column) ? (
                            <Cascader options={this.handleCascaderOptions(optionsValue)} onChange={this.handleCascaderChange} placeholder={value} />
                          )
                              : <Input value={value} onChange={this.handleChange} onPressEnter={this.check} />
              }
            </div>
            <div style={{ display: 'flex' }}>
              <Icon type="check" onClick={this.check} />
              <Icon type="close" style={{ marginLeft: 5 }} onClick={this.cancel} />
            </div>
          </div>
        ) : (
            <div className="editable-cell-text-wrapper">
              <div className="editable-cell-text-span" style={{ float: 'left' }}>
                {
                  ApiUtils.isShrink(column) ?
                    <Popover placement="right" overlayStyle={{ width: 600 }} content={value} title={ApiUtils.getColName(column)}>
                      {value || " "}
                    </Popover>
                    : <div style={{ float: 'right' }}>{this.renderId2Name(value, column, column)}</div>
                }
              </div>
              {this.props.editData ? (<div style={{ float: 'right' }}><Icon type="edit" className="editable-cell-icon" onClick={e => this.edit(e, column, value)} /></div>) : null}
            </div>
          )
        }
      </div>
    )
  }
}
