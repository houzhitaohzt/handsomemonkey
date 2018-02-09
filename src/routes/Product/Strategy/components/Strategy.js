import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page"
//引入按钮键
import  Confirm from  '../../../../components/button/confirm'
import  DeleteDialog from '../../../../components/Dialog/Confirm'
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
import {getQueryString,apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

export class Strategy extends Component{

	constructor(props){
		super(props);
        props.strategy && props.strategy(this);

		this.state = {
			pageSize:pageSize,
			rodalShow:false ,
			title:'',
			scroll:0,
			paddingTop:0,
			selectArr:[],
			checkedRows:[],
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data :[],
			DialogContent:<div></div>,

			sourceId:this.props.location.query.id,
			dataTyId:'',
			name:'',

		}

		this.columns = [{
			title : i18n.t(200955/*国家定价*/),
			dataIndex : 'countryName',
			key : "countryName",
			width : '30%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data} {row['ocValue']}%</div>);
			}
		},{
			title : i18n.t(200956/*终端客户定价*/),
			dataIndex : "beValue",
			key : "beValue",
			width : "30%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data} %</div>);
			}
		},{
			title : i18n.t(200957/*贸易公司定价*/),
			dataIndex : "ccValue",
			key : "ccValue",
			width : "30%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data} %</div>);
			}
		}];


	}

	componentDidMount(){
        this.handleResize(0);
        if(!this.props.isDetail){
            this.getPage();
		}

		window.addEventListener('resize', this.handleResize(0));
    } 
    componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
	  
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}

	handleResize = (height)=> {

		let sch=document.body.offsetHeight;
		let scroll = sch-330;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}

	searchChange = (e)=> {
		this.setState({
			name:e.target.value
		});
	}

	searchClick = ()=> {
		this.getPage();
	}

	addClick = (data)=> {
		let that = this;
		let content=require('../../../Common_confirm/Strategy').default;
		let element=React.createElement(content,{
			onSaveAndClose: that.onSaveAndClose,
			onCancel:that.onCancel,
			getPage:that.getPage,
			checkedData:data ? data['record'] : {}
		});

		this.setState({
			rodalShow : true,
			showHeader:true,
			dialogContent: element,
			title:`${i18n.t(100392/*新增*/)} - ${i18n.t(200943/*策略*/)}`
		})
    }


   	deleteClick = (e)=> {
		let that = this;
        let IDs = this.refs.product.getSelectArr().map(o => o.id);

        if (!IDs.length) {
			ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'error'});
			return;
		}

		
		DeleteDialog(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			done: () => {
				apiForm(API_FOODING_DS,'/countryPricePolicy/delete',{id:IDs},(response)=>{
					ServiceTips({text:response.message,type:'success'});
					that.getPage();					
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
				});
			},
			close:() => {
			}
		});			 
	}

	// get page 
	getPage = (currentPage,objValue)=> {
		let that = this;
		let {name} = this.state;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{companyMtlId:getQueryString('id'),countryName:name,pageSize: this.state.pageSize, currentPage: currentP});
		apiGet(API_FOODING_DS,'/countryPricePolicy/getPage',object,
				(response)=>{	
					that.setState({	
						data: response.data.data || [],
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
		});
	}

	handleClick = (e,data,target)=> {
		//右键处理
		if(data.type == 1){
			this.deleteClick(data);
		}else if(data.type ==2){
  			this.addClick(data);
  		}
	}

    onSaveAndClose = ()=> {
		this.getPage();
		this.onCancel();
	}

	onCancel = ()=> this.setState({rodalShow:false});


	render(){
		let {dialogContent} = this.state;
		let iconArray = [{type:'add',onClick:this.addClick,permissions:'mtl.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'mtl.dtl.del'}];
		let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
		
		
		return (
			<div className="contact-fluid">
				<div className='content-margin'></div>
				<div className="contact-body" style = {{height:this.state.scrollHeight}}>
					<Confirm iconArray ={iconArray}/>
					<div className="search" style={{marginLeft:"400px"}}><input type='search'
						name="search" placeholder={i18n.t(500296/*请输入国家名称*/)}
						value ={this.state.name} onChange = {this.searchChange}
												   onKeyDown={(e)=>{
														if(e.keyCode == 13){
															this.searchClick()
														}
												   }}
					 />
						<i className="pointer foddingicon fooding-search_icon" onClick={this.searchClick}></i>
					</div>					
					<Page
						currentPage={this.state.currentPage}
						totalPages={this.state.totalPages}
						totalRecords={this.state.totalRecords}
						sizeList={sizeList}
						currentSize={this.state.pageSize}
						pageSizeChange={(num)=>{
							this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(1,num));
						}}
						backClick={(num)=>{
							this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
						}}
						nextClick={(num)=>{
							this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
						}}
						goChange={(num)=>{
							this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
						}}
					/>
					<div className="action-normal-buttons">
						<Table
								ref ="product"
								columns={this.columns}
								scroll={{x:true,y:this.state.scroll}}
								data={this.state.data}
								checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
								colorFilterConfig={{show : false}}
								followConfig={{show:false}}
								style={{width:'100%'}}
								contextMenuConfig={{
									enable:true,
									contextMenuId:'SIMPLE_TABLE_MENU',
									menuItems:[{
										permissions:'mtl.dtl.del',
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{i18n.t(100437/*删除*/)}</div>,
										data:{type:1,title:i18n.t(100437/*删除*/)}
										},{
											permissions:'mtl.edit',
											onClick:this.handleClick,
											content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
											data:{type:2,title:i18n.t(100439/*编辑*/)}
										}]
								}}
						/>
						<Dialog visible={this.state.rodalShow} showHeader ={this.state.showHeader}  title={this.state.title} width={926}>
							{dialogContent}
						</Dialog>
					</div>
				</div>
			</div>
		);
	}

}
export default Strategy;
