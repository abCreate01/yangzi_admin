import { Button, Modal, Form, Input, Radio, Select, DatePicker } from 'antd';
import React from 'react';
import PicturesWall from './PicturesWall';
import ApiUtils from '../../utils/ApiUtils'
import MyConfig from '../../myConfig/MyConfig'
import moment from "moment";
import "moment/locale/zh-cn";

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

moment.locale("zh-cn");
const Option = Select.Option;

const CollectionMultiSearchForm = Form.create()(
  class extends React.Component {

    state = {
      confirmLoading: false,
      value: '',
      optionValues: {},
      lessionList: {}
    }

    componentDidMount() {
      this.setState({
        optionValues: this.props.optionValues
      })
    }

    render() {
      const { visible, onCancel, onCreate, form, optionValues } = this.props;
      const { getFieldDecorator } = form;
      const { value, carNumList } = this.state
      const generateItem = (labelName, i) => {
        const optionsValue = optionValues[labelName];
        return (
          <FormItem label={ApiUtils.getColName(labelName)} key={i}>
            {getFieldDecorator(labelName, {
            })(
              ApiUtils.isDate(labelName) ?
                <RangePicker onChange={this.onChange}
                  showTime={{ defaultValue: [moment('08:00:00', 'HH:mm'), moment('08:00', 'HH:mm')] }} format="YYYY-MM-DD HH:mm" />
                :
                ApiUtils.isSelector(labelName) ? (
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onSelect={ApiUtils.isClassifyId(labelName) ? (classifyid) => ApiUtils.myPostData("/selectNames/queryLessionNamesById", { classifyid: classifyid },
                      (result) => this.setState({ lessionList: result[classifyid] }, () => { console.log("500--error") })) : () => { } }
                    >
                    {
                      Object.keys(optionsValue).map((val, i) => {
                        return <Option key={i} value={val}>{optionsValue[val]}</Option>
                      })
                    }
                  </Select>
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
                ) :
                    <Input />
              )}
          </FormItem>
        )
      }

      const labels = this.props.labels;

      return (
        <Modal
          visible={visible}
          title="多重筛选"
          okText="筛选"
          onCancel={onCancel}
          onOk={() => onCreate(
            () => this.setState({ confirmLoading: true }),
            () => this.setState({ confirmLoading: false })
          )}
          confirmLoading={this.state.confirmLoading}
          width='800px'
          >
          <Form layout="vertical" style={{
            display: 'flex', flexDirection: 'row',
            alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'
          }}>
            {
              labels.map((label, i) => generateItem(label, i))
            }
          </Form>
        </Modal>
      );
    }
  }
);


export default CollectionMultiSearchForm;