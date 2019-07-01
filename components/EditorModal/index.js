import React from 'react'
import { Modal } from 'antd'
import RoleComponent from '../table/RoleComponent'
import roleState from '../table/RoleComponent/state'
import { observer } from 'mobx-react'
import state from './state'
import ApiUtils from '../../utils/ApiUtils'
import UpPwdForm from '../table/UpPwdForm'

@observer
export default class extends React.Component {
    constructor(props) {
        super(props)
        state.setCol(this.props.col)
    }

    componentDidMount() {
        const { value } = this.props
        ApiUtils.isShrink(state.col) && this.initEditorContent(value)
        ApiUtils.isManyID2Name(state.col) && this.initRoleContent(value)
    }

    initEditorContent = value => editorState.setEditorContent(value)

    initRoleContent = value => {
        roleState.setCheckList(Object.values(this.props.optionsValue));
        roleState.setCheckedList(value && this.renderId2Name(value, state.col, state.col).split(','));
    };

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

    renderId2Name = (text, column, condition) => {
        if (text === undefined) return;
        if (ApiUtils.isPhoto(column)) return <img src={text} style={{ width: '100px', height: '100px' }} />
        // const { optionsValue } = this.state;
        // return optionsValue && apiUtils.isSelector(column) ? (text in optionsValue ? optionsValue[text] : text) : text
        const { optionValues } = this.props;
        if (!ApiUtils.isManyID2Name(column) && !ApiUtils.isSelector(column) && !ApiUtils.isLessionId(column)) return text;
        const optionsValue = column === condition ? optionValues[column] || optionsValue : optionValues[column][condition] || optionsValue;
        if (!optionsValue) return;
        if (typeof text === "number") text = text + "";
        let value = ""
        text = text && text.split(",")
        text.map((val, i) => {
            value += ((val in optionsValue ? optionsValue[val] : val) + ",")
        })
        value = value.substring(0, value.length - 1)
        return optionsValue && value;
        // return optionsValue && (text in optionsValue ? optionsValue[text] : text)
    }

    upPwdOk = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                Modal.warning({
                    content: "请填写完整信息！",
                })
                return;
            }

            // console.log('Received values of form: ', values);
            form.resetFields();
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        const { setInputValue, value, setEditable, col } = this.props
        const { checkedList, checkList } = roleState
        return (
            <React.Fragment>
                {this.renderId2Name(value, col, col)}
                <Modal
                    visible={state.visible}
                    title='修改页面'
                    okText='修改'
                    cancelText='取消'
                    maskClosable={false}
                    onCancel={() => {
                        state.setVisible(false)
                        setEditable && setEditable(false)
                    }}
                    onOk={() => {
                        !ApiUtils.isUpPwd(col) && state.setVisible(false);
                        ApiUtils.isShrink(col) && setInputValue(editorState.editorContent);
                        ApiUtils.isManyID2Name(col) && setInputValue(this.handleRoleData(roleState.checkedList))
                        ApiUtils.isUpPwd(col) && this.upPwdOk()
                    }}
                    // confirmLoading={this.state.confirmLoading}
                    width={'1000px'}
                >
                    {ApiUtils.isShrink(col) ? <WangEditor /> :
                        ApiUtils.isManyID2Name(col) ? <RoleComponent checkedList={checkedList} checkList={checkList} /> :
                            ApiUtils.isUpPwd(col) ? <UpPwdForm wrappedComponentRef={this.saveFormRef} /> : null}
                </Modal>
            </React.Fragment>
        )
    }
}
