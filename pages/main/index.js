import React from 'react';
import { Layout } from 'antd';
import _ from 'lodash'
import MyConfig from "../../myConfig/MyConfig"
import MenuConfig from "../../myConfig/MenuConfig"
import axios from '../../utils/axios'
import { observer } from 'mobx-react'
import state from './state'
import './index.css'
import HeaderCustom from '../../components/Header'
import SliderMenu from '../../components/SliderMenu'


import MyRoute from '../../route'


const { Header, Content, Footer, Sider } = Layout;

@observer
export default class MainPage extends React.Component {

    componentDidMount() {
        console.log("browserMenu加载")
        state.setUserName(_.get(JSON.parse(sessionStorage.getItem(MyConfig.USER_INFO)), 'userName', ''))
        this.selectOptionValues()
    }

    selectOptionValues = () => {
        console.log("selector加载")

        axios.get(MyConfig.SELECTOR_URL)
            .then(
                result => {
                    console.log('s-s-s-s--s-s',result)
                    state.setOptionValues(result.data)
                })
            .catch(
                (err) => {
                    console.log("catch", err)
                }
            )
    }

    signout = () => {
        this.props.fakeAuth.signout(() => {
            this.props.history.push('/login');
        })
        sessionStorage.removeItem(MyConfig.TOKEN_INFO);
        sessionStorage.removeItem(MyConfig.USER_INFO);
    }
    
    toggle = () => {
        state.setCollapsed(!state.collapsed)
    }

    render() {
        const { collapsed } = state
        
        return (
            <Layout>
                <SliderMenu collapsed={state.collapsed} menus={MenuConfig.menus}/>
                <Layout style={{ flexDirection: 'column' }}>
                    <HeaderCustom redirectToPage={this.redirectToPage} toggle={this.toggle} collapsed={collapsed} signout={this.signout} />
                    <Content style={{ margin: '0 16px', overflow: 'initial' }}>
                        <MyRoute />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                         ©{new Date().getFullYear()} Created by NJTech-CEC
                    </Footer>
                </Layout>
            </Layout>
        );
    };
}

