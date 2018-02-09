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
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal,API_FOODING_HR} from '../../../../services/apiCall';


export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
		
		this.handleAdd=this.handleAdd.bind(this);
		this.handleClick=this.handleClick.bind(this);

		this.addBeforeSaveClick=this.addBeforeSaveClick.bind(this);
		
		
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

    onSaveAndClose(values){
        //this.setState({visible:false});
		this.getPage();
		this.props.getOne(); // 刷新主表

		this.props.sourceHandle(); // 控制原单类型 控制					
		

    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>,
			data: [{sourceNo: 'Looding...'}],


            columns:[{
                title : i18n.t(500121/*费用名称*/),
                dataIndex : "costlvtr"+language,
                key : "costlvtr"+language,
                width : "10%",
                render(data,row,index){
                    return data;
                }
            },{
                title : i18n.t(200246/*金额*/),
                dataIndex : "chargeAmt",
                key : "chargeAmt",
                width : "7%",
                render(data,row,index){
                   return (<div>{data?toDecimal(data):''}</div>)
                }
            },{
                title : i18n.t(100336/*备注*/),
                dataIndex : "remark",
                key : "remark",
                width : "10%",
                render(data,row,index){
                   return (<div>{data}</div>)
                }
            }],

        }
	}

    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }

    handleClick = (e, data, Template) => {

		let that = this;		
		if(data.number == 2){
			// 删除 
			if(data.selectArr.length>1){
				ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
			} else{
				Confirm(i18n.t(500093/*删除后无法撤回,你确定要删除此订单吗？*/), {
					done: () => {
						apiForm(API_FOODING_HR,'/evecregister/dtl/delete',{id: data.selectArr[0].billId},
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
		} else if( data.number == 1 ){
			// 新增
			let dialogTitle= data.action+data.name.title;
			this.setState({
				visible:true,
				dialogTitle:dialogTitle,
				dilogTelmp:Template,
			});
		} else{
			// 编辑
			apiGet(API_FOODING_HR,'/evecregister/dtl/getOne',{id:data.record.billId},
				(response)=>{
					let dialogTitle= data.action+data.name.title;
					this.setState({
						visible:true,
						dialogTitle:dialogTitle,
						dilogTelmp:Template,
					});
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});	
		} 
    }

	// 新增
	handleAdd(e,data,element){

		this.handleClick(e,data,element);

	}

 	addBeforeSaveClick(initAjax){

    	if(this.props.getOne.billId){
    		initAjax();
    	}else{
    		this.props.onSaveAndClose(initAjax);
    	}
    }	

	// 页面 刷新
	getPage(){
		let that = this;
		apiGet(API_FOODING_HR,'/evecregister/dtl/getList',{billId: that.props.getOneData.billId || that.props.id || ''},
			(response)=>{	
				that.setState({	
					data: response.data,
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}



	render(){

		const commonForm = this.state.dilogTelmp;
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8',marginTop:'10px'}}>
		               <div className='col'>
		                    <Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							
								title ={i18n.t(500121/*费用名称*/)} 
								openDialog={this.handleAdd}
			                    onSaveAndClose={this.onSaveAndClose}
			               		onCancel = {this.onCancel}
								DialogTempalte={require('./confirm').default} 
			                    id={'39'}
			                    Zindex={2}
			                    showHeader ={true}
			                    columns ={this.state.columns}
			                    data={this.state.data}
								otherData={this.props.getOneData}	
								getPage={this.getPage}
								addBeforeSaveClick={this.addBeforeSaveClick}
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
