import React, { Component } from 'react';
const {Table} = require("../../../../components/Table");
import AddNormal from "./AddNormal";
import FeeTitle  from "./FeeTitle";

// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../../components/Select'; // 下拉
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';//引入
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,language,commonAjax,} from '../../../../services/apiCall';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.onTableClick = this.onTableClick.bind(this);


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
	onTableClick(value){
		if(this.state.checked == 0){
			this.setState({
				inputValue:value.business + '  '+ value.theme
			})
		}else if(this.state.checked == 1){
			this.setState({
				inputValue:value.business + '  '+ value.theme
			})
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
		var that = this;
		 this.getOne();
		window.addEventListener('resize', this.handleResize(47));
    }

	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		this.getOne();
    }

	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}

  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}	


	// 页面 刷新
	getOne =()=> {		
		let that = this;
		apiGet(API_FOODING_DS,'/formObject/getOne',Object.assign({id:that.props.location.query['id'],content: 500},),
			(response)=>{	
				that.setState({getOneData:{}},function(){
					that.setState({getOneData: response['data']});
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});	
			
	}



	render(){
		let {getOneData} = this.state;
		let  sourceType = getOneData.sourceType;
		let  id = getOneData.billId;
		return (
			<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
					<AddNormal 
						normalRef={no => this.normalRef = no}
						onSaveAndClose={this.onSaveAndClose}
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
					<FeeTitle isShowChecked={true}
						id={this.state.id}
						onSaveAndClose={this.onSaveAndClose}
						getOneData={this.state.getOneData}
						getOne={this.getOne}
					/>
			</div>
		);

	}

}
// export default ActivityDetail;
export default NavConnect(ActivityDetail);

