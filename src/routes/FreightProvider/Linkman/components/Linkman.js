import React, {Component,PropTypes} from "react";
import LinkmanTemplate from '../../../Linkman/components/Linkman';

export  class  Linkman extends Component{
    constructor(props) {
        super(props);
        props.linkman && props.linkman(this);
        this.getPage =  this.getPage.bind(this);
    }
    getPage(){
    	let that = this;
    	this.linkman.getPage();
	}
	render(){
		return (<LinkmanTemplate pageIdent='provider' router={this.props.router} getDetailData={this.props.getDetailData}
								 linkman ={no => this.linkman = no} isDetail ={true} dataTyId ={120}
		/>);
	}
}

export default Linkman;
