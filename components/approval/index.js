import React, { Component } from 'react';
import { Input, Button, Descriptions, Row, Col, Card } from 'antd'
import { observer } from 'mobx-react'
import state from './state'
import axios from '../../utils/axios'
import _ from 'lodash'
import BreadcrumbCustom from '../../components/BreadcrumbCustom'

const { TextArea } = Input

@observer
export default class Approval extends Component {

    handleSubmit = () => {
        // console.log(state.taskId)
        axios.post("jsybshenhe", { 'taskId': state.taskId ? state.taskId : sessionStorage.getItem('taskId'), 'sign': true }).then(({ data }) => {
            // console.log('proid', data)
            // console.log(this.props.history)
            this.props.history.replace('/main/jsybToDoList')
            // this.props.history.push('/main/jsybToDoList')
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
        const { labelName, jsybName, upName } = state
        // console.log(state.taskId, '-------', sessionStorage.getItem('taskId'))
        return (
            <div className="gutter-example">
                <BreadcrumbCustom />
                {this.beautifyCard(
                    <div>
                        <Descriptions bordered>
                            <Descriptions.Item label={labelName} span={3}><span>{jsybName}</span></Descriptions.Item>
                            <Descriptions.Item label="审核意见" span={3}><TextArea style={{ width: "400Px" }} rows={4} /></Descriptions.Item>
                            <Descriptions.Item label="上传人" span={1.5}><Input style={{ width: "200Px" }} placeholder={upName} defaultValue={upName} disabled /></Descriptions.Item>
                        </Descriptions>
                        <br />
                        <Button style={{ float: "right" }} type="primary">驳回</Button>
                        <Button onClick={this.handleSubmit} style={{ float: "right", marginRight: '8px' }} type="primary">通过</Button>
                    </div>
                )}
            </div>
        );
    }
}
