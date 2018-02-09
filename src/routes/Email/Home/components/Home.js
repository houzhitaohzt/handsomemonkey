import React, {Component} from "react";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import xt from '../../../../common/xt';
import IFrame from '../../../../components/IFrame';

class EmailHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '/email/router/mail/home.html'
        };
        window.ErpAddTabs = this.openTabs.bind(this);
    }

    openTabs({id, title, src}) {
        let {navAddTab} = this.props;
        let url = '/email/write/' + xt.getQueryParameter('type', src);
        navAddTab({name: title, component: title, url});
        this.props.router.push({pathname: url, query: {uri: encodeURIComponent(src)}});
    }

    shouldComponentUpdate(props, state) {
        return xt.equalsObject(state, this.state);
    }

    render = () => <IFrame src={this.state.url}/>
}

export default NavConnect(EmailHome);