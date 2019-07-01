import React from 'react'
import './index.css'
import { Form, Icon, Input, Button, Checkbox, LocaleProvider, Modal, notification } from 'antd';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom"
import axios from '../../utils/axios'
import MyConfig from '../../myConfig/MyConfig'
import ApiUtils from '../../utils/ApiUtils'
import MainPage from '../main';
const logo = 'http://njtech.oss-cn-shanghai.aliyuncs.com/mes/assets/transparent.png'

export class AuthRoute extends React.Component {
  render() {

    return (
      <Router history={this.props.history}>
        <Switch>
          {<Route exact path='/login' component={WrappedNormalLoginForm} />}
          {<PrivateRoute path='/main' component={MainPage} />}
        </Switch>
      </Router>
    )
  }
}

const fakeAuth = {
  isAuthenticated: false,
  userName: "",
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  },
  setUser(userName) {
    this.userName = userName;
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} fakeAuth={fakeAuth} />
      ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
    }
  />
);

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  state = {
    redirectToReferrer: false,
    loading: false,
    storedUserInfo: sessionStorage.getItem(MyConfig.USER_INFO),
  };

  componentDidMount() {

    const userInfo = this.state.storedUserInfo;
    userInfo && this.setState({
      storedUserInfo: JSON.parse(this.state.storedUserInfo)
    })
    //isValidToken 验证是否过期
    const isValidToken = (token) => token;
    isValidToken(ApiUtils.token_info()) && userInfo && this.login(JSON.parse(this.state.storedUserInfo));

  }

  login = (user) => {
    fakeAuth.setUser(user.userName);
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        const userErrorMessage = err.userName ? "请输入用户名！\n" : "";
        const pwdErrorMessage = err.password ? "请输入密码！" : "";
        Modal.error({
          content: userErrorMessage + pwdErrorMessage
        });
        return;
      }
      //验证成功后跳转
      //if(成功)
      const user = {
        userName: this.props.form.getFieldsValue().userName || "",
        password: this.props.form.getFieldsValue().password || "",
      };

      this.setState({ loading: true });

      // setTimeout(() => {
      //   this.setState({
      //     loading: false,
      //   });
      //   this.login(user);
      //   console.log(localStorage.getItem("user"), "BEFORE USER?")
      //   localStorage.setItem('user', JSON.stringify(user));
      //   console.log(localStorage.getItem("user"), "USER?")
      // }, 1000);

      axios.post(MyConfig.API_URL + '/login', user)
        .then(
          (result) => {
            let data = result.data || "";
            if (_.get(data, 'status', '') === '200') {
              data.token && sessionStorage.setItem(MyConfig.TOKEN_INFO, JSON.stringify(_.get(data, 'token', '')));
              // values.remember ? 
              sessionStorage.setItem(MyConfig.USER_INFO, JSON.stringify({ 'userName': user.userName })) 
              // : localStorage.removeItem(MyConfig.USER_INFO);
              this.setState({
                loading: false,
              });
              this.login(user)
            } else if (_.get(data, 'status', '') === '400') {
              this.setState({
                loading: false,
              }, () => {
                Modal.warning({
                  content: "请检查账号或密码是否输入正确！"
                });
              });

            }
          })
        .catch((err) => {
          Modal.warning({
            content: err.status == 0 ? "请检查网络！" : err.status == 400 ?
              "请检查账号或密码是否输入正确！" : "发生意外错误！"
          });
          this.setState({
            loading: false,
          });
        })

      // this.login(user)

    });
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: "/main/home" } };
    const { redirectToReferrer, loading } = this.state;
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="main-container">
        <div className="main-center">
          <p className="login-form-head"></p>
          <div className='content'>
            <div style={{ margin: '0 20px 0 20px' }}>
              <div className='top'>
                <div className='header'>
                  <img alt='logo' className='login-logo' src={logo} />
                  <span className='title'>扬子石化</span>
                </div>
                <div className='desc'>南京扬子石化工艺管理平台</div>
              </div>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: '请输入用户名！' }],
                    initialValue: this.state.storedUserInfo && this.state.storedUserInfo.userName,
                  })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码！' }],
                    initialValue: this.state.storedUserInfo && this.state.storedUserInfo.password,
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                  )}
                </FormItem>
                <FormItem>
                  {/** 
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(
                    <Checkbox>记住账号</Checkbox>
                  )}*/}
                  <Button type="primary" htmlType="submit" className="login-form-button"
                    loading={loading}>
                    登录
                  </Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

