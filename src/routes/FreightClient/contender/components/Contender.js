import React, {Component} from "react";
import Template from '../../../Common_contender/components/ContenderPage';

export  class  Page extends Component{
    constructor(props) {
        super(props);
        props.contender && props.contender(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.contender.getPage();
    }
	render(){
		return (<Template pageIdent="client" router={this.props.router}
						  contender ={no => this.contender = no} isDetail ={true}
		/>);
	}
}

export default Page;
