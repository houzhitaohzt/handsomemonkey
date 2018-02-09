import React, { Component } from 'react';
const {Table} = require("../../../../components/Table");
import AddNormal from "./AddNormal";
// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../../components/Select'; // 下拉
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';//引入
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,API_FOODING_HR} from '../../../../services/apiCall';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.getOne = this.getOne.bind(this);
		this.backClick = this.backClick.bind(this);
		this.getForm = this.getForm.bind(this);
		this.state = {
			inputValue:'',
			checked:0,
			paddingTop:0,
			scroll:0,
			id:this.props.location.query.id,
			isnormal:this.props.location.query.isnormal?this.props.location.query.isnormal:false,
			getOneData: {},
			billId: this.props.location.query['id'] || '',
			sourceResult: false, // 控制原单类型 只读
		}
	}
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = 80;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		this.getOne();
    };	
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}	


  	backClick(){
  	}
  	getForm(isclose,initAjax){
  		var that = this;
  		that.normalRef.saveClick(true,initAjax);
  	}


	// 保存
  	onSaveAndClose(callBack){
		let that = this;
		this.normalRef.onSaveAndClose(function(data){
			that.setState({billId:data.data},function(){
				that.getOne(callBack);
			}); 			
		},typeof callBack); 
  	}	   


	// 页面 刷新
	getOne(callBack){		
		let that = this;
		apiGet(API_FOODING_HR,'/scheduleSet/getOne',Object.assign({id:that.state.id || that.state.billId},),
			(response)=>{	
				that.setState({ getOneData: response.data,},function(){
					typeof callBack == 'function' && callBack();
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	componentDidMount(){
		var that = this;
		if(that.state.id){
            this.getOne();
		}
		window.addEventListener('resize', this.handleResize(47));
    };

	render(){
		let {getOneData} = this.state;
		let  id = getOneData.billId;
		return (
			<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
				<AddNormal 
						normalRef={no => this.normalRef = no}
						onSaveAndClose={this.onSaveAndClose}
						backClick={this.backClick}
						onTableClick ={this.onTableClick}
						inputValue ={this.state.inputValue}
						checked ={this.state.checked}
						id={this.state.id}
						checkedData={{}}
						getOne={this.getOne}
						getOneData={this.state.getOneData}
						location={this.props.location}
						navReplaceTab={this.props.navReplaceTab}						
						router={this.props.router}
						sourceResult={this.state['sourceResult']}
						
					/>
					
					
					
			</div>
		);

	}

}
// export default ActivityDetail;
export default NavConnect(ActivityDetail);

