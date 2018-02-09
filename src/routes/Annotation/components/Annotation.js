/*注释*/
import React, {Component,PropTypes} from "react";
import Dialog from '../../../components/Dialog/Dialog';
import Confirm from '../../../components/Dialog/Confirm';
import Edit from './Edit';
import Fix from './Fix';
import Record from './Record';
// ajax
import {permissionsBtn, apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,API_FOODING_OA,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import xt from '../../../common/xt';
class Annotation extends Component{
	constructor(props){
		super(props);
        props.annotation && props.annotation(this);
		this.state = this.initState();
		this.scrollHeight=this.scrollHeight.bind(this);
		this.getPage = this.getPage.bind(this);
        this.handleResize = this.handleResize.bind(this);
	}

	initState(){
		return {
			paddingTop:false,
			showEditor:true,
			id:this.props.location.query.id,
			arr:[]
		}
	}
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
		let sch=document.body.offsetHeight-256;
		let scroll = sch - 256 ;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	getPage(){
		let that = this;
		let  id = this.state.id;
		let businessType = this.props.businessType;
		apiGet(API_FOODING_OA,'/comment/getCommentList',
			{businessType:businessType,businessId:id},
			(response)=>{
			that.setState({
				arr:response.data
			})
		},(error)=>{

		})
	}
	componentDidMount(){
        this.handleResize();
        if(!this.props.isDetail){
            this.getPage();
		}
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
  	scrollHeight(e){
  		let showEditor = this.state.showEditor;
  		if((showEditor &&e.target.scrollTop < 250) || (!showEditor && e.target.scrollTop >= 250)){
  			return false;
  		}
  		if(e.target.scrollTop>=250){
  			this.setState({showEditor:false})
  		}else{
  			this.setState({showEditor:true})
  		}
  	}
	render(){
		let arr = this.state.arr,
		 len = arr.length,
		 editor=null,
		 editorFix=null,
		 single = <Record arr={arr} getPage={this.getPage} id={this.state.id} businessType={this.props.businessType}/>;
		 if(this.state.showEditor){
		 	editorFix=<Fix bol={this.state.showEditor} len={len} businessType={this.props.businessType}/>
		 }else{
		 	editor=<Fix bol={this.state.showEditor} len={len} businessType={this.props.businessType}/>
		 	editorFix=<Fix bol={true} len={len} businessType={this.props.businessType}/>
		 }
		// 按钮权限
		let {permissions=''} = this.props;
		return(
			<div className={'annotation'}>
				<div className={'annotation-content scroll'}  style={{height:this.state.scrollHeight}} onScroll={this.scrollHeight}>
					<Edit permissions={permissions ? (permissionsBtn(permissions) ? permissions : '') : 'privilege'} id={this.state.id} getPage ={this.getPage} businessType={this.props.businessType}/>
					{editor}
					<div className={'annotation-content-comment'}>
						{editorFix}
						{single}
					</div>
				</div>

			</div>
		)
	}
}
export default Annotation;
