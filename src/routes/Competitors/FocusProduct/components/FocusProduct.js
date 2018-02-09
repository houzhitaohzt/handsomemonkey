import React,{Component,PropTypes} from 'react';
const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import  BConfirm from  '../../../../components/button/confirm';//引入按钮键
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import Checkbox from '../../../../components/CheckBox';
//引入提示
import Tooltip from 'antd/lib/tooltip';
import SpecTextCard from "../../../Product/List/SpecText/SpecText";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {I18n} from '../../../../lib/i18n';

class FocusProduct extends Component{
	constructor(props){
		super(props);
        props.product && props.product(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		//拉取数据
		this.getPage = this.getPage.bind(this);
		this.columns = [{
			title : I18n.t(100377/*产品编码*/),
			dataIndex : 'code',
			key : "code",
			width : '20%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : I18n.t(100379/*产品*/),
			dataIndex : "localName",
			key : "localName",
			width : "11%",
			render(data,row,index){
				return <div>{data}</div>;
			}
		},{
			title : I18n.t(100226/*英文名称*/),
			dataIndex : "enName",
			key : "enName",
			width : "19%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100382/*产品规格*/),
			dataIndex : "specTxt",
			key : "specTxt",
			width : "34%",
			render(data,row,index){
				if(data){
					return (<Tooltip
		                    placement="bottomRight"
		                    mouseEnterDelay={0.5}
		                    arrowPointAtCenter={true}
		                    mouseLeaveDelay={0.2}
		                    prefixCls="spctext-toolip"
		                    overlay={<SpecTextCard id={row&&row.mtlId}/>}
		                >
	                    <div className="text-ellipsis mail-hover">{data}</div>
	                </Tooltip>)
				}
			}
		}];
	}
	initState(){
		return {
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			id:this.props.location.query.id,
			totalPages: 1, // 总页数			
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条 
		}
	}
	addClick(){
		this.addAndEditInit(I18n.t(100392/*新增*/) + I18n.t(100350/*关注产品*/));
	}
	addAndEditInit(title){
		let content =require('./FocusProductAddAndEditDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title:title,
    		dialogContent : element	    		
    	})
	}
	onSaveAndClose(value,data){
		let that = this;
		value = Object.assign({},value,{dataTyId:210,sourceId:this.state.id})
		apiPost(API_FOODING_DS,'/beMtl/save',value, response =>　{
			that.setState({
				showDilaog:!this.state.showDilaog
			})
			ServiceTips({text:response.message,type:'success'})
			that.getPage(this.state.id);
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		
	}
	onCancel(that){
		this.setState({
			showDilaog:false
		})
	}
	deleteClick(){
		var that = this;
		let numArr = this.refs.competitors.getSelectArr(),tempString = I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
		if(!numArr.length){
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
			return false;	
		}else if(numArr.length > 1){
			tempString = I18n.t(100395/*已选中*/) + data.selectArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
		} 
	 	Confirm(tempString, {
				done: () => {
					let id=[];
					numArr.map((e)=>{id.push(e.id)});
				    apiForm(API_FOODING_DS,'/beMtl/delete',{id:id},(response)=>{
				    		ServiceTips({text:response.message,type:'sucess'});
				    		that.getPage();
				    },(error)=>{
				    	ServiceTips({text:error.message,type:'error'});
				    })
				}
		});
	}
	getPage(sID,objValue){
		let that = this;
		var sID = sID || '';
		if(objValue){
			this.setState({
				obj:objValue
			},function() {
			// body... 
				let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: this.state.currentPage,dataTyId: 210, sourceId : this.state.id },this.state.obj);
				apiGet(API_FOODING_DS,'/beMtl/getPage',object,
					(response)=>{	
						that.setState({	
							data: response.data.data,
							totalPages: response.data.totalPages,
							currentPage: response.data.currentPage 	
						});
					},(errors)=>{
				});
			})
		}else {
			let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: this.state.currentPage, dataTyId: 210, sourceId : this.state.id },this.state.obj);
			apiGet(API_FOODING_DS,'/beMtl/getPage',object,
				(response)=>{	
					that.setState({	
						data: response.data.data,
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
			});
		}	
	}

	handleClick=(e,data) => {
		// if(data.type == 1){
		// 	this.addAndEditInit('编辑关注产品',data.record.id);
		// }
		if(data.type == 2){
			this.deleteClick();
		}else if(data.action == 3){
			// {
			// 	onClick:this.handleClick,
			// 	content:<div><i className={'foddingicon fooding-shixiao'}></i>失效</div>,
			// 	data:{action:'失效',type:3}
			// }
		}
	}
	handleResize(height){
		let sch=document.body.offsetHeight-height-226;
		let scroll=sch-110;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
		if(!this.props.isDetail){
            this.getPage(this.state.id);
		}
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}

	render(){
		let that = this;
		let  iconArray = [{type:'add',onClick:this.addClick,permissions:'competitors.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'competitors.dtl.del'}]
		return(<div>
			<div className={'client-body'} style={{height:this.state.scrollHeight,marginTop:'10px'}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<BConfirm iconArray={iconArray}/>
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
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage())}}								
						/>
					</div>
					<Table 
						ref = "competitors"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									permissions:'competitors.dtl.del',
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{I18n.t(100437/*删除*/)}</div>,
									data:{action:I18n.t(100437/*删除*/),type:2}
								}]
							}}
					/>
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
				</div>
				</div>
			</div>
		</div>
	)
	}
}
export default NavConnect(FocusProduct);

