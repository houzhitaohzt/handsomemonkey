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
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,language,commonAjax,getQueryString,toDecimal} from '../../../../services/apiCall';


export class ProductDetail extends Component{
	constructor(props) {
        super(props);
	
		this.state = {
            visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>,
			data: [{sourceNo: 'Looding...'}],


            columns:[{
                title : i18n.t(600228/*属性名称*/),
                dataIndex : 'localName',
                key : "localName",
                width : '20%',
                render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
                }
            },{
                title : i18n.t(600229/*属性标识*/),
                dataIndex : "attrIdentity",
                key : "attrIdentity",
                width : "20%",
                render(data,row,index){
					return (<div className="text-ellipsis">{data}</div>);
                }
            },{
                title : i18n.t(600230/*属性类型*/),
                dataIndex : "formObjectAttrType",
                key : "formObjectAttrType",
                width : "20%",
                render(data,row,index){
					return (<div className="text-ellipsis">{data ? data['name']:''}</div>);
                }
            },{
                title : i18n.t(600227/*取值*/),
                dataIndex : "formObject",
                key : "formObject",
                width : "20%",
                render(data,row,index){
					return (<div className="text-ellipsis">{data ? data['localName']:''}</div>);
                }
            },{
				title : i18n.t(600234/*参数*/),
				dataIndex : "queryParams",
				key : "queryParams",
				width : "20%",
				render(data,row,index){
					return (<div className="text-ellipsis">{data}</div>);
				}
			}]			
		}

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

    onSaveAndClose =()=> {
		this.onCancel(); // 关闭弹框 
		this.getPage(); // 刷新页面
    }

	onCancel =()=> this.setState({visible:false});

    handleResize =(height)=> {
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
						apiForm(API_FOODING_DS,'/formObjectAttr/delete',{id: data.selectArr[0].id},
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
		}  else{
			// 新增
			let dialogTitle= data.action + i18n.t(200896/*属性*/);
			this.setState({
				visible:true,
				dialogTitle:dialogTitle,
				dilogTelmp:Template,
			});
		} 
    }

	// 新增
	handleAdd =(e,data,element)=> {
		this.handleClick(e,data,element);
	}



	// 页面 刷新
	getPage =()=> {

		let that = this;
		apiGet(API_FOODING_DS,'/formObjectAttr/getList',{sourceId: getQueryString('id')},
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
								title ={i18n.t(600226/*属性列表*/)}						
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
