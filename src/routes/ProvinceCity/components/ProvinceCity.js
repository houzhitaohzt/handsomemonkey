import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import Tree from "../../../components/Tree/index";
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import Dialog from '../../../components/Dialog/Dialog';
import RightFuncKeys from "../../ProductCategory/components/RightFuncKeys";
import ProvinceCityView from "../../ProductCategory/components/ProductCategoryView";
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
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
class ProvinceCity extends Component{
	constructor(props){
		super(props);
		this.handleResize=this.handleResize.bind(this);
		this.onRightClick=this.onRightClick.bind(this);
		this.onSelect=this.onSelect.bind(this);
		this.onBlur=this.onBlur.bind(this);
		this.handClick=this.handClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.handleMenuClick=this.handleMenuClick.bind(this);
		this.state={
			gData :  [],
			scroll:0,
			scrollHeight:0,
			rightFuncShow:false,//控制右键是否出来
			x:0,
			y:0,
			showDilaog:false,//控制弹出层是否出来
			content:'',
			dialogContent:'<div></div>',
			visible:false,
			tempArray:[],
			tableDate:[],
			moduleIdArray:[],
			menuId:null,
			normalList:[],
			responseData:{}	,
			isShowMenu:true	,
			treeInfo:{},
			iconArray: [{permissions:'area.add', action:i18n.t(200558/*新增节点*/),classn:'foddingicon fooding-add-icon3',title:i18n.t(200558/*新增节点*/)},
	    	{permissions:'area.del', action:i18n.t(200559/*删除节点*/),classn:'foddingicon fooding-delete-icon3',title:i18n.t(200559/*删除节点*/)}]
		}
		this.getTree = this.getTree.bind(this);
		this.onLoadData = this.onLoadData.bind(this);
		this.upload = this.upload.bind(this);
	}
	upload(){
		let that = this;
		that.onLoadData(this.state.treeInfo,this.state.treeInfo.props.parent.id);
	}
	getTree(){
		let that = this;
		apiGet(API_FOODING_DS,'/area/getTree',{},(response)=>{
			that.setState({
				gData:response.data
			});
		},(error)=>{

		})
	}
	onSaveAndClose(value){
		var that = this;
		let parentId = value.id?this.state.treeInfo.props.parent.id:this.state.menuId;
		value = Object.assign({},value,{parentId:parentId,cntryId:this.state.menuId});
		apiPost(API_FOODING_DS,'/area/save',value,(response)=>{
				this.setState({
					showDilaog:!this.state.showDilaog,
					visible:false
				})
				that.onLoadData(this.state.treeInfo,parentId);
				 ServiceTips({text:response.message,type:'success'});
		},(error)=>{
				this.setState({
					showDilaog:!this.state.showDilaog
				})
				 ServiceTips({text:error.message,type:'error'});
		})
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
	handClick(type,e){
		if(type == i18n.t(200558/*新增节点*/)){
			let content=require('./ProvinceCityAddandEditDialog').default;
			let element=React.createElement(content,
				{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,onSaveAdd:this.onSaveAdd,moduleIdArray:this.state.moduleIdArray})
	    	this.setState({
	    		showDilaog : true,
	    		title: i18n.t(100392/*新增*/),
	    		dialogContent: element
	    	})
		}else if(type == i18n.t(200559/*删除节点*/)){
			let that= this;
			Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			  	done: () => {
			  		apiForm(API_FOODING_DS,'/area/delete',{id:this.state.treeInfo.props.eventKey},(response)=>{
			  			 that.onLoadData(this.state.treeInfo,this.state.treeInfo.props.parent.id);
			  			 ServiceTips({text:response.message,type:'success'});
			  		},(error)=>{
						 ServiceTips({text:error.message,type:'error'});
			  		});
				},
				close:() => {
					console.log('no, close')
				}
			});
		}
	}
	onRightClick(info){//节点右键事件
		let rightFunc = true;
		let xP,yP;
		xP = info.event.clientX;
		yP = info.event.clientY;
		if(info.node.props.treeIndex == 1){
            this.setState({
            	iconArray: [{permissions:'area.add', action:i18n.t(200558/*新增节点*/),classn:'foddingicon fooding-add-icon3',title:i18n.t(200558/*新增节点*/)}]
            });
		}else {
			this.setState({
				iconArray: [{permissions:'area.add', action:i18n.t(200558/*新增节点*/),classn:'foddingicon fooding-add-icon3',title:i18n.t(200558/*新增节点*/)},
	    	{permissions:'area.del', action:i18n.t(200559/*删除节点*/),classn:'foddingicon fooding-delete-icon3',title:i18n.t(200559/*删除节点*/)}]
			});
		}
		this.setState({
			rightFuncShow:rightFunc,
			x:xP,
			y:yP,
			treeInfo:info.node,
			menuId:info.node.props.eventKey
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
		//因为可以在选中时有值，而没选中时没有，所以不能用来判断length长度
		this.setState({
			visible:true,
			menuId:key[0],
			treeInfo:obj.node,
		});
		let data=obj.node.props.label;
		let array=[
	                    	{key:i18n.t(100000/*代码*/),value:data.code?data.code:''},
	                    	{key:i18n.t(100001/*名称*/),value:data.localName?data.localName:''},
	                    	{key:i18n.t(100002/*描述*/),value:data.description?data.description:''},
	       ]
	       if(obj.node.props.treeIndex == 1){
				this.setState({
					        	normalList:array,
					        	responseData:data,
					        	isShowMenu:false
					       });
	       }else {
	       			this.setState({
					        	normalList:array,
					        	responseData:data,
					        	isShowMenu:true
					       });
	       }

	}
	onLoadData(treeNode,pId){
		let parentId = pId||treeNode.props.eventKey;
		let treeIndex = pId?treeNode.props.treeIndex-2:treeNode.props.treeIndex-1;
		return new Promise((resolve) => {
		  apiGet(API_FOODING_DS,'/area/getTree',{id:parentId,lv:treeIndex},(response)=>{
		  		const gData = [...this.state.gData];
			    getNewTreeData(gData, parentId,response.data, 10);
				this.setState({gData});
				resolve();
		  },(error)=>{

		  })
	    });
	}
	handleMenuClick = (e, data, dialogContent) => {
		var that = this;
        if(data.number ==2){
        	 Confirm('是否删除该界面操作？', {
				  done: () => {
				}
		   	});
        }else{
        	let dialogTitle;
        	if(!data.action){
        		dialogTitle = i18n.t(100439/*编辑*/);
        	}else{
        		dialogTitle= data.action+data.name.title;
        // 		apiPost(API_FOODING_DS,'/object/getList',{obj:'com.fooding.fc.enumeration.Module'},
				// 	(response)=>{
				// 		that.setState({
				// 			moduleIdArray:response
				// 		})
				// 	},(errors)=>{
        //
				// });
        	}
        	 this.setState({
        	 	showDilaog:true,
                title:dialogTitle,
                dialogContent:dialogContent
        	});
        }
    }
	handleResize(height){
		let sch=document.body.offsetHeight-100-height;
        let scroll = sch-20;
		this.setState({scrollHeight:sch+'px',scroll:scroll+'px'});
	}
	componentDidMount(){
		this.getTree();
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}
	render(){
		const {rightFuncShow} = this.state;

	    let iconArray =this.state.iconArray;
	    let rightDom;
	    if(rightFuncShow){
	    	rightDom = (<RightFuncKeys iconArray= {iconArray.filter(o=>o['permissions'] ? permissionsBtn(o['permissions']) : 1 )} x={this.state.x} y={this.state.y} onBlur={this.onBlur} handClick={this.handClick} />);
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
				<div className={this.state.visible?'menuset-content-all-show scroll':'none'} style={{height:this.state.scroll}}>
					<ProvinceCityView
						permissions='area.edit'
	                    DialogTempalte={require('./ProvinceCityAddandEditDialog').default}
	               		isShowMenu={this.state.isShowMenu}
	               		upload ={this.upload}
	               		otherData={this.state.responseData}
	               		openDialog={this.handleMenuClick}
	               		onSaveAndClose={this.onSaveAndClose}
	               		onSaveAdd={this.onSaveAdd}
	               		onCancel = {this.onCancel}
	                    id={'productcategory-view-00'} title={i18n.t(200560/*查看*/)} tempArray={this.state.normalList}
                    />                    
				</div>
			</div>
			<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
				{this.state.dialogContent}
			</Dialog>
		</div>)
	}
}
export default ProvinceCity;
