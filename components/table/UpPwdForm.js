import React from 'react';
import { Form, Icon, Input, Button, Checkbox, } from 'antd';

const upPwdForm = Form.create()(
    class extends React.Component {
        handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                }
            });
        }

        render() {
            const { getFieldDecorator } = this.props.form;
            return (
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item
                        label='新密码'
                        >
                        {getFieldDecorator('pwd', {
                            rules: [{ required: true, message: '请输入新密码!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </Form.Item>
                    <Form.Item
                        label='确认密码'>
                        {getFieldDecorator('rPwd', {
                            rules: [{ required: true, message: '请确认密码!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Confirm Password" />
                        )}
                    </Form.Item>
                </Form>
            );
        }
    }
)

export default upPwdForm;