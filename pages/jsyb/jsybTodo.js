import React, { Component } from 'react'
import Todo from '../../components/toDo'
import sliderMenuState from '../../components/SliderMenu/state'
import breadState from '../../components/BreadcrumbCustom/state'
import MyConfig from '../../myConfig/MyConfig'
import { inject, observer } from 'mobx-react'

@observer
@inject('approvalState', 'sliderMenuState', 'breadState')
export default class JsybTodoList extends Component {

    componentDidMount() {
        const { sliderMenuState, breadState } = this.props
        sliderMenuState.setSelectedKey("jsybTodo")
        sliderMenuState.setOpenKeys(new Set([...sliderMenuState.openKeys]).add("sub1"))
        breadState.setFirst("技术月报")
        breadState.setSecond("待办事项")
    }

    jsbyCheck = (taskId) => {
        const { approvalState } = this.props
        this.props.history.push('/main/jsybToDoList/jsybApproval')
        approvalState.setTaskId(taskId)
        sessionStorage.setItem('taskId', taskId)
    }

    render() {
        return (
            <Todo selectUrl={MyConfig.urlConfig.jsybTodo} check={this.jsbyCheck} />
        )
    }
}