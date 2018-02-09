import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';

import Template1  from  '../../Client/Detail/Content/components/Template1';
import {Table} from '../../../components/Table'; //Table表格
import OnlyreadyRuleTemplate from  '../../../components/OnlyreadyRuleTemplate';

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import {I18n} from "../../../lib/i18n";
export class Page extends Component{
	constructor(props){
		super(props);
        let that = this;
		
		// init state
		this.state = {
            caigou: [],
            wuliu:[],
            data:'',
            shoukuan:[]
            
		};

        // table 
		this.columns = [
        {
			title : i18n.t(100181/*款项类型*/),
			dataIndex : "fundTy"+language,
			key : "fundTy"+language,
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(200628/*应收金额*/),
			dataIndex : "predictReceAmt",
			key : "predictReceAmt",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis">{toDecimal(data) || 0} {that.state['cny']}</div>);
			}
		},{
			title : i18n.t(200629/*已收金额*/),
			dataIndex : "receAmt",
			key : "receAmt",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis">{toDecimal(data) || 0} {that.state['cny']}</div>);
			}
		},{
			title : i18n.t(200323/*实际收款日期*/),
			dataIndex : "receDate",
			key : "receDate",
			width : "20%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		}];        

	}
    componentDidMount(){
    	this.getPage();
	}
	componentWillUnmount() {
	}

