import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import MenuConfig from '../myConfig/MenuConfig';
import AllComponent from '../components'
import NotFound from '../pages/NotFound'

class MyRoute extends Component {

    requireLogin = component => {

        // if (process.env.NODE_ENV === 'production' && !permissions) { // 线上环境判断是否登录
        //     return <Redirect to={'/login'} />;
        // }
        return component;
    };

    render() {
        return (
            <Switch>
                {
                    Object.keys(MenuConfig).map(key =>
                        MenuConfig[key].map(item => {
                            const route = item => {
                                const Component = AllComponent[item.component]
                                return (
                                    <Route
                                        key={item.key}
                                        exact
                                        path={item.route}
                                        render={props => (<Component  { ...props} />)}
                                    />
                                )
                            }
                            return item.component ? route(item) : item.subs.map(item => route(item))
                        })
                    )
                }
                <Route component={NotFound} />
            </Switch>
        )
    }
}

export default MyRoute;