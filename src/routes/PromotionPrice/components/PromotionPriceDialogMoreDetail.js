import React,{Component,PropTypes} from 'react';
const {Table} =  require("../../../components/Table");
class PromotionPriceDialogMoreDetail extends Component{
	constructor(props){
		super(props);
		this.state=this.initState();
		this.columns = [{
			title : "Specification",
			dataIndex : 'Specification',
			key : "Specification",
			width : '14%',
			render(data,row,index){
				return data;
			}
		},{
			title : "FOB Price(MT)",
			dataIndex : "FOB",
			key : "FOB",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title : "POL",
			dataIndex : "POL",
			key : "POL",
			width : "14%",
			render(data,row,index){
				return data;
			}
		},{
			title : "CIF Price(MT)",
			dataIndex : "CIF",
			key : "CIF",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : "POD",
			dataIndex : "POD",
			key : "POD",
			width : "14%",
			render(data,row,index){
				return data;
			}
		},{
			title : "Validity",
			dataIndex : "Validity",
			key : "Validity",
			width : "12%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd hh:mm:ss');
			}
		}];
	}

	initState(){
		return{
			scrollHeight:0,
			data:null,
			record: [{'Specification':'Pardkjfdi9438595 iwfjsdf','FOB':'985348USD','POL':'QINDAO','CIF':'991 USD','POD':'KARACHI','Validity':1488875168768}]
		}
	}
	render(){
		let {record} = this.state;
		return(<div className={'promotionprice-dialog-moredetails'}>
			<p>Dear,Test01</p>
			<p>Good Day!</p>
			<p>This email is to update out latest good price for you as below;</p>
			<Table
				columns={this.columns}
				data={record}
				checkboxConfig={{show:false}}
				colorFilterConfig={{show : false,dataIndex:'colorType'}}
				followConfig={{show:false}}
				scroll={{x:true,y:200}}
				prefixCls={"rc-confirm-table"}
			/>
			<h3>Payment term：&nbsp;&nbsp;<span className={'espac-red'}>20% T/T in advance,balance by O/A 45 days</span></h3>
			<p>Any interest,please contact us earlier.</p>
			<p>Best regards.</p>
			<br />
			<p>sales13 Empty| Sales Manager</p>
			<h3>FOODING GROUP LIMITED</h3>
			<p>NO.759,SOUTHYANGGAO POAD,PUDONG,SHANGHAI,CHINA</p>
			<p>Tel:+86-21-50321622 EXTL8106</p>
			<p>+86-21-50321622</p>
			<p>Email:<span className={'espac-blue'}>sales13@chinafooding.com</span></p>
			<p>Web:<span className={'espac-blue'}>www.chinafooding.com</span></p>
		</div>)
	}
}
export default PromotionPriceDialogMoreDetail;

