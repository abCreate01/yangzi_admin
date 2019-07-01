import React, { Component } from 'react';
import _ from 'lodash'
import { Input, DatePicker, Upload, Button, Icon, Descriptions, Select, Row, Col, Card } from 'antd'
import axios from '../../utils/axios'
import BreadcrumbCustom from '../../components/BreadcrumbCustom'
import { inject, observer } from 'mobx-react'

@observer
@inject('breadState', 'sliderMenuState')
class jsybSubmit extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { sliderMenuState, breadState } = this.props

        sliderMenuState.setSelectedKey("jsybSubmit")
        sliderMenuState.setOpenKeys(new Set([...sliderMenuState.openKeys]).add("sub1"))
        breadState.setFirst("技术月报")
        breadState.setSecond("技术月报提交")
        axios.post("user/depNamesTwoByName", { userName: 'admin' })
            .then(({ data }) => {
                //    console.log('res--------',data)
            })
            .catch((err) => console.log("catch", err))
    }

    handleSubmit = (e) => {
        axios.get("jsybqidong").then(({ data }) => {
            console.log('proid', data)
            axios.post('/jsybtijiao', { 'processInstanceId': data.data, 'sendUserId': '5590b901-77c5-42a9-8114-9c0095bfe115', 'receiveUserId': 'cda8d33a-0ba0-4210-9348-884e6f4852c2' })
                .then(({ data }) => {
                    console.log(data.data)
                    this.props.history.push("/main/home")
                })

        })

    }

    handleChange = (value) => {
        this.setState({
            sendTo: value
        })
    }

    handelSubCompany(e) {
        this.setState({
            subCompany: e.target.value
        })
    }
    handleSender(e) {
        this.setState({
            sender: e.target.value
        })
    }

    beautifyCard = component => {
        return (
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            {component}
                        </Card>
                    </div>
                </Col>
            </Row>
        )
    }

    render() {

        // console.log('aaaaaaaaaaaaaaaaaaaaaa')

        const props = {
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            onChange({ file, fileList }) {
                if (file.status !== 'uploading') {
                    console.log(file, fileList);
                }
            },
            defaultFileList: [
            
            ],
        };

        return (
            <div className="gutter-example">
                <BreadcrumbCustom />
                {this.beautifyCard(
                    <div>
                        <Descriptions bordered>
                            <Descriptions.Item label="上传单位" span={3}><Input style={{ width: "200Px" }} placeholder="上传单位" defaultValue='技术部门' disabled onChange={this.handelSubCompany.bind(this)} /></Descriptions.Item>
                            <Descriptions.Item label="上传日期" span={3}><DatePicker style={{ width: "200Px" }} onChange={this.onChange} /></Descriptions.Item>
                            <Descriptions.Item label="上传人" span={1.5}><Input style={{ width: "200Px" }} placeholder="上传人" defaultValue='杨科' disabled onChange={this.handleSender.bind(this)} /></Descriptions.Item>
                            <Descriptions.Item label="发送给" span={2}>
                                <Select defaultValue="发送给" style={{ width: 120 }} onChange={this.handleChange}>

                                    {/* {this.state.infos.map((item, key) => (
                                 <Option value={_.get(item, 'name', key)}>{_.get(item, 'name', '')}</Option>
                            )
                            )} */}
                                    <Option value="5590b901-77c5-42a9-8114-9c0095bfe115">任红锋</Option>

                                </Select>
                            </Descriptions.Item>
                            <Descriptions.Item label="文档资料" span={3}>
                                <Upload {...props}>
                                    <Button>
                                        <Icon type="upload" /> 添加附件
                        </Button>
                                </Upload>
                            </Descriptions.Item>

                        </Descriptions>
                        <br />
                        <Button style={{ float: "right" }} type="primary">取消</Button>
                        <Button onClick={this.handleSubmit} style={{ float: "right", marginRight: '8px' }} type="primary">提交</Button>
                    </div>
                )}
            </div>
        );
    }
}

export default jsybSubmit;