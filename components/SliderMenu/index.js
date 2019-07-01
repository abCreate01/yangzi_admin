import React from 'react';
import { Menu, Icon, Layout } from 'antd';
import { Link } from 'react-router-dom';
import state from './state'
import _ from 'lodash'
import { observer } from 'mobx-react'
import './index.css'
const localLogo = '../../assets/yangzi_logo.png'
const localLogo2 = '../../assets/yangzi_logo2.png'

const { Sider } = Layout

const renderMenuItem = item => (    // item.route 菜单单独跳转的路由
    <Menu.Item
        key={item.key}
    >
        <Link to={item.route}>
            {item.icon && <Icon type={item.icon} />}
            <span className="nav-text">{item.title}</span>
        </Link>
    </Menu.Item>
);

const renderSubMenu = item => (
    <Menu.SubMenu
        key={item.key}
        title={
            <span>
                {item.icon && <Icon type={item.icon} />}
                <span className="nav-text">{item.title}</span>
            </span>
        }
    >
        {item.subs.map(item => renderMenuItem(item))}
    </Menu.SubMenu>
);


@observer
export default class SliderMenu extends React.Component {
    constructor(props) {
        super(props);
        // this.initState();
    }
    componentDidMount() { }

    // initState = () => {
    //     state.setCurrent('main');
    //     state.setMenuStyle(this.props.menuStyle);
    //     state.setTheme('dark');
    //     let userName = _.get(JSON.parse(localStorage.getItem(MyConfig.USER_INFO)), 'userName', 'xxxxx');
    //     axios.post("user/depNamesTwoByName", { userName: userName })
    //         .then((res) => {
    //             state.setDeparts(_.get(res.data, 'depart_name', {}));
    //         })
    //         .catch((err) => console.log("catch", err))
    // }

    // handleClick = (e) => {
    //     this.props.redirectToPage(e.key, e.keyPath)
    //     state.setCurrent(e.key);
    // }

    menuClick = e => {
        state.setSelectedKey(e.key)
    }

    openChangeClick = openKeys => {
        state.setOpenKeys(openKeys)
    }

    render() {
        const { menus } = this.props
        // console.log('sliderState', state.openKeys, state.selectedKey)
        return (
            <Sider
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{ overflowY: 'auto' }}>
                <div className="logo" >
                    {
                        this.props.collapsed ? (<img width="100%" height="42" className='logo_img' src={localLogo2} />) :
                            (<img width="100%" height="42" className='logo_img' src={localLogo} />)
                    }
                </div>
                <div>
                    <Menu
                        onClick={this.menuClick}
                        theme="dark"
                        mode="inline"
                        selectedKeys={[state.selectedKey]}
                        openKeys={[...state.openKeys]}
                        onOpenChange={this.openChangeClick}
                    >
                        {menus && menus.map(item =>
                            item.subs ? renderSubMenu(item) : renderMenuItem(item)
                        )}
                    </Menu>
                </div>
                <style>
                    {`
                        #nprogress .spinner{
                            left: ${this.props.collapsed ? '70px' : '206px'};
                            right: 0 !important;
                        }
                        `}
                </style>
            </Sider>

        );
    }
}