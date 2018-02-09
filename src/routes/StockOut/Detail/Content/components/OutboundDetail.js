import React, { Component,PropTypes } from 'react';
import Table  from  "../../../../../components/Table";
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
import {I18n} from '../../../../../lib/i18n';
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		this.getData=this.getData.bind(this);
		this.columns =
									[{
										title : I18n.t(100379/*产品*/),
										dataIndex : 'mtl'+language,
										key : "mtl"+language,
										width : '18%',
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title :I18n.t(100382/*产品规格*/),
										dataIndex : "basSpeci",
										key : "basSpeci",
										width : "25%",
										render(data,row,index){
											return (<div title={data} className={'text-ellipsis'}>{data}</div>)
										}
									},{
										title : I18n.t(500163/*出库数量*/),
										dataIndex : "qty",
										key : "qty",
										width : "18%",
										render(data,row,index){
											return (<div>{data?(data+' '+row['uom'+language]):''}</div>)
										}
									},{
										title : I18n.t(500140/*已操作数量*/),
										dataIndex : "hasBeenQty",
										key : "hasBeenQty",
										width : "18%",
										render(data,row,index){
											return (<div>{data?(data+' '+row['uom'+language]):''}</div>)
										}
									},{
										title : I18n.t(100312/*供应商*/),
										dataIndex : 'vndBe'+language,
										key : "vndBe"+language,
										width : "21%",
										render(data,row ,index){
											return data;
										}
									}]
    }
    getData(){
    	return this.refs.mainTable.getSelectArr();
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
        	 Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
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
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8'}}>
		               <div style={{marginTop:'10px',backgroundColor:'#fff',borderRadius:'6px'}} className='product-measurement'>
		               	<div>
							<div className='item-title'>
								<span className='title'>{I18n.t(500166/*出库明细*/)}</span>
							</div>
						</div>
		               	<Table 
		               	    ref = "mainTable"
							showHeader ={true}
							columns={this.columns}
							data={this.props.mingxiArray}
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
