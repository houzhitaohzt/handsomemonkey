import React, {Component} from "react";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import IFrame from '../../../../components/IFrame';

class EmailWrite extends Component {

    constructor(props){
        super(props);
        this.state = {
            src: decodeURIComponent(this.props.location.query.uri)
        }
    }

    componentDidMount() {
        window.ErpCloseTabs = ()=> this.props.navCloseCurrentTab();
    }

    componentWillReceiveProps(props, state) {
        this.setState({src: decodeURIComponent(props.location.query.uri)});
    }

    render = ()=> <IFrame src={this.state.src}/>
}

export default NavConnect(EmailWrite)