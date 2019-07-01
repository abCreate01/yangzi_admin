import React from 'react'
import { Checkbox, Button, Row, Modal } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import state from './state'
import { observer } from 'mobx-react'

const CheckboxGroup = Checkbox.Group;

@observer
export default class extends React.Component {

    constructor(props) {
        super(props)
        this.initData()
    }

    initData = () => {
        state.setCheckedList(this.props.checkedList)
        state.setCheckList(this.props.checkList)
    }

    componentDidMount() {
        
    }

    render() {
        const { checkList, checkedList, indeterminate, checkAll } = state;
        return (
            <div>
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                    <Checkbox
                        indeterminate={indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={checkAll}
                    >
                        选择全部
                    </Checkbox>
                </div>
                <br />
                <CheckboxGroup value={checkedList} onChange={this.onChange} >
                    {
                        checkList.map((v, i) => {
                            return <Row key={i}><Checkbox key={i} value={v}>{v}</Checkbox></Row>
                        })
                    }
                </CheckboxGroup>
                <br />
            </div>
        );
    }

    handleRoleData = value => {
        let res = '';
        Object.keys(this.props.optionsValue).map((v1, i1) => {
            value.map((v2, i2) => {
                if (this.props.optionsValue[v1] === v2)
                    res += v1 + ','
            })

        })
        // value.map((v, i) => {
        //     res += v + ','
        // })
        res = res.substring(0, res.length - 1)
        return res;
    }

    onChange = (checkedList) => {
        state.setCheckedList(checkedList);
        state.setIndeterminate(!!checkedList.length && (checkedList.length < state.checkList.length))
        state.setCheckAll(checkedList.length === state.checkList.length)
        console.log('onChange-in', state.checkedList)
        this.props.extraAdd && this.props.onChange && this.props.onChange(this.handleRoleData(state.checkedList)) 
    }

    onCheckAllChange = (e) => {
        state.setCheckedList(e.target.checked ? state.checkList : [], );
        state.setIndeterminate(false)
        state.setCheckAll(e.target.checked)
        console.log('onChange-all', state.checkedList)
        this.props.extraAdd && this.props.onChange && this.props.onChange(this.handleRoleData(state.checkedList)) 
    }
}

