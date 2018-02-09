import React, {Component} from "react";
import LinkmanTemplate from './LinkmanCom';

export  class  Linkman extends Component{
    constructor(props) {
        super(props);
        props.linkman && props.linkman(this);
    }
    getPage(){
    	this.linkman.getPage();
	}

	render(){
		return (<LinkmanTemplate pageIdent="client" router={this.props.router}  linkman={no => this.linkman = no}
								 dataTyId={this.props.dataTyId} getDetailData={this.props.getDetailData} commoncustomer={this.props.country}/>);
	}
}

export default Linkman;
