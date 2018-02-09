import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
const {Table} = require("../../../../../components/Table");
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.onTableClick = this.onTableClick.bind(this);
		let that = this;
		this.columns = [
			{title : i18n.t(400025/*仓库*/),
				dataIndex : "sl"+language,
				key : "sl"+language,
				width : "5%",
				render(data,row ,index){
					return <div>{data}</div>
				}
			},{
				title : i18n.t(400026/*库区*/),
				dataIndex : "st"+language,
				key : "st"+language,
				width : "5%",
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>)
				}
			},{
				title : i18n.t(400027/*储位*/),
				dataIndex : "slsp"+language,
				key : "slsp"+language,
				width : "5%",
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>)
				}
			},{
				title : i18n.t(100379/*产品*/),
				dataIndex : 'mtl'+language,
				key : "mtl"+language,
				width : "5%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(400012/*品牌*/),
				dataIndex : 'brand'+language,
				key : "brand"+language,
				width : "5%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(400028/*原供应商*/),
				dataIndex : 'vndBe'+language,
				key : "vndBe"+language,
				width : "5%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(400029/*过期日期*/),
				dataIndex : "shelfEdate",
				key : "shelfEdate",
				width : "5%",
				render(data,row,index){
					return new Date(data).Format('yyyy-MM-dd')
				}
			},{
				title : i18n.t(400030/*物料状态*/),
				dataIndex : 'mStats'+language,
				key : "mStats"+language,
				width : "5%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(500141/*采购单价*/),
				dataIndex : 'purNetPrc',
				key : "purNetPrc",
				width : "5%",
				render(data,row,index){
					return toDecimal(data);
				}
			},{
				title : i18n.t(200415/*账面数量*/),
				dataIndex : 'stockQty',
				key : "stockQty",
				width : "5%",
				render(data,row,index){
					return toDecimal(data/row.eqBasnum);
				}
			},{
				title : i18n.t(200416/*实盘数量*/),
				dataIndex : 'stockingQty',
				key : "stockingQty",
				width : "5%",
				ignore_equals: true,
				render(data,row,index){
					return toDecimal(data);
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
			data:null,
			MeunState:true
		}
	}
	handleChange(e){
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
  	kun(){
  		
  	}
	render(){
			let array = [];
			let {getNFieldProps,getFieldProps,getFieldError,getFieldValue }= this.props.form;
			for(var i= 0 ;i< this.props.cangKuArray.length;i++){
				getFieldProps('outstock['+i+'].id', {
							            	validateFirst: true,
						                    initialValue:this.props.cangKuArray[i].billDtlId,
				})
				let obj = Object.assign({},this.props.cangKuArray[i],{stockingQty:<input 
					{...getFieldProps('outstock['+i+'].nums',{
																
																initialValue:''})}
					/>});
				array.push(obj);
			}
			
			return (
				<div className='activity-detail scroll' style={{height:this.state.scrollHeight,padding:'0px'}}>
				<div className={'client-body-single'}>
					<Table
						columns={this.columns}
						data={array}
						checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onRowDoubleClick={this.onRowDoubleClick}
					/>
				</div>
			</div> 
			);

	}

}

export default NavConnect(ActivityDetail);

