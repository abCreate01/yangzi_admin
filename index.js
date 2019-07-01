import React from 'react';
import ReactDOM from 'react-dom';
import 'moment/locale/zh-cn'
import { AuthRoute } from './pages/login'
import { Provider } from 'mobx-react'
import './style/index.less';

import approvalState from './components/approval/state'
import breadState from './components/BreadcrumbCustom/state'
import sliderMenuState from './components/SliderMenu/state'

const stores = {
    approvalState,
    breadState,
    sliderMenuState
}

ReactDOM.render(<Provider {...stores}><AuthRoute /></Provider>, document.getElementById('root'))