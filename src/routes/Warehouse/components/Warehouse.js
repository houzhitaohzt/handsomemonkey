import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import Tree from "../../../components/Tree/index";
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import Dialog from '../../../components/Dialog/Dialog';
import RightFuncKeys from "../../ProductCategory/components/RightFuncKeys";
import WarehouseOne from "./WarehouseOne";
import WarehouseTwo from "./WarehouseTwo";
import WarehouseThree from "./WarehouseThree";
import {permissionsBtn, apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
function setLeaf(treeData, curKey, level) {
  const loopLeaf = (data, lev) => {
    const l = lev - 1;
    data.forEach((item) => {
      if ((item.id.length > curKey.length) ? item.id.indexOf(curKey) !== 0 :
        curKey.indexOf(item.id) !== 0) {
        return;
      }
      if (item.children) {
        loopLeaf(item.children, l);
      } else if (l < 1) {
        item.isLeaf = true;
      }
    });
  };
  loopLeaf(treeData, level + 1);
}
function getNewTreeData(treeData, curKey, child, level) {
  const loop = (data) => {
    // if (level < 1 || curKey.length - 3 > level * 2) return;
    data.forEach((item) => {
      if (curKey.indexOf(item.id) === 0) {
          item.children = child;
      }else if(item.children){
        loop(item.children);
      }
    });
  };
  loop(treeData);
  setLeaf(treeData, curKey, level);
}
class Warehouse extends Component{
	constructor(props){
		super(props);
		this.handleResize=this.handleResize.bind(this);
		this.onRightClick=this.onRightClick.bind(this);
		this.onSelect=this.onSelect.bind(this);
		this.onBlur=this.onBlur.bind(this);
		this.handClick=this.handClick.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.handleMenuClick=this.handleMenuClick.bind(this);
		this.bianjicanku = this.bianjicanku.bind(this);
		this.bianjikuchu = this.bianjikuchu.bind(this);
		this.bianjichuwei = this.bianjichuwei.bind(this);
		this.state={
			gData : [],
			scroll:0,
			scrollHeight:0,
			rightFuncShow:false,//控制右键是否出来
			x:0,
			y:0,
			len:-1,
			showDilaog:false,//控制弹出层是否出来
			content:'',
			dialogContent:'<div></div>',
			showOne:false,
			showTwo:false,
			showThree:false,
			tempArray:[],
			tableDate:[],
			moduleIdArray:[],
			menuId:null,
			treeInfo:{},
			iconArray: [{permissions:'storLocatn.add',type:'add',action:i18n.t(200558/*新增节点*/),classn:'foddingicon fooding-add-icon3',title:i18n.t(200558/*新增节点*/)},
	    	{permissions:'storLocatn.del',type:'delete',action:i18n.t(200559/*删除节点*/),classn:'foddingicon fooding-delete-icon3',title:i18n.t(200559/*删除节点*/)}],




		}
		this.getTree = this.getTree.bind(this);
		this.onLoadData = this.onLoadData.bind(this);
		this.onSaveAndCloseCanku = this.onSaveAndCloseCanku.bind(this);
		this.onSaveAndCloseKuqu = this.onSaveAndCloseKuqu.bind(this);
		this.onSaveAndCloseChuwei = this.onSaveAndCloseChuwei.bind(this);




	}
	onLoadData(treeNode,Pid){
			let parentId = Pid || treeNode.props.eventKey;
			let treeIndex = Pid?treeNode.props.treeIndex-2:treeNode.props.treeIndex-1;
			return new Promise((resolve) => {
					  apiGet(API_FOODING_DS,'/storLocatn/getStorLocatnTree',{id:parentId,lv:treeIndex},(response)=>{
					  		const gData = [...this.state.gData];
					        getNewTreeData(gData, parentId,response.data, 10);
					        this.setState({gData});
					        resolve();
					  },(error)=>{

					  })
			});
	}
	getTree(){
		let that = this;
		apiGet(API_FOODING_DS,'/storLocatn/getStorLocatnTree',{},(response)=>{
			that.setState({
				gData:response.data
			})
		},(error)=>{

		});
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	onSaveAdd(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	onSaveAndCloseCanku(){
		//
		let that = this;
	    this.onLoadData(this.state.treeInfo);
		this.setState({
			showDilaog:false
		});
	}
	bianjicanku(){
		//
		let that = this;
	    this.onLoadData(this.state.treeInfo,this.state.treeInfo.props.parent.id);
		this.setState({
			showDilaog:false
		});
		apiGet(API_FOODING_DS,'/storLocatn/getOne',{id:this.state.treeInfo.props.eventKey},(response)=>{
				let value = response.data||{};
				that.setState({
					tempArray:[{key:i18n.t(100000/*代码*/),value:value.code},
					{key:i18n.t(100001/*名称*/),value:value.localName},
					{key:i18n.t(100243/*集团*/),value:value.cluster?value.cluster.localName:''},
					{key:i18n.t(100244/*企业*/),value:value.company?value.company.localName:''},
					{key:i18n.t(500144/*营运组织*/),value:value.plant?value.plant.localName:''},
					{key:i18n.t(201249/*仓储类型*/),value:value.stroType?value.stroType.name:''},
					{key:i18n.t(100002/*描述*/),value:value.description?value.description:''},
					{key:i18n.t(100481/*地址*/),value:value.address ? value.address:''}]
				})
			},(error)=>{

		})
	}
	bianjikuchu(){
		let that = this;
	    this.onLoadData(this.state.treeInfo,this.state.treeInfo.props.parent.id);
		this.setState({
			showDilaog:false
		});
		apiGet(API_FOODING_DS,'/storArea/getOne',{id:this.state.treeInfo.props.eventKey},(response)=>{
				let value = response.data||{};
				that.setState({
					tempArray:[{key:i18n.t(100000/*代码*/),value:value.code},
					{key:i18n.t(100001/*名称*/),value:value.localName},
					{key:i18n.t(100243/*集团*/),value:value.cluster?value.cluster.localName:''},
					{key:i18n.t(100244/*企业*/),value:value.company?value.company.localName:''},
					{key:i18n.t(500144/*营运组织*/),value:value.plant?value.plant.localName:''},
					{key:i18n.t(201249/*仓储类型*/),value:value.stroType?value.stroType.name:''},
					{key:i18n.t(100002/*描述*/),value:value.description?value.description:''}]
				})
				this.onLoadData(this.state.treeInfo);
			},(error)=>{

		})
	}
	bianjichuwei(){
		let that = this;
		this.setState({
			showDilaog:false
		});
		apiGet(API_FOODING_DS,'/slBin/getOne',{id:this.state.treeInfo.props.eventKey},(response)=>{
				let value = response.data||{};
				that.setState({
					tempArray:[{key:i18n.t(100000/*代码*/),value:value.code},
					{key:i18n.t(100001/*名称*/),value:value.localName},
					{key:i18n.t(201250/*货架类型*/),value:value.shelfType?value.shelfType.localName:''},
					{key:i18n.t(201251/*排*/),value:value.lrow?value.lrow:''},
					{key:i18n.t(201252/*列*/),value:value.lbay?value.lbay:''},
					{key:i18n.t(201253/*层*/),value:value.llayr?value.llayr:''}]
				})
				this.onLoadData(this.state.treeInfo,this.state.treeInfo.props.parent.id);
			},(error)=>{

		})
	}

	onSaveAndCloseKuqu(){
		let that = this;
	    this.onLoadData(this.state.treeInfo);
		this.setState({
			showDilaog:false
		});
	}

	onSaveAndCloseChuwei(){
		let that = this;
	    this.onLoadData(this.state.treeInfo);
		this.setState({
			showDilaog:false
		});
	}
	handClick(type,len,e){
		let content;
		let element;
		if(this.state.len == 1){
			//右键树结构仓库新增
			content=require('./WarehouseAddandEditDialog').default
			element=React.createElement(content,
				{onSaveAndClose:this.onSaveAndCloseCanku,
				onCancel:this.onCancel,onSaveAdd:this.onSaveAdd})
		}else if(this.state.len == 2){
			content=require('./WarehouseAddandEditTwoDialog').default
			element=React.createElement(content,
				{onSaveAndClose:this.onSaveAndCloseKuqu,onCancel:this.onCancel,onSaveAdd:this.onSaveAdd,treeInfo:this.state.treeInfo})
		}else if(this.state.len == 3){
			content=require('./WarehouseAddandEditThreeDialog').default
			element=React.createElement(content,
				{onSaveAndClose:this.onSaveAndCloseChuwei,onCancel:this.onCancel,onSaveAdd:this.onSaveAdd,treeInfo:this.state.treeInfo})
		}
		if(type == i18n.t(200558/*新增节点*/)){
	    	this.setState({
	    		showDilaog : true,
	    		title: i18n.t(100392/*新增*/),
	    		dialogContent: element
	    	})
		}else if(type == i18n.t(200559/*删除节点*/)){
			Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			  	done: () => {
				     if(this.state.treeInfo.props.treeIndex == 2){
				   		apiForm(API_FOODING_DS,'/storLocatn/delete',{id:this.state.treeInfo.props.eventKey},(response)=>{
				   			this.onLoadData(this.state.treeInfo,this.state.treeInfo.props.parent.id);
				   			ServiceTips({text:response.message,type:'sucess'});
                this.setState({
                  showOne:false,
        				  showTwo:false,
        				  showThree:false
                });
				   		},(error)=>{
				   			ServiceTips({text:error.message,type:'error'});
				   		})
				   	 }else if(this.state.treeInfo.props.treeIndex == 3){
				   	 	apiForm(API_FOODING_DS,'/storArea/delete',{id:this.state.treeInfo.props.eventKey},(response)=>{
				   			this.onLoadData(this.state.treeInfo,this.state.treeInfo.props.parent.id);
				   			ServiceTips({text:response.message,type:'sucess'});
                this.setState({
                  showOne:false,
        				  showTwo:false,
        				  showThree:false
                });
				   		},(error)=>{
				   			ServiceTips({text:error.message,type:'error'});
				   		})
				   	 }else if(this.state.treeInfo.props.treeIndex == 4){
				   	 	apiForm(API_FOODING_DS,'/slBin/delete',{id:this.state.treeInfo.props.eventKey},(response)=>{
				   			this.onLoadData(this.state.treeInfo,this.state.treeInfo.props.parent.id);
				   			ServiceTips({text:response.message,type:'sucess'});
                this.setState({
                  showOne:false,
        				  showTwo:false,
        				  showThree:false
                });
				   		},(error)=>{
				   			ServiceTips({text:error.message,type:'error'});
				   		})
				   	 }
				}
			});
		}
	}
	onRightClick(info){//节点右键事件
		let len = info.node.props.label.length;
		let rightFunc = true;
		let xP,yP;
		xP = info.event.clientX;
		yP = info.event.clientY;
		if(info.node.props.treeIndex == 1){
			this.setState({
				iconArray: [{permissions:'storLocatn.add',type:'add',action:i18n.t(200558/*新增节点*/),classn:'foddingicon fooding-add-icon3',title:i18n.t(200558/*新增节点*/)}]
			});
		}else if(info.node.props.treeIndex == 4){
			this.setState({
				iconArray: [{permissions:'storLocatn.del',type:'delete',action:i18n.t(200559/*删除节点*/),classn:'foddingicon fooding-delete-icon3',title:i18n.t(200559/*删除节点*/)}]
			});
		}else {
			this.setState({
				iconArray: [{permissions:'storLocatn.add',type:'add',action:i18n.t(200558/*新增节点*/),classn:'foddingicon fooding-add-icon3',title:i18n.t(200558/*新增节点*/)},
	    	{permissions:'storLocatn.del',type:'delete',action:i18n.t(200559/*删除节点*/),classn:'foddingicon fooding-delete-icon3',title:i18n.t(200559/*删除节点*/)}]
			});
		}
		this.setState({
			rightFuncShow:rightFunc,
			x:xP,
			y:yP,
			len:info.node.props.treeIndex,
			treeInfo:info.node
		},()=>{
			document.getElementById('rightfunckeyproductcategory').focus();
		})
	}
	onBlur(){//节点右键失焦事件
		let rightFunc = false;
		this.setState({
			rightFuncShow:rightFunc,
		})
	}
	onSelect(key,obj){
		//仓库的树节点总共就只有三层，最上面的仓库点击是没有用的，只有下面三层的每一级的点击会出现不同的模版,因此就只能根据key，obj来判断显示哪一个模版
		let temp = obj.node.props.treeIndex;
		let {showOne,showTwo,showThree} = this.state;
		let that = this;
		if(temp == 1){
			// this.setState({
			// 	showOne:true,
			// 	showTwo:false,
			// 	showThree:false
			// });
		}else if(temp == 2){
			that.setState({
				tempArray:[]
			});
			apiGet(API_FOODING_DS,'/storLocatn/getOne',{id:key[0]},(response)=>{
				let value = response.data||{};
				that.setState({
					tempArray:[{key:i18n.t(100000/*代码*/),value:value.code},
					{key:i18n.t(100001/*名称*/),value:value.localName},
					{key:i18n.t(100243/*集团*/),value:value.cluster?value.cluster.localName:''},
					{key:i18n.t(100244/*企业*/),value:value.company?value.company.localName:''},
					{key:i18n.t(500144/*营运组织*/),value:value.plant?value.plant.localName:''},
					{key:i18n.t(201249/*仓储类型*/),value:value.stroType?value.stroType.name:''},
					{key:i18n.t(100002/*描述*/),value:value.description?value.description:''},
					{key:i18n.t(100481/*地址*/),value:value.address ? value.address:''}]
				})
			},(error)=>{

			})
			this.setState({
				showOne:true,
				showTwo:false,
				showThree:false,
				treeInfo:obj.node
			});
		}else if(temp == 3){
			that.setState({
				tempArray:[]
			});
			apiGet(API_FOODING_DS,'/storArea/getOne',{id:key[0]},(response)=>{
				let value = response.data||{};
				that.setState({
					tempArray:[{key:i18n.t(100000/*代码*/),value:value.code},
					{key:i18n.t(100001/*名称*/),value:value.localName},
					{key:i18n.t(100243/*集团*/),value:value.cluster?value.cluster.localName:''},
					{key:i18n.t(100244/*企业*/),value:value.company?value.company.localName:''},
					{key:i18n.t(500144/*营运组织*/),value:value.plant?value.plant.localName:''},
					{key:i18n.t(100002/*描述*/),value:value.description?value.description:''}]
				})
			},(error)=>{

			})
			this.setState({
				showOne:false,
				showTwo:true,
				showThree:false,
				treeInfo:obj.node
			});
		}else if(temp== 4){
			this.setState({
				showOne:false,
				showTwo:false,
				showThree:true,
				treeInfo:obj.node
			})
			apiGet(API_FOODING_DS,'/slBin/getOne',{id:key[0]},(response)=>{
				let value = response.data||{};
				that.setState({
					tempArray:[{key:i18n.t(100000/*代码*/),value:value.code},
					{key:i18n.t(100001/*名称*/),value:value.localName},
					{key:i18n.t(201250/*货架类型*/),value:value.shelfType?value.shelfType.localName:''},
					{key:i18n.t(201251/*排*/),value:value.lrow?value.lrow:''},
					{key:i18n.t(201252/*列*/),value:value.lbay?value.lbay:''},
					{key:i18n.t(201253/*层*/),value:value.llayr?value.llayr:''}]
				})
			},(error)=>{

			})
		}

	}
	handleMenuClick = (e, data, dialogContent) => {
		var that = this;
        if(data.number ==2){
        	 Confirm('是否删除该界面操作？', {
				  done: () => {
				   if(this.state.treeInfo.props.treeIndex == 2){
				   		apiForm(API_FOODING_DS,'/storLocatn/delete',{id:this.state.treeInfo.props.eventKey},(response)=>{
				   			this.onLoadData(this.state.treeInfo);
				   			ServiceTips({text:response.message,type:'sucess'});
				   		},(error)=>{
				   			ServiceTips({text:error.message,type:'error'});
				   		})
				   }
				}
		   	});
        }else{
        	let dialogTitle;
        	if(!data.action){
        		dialogTitle = i18n.t(100439/*编辑*/);
        	}else{
        		dialogTitle= data.action+data.name.title;
        		apiPost(API_FOODING_DS,'/object/getList',{obj:'com.fooding.fc.enumeration.Module'},
					(response)=>{
						that.setState({
							moduleIdArray:response
						})
					},(errors)=>{

				});
        	}
        	 this.setState({
        	 	showDilaog:true,
                title:dialogTitle,
                dialogContent:dialogContent
        	});
        }
    }
	handleResize(height){
		let sch=document.body.offsetHeight-100;
        let scroll = sch-20;
		this.setState({scrollHeight:sch+'px',scroll:scroll+'px'});
	}
	componentDidMount(){
		let that = this;
		this.handleResize();
		that.getTree();
		window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}
	render(){

		const {permissionsList,iconArray,rightFuncShow} = this.state;
		let common;
		if(this.state.showOne){
					//仓库新增
			common=(<div className={'menuset-content-all-show scroll'} style={{height:this.state.scroll}}>
									<WarehouseOne
					                    DialogTempalte={require('./WarehouseAddandEditDialog').default}
					               		isShowMenu={true}
					               		openDialog={this.handleMenuClick}
					               		onSaveAndClose={this.bianjicanku}
					               		onCancel = {this.onCancel}
					                    id={'Warehouse-view'}
					                    title={i18n.t(100097/*详情*/)}
					                    treeInfo = {this.state.treeInfo}
					                    tempArray={this.state.tempArray}
				                    />
						</div>);
	}else if(this.state.showTwo){
							common=(<div className={'menuset-content-all-show scroll'} style={{height:this.state.scroll}}>
								<WarehouseTwo
				                    DialogTempalte={require('./WarehouseAddandEditTwoDialog').default}
				               		isShowMenu={true}
				               		openDialog={this.handleMenuClick}
				               		onSaveAndClose={this.bianjikuchu}
				               		onSaveAdd={this.onSaveAdd}
				               		onCancel = {this.onCancel}
				               		treeInfo = {this.state.treeInfo}
				                    id={'Warehouse-view-01'} title={i18n.t(100097/*详情*/)} tempArray={this.state.tempArray}
			                    />
							</div>)
						}else {
							common= (<div className={this.state.showThree?'menuset-content-all-show scroll':'none'} style={{height:this.state.scroll}}>
								<WarehouseThree
				                    DialogTempalte={require('./WarehouseAddandEditThreeDialog').default}
				               		isShowMenu={true}
				               		openDialog={this.handleMenuClick}
				               		onSaveAndClose={this.bianjichuwei}
				               		onSaveAdd={this.onSaveAdd}
				               		onCancel = {this.onCancel}
				               		treeInfo = {this.state.treeInfo}
				                    id={'Warehouse-view-02'} title={i18n.t(100097/*详情*/)} tempArray={this.state.tempArray}
			                    />
							</div>)
						}

	    let rightDom;
	    if(rightFuncShow){
	    	rightDom = (<RightFuncKeys iconArray={iconArray.filter(o=>o['permissions'] ? permissionsBtn(o['permissions']) : 1 )} x={this.state.x} y={this.state.y} onBlur={this.onBlur} handClick={this.handClick} len={this.state.len}/>);
	    }else{
	    	rightDom=(<span></span>);
	    }
		return(<div className={'menuset-content'}>
			<div className={'menuset-content-all'} style={{height:this.state.scrollHeight}}>
				<div className={'menuset-content-all-tree scroll'} style={{height:this.state.scroll}}>
					<Tree
						onRightClick={this.onRightClick}
						onSelect={this.onSelect}
          				gData={this.state.gData}
          				onLoadData={this.onLoadData}
          			>
					</Tree>
					{rightDom}
				</div>
				{common}
			</div>
			<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
				{this.state.dialogContent}
			</Dialog>
		</div>)
	}
}
export default Warehouse;
