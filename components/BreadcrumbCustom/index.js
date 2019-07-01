import React from 'react'
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react'
import state from './state'

@observer
export default class BreadcrumbCustom extends React.Component {

    render() {
        return (
            <Breadcrumb style={{ margin: '12px 0' }}>
                <Breadcrumb.Item><Link to={'/main/home'}>首页</Link></Breadcrumb.Item>
                {state.first ? <Breadcrumb.Item>{state.first}</Breadcrumb.Item> : null}
                {state.second ? <Breadcrumb.Item>{state.second}</Breadcrumb.Item> : null}
                {state.third ? <Breadcrumb.Item>{state.third}</Breadcrumb.Item> : null}
            </Breadcrumb>
        )
    }
}

