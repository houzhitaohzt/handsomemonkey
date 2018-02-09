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
		return (<LinkmanTemplate pageIdent='server' router={this.props.router} getDetailData={this.props.getDetailData} dataTyId={140}
								 linkman ={no => this.linkman = no}  isDetail ={true} commoncustomer={this.props.country}
		/>);
	}
}

export default Linkman;
