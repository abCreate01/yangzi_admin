import React, { Component } from 'react';
import _ from 'lodash'
import Approval from '../../components/approval'
import { inject, observer } from 'mobx-react'

@observer
@inject('approvalState', 'breadState')
export default class JsybApproval extends Component {

    componentDidMount() {
        this.initData()
    }

    componentWillUnmount() {
        const { approvalState, breadState } = this.props
        breadState.setThird('')
    }

    initData = () => {
        const { approvalState, breadState } = this.props

        approvalState.setJsybName("塑料厂技术运行科提交技术月报")
        approvalState.setLabelName("技术月报名称")
        approvalState.setUpName("任红峰")
        breadState.setFirst("技术月报")
        breadState.setSecond("待办事项")
        breadState.setThird("审批")
    }

    render() {
        return (
            <Approval {...this.props}/>
        )
    }
}
