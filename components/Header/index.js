import React, { Component } from 'react';
import { Menu, Icon, Layout, Carousel, Avatar, Button, Dropdown } from 'antd';
import screenfull from 'screenfull';
import MyConfig from '../../myConfig/MyConfig'
import editorModalState from '../EditorModal/state'
import EditorModal from '../EditorModal'
import './header.css'

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

export default class HeaderCustom extends Component {
    state = {
        userName: '',
    };

    componentDidMount() {
        this.setState({ userName: _.get(JSON.parse(localStorage.getItem(MyConfig.USER_INFO)), 'userName', '') })
    };

    screenFull = () => {
        if (screenfull.enabled) {
            screenfull.request();
        }
    };

    handleClick = () => {
        this.props.redirectToPage('moreInfo', ["moreInfo", "sub6"])
    }

    render() {
        const { collapsed, toggle, signout } = this.props
        const { userName, } = this.state

        return (
            <Header style={{ background: '#fff', padding: 0, height: 65, width: '100%' }} className="custom-theme" >
                <Icon
                    style={{ float: 'left' }}
                    className="trigger custom-trigger"
                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={toggle}
                />

                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right', flexDirection: 'row' }}
                >

                    <Menu.Item key="full" onClick={this.screenFull} >
                        <Icon type="arrows-alt" onClick={this.screenFull} />
                    </Menu.Item>

                    <Menu.Item key='icon'>

                        <Avatar icon="user" size="small" style={{ backgroundColor: '#87d068', }} />
                        <Menu.Item key="2" style={{ textAlign: 'center', fontSize: '0.8em', color: 'black', fontWeight: 'bold' }}></Menu.Item>
                    </Menu.Item>

                    <SubMenu title={userName} >
                        <Menu.Item key="2" style={{ textAlign: 'center', fontSize: '0.8em', color: 'black', fontWeight: 'bold' }}>{userName}</Menu.Item>
                        <Menu.Item key="1">
                            <span onClick={() => editorModalState.setVisible(true)}><Icon type="form" />修改密码</span>
                            <EditorModal col={"upPwd"} />
                        </Menu.Item>
                        <Menu.Item key="3" ><span onClick={signout}><Icon type="logout" />退出系统</span></Menu.Item>
                    </SubMenu>

                </Menu>
                <style>{`
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -20px;
                    }
                `}</style>
            </Header>
        )
    }
}


