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
		this.columns =[{
						title : i18n.t(500121/*费用名称*/),
						dataIndex : 'costlvtr'+language,
						key : "costlvtr"+language,
						width : '18%',
						render(data,row,index){
											return (<div title={data}>{data}</div>)
						}
									},{
										title : i18n.t(500122/*标准费用*/),
										dataIndex : "costAgg",
										key : "costAgg",
										width : "25%",
										render(data,row,index){
											return (<div>{data?(toDecimal(data)+' '+row.cnyLcName):''}</div>)
										}
									},{
										title : i18n.t(500088/*装箱类型*/),
										dataIndex : "packTyName",
										key : "packTyName",
										width : "18%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(100214/*箱型*/),
										dataIndex : "contnrTy"+language,
										key : "contnrTy"+language,
										width : "18%",
										render(data,row,index){
											return (<div>{data}</div>)
										}
									},{
										title : i18n.t(500123/*计算模式*/),
										dataIndex : 'chargeTyName',
										key : "chargeTyName",
										width : "21%",
										render(data,row ,index){
											return data;
										}
									}];
        this.state=this.initState();
        this.getList = this.getList.bind(this);
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
        this.getList();
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
    getList(){
    	var that = this;
    	apiGet(API_FOODING_ERP,'/lsbeport/cost/getList',{billId:this.props.id},(response)=>{
    		that.setState({
    			data:response.data
    		});
    	},(error)=>{

    	});
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
	render(){
		const commonForm = this.state.dilogTelmp;
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8'}}>
		               <div style={{marginTop:'10px',backgroundColor:'#fff',borderRadius:'6px'}} className='product-measurement'>
		               	<div>
							<div className='item-title'>
								<span className='title'>{i18n.t(500124/*明细*/)}</span>
							</div>
						</div>
		               	<Table 
							showHeader ={true}
							columns={this.columns}
							data={this.state.data}
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
