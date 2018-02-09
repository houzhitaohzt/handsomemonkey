import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
const {Table} = require("../../../../../components/Table");
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import {createForm,FormWrapper} from '../../../../../components/Form';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.onTableClick = this.onTableClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		let that = this;
		this.columns =[{
			title : i18n.t(200612/*收款日期*/),
			dataIndex : 'createDate',
			key : "createDate",
			width : '10%',
			render(data,row,index){
				return new Date( row['billDate'] || data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200613/*收款银行*/),
			dataIndex : "bank"+language,
			key : "bank"+language,
			width : "15%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100500/*银行账号*/),
			dataIndex : "account"+language,
			key : "account"+language,
			width : "15%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200614/*收汇方式*/),
			dataIndex : "payTrmTy"+language,
			key : "payTrmTy"+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200621/*实收金额*/),
			dataIndex : "billAmt",
			key : "billAmt",
			width : "10%",
			ignore_equals: true,
			render(data,row,index){
				return (<div>{data?toDecimal(data)+ ' ' + that.state.datas['cny'+language]:''}</div>)
			}
		}];

		this.state = {
			inputValue:'',
			checked:0,
			paddingTop:0,
			scroll:0,
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			datas:this.props.data || {},
			data:{},
			info:[],
			MeunState:true
		}
	}
	handleChange(e){
	}
	// 取消
	onCancel(){
		this.props.form.resetFields(); // 清除表单
		this.props.onCancel();
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
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
	render(){
			let {checkedData} = this.props;
			let info = this.props.info || {}
			let content = <div></div>;
			const jihuaArray = this.props.jihuaArray || [];
			let {getNFieldProps,getFieldProps,getFieldError,getFieldValue}= this.props.form;
			return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} showSaveClose={false} onCancel={this.onCancel}>
						<Table
							columns={this.columns}
							data={jihuaArray}
							checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							colorFilterConfig={{show : false,dataIndex:'colorType'}}
							followConfig={{show:false}}
							scroll={{x:true,y:this.state.scroll}}
							onRowDoubleClick={this.onRowDoubleClick}
						/>
					</FormWrapper>
			</div>
			);

	}

}

export default NavConnect(createForm()(ActivityDetail));

