import React, { Component } from 'react';
import _ from 'lodash'
import MyTable from '../../components/table/MyTable'
import MyConfig from '../../MyConfig/MyConfig'
import ApiUtils from "../../utils/ApiUtils"
import BreadcrumbCustom from '../../components/BreadcrumbCustom'
import { inject } from 'mobx-react'
import { observer } from 'mobx-react'
import state from '../main/state'

@observer
@inject('breadState', 'sliderMenuState')
class UserMng extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { sliderMenuState, breadState } = this.props
        sliderMenuState.setSelectedKey("userMng")
        sliderMenuState.setOpenKeys(new Set([...sliderMenuState.openKeys]).add("sub2"))
        breadState.setFirst("系统维护")
        breadState.setSecond("用户管理")
    }

    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom />
                {ApiUtils.beautifyCard(<MyTable {...MyConfig.urlConfig.userMng}  optionValues = {state.optionValues} addData = {true}  delData= {true} editData= {true}/>)}
            </div>
        );
    }
}

export default UserMng;