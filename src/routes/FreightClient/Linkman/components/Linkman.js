import React, {Component} from "react";
import LinkmanTemplate from '../../../Linkman/components/Linkman';

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
								 dataTyId={this.props.dataTyId} getDetailData={this.props.getDetailData}/>);
	}
}

export default Linkman;
