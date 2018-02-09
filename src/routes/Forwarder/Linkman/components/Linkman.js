import React, {Component,PropTypes} from "react";
import LinkmanTemplate from '../../../Linkman/components/Linkman';

export  class  Linkman extends Component{
    constructor(props) {
        super(props);
        props.linkman && props.linkman(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.linkman.getPage();
    }
	render(){
		return (<LinkmanTemplate pageIdent='forwarder'
								 linkman ={no => this.linkman = no} isDetail = {true}  dataTyId = {130}
								 router={this.props.router} getDetailData={this.props.getDetailData} commoncustomer={this.props.country}/>);
	}
}

export default Linkman;
