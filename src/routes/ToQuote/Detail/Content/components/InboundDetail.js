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
		var that = this;
		this.columns =
									[{
										title : i18n.t(200939/*起始数值*/),
										dataIndex : 'sNum',
										key : "sNum",
										width : '18%',
										ignore_equals: true,
										render(data,row,index){
											return (<div>{data?data+' '+that.props.data['uom'+language]:0+' '+that.props.data['uom'+language]}</div>)
										}
									},{
										title : i18n.t(200940/*终止数值*/),
										dataIndex : "eNum",
										key : "eNum",
										width : "25%",
										ignore_equals: true,
										render(data,row,index){
											return (<div>{data?data+' '+that.props.data['uom'+language]:''}</div>)
										}
									},{
										title : i18n.t(200080/*类型*/),
										dataIndex : "countType",
										key : "countType",
										width : "25%",
										render(data,row,index){
											return <div>{row.countTypeName}</div>;
										}
									},{
										title : i18n.t(200954/*金额/比例*/),
										dataIndex : "convertValue",
										key : "convertValue",
										width : "18%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(200942/*送到价*/),
										dataIndex : "sendPrc",
										key : "sendPrc",
										width : "18%",
										ignore_equals: true,
										render(data,row,index){
											return (<div>{data?toDecimal(data)+' '+that.props.data['cny'+language]:''}</div>)
										}
									}]
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
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8'}}>
		               <div style={{marginTop:'10px',backgroundColor:'#fff',borderRadius:'6px'}} className='product-measurement'>
		               	<div>
							<div className='item-title'>
								<span className='title'>{i18n.t(200938/*区间价格*/)}</span>
							</div>
						</div>
		               	<Table ref = "mainTable"
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
