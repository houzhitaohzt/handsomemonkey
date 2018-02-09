import React, {Component} from "react";
import Template from '../../../Common_client/components/Client';

export  class  Page extends Component{
    constructor(props) {
        super(props);
        props.client && props.client(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
    	this.client.getPage();
	}
	render(){
		return (<Template pageIdent="client" router={this.props.router}
						  client ={no => this.client = no} isDetail ={true}
		/>);
	}
}

export default Page;
