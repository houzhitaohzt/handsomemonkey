import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FunctionKeys from "./FuncKeys";
import PortfhtPlug from './PortfhtPlug';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips'; // 提示
class Portfht extends Component{
	constructor(props){
		super(props);
        props.feiyong && props.feiyong(this);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		var that = this;
			this.columns = [{
			title : i18n.t(200387/*销售订单号*/),
			dataIndex : 'saleOrderNo',
			key : "saleOrderNo",
			width : '10%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(500121/*费用名称*/),
			dataIndex : "costlvtr"+language,
			key : "costlvtr"+language,
			width : "20%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200246/*金额*/),
			dataIndex : "chargeAmt",
			key : "chargeAmt ",
			width : "20%",
			render(data,row,index){
				return <div>{data?(data + ' '+row["cny"+language]):(0+row["cny"+language])}</div>;
			}
		},{
			title : i18n.t(100336/*备注*/),
			dataIndex : "remark",
			key : "remark",
			width : "15%",
			render(data,row,index){
				return <div>{data}</div>;
			}
		}];
		this.state = {
			scrollHeight:0,
			filter:null,
			rodalShow:false,
			pageSize:pageSize,
			currentPage:1,
			id:this.props.location.query.id,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data : []
		}
		this.getPage= this.getPage.bind(this);

	}
	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			checkedData:{},
			title:i18n.t(200388/*新增其他费用*/)
		})
	}
	deleteClick(data,row,event){
		let numArr = this.refs.protfht.getSelectArr();
		let tempString = "";
		if(numArr.length==0){
			ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
			return false;
		}else{
			tempString=i18n.t(100395/*已选中*/) + numArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
		}
		Confirm(tempString, {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/shippingorder/charge/delete',{id:this.refs.protfht.getSelectArr()[0].billDtlId},
			    	(response)=>{
			    		ServiceTips({text:response.message,type:'success'});
			    		this.getPage();
			    	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
			    	});
			},
			close:() => {
				
			}
		});
	}
	editClick(e,record,event){
	}
	copyClick(){
		console.log('copyClick')
	}
	onSaveAndClose(){
		this.getPage();
		this.onCancel();
	}
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}

	handleClick(e,data){
		//右键处理
		if(data.type == 1){
			this.deleteClick(null,data,e);
		}else if(data.type ==2){
  			this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:3,
				title:i18n.t(200389/*编辑港杂及运费*/),
				checkedData:data
			})
  		}
	}
	getPage(sID){
		    let that = this;
			let object=Object.assign({},{billId:this.state.id});
			apiGet(API_FOODING_ERP,'/shippingorder/charge/getList',object,
				(response)=>{	
					that.setState({	
						data: response.data||[]
					});
				},(errors)=>{
			});
		
		
	}
	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}
	componentDidMount(){
		if(!this.props.isDetail){
            this.getPage();
		}
		window.addEventListener('resize', this.handleResize(117));
    };
	componentWillUnmount() {
		// window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		let  that = this;
		let  iconArray = [{type:'add',onClick:this.addClick},{type:'delete',onClick:this.deleteClick},{type:'copy',onClick:this.copyClick}];
		return(<div style={{marginTop:'10px'}}>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				<div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}  copyClick={this.copyClick} />
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages} 
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
							}} 
							backClick={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
							}} 
							nextClick={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());										
							}}
							goChange={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());																				
							}}								
						/>
					</div>
					
					<Table
					    ref ='protfht'
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						singleSelect ={true}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{i18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:i18n.t(100437/*删除*/)}
									},{
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:i18n.t(100439/*编辑*/)}
									}]
						}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<PortfhtPlug DialogContent={this.state.DialogContent}
						 checkedData = {this.state.checkedData}
						 buttonLeft = {this.state.buttonLeft}
						  onSaveAndClose ={this.onSaveAndClose}
						  contentDate = {this.state.contentDate}
						  getOne={this.props.getOne}
						  onCancel = {this.onCancel}/>
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(Portfht);

