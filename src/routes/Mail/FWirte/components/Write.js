import React, {Component} from "react";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import IFrame from '../../../../components/IFrame';

class EmailWrite extends Component {

    constructor(props){
        super(props);
        this.state = {
            src: '/email/writef' + this.props.location.search
        }
    }

    componentDidMount() {
        // window.ErpCloseTabs = ()=> this.props.navCloseCurrentTab();
    }

    componentWillReceiveProps(props, state) {
        // this.setState({src: decodeURIComponent(props.location.query.uri)});
    }

    render = ()=> {
        console.log(this.state.src);
        return (<IFrame src={this.state.src}/>);

    }
}

export default NavConnect(EmailWrite)