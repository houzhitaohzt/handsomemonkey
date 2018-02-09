import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Table  from  "../../../../../components/Table";
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../../services/apiCall';
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.getData=this.getData.bind(this);
        this.state=this.initState();
    }
    getData(){
    	return this.refs.mainTable.getSelectArr();
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				    console.log('ok, got it');
				}
		   	});
        }else{
        	let dialogTitle= data.action+data.name.title;
        	 this.setState({
        	 	visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
        	});
        }
    }
    onSaveAndClose(values){
        console.log(values);
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false, 
            dialogTitle:'',
            data:[],
            dilogTelmp:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
	render(){
		const commonForm = this.state.dilogTelmp;
		let that = this;
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8'}}>
		               <div style={{marginTop:'10px',backgroundColor:'#fff',borderRadius:'6px'}} className='product-measurement'>
		               	<div>
							<div className='item-title'>
								<span className='title'>{i18n.t(200596/*收款计划*/)}</span>
							</div>
						</div>
		               	<Table ref = "mainTable"
							showHeader ={true}
							columns={	[{
										title : i18n.t(100181/*款项类型*/),
										dataIndex : 'fundTy'+language,
										key : "fundTy"+language,
										width : '10%',
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title : i18n.t(200622/*期数*/),
										dataIndex : "periodNum",
										key : "periodNum",
										width : "10%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(200610/*预计收款时间*/),
										dataIndex : "predictReceDate",
										key : "predictReceDate",
										width : "20%",
										render(data,row,index){
											return new Date(data).Format('yyyy-MM-dd');
										}
									},{
										title : i18n.t(200623/*最后收款期限*/),
										dataIndex : "lastReceDate",
										key : "lastReceDate",
										width : "8%",
										render(data,row,index){
											return new Date(data).Format('yyyy-MM-dd');
										}
									},{
										title : i18n.t(200611/*预计收款金额*/),
										dataIndex : "predictReceAmt",
										key : "predictReceAmt",
										width : "8%",
										cny:that.props.zhubiao['cny'+language],
										render(data,row,index){
											return (<div>{data?toDecimal(data)+ ' ' + that.props.zhubiao['cny'+language]:''}</div>)
										}
									},{
										title : i18n.t(200624/*实际收款金额*/),
										dataIndex : 'receAmt',
										key : "receAmt",
										width : "8%",
										cny:that.props.zhubiao['cny'+language],
										render(data,row ,index){
											return(<div>{data?toDecimal(data)+ ' ' + that.props.zhubiao['cny'+language]:''}</div>)
										}
									},{
										title : i18n.t(200625/*正常资金成本*/),
										dataIndex : 'normalCostFunds',
										key : "normalCostFunds",
										width : "8%",
										cny:that.props.zhubiao['cny'+language],
										render(data,row ,index){
											return (<div>{data?toDecimal(data)+ ' ' + that.props.zhubiao['cny'+language]:''}</div>)
										}
									},{
										title : i18n.t(200626/*超期资金成本*/),
										dataIndex : 'overCostFunds',
										key : "overCostFunds",
										width : "8%",
										cny:that.props.zhubiao['cny'+language],
										render(data,row ,index){
											return (<div>{data?toDecimal(data)+ ' ' + that.props.zhubiao['cny'+language]:''}</div>)
										}
									}]}
							data={this.props.shoukuanArray}
							checkboxConfig={{show:true,checkedAll:this.state.choised,
								checkedRows:this.state.checkedRows,position:'first'}}
						/>
		                </div>
	               </div>
	                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
		                {commonForm}
		            </Dialog>
               </div>
			);
	}

}
export default ProductDetail;
