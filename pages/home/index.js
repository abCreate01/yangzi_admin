import React from 'react'
import sliderMenuState from '../../components/SliderMenu/state'
import ApiUtils from '../../utils/ApiUtils'
import BreadcrumbCustom from '../../components/BreadcrumbCustom'
import NotFound from '../NotFound'


export default class Home extends React.Component {

    componentDidMount() {
        sliderMenuState.setSelectedKey("home")
    }

    render() {

        return (
            <div>
                <BreadcrumbCustom />
                {ApiUtils.beautifyCard(<NotFound />)}
            </div>
        )


    }
}