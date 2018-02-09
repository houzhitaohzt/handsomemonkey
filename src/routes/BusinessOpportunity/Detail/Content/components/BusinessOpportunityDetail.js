import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";
import Template1 from "../../../../Client/Detail/Content/components/Template1";
import MeasureNormalCommon from "../../../../../components/RuleTemplate/components/MeasureNormalCommon";
import Dialog from "../../../../../components/Dialog";
import Confirm from "../../../../../components/Dialog/Confirm";
import BODetailNormal from "./BODetailNormal"; // 常规详情
import {API_FOODING_ERP, apiForm, apiGet, apiPost} from '../../../../../services/apiCall';
import {errorTips, successTips} from "../../../../../components/ServiceTips"; //提示框
export class BODetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
		this.columns = 
				[
					{
						title : i18n.t(100379/*产品*/),
						dataIndex : 'mtlLcName',
						key : "mtlLcName",
						width : '10%',
						render(data,row,index){
							return (<div title={data}>{data}</div>)
						}
					},{
						title : i18n.t(100382/*产品规格*/),
						dataIndex : "basSpeci",
						key : "basSpeci",
						width : "20%",
						render(data,row,index){
							return data;
						}
					},{
						title : i18n.t(500067/*包装*/),
						dataIndex : "packagLcName",
						key : "packagLcName",
						width : "15%",
						render(data,row,index){
							return data;
						}
					},{
						title : i18n.t(500065/*需求数量*/),
						dataIndex : "needQty",
						key : "needQty",
						width : "10%",
						render(data,row,index){
							return (<div>{data}{row.uomLcName}</div>)
						}
					},{
						title : "FOB成本价",
						dataIndex : 'fobCostPrc',
						key : "fobCostPrc",
						width : "10%",
						render(data,row ,index){
							return data ? data + row.cnyLcName: '';
						}
					},{
						title : i18n.t(200230/*客户目标价*/),
						dataIndex : 'customerPrc',
						key : "customerPrc",
						width : "10%",
						render(data,row ,index){
							return data? data + row.cnyLcName: '';
						}
					},{
						title : i18n.t(201262/*FOB销售价*/),
						dataIndex : 'fobSalePrc',
						key : "fobSalePrc",
						width : "10%",
						render(data,row ,index){
							return data? data + row.cnyLcName: '';
						}
					}
				];
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
    };

    onSaveAndClose(values){
        console.log(values);
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            isnormal: this.props.location.query.isnormal ? this.props.location.query.isnormal : false,
            visible: false,
            dialogTitle: '',
            billId:this.props.location.query.id,
            salBeId:this.props.location.query.cid,
            dilogTelmp: <div></div>,
            productData:[],
            profitData:[],
            saleData:[],
            businessOne:''
        }
	}
	getEditOne = billId => {
		billId = billId || this.state.billId;
        apiGet(API_FOODING_ERP, '/business/getOne',{billId},
        response => {
            this.setState({businessOne:response.data});
        }, error => {
            errorTips(error.message);
        });
        if(billId){
            this.getProfitTeam(billId);
            this.getListTeam(billId);
            this.getListMtl(billId);
        }
    };
	 getListTeam = billId => {
        billId = billId || this.state.billId;
        apiGet(API_FOODING_ERP, '/business/team/getList', {billId},
            response => {
                this.setState({saleData: response.data});
            }, error => {
                errorTips(error.message);
            })
    };

    getProfitTeam = billId => {
        billId = billId || this.state.billId;
        apiGet(API_FOODING_ERP, '/business/linker/getList', {billId},
            response => {
                this.setState({profitData: response.data});
            }, error => {
                errorTips(error.message);
            })
    };

    getListMtl = billId =>{
        billId = billId || this.state.billId;
        apiGet(API_FOODING_ERP, '/business/mtl/getList', {billId},
            response => {
                this.setState({productData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };
    componentDidMount(){
        this.handleResize();
        this.getEditOne();
    }
    handleResize(height){
        this.setState({
            // paddingTop:!this.state.paddingTop
        });
        let padding = this.props.paddingTop;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps){
        this.handleResize(0);
    }
	render(){
        let {comp} = this.props;
        let {businessOne,productData,profitData,saleData}=this.state;
		const commonForm = this.state.dilogTelmp;  
		return (
			<div> 
				<div className='scroll activity-detail' style={{backgroundColor:'#f0f4f8',
				height:this.state.scrollHeight,overflow:'auto'}}>             
						<div style={{ paddingBottom: 10}}>
						<BODetailNormal businessOne={businessOne}/>
						</div>
						<div>
							<MeasureNormalCommon
                                ref={rf=>comp.product=rf}
								title ={i18n.t(200231/*商机产品*/)}
								openDialog={this.handleClick}
								onSaveAndClose={this.onSaveAndClose}
								onCancel = {this.onCancel}
								id={'22'}
                                singleSelect={false}
								showHeader ={true}
								columns ={this.columns}
								data={productData}
							/>
						</div>
						<div className = 'col' style={{paddingLeft:0}}>
							<Template1
								isShowMenu={false}
								openDialog={this.handleClick}
								onSaveAndClose={this.onSaveAndClose}
								onCancel = {this.onCancel}
								id={'product-detail-1'} 
								title={i18n.t(100140/*组织*/)} 
								isShowIcon={false}
								tempArray={[
										{key:i18n.t(100243/*集团*/),value: businessOne.clusterLcName},
										{key:i18n.t(100486/*公司*/),value:businessOne.ccLcName},
										{key:i18n.t(200119/*销售组织*/),value: businessOne.sorLcName},
										{key:i18n.t(400011/*销售员*/),value: businessOne.saleStaffLcName}
									]}
							/>
						</div>
						<div className = 'col' style={{paddingLeft:0}}>
							<div className = 'col' style={{paddingLeft:0, paddingTop: 0}}>
								<MeasureNormalCommon
                                    isShowMenu={false}
									onCancel ={this.onCancel} 
									title ={i18n.t(200232/*利益干系人*/)} 
									Zindex={3}
									showHeader ={false}
									checkedRowsArray={[]}
									id={'client-detail-07'}
									columns ={
                                        [{
                                            title: "linkLcName",
                                            dataIndex: 'linkLcName',
                                            key: "linkLcName",
                                            render(data, row, index){
                                                return <div>{data}</div>
                                            }
                                        }
                                        ]
									}
									data={profitData}
								/> 
							</div>
							<div className = 'col' style={{paddingLeft:0, paddingTop: 0}}>
								<MeasureNormalCommon
                                    isShowMenu={false}
									title ={i18n.t(200233/*销售团队*/)}
									Zindex ={3} 
									showHeader ={false}
									checkedRowsArray={[]}
									id={'client-detail-04'}
									columns ={
                                        [{
                                            title: i18n.t(200234/*销售人*/),
                                            dataIndex: 'salSaffLcName',
                                            key: "salSaffLcName",
                                            width: '40%',
                                            render(data, row, index){
                                                return <div>{data}</div>
                                            }
                                        },
                                            {
                                                title: i18n.t(200221/*是否主力*/),
                                                dataIndex: 'mainMark',
                                                key: "mainMark",
                                                render(data, row, index){
                                                    return (<div title={data}>{data === true ? i18n.t(200235/*主力*/) : ''}</div>)
                                                }
                                            }
                                        ]
									}
									data={saleData}
								/> 
							</div>
						</div>
							
				</div>
				<Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
					{commonForm}
				</Dialog>
			</div>
		);
	
	}

}
export default BODetail;


