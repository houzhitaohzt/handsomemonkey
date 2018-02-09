import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option } from 'rc-select';
//引入table
import Table from "../../../components/Table";
//引入分页
import Page from "../../../components/Page";


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import {I18n} from "../../../lib/i18n";





class Record extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();

		let {unit} = this.props;

		this.columns_party=[{
			title : I18n.t(100145/*创建时间*/),
			dataIndex : 'createDate',
			key : "createDate",
			width : '15%',
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(500150/*操作数量*/),
			dataIndex : "baseQty",
			key : "baseQty",
			width : "10%",
			render(data,row,index){
				return data +' '+ unit;
			}
		},{
			title : I18n.t(600053/*操作类型*/),
			dataIndex : "type",
			key : "type",
			width : "10%",
			render(data,row,index){
				switch(data){
					case 1 :
						return I18n.t(500148/*入库*/);						
					break;
					case 2 :
						return I18n.t(500167/*出库*/);						
					break;
					case 3 :
						return I18n.t(100467/*锁库*/);					
					break;
					case 4 :
						return I18n.t(600054/*解锁*/);						
					break;
					case 5 :
						return I18n.t(500149/*撤销*/);						
					break;	
					default:																				
				}
			}
		},{
			title : I18n.t(500129/*源单编号*/),
			dataIndex : "orderNo",
			key : "orderNo",
			width : "15%",
			render(data,row,index){
				return data;
			}
		},{
			title :  I18n.t(200828/*操作人*/),
			dataIndex : "updateStaffName",
			key : "updateStaffName",
			width : "10%",
			render(data,row,index){
				return data;
			}
		}];
	}
	
	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onCancel: PropTypes.func,
		columns_party:PropTypes.array,
		searchParty:PropTypes.func
	}
	initState(){
		return {
			tableSources:[
			{day : '2017-02-24', bank : "2", level : I18n.t(500148/*入库*/),type : "PO1612080039",'money':'1067'},
			{day : '2017-02-24', bank : "3", level : I18n.t(500148/*入库*/),type : "PO1612080039",'money':'1067'},
			{day : '2017-02-24', bank : "4", level : I18n.t(500148/*入库*/),type : "PO1612080039",'money':'1067'},
			{day : '2017-02-24', bank : "5", level : I18n.t(500148/*入库*/),type : "PO1612080039",'money':'1067'}],
		}
	}

	static defaultProps={
		data:{main:{
				
			},
		},
		onCancel(){}
	}
	componentDidMount(){

	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}


	render(){
		const {form,data} = this.props;
		const {main}=data;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		const inputStar=(<span className={''}>*</span>);

		return (<FormWrapper showFooter={true}  onCancel={this.onCancel} showSaveClose={false} >
					<div className="common-party">
						<div className="common-party-table">
							<Table
								columns={this.columns_party}
								data={this.props.checkedData}
								checkboxConfig={{show:false}}
								colorFilterConfig={{show:false}}
								followConfig={{show:false}}
								prefixCls={"rc-confirm-table"}
								scroll={{x:false, y:200}}
							/>
						</div>
					</div>
			</FormWrapper>);
	}
}

Record = createForm()(Record);

export default Record;


