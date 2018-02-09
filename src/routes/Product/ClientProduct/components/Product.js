import i18n from './../../../../lib/i18n';
import React, { Component } from 'react';
import Page from '../../../../components/Page'
import Table from "../../../../components/Table";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
import ButtonKey from  '../../../../components/button/confirm';
import Confirm from '../../../../components/Dialog/Confirm';
import AddRadio from '../../../../components/AddRadio'
import ProductNav from './ProductNav'
//引入提示
import Tooltip from "../../../../components/Tip";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
export  class Product extends Component{
	constructor(props){
		super(props);
		let that = this;
        props.product && props.product(this);
		this.addClick = this.addClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.deleteClick =this.deleteClick.bind(this);
		this.priceClick = this.priceClick.bind(this);
		this.updatePriceClick = this.updatePriceClick.bind(this);
		this.competeClick = this.competeClick.bind(this);
		this.competeClick_1 = this.competeClick_1.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.onVisibleChange = this.onVisibleChange.bind(this);
		this.updatePrice = this.updatePrice.bind(this);
		this.state = {
			contentDate:{},
			showHeader:true,
			title:'',
			selectArr:[],
			checkedRows:[],
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			data : [],
			sourceId:this.props.location.query.id,
			type:'',
			getOne:{},
			visible: false,
			currentIndex:0,
			content:<div></div>,
            currentPage:0,
            pageSize:20,
            paddingTop:0

		}
	}
	updatePrice(){
		let that = this;
		let array=this.refs.product.getSelectArr();
		if(array.length>0){
			Confirm(i18n.t(200918/*您确定要更新价格吗*/), {
						done: () => {
							let beId = that.props.customer.id;
							let ormbs=[];
							array.map((e)=>{
								// beId.push(e.enterpris.id);
								ormbs.push({mtlId: e.mtlId});
							});
							let value=Object.assign({},{beId: beId, ormbs: ormbs});
						    apiPost(API_FOODING_DS,'/offerRec/updatePrice',value,(response)=>{
						    	this.getPage();
						    	ServiceTips({text:response.message,type:'sucess'});
							},(error)=>{
								ServiceTips({text:error.message,type:'error'});
							})
						}
			});

		}else {
			ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
		}

	}
	addClick(e){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:i18n.t(200919/*新增关注产品*/),
			getOne:{}
		})
    }
    onVisibleChange (index,row,visible) {
    	if(!visible){
    		 this.setState({
		      visible:visible,
		      currentIndex:index
		    });
    	  return false;
    	}
    	apiGet(API_FOODING_ERP,'/promoteprice/getEffectPrices',{mtlId:row.mtlId,beId:row.enterpris.id},(response)=>{
    		if(response.data.length> 0){
    			let data = response.data ||[];
	    		let content = (<div className='product-card' style={{boxShadow:'0px 0px 20px rgba(0,0,0,.65)',
                    border: '1px solid rgba(0, 0, 0, 0.65)'}}>
						<Table
							columns={[{
										title : "",
										dataIndex : 'payTermName',
										key : "payTermName",
										tooltip: false,
										render(data,row,index){
											return <div title={data}>{data}</div>
										}
									},{
										title : "",
										dataIndex : "brandName",
										key : "brandName",
										tooltip: false,
										render(data,row,index){
											return <div>{data}</div>;
										}
									},{
										title : "",
										dataIndex : "sStatnName",
										key : "sStatnName",
										tooltip: false,
										render(data,row,index){
											return <div>{'FOB-'+row.sStatnName +':'+row.fobPrc.toFixed(2)}</div>;
										}
									},{
										title : "",
										dataIndex : "eStatnName",
										key : "eStatnName",
										tooltip: false,
										render(data,row,index){
											return <div>{ 'CIF-'+row.eStatnName +':'+(row.cifPrc?row.cifPrc.toFixed(2):'')}</div>;
										}
									},{
										title : "",
										dataIndex : "eDate",
										key : "eDate",
										tooltip: false,
										render(data,row,index){
											return <div>{new Date(row.eDate).Format('yyyy-MM-dd')}</div>;
										}
									}]}
							showHeader={false}
							data={data}
							scroll={{x:true,y:false}}
							checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						/>
					</div>);

					// <ul
	    		// 	className='scroll'
	    		// 	style={{margin: '15px 5px 5px 15px',maxHeight: '250px',overflowY: 'auto'}}
	    		// >
		    	// 	 {
		    	// 	 	data.map((value,i)=>{
		    	// 	 		return <li style={{color:'#333',lineHeight:'30px'}} key={i}>
		    	// 	 				  <span style={{paddingRight:'10px',width:'270px',display:'inline-block'}}>{value.payTermName}</span>
		    	// 	 				  <span style={{paddingRight:'10px',width:'70px',display:'inline-block'}}>{value.brandName?value.brandName:''}</span>
		    	// 	 				  <span style={{paddingRight:'10px',width:'177px',display:'inline-block'}}>{'FOB-'+value.sStatnName +':'+value.fobPrc.toFixed(2)}</span>
		    	// 	 				  <span style={{paddingRight:'10px',width:'177px',display:'inline-block'}}>{ 'CIF-'+value.eStatnName +':'+(value.cifPrc?value.cifPrc.toFixed(2):'')}</span>
		    	// 	 				  <span style={{paddingRight:'10px'}}>{new Date(value.eDate).Format('yyyy-MM-dd')}</span>
		    	// 	 		  </li>
		    	// 	 	})
		    	// 	 }
		    	// </ul>
		    	 this.setState({
			      visible:visible,
			      currentIndex:index,
			      content:content
			    });
    		}
    	},(error)=>{
    		ServiceTips({text:error.message,type:'error'});
    	})

	}
    onSaveAndClose(value){
    	var that = this;
    	let {type} = this.state;
    	let array=this.refs.product.getSelectArr();
    	let sourceId = array[0]?array[0].id:null;
    	if(array.length == 0 && that.state.DialogContent != 1){
    		ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
    		return false;
    	}
    	if(type == 1){
    			//添加竞争对手
    		value=Object.assign({},value,{sourceId:sourceId});
    		apiPost(API_FOODING_DS,'/bizCompetitor/save',value,(response)=>{
	    		  that.setState({
					rodalShow:false
				    });
    				ServiceTips({text:response.message,type:'sucess'});
					that.getPage();
	    	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
	    	})
    	}else if(type == 2){
    		//更新价格
    	}else if (type == 3) {
    		//自动报价
    	}else if(type == 4){
    		//包装要求
    		value=Object.assign({},value,{cstmMtlId:sourceId});
    		apiPost(API_FOODING_DS,'/tradrulePack/save',value,(response)=>{
	    		  that.setState({
					rodalShow:false
				    });
    				ServiceTips({text:response.message,type:'sucess'});
					that.getPage();
	    	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
	    	})

    	}else if(type == 5){
    		//证书
    		value=Object.assign({},value,{sourceId:sourceId});
    		apiPost(API_FOODING_DS,'/tradruleCertfct/save',value,(response)=>{
	    		  that.setState({
					rodalShow:false
				    });
    				ServiceTips({text:response.message,type:'sucess'});
					that.getPage();
	    	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
	    	})
    	}else if(type == 6){
    		//监装机构
    	}else if(type == 7){
    		//唛头
    	}else if(type == 8){
    		//运输要求
    	}else if(type == 9){
    		//托盘要求
    	}else if (type == 10) {
    		//检验报告
    	}
    	else if(that.state.DialogContent == 1){
    		value = Object.assign({},{id:this.state.getOne.id,optlock:this.state.getOne.optlock},value);
    		apiPost(API_FOODING_DS,'/beMtl/save',value,(response)=>{
	    		  that.setState({
					rodalShow:false
				    });
    				ServiceTips({text:response.message,type:'sucess'});
					that.getPage();
	    	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
	    	})
    	}
	}
	onCancel(){
		this.setState({
			rodalShow:false
		});
	}
    deleteClick(e){
    	var that = this;
    	 let array=this.refs.product.getSelectArr();
    	 if(array.length == 0){
    	 		ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
	    	 }else{
	    	 	Confirm('删除后将无法恢复，您确定删除'+array.length+'条数据吗？', {
						done: () => {
							let id=[];
							array.map((e)=>{id.push(e.id)});
						    apiForm(API_FOODING_DS,'/beMtl/delete',{id:id},(response)=>{
						    		ServiceTips({text:response.message,type:'sucess'});
						    		that.getPage();
						    },(error)=>{
						    	ServiceTips({text:error.message,type:'error'});
						    })
						}
				});
	    	 }
    }
    updatePriceClick(e){
  //   	this.setState({
		// 	rodalShow:true,
		// 	showHeader:false,
		// 	buttonLeft:'确定',
		// 	DialogContent:4
		// });
    }
    priceClick(e){
  //   	this.setState({
		// 	rodalShow:true,
		// 	showHeader:false,
		// 	buttonLeft:'确定',
		// 	DialogContent:3
		// });
    }
    competeClick_1(){
    	//上排竞争对手按钮用
    	let title_1 = i18n.t(200920/*添加竞争对手*/);
    	this.setState({
    		paddingTop:0,
			rodalShow : true,
			showHeader:true,
			DialogContent:5,
			title:title_1,
			contentDate:{
				dataArray:[{title:i18n.t(100449/*竞争对手*/),isMus:true,radio:{type:i18n.t(300009/*手机*/),checked:true},select:""}],
			  addobj : {title:i18n.t(100449/*竞争对手*/),isMus:true,radio:{type:i18n.t(300009/*手机*/),checked:false},select:""}
			}
		})
    }
    competeClick(title){
    	let title_1 = i18n.t(200920/*添加竞争对手*/);
    	this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:2,
			title:title_1,
		})
    }

  	getPage(sID,objValue){
		let that = this;
		var sID = sID || '';
		if(objValue){
			this.setState({
				obj:objValue
			},function() {
			// body...
				let object=Object.assign({},{isPlatform:true,type:10, pageSize: this.state.pageSize, currentPage: this.state.currentPage, mtltyId: sID },this.state.obj,{sourceId:this.state.sourceId});
				apiGet(API_FOODING_DS,'/beMtl/getPage',object,
					(response)=>{
						that.setState({
							data: response.data.data,
							totalPages: response.data.totalPages,
							currentPage: response.data.currentPage,
							totalRecords:response.data.totalRecords
						});
					},(errors)=>{
				});
			})
		}else {
			let object=Object.assign({},{isPlatform:true,type:10, pageSize: this.state.pageSize, currentPage: this.state.currentPage, mtltyId: sID },this.state.obj,{sourceId:this.state.sourceId});
			apiGet(API_FOODING_DS,'/beMtl/getPage',object,
				(response)=>{
					that.setState({
						data: response.data.data,
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage,
						totalRecords:response.data.totalRecords
					});
				},(errors)=>{
			});
		}

	}
	onRowDoubleClick(record, index, checked) {
        let {navAddTab} = this.props;
        navAddTab({id: 'client-product-detail', name: i18n.t(200862/*客户产品*/), component: i18n.t(200862/*客户产品*/), url: '/client/productdetail'});
        this.props.router.push({pathname:'/client/productdetail',query:{id:record.id}});
    }
  	handleClick(e,data,target){
  		//右键处理
  		var that = this;
  		that.setState({
  			type:data.type
  		});
  		if(data.type == 11){
  			//编辑
  	       apiGet(API_FOODING_DS,'/beMtl/getOne',{id:data.record.id},(response)=>{
  	       		this.setState({
  	       			rodalShow : true,
					showHeader:true,
					DialogContent:1,
					title:i18n.t(200471/*编辑关注产品*/),
					getOne:response.data
  	       		});
  	       },(error)=>{

  	       });
  		}
  		else if(data.type == 12){
  			this.deleteClick();
  		}
  	}
  	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = this.state.paddingTop ? 173:262;
  		let sch=document.body.offsetHeight-height-padding;
		let scroll = 326
		this.setState({scrollHeight:sch+'px',scroll:scroll});

	}
	componentDidMount(){
        this.handleResize();
        // this.getPage();
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
	render(){
		// 客户 - 关注产品
		let that = this;
		let  iconArray = [{type:'add',onClick:this.addClick,permissions:'clien.dtl.add'},
		{type:'delete',onClick:this.deleteClick,permissions:'clien.dtl.del'},
		{type:'updatePrice',onClick:this.updatePrice}
				]
		return (
			<div className="contact-fluid">
				<div className='content-margin'></div>
				<div className="product-body">
					<div className="product-dialog" style = {{height:this.state.scrollHeight}}>
						<ButtonKey iconArray ={iconArray}/>
						<Page
							currentPage={this.state.currentPage}
							totalRecords={this.state.totalRecords}
							totalPages={this.state.totalPages}
							sizeList={[20,50,100]}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
                                that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
                            }}
							backClick={(num)=>{
                                that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                            }}
							nextClick={(num)=>{
                                that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                            }}
							goChange={(num)=>{
                                that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                            }}
						/>
						<div className="">
							<Table
							    ref ="product"
								columns={[{
											title : i18n.t(100000/*代码*/),
											dataIndex : 'code',
											key : "code",
											width : '10%',
											render(data,row,index){
												return (<div className="text-ellipsis" title={data}>{data}</div>)
											}
										},{
											title : i18n.t(100379/*产品*/),
											dataIndex : "localName",
											key : "localName",
											width : "10%",
											render(data,row,index){
												return <div>{data}</div>;
											}
										},{
											title : i18n.t(100226/*英文名称*/),
											dataIndex : "enName",
											key : "enName",
											width : "15%",
											render(data,row,index){
												return data;
											}
										},{
											title : i18n.t(100382/*产品规格*/),
											dataIndex : "specTxt",
											key : "specTxt",
											width : "20%",
											render(data,row,index){
												return (
														<div className="text-ellipsis">{data}</div>
												)
											}

										},{
											title : i18n.t(200244/*利润率*/),
											dataIndex : 'profit',
											key : "profit",
											width : "5%",
											render(data,row ,index){
												return data;
											}

										},{
											title : i18n.t(200921/*最新价格*/),
											dataIndex : "newPrice",
											className:'text-center',
											key : "newPrice",
											width : "10%",
											ignore_equals: true,
											render(data,row,index){
												return (<Tooltip
													placement="bottom"
													visible={that.state.visible && index.index == that.state.currentIndex}
													animation="zoom"
													onVisibleChange={that.onVisibleChange.bind(this,index.index,row)}
													trigger="click"
													overlay={that.state.content}
													arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
												>
													<div className="text-ellipsis"><i className='foddingicon fooding-newest-price'></i></div>
												</Tooltip>);
											}
										}]}
								data={this.state.data}
								scroll={{x:true,y:this.state.scroll}}
								checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
								style={{width:'100%'}}
								onRowDoubleClick ={this.onRowDoubleClick}
								contextMenuConfig={{
										enable:true,
										contextMenuId:'SIMPLE_TABLE_MENU',
										menuItems:[{
											permissions:'clien.edit',
											onClick:this.handleClick,
											content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
											data:{type:11,title:i18n.t(100439/*编辑*/)}
										},{
											permissions:'clien.dtl.del',
											onClick:this.handleClick,
											content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{i18n.t(100437/*删除*/)}</div>,
											data:{type:12,title:i18n.t(100437/*删除*/)}
										},{
											onClick:this.updatePrice,
											content:<div><i className={'foddingicon fooding-page'}></i>{i18n.t(100450/*更新价格*/)}</div>,
											data:{type:13,title:i18n.t(100450/*更新价格*/)}
										}]
								}}

							/>
							<Dialog visible={this.state.rodalShow} showHeader ={this.state.showHeader}  titleLeft={this.state.title} width={926}>
								<ProductNav DialogContent={this.state.DialogContent}
								 buttonLeft = {this.state.buttonLeft}
								  onSaveAndClose ={this.onSaveAndClose}
								  contentDate = {this.state.contentDate}
								  sourceId={this.state.sourceId}
								  getOne ={this.state.getOne}
								  onCancel = {this.onCancel}/>
							</Dialog>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export  default NavConnect(Product);
