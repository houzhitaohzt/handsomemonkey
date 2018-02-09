import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Measurement from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import Template1  from  '../../../Client/Detail/Content/components/Template1';


// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal} from '../../../../services/apiCall';


export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
		this.handleClick=this.handleClick.bind(this);
		var that = this;
	}

	

    
    initState(){
        return {
            visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>,
			data: [{saleNo: 'Looding...'}]
			

        }
	}

    //删除
    handleClick(row,data){
		let that = this;	
		Confirm(i18n.t(500093/*删除后无法撤回,你确定要删除此订单吗？*/), {
					done: () => {
						apiForm(API_FOODING_ERP,'/costconfirmation/delete',{billId: row.billId},
							(response)=>{	
								ServiceTips({text:response.message,type:'success'});
								that.getPage();
								that.props.getOne();
							},(errors)=>{
								ServiceTips({text:errors.message,type:'error'});
						});
					}
		});	
			
		
	}
	// 页面 刷新
	getPage(){
		let that = this;
		apiGet(API_FOODING_ERP,'/costconfirmation/getChargeDtls',{chargeId: that.props.getOneData.billId || that.props.id || ''},
			(response)=>{	
				that.setState({	
					data:response.data,
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}
	onSaveAndClose(values){
        //this.setState({visible:false});
		this.getPage();
		this.props.getOne(); // 刷新主表
		this.props.sourceHandle(); // 控制原单类型 控制

    }
	onCancel(){
        this.setState({visible:false});
	}
	handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
	componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
		this.getPage();		
    }	
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }


	render(){
		var that = this;
		const commonForm = this.state.dilogTelmp;
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8',marginTop:'10px'}}>
		               <div className='col'>
		                    <Measurement 
		                    	title ={i18n.t(500206/*费用确认列表*/)} 
								onSaveAndClose={this.onSaveAndClose}
			               		onCancel = {this.onCancel}
								DialogTempalte={require('./confirm').default} 
			                    id={'39'}
			                    Zindex={2}
			                    showHeader ={true}
			                    columns ={[{
						                title : i18n.t(500129/*源单编号*/),
						                dataIndex : 'saleNo',
						                key : "saleNo",
						                width : '20%',
						                render(data,row,index){
						                    return (<div title={data}>{data}</div>)
						                }
						            },{
						                title : i18n.t(500121/*费用名称*/),
						                dataIndex : "costName",
						                key : "costName",
						                width : "20%",
						                render(data,row,index){
						                    return data;
						                }
						            },{
						                title : i18n.t(200404/*报销金额*/),
						                dataIndex : "amt",
						                key : "amt",
						                width : "20%",
						                render(data,row,index){
						                    return (<div>{data?(toDecimal(data)+' '+row.cny):''}</div>)
						                }
						            },{
						                title : i18n.t(700074/*状态*/),
						                dataIndex : "isConfirmed",
						                key : "isConfirmed",
						                width : "20%",
						                render(data,row,index){
						                    return <div>{data?i18n.t(201065/*已确认*/):i18n.t(300069/*未确认*/)}</div>;
						                }
						            },{
										title : i18n.t(200098/*操作*/),
										dataIndex : 'caozuo',
										key : "caozuo",
										width : '10%',
										className:'text-center',
										render(data,row,index){
											return (<div className="text-ellipsis" title={data}>
													{/*<i className='foddingicon fooding-delete-icon3' style={{fontSize:18}}  onClick={that.handleClick.bind(that,row)} title="删除"></i>*/}
												</div>)
									}
						        }]}
			                    data={this.state.data}
								otherData={this.props.getOneData}	
								getPage={this.getPage}
								
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
