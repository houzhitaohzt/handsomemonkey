import React, { Component } from 'react';
const {Table} = require("../../../../components/Table");
import {createForm,FormWrapper} from '../../../../components/Form';
import AddNormal from "./AddNormal";
import Organ from "./Organ";
import Outbound from "./Outbound";
import { browserHistory } from 'react-router';
import {I18n} from '../../../../lib/i18n';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import Confirm from '../../../../components/Dialog/Confirm';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.onTableClick = this.onTableClick.bind(this);
		this.saveClick = this.saveClick.bind(this);
		this.saveClickLink = this.saveClickLink.bind(this);
		this.backClick = this.backClick.bind(this);
		this.getForm = this.getForm.bind(this);
		this.getOne =this.getOne.bind(this);
		this.setGetOne = this.setGetOne.bind(this);
		this.normalRef = null;
		this.state = {
			inputValue:'',
			checked:0,
			paddingTop:0,
			scroll:0,
			id:this.props.location.query.id,
			isnormal:this.props.location.query.isnormal?this.props.location.query.isnormal:false,
			getOne:{}
		}
	}
	setGetOne(obj){
		this.setState({
			getOne:obj
		});
	}

	handleChange(e){
		if(e.target.value == 2 || e.target.value == 3){
				this.setState({
					isShowDialog:true,
					checked:e.target.value,
					inputValue:'' + e.target.value
				});
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
        this.handleResize(0);
         this.getOne();
		window.addEventListener('resize', this.handleResize(0));

    };
    getOne(initAjax){
        apiGet(API_FOODING_ERP, '/noticestock/getOne', {
            billId: this.state.id,
          content:223
        }, response => {
            this.setState({getOne: response.data},()=>{
            	if(initAjax){
            		initAjax();
            	}
            });
        }, error => {
            errorTips(error.message);
        });
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
  	saveClick(value,isclose,initAjax){
  		var that = this;
  		let getOne=this.state.getOne;
  		apiPost(API_FOODING_ERP,'/noticestock/save',Object.assign({},getOne,value),(response)=>{
	      			that.setState({
	      				id:response.data
	      			},()=>{
	      				if(isclose){
		      			   initAjax();
		      			}
	      			});
	    },(error)=>{
	    		ServiceTips({text:error.message,type:'error'});
	    })
  	}
  	saveClickLink(initAjax){
  		let that = this;
  		let getOne=this.state.getOne;
  		const {form} = this.props;
        form.validateFields((error, values) => {
        	 if (!error) {

        	 	 let param = Object.assign({}, getOne, values,{billId:that.state.id});
			  apiPost(API_FOODING_ERP,'/noticestock/save',param,
			  	(response)=>{
			  		param.billId = response.data;
					let cancel = ()=>{
							this.props.router.push({pathname: this.props.router.location.pathname, query: {id: param.billId}, state: {refresh: false}});
							 this.setState({id: param.billId},()=>{
                            	this.getOne();
                            });
					};
					let done = ()=>{
						ServiceTips({text:response.message,type:'sucess'});
						that.props.navReplaceTab({name:I18n.t(500160/*出库通知单详情*/), component: I18n.t(500160/*出库通知单详情*/), url: '/stockout/detail'});
						this.props.router.push({pathname:'/stockout/detail',query:{id:response.data}});
					};
					Confirm(I18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,cancel, done});
			  },(error)=>{
			  		ServiceTips({text:error.message,type:'error'});
			  })
			}

    	});
  	}
  	backClick(data){
		if(data.billId){
			this.props.navReplaceTab({name:I18n.t(500160/*出库通知单详情*/), component: I18n.t(500160/*出库通知单详情*/), url: '/stockout/detail'});
			this.props.router.push({pathname:'/stockout/detail',query: {id:data.billId}});
		} else {
			this.props.navReplaceTab({name: I18n.t(400042/*出库通知单*/), component: I18n.t(400042/*出库通知单*/), url: '/stockout/list'});
			this.props.router.push({pathname:'/stockout/list',query: {}});
		}
  	}
  	getForm(isclose,initAjax){
  		var that = this;
  		that.normalRef.saveClick(true,initAjax);
  	}
	render(){

			return (
				<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
					<AddNormal
						normalRef={no => this.normalRef = no}
						saveClickLink={this.saveClickLink}
						saveClick ={this.saveClick}
						backClick={this.backClick}
						onTableClick ={this.onTableClick}
						inputValue ={this.state.inputValue}
						checked ={this.state.checked}
						id={this.state.id}
						columns = {this.state.columns}
						data = {this.state.data}
						getOne = {this.state.getOne}
						form = {this.props.form}
						setGetOne={this.setGetOne}
					/>


					<Outbound isShowChecked={true}
					  id={this.state.id}
					  getForm={this.getForm}
					/>
					<Organ getOne={this.state.getOne} form = {this.props.form} setGetOne={this.setGetOne}/>
				</div>
			);

	}

}

export default NavConnect(createForm()(ActivityDetail));
