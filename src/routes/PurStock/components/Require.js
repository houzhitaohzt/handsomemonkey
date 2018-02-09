import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
//引入select插件
import Select, { Option } from '../../../components/Select';
//引入table
import Table from "../../../components/Table";
//引入分页
import Page from "../../../components/Page";
//tab切换
import TabSwitch from "../../../components/TabSwitch";
import ProductListOne from "./ProductListOne";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';

import {I18n} from '../../../lib/i18n';
class Record extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		var that = this;
	}
	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onCancel: PropTypes.func,
	}
	initState(){
		let that = this;
		return {
		titleArray:[],//遍历唛头标签
		columns_voucher:[{
			title : I18n.t(400039/*操作员*/),
			dataIndex : 'userTypeName',
			key : "userTypeName",
			width : '30%',
			render(data,row,index){
				return (<div title={data}>{data}</div>)
			}
			},{
				title : I18n.t(100128/*单据要求*/),
				dataIndex : "billRequLcName",
				key : "billRequLcName",
				width : "30%",
				render(data,row,index){
					return data;
				}
			},{
				title : I18n.t(100002/*描述*/),
				dataIndex : "content",
				key : "content",
				width : "40%",
				render(data,row,index){
					return (<div>{data}</div>);
				}
			}],
			columns_marks:[{
				title : I18n.t(100379/*产品*/),
				dataIndex : 'mtlLcName',
				key : "mtlLcName",
				width : '14%',
				render(data,row,index){
					return (<div title={data}>{data}</div>)
				}
			},{
				title : I18n.t(400130/*贴唛方*/),
				dataIndex : "stickDirectionName",
				key : "stickDirectionName",
				width : "8%",
				render(data,row,index){
					return data;
				}
			},{
				title : I18n.t(400131/*唛头类型*/),
				dataIndex : "markTyLcName",
				key : "markTyLcName",
				width : "14%",
				render(data,row,index){
					return (<div>{data}</div>);
				}
			},{
				title :I18n.t(400132/*颜色*/),
				dataIndex : "colorTypeName",
				key : "colorTypeName",
				width : "14%",
				render(data,row,index){
					return (<div>{data}</div>);
				}
			},{
				title : I18n.t(400133/*唛头内容*/),
				dataIndex : "items",
				key : "items",
				width : "24%",
				render(data,row,index){
					return <div>
                            {
                                that.state.titleArray.map((value,i)=>{
                                    if(data && data[value["id"]]){
                                          return value["localName"]+' '+data[value["id"]] +'   ';  
                                    }
                                })
                            }
                        </div>;
				}
			}],
			columns_certificate:[{
				title : I18n.t(500070/*证书名称*/),
				dataIndex : 'cardLcName',
				key : "cardLcName",
				width : '14%',
				render(data,row,index){
					return (<div title={data}>{data}</div>)
				}
			},{
				title : I18n.t(500071/*是否加急*/),
				dataIndex : "gentMark",
				key : "gentMark",
				width : "5%",
				render(data,row,index){
					return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
					//return data?I18n.t(100141/*是*/):I18n.t(100142/*否*/);
				}
			},{
				title : I18n.t(500072/*是否正本*/),
				dataIndex : "origMark",
				key : "origMark",
				width : "5%",
				render(data,row,index){
					return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
					//return data?I18n.t(100141/*是*/):I18n.t(100142/*否*/);
				}
			},{
				title : I18n.t(400134/*相关产品*/),
				dataIndex : "mtlLcName",
				key : "mtlLcName",
				width : "20%",
				render(data,row,index){
					return (<div>{data}</div>);
				}
			},{
				title : I18n.t(400135/*供应商提供*/),
				dataIndex : "vndBeMark",
				key : "vndBeMark",
				width : "20%",
				render(data,row,index){
					return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
					//return (<div>{data?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</div>);
				}
			}],
			columns_shipment:[{
				title : I18n.t(100379/*产品*/),
				dataIndex : 'mtlLcName',
				key : "mtlLcName",
				width : '40%',
				render(data,row,index){
					return (<div title={data}>{data}</div>)
				}
			},{
				title : I18n.t(200080/*类型*/),
				dataIndex : "shipTestTypeName",
				key : "shipTestTypeName",
				width : "18%",
				render(data,row,index){
					return data;
				}
			},{
				title : I18n.t(100313/*服务机构*/),
				dataIndex : "splBeLcName",
				key : "splBeLcName",
				width : "38%",
				render(data,row,index){
					return (<div>{data}</div>);
				}
			}],
			billreqirListData:[],//单据
			cardListData:[],//证书要求
			marksListData:[],//麦头
			requireListData:[], //装船要求

		}
	}
	componentDidMount(){
		let {data} = this.props;
		this.getTableInitData(data.billId);
	}
	componentWillReceiveProps(nextProps){
		if((nextProps.data && nextProps.data.billId) && nextProps.data.billId !== this.props.billId)
			this.getTableInitData(nextProps.data.billId);
	}
	getTableInitData = billId => {
		if( !billId) return;
		//单据要求初始化
		apiGet(API_FOODING_ERP,'/purorder/getBillreqirList',{billId:billId},response => {
			this.setState({billreqirListData:response.data})
		},error => ServiceTips({text:error.message,type:'error'}))
		//证书要求
		apiGet(API_FOODING_ERP,'/purorder/getCardList',{billId:billId},response => {
			this.setState({cardListData:response.data})
		},error => ServiceTips({text:error.message,type:'error'}))
		//麦头
		apiGet(API_FOODING_ERP,'/purorder/getMarksList',{billId:billId},response => {
			this.setState({marksListData:response.data})
		},error => ServiceTips({text:error.message,type:'error'}))
		//装船要求
		apiGet(API_FOODING_ERP,'/purorder/getRequireList',{billId:billId},response => {
			this.setState({requireListData:response.data})
		},error => ServiceTips({text:error.message,type:'error'}))

		 apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Item'},(response)=>{
                this.setState({
                    titleArray:response.data
                })
        },(error)=>{

        })
	}
	onCancel = () => {
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}

	render(){
		const {form,data} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		const inputStar=(<span className={''}>*</span>);
		let TabSwitchArray = [
		{title:I18n.t(100128/*单据要求*/),content:<ProductListOne data={this.state.billreqirListData} columns={this.state.columns_voucher} />},
		{title:I18n.t(400137/*唛头要求*/),content:<ProductListOne data={this.state.marksListData} columns={this.state.columns_marks} />},
		{title:I18n.t(500078/*证书要求*/),content:<ProductListOne data={this.state.cardListData} columns={this.state.columns_certificate} />},
		{title:I18n.t(400138/*装船要求*/),content:<ProductListOne data={this.state.requireListData} columns={this.state.columns_shipment} />}]
		return (<FormWrapper showFooter={true}  onCancel={this.onCancel} showAddSave={false} showSaveClose={false} >
				<div style={{height:'334px',overflow:'auto'}} className={'scroll'}>
					<TabSwitch TabSwitchArray={TabSwitchArray}/>
				</div>
			</FormWrapper>);
	}
}

Record = createForm()(Record);

export default Record;
