import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';

import {Print} from "../../../../components/Print";


export default class PageNow extends Component {

    render(){
        return <Print single={true} />;
    }
}