    // init 
    getPage = ()=>{
        let that = this;
        let {num} = this.props;
		
        apiGet(API_FOODING_ERP,'/saleorder/getExecuteStatus',{saleNo:num},
            (response)=>{				
                that.setState({	
                    caigou:response.data.purOrders || [],
                    wuliu:response.data.shippings || [],
                    shoukuan:response.data.receipts || [],
                    data:response.data
                    
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });        
    }

	render(){
        let {onCancel} = this.props;
        let {presentMsg,data,creditStatusName,lsStaffNames,caigou,wuliu,shoukuan} = this.state;
        let content = <div></div>;
        let that =this;
        content = (
           	<div className={'addnormal scroll'}>
           	<div style={{overflow:'hidden'}}>
           					<div className={'col'}>
								
	                           	<Template1 
		                           onCancel ={this.onCancel}  
		                           title={i18n.t(500212/*销售记录*/)} 
		                           id={'5'}  
		                           allData={{key:'serbBe'}}
	                               isShowIcon={false}
		                           tempArray={[
		                                {key:i18n.t(400008/*销售单号*/),value:data.saleNo},
		                                {key:i18n.t(400011/*销售员*/),value:data.saleStaffLcName},
		                                {key:i18n.t(200325/*信用证*/),value:data.presentMsg},
		                                {key:i18n.t(200518/*信保状态*/),value:data.creditStatusName},
		                                {key:i18n.t(500038/*订单金额*/),value:data.saleTaxAmt +' '+data.cnyLcName},
		                                {key:'',value:''},
		                                {key:i18n.t(100133/*支付条款*/),value:data.payTrmLcName}
		                            ]}
	                    		/>
	                    	</div>
	                    	<div className={'col'}>
	                    		<Template1 
	                    			onCancel ={this.onCancel}  
	                    			title={i18n.t(500214/*收款单*/)} id={'5'}  
	                    			allData={{key:'serbBe'}}
	                                isShowIcon={false}
		                            tempArray={[
		                                {key:i18n.t(500215/*收款单号*/),value:data.receiptNo},
		                                {key:I18n.t(100230/*状态*/),value:data.receiptStatus}
		                                
		                            ]}
	                    		/>
	                    		<OnlyreadyRuleTemplate 
                                onCancel ={this.onCancel} 
                                Zindex ={8}
                                title ={'收款明细'} 
                                openDialog={this.handleClick}
                                showHeader ={true}
                                onSaveAndClose={this.onAddressListSaveAndClose}
                                checkedRowsArray={[]}
                                id={'client-detail-addressList'}
                                columns ={
                                        [{
			                                title :i18n.t(100181/*款项类型*/),
			                                dataIndex : 'fundTyLcName',
			                                key : "fundTyLcName",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                    return data;
			                                }
			                            },{
			                                title :i18n.t(200628/*应收金额*/),
			                                dataIndex : 'predictReceAmt',
			                                key : "predictReceAmt",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                        return <div>{data?data +' '+that.state.data.cnyLcName:''}</div>;
			                                    
			                                   
			                                }
			                            },{
			                                title :i18n.t(200629/*已收金额*/),
			                                dataIndex : 'receAmt',
			                                key : "receAmt",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                        return  <div>{data?data +' '+that.state.data.cnyLcName:''}</div>;
			                                   
			                                    
			                                }
			                            }]
			                        }
		                        data={this.state.shoukuan}
								
							/>
                    		 </div>
                       </div>
                       <div style={{overflow:'hidden'}}>
                       		
							<OnlyreadyRuleTemplate 
                                onCancel ={this.onCancel} title ={i18n.t(200373/*物流订单*/)} 
                                Zindex ={8}
                                openDialog={this.handleClick}
                                showHeader ={true}
                                onSaveAndClose={this.onAddressListSaveAndClose}
                                checkedRowsArray={[]}
                                id={'client-detail-addressList'}
                                columns ={
                                        [{
			                                title :i18n.t(500188/*物流单号*/),
			                                dataIndex : 'no',
			                                key : "no",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                    return data;
			                                }
			                            },{
			                                title :i18n.t(200312/*物流员*/),
			                                dataIndex : 'lsStaffLcName',
			                                key : "lsStaffLcName",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                        return data;
			                                    
			                                   
			                                }
			                            },{
			                                title :I18n.t(100230/*状态*/),
			                                dataIndex : 'status',
			                                key : "status",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                        return data;
			                                   
			                                    
			                                }
			                            },{
			                                title :i18n.t(201078/*发运日期*/) ,
			                                dataIndex : 'shipmentDate',
			                                key : "shipmentDate",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                       return (<div className="text-ellipsis" title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>)
			                                   
			                                    
			                                }
			                            },{
			                                title :i18n.t(500261/*预计到港*/),
			                                dataIndex : 'predictArrivalDate',
			                                key : "predictArrivalDate",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                       return (<div className="text-ellipsis" title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>)
			                                   
			                                    
			                                }
			                             }]
                        		}
		                        data={this.state.wuliu}
								
							/>
							
							<OnlyreadyRuleTemplate 
                                onCancel ={this.onCancel} title ={i18n.t(400020/*采购订单*/)}
                                Zindex ={8}
                                openDialog={this.handleClick}
                                showHeader ={true}
                                onSaveAndClose={this.onAddressListSaveAndClose}
                                checkedRowsArray={[]}
                                id={'client-detail-addressList'}
                                columns ={
                                        [{
			                                title : I18n.t(400054/*采购单号*/),
			                                dataIndex : 'no',
			                                key : "no",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                    return data;
			                                }
			                            },{
			                                title :  I18n.t(100377/*产品编码*/),
			                                dataIndex : 'code',
			                                key : "code",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                        return data;
			                                    
			                                   
			                                }
			                            },{
			                                title : i18n.t(500061/*产品名称*/),
			                                dataIndex : 'mtlLcName',
			                                key : "mtlLcName",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                        return data;
			                                   
			                                    
			                                }
			                            },{
			                                title : i18n.t(400037/*采购员*/),
			                                dataIndex : 'purStaffLcName',
			                                key : "purStaffLcName",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                        return data;
			                                   
			                                    
			                                }
			                             },{
			                                title : I18n.t(100230/*状态*/),
			                                dataIndex : 'status',
			                                key : "status",
			                                width : '14%',
			                                render(data,row,index){
			                                    
			                                        return data;
			                                   
			                                    
			                                }
			                           
			                            }]
                        		}
		                        data={this.state.caigou}
								
							/>
							
							</div>
                    		
                           
							
						
					

			</div>
           	);
		return (
			<div className="package-action-buttons">
                <FormWrapper 
                    showFooter={true} 
                    showSaveClose={false}
                    onCancel={onCancel}>
                       {content}
                </FormWrapper>
			</div>
		)
	}
}
const ResultPage =createForm()(Page);
export default ResultPage;
