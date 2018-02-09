import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import Checkbox from '../../../../components/CheckBox';
import Tree from '../../../../components/Tree';
//引入ajax
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
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
    	if(item.children){
    		loop(item.children)
    	}else if(curKey.indexOf(item.id) === 0){
    		item.children = child;
    		loop(item.children);
    	}
    });
  };
  loop(treeData);
  setLeaf(treeData, curKey, level);
}

export class ChenpsortDialog extends Component{
	constructor(props) {
		super(props);
		this.state ={
		    gData: [],
		    checkedKeys: [],
		    expandedKeys: [],
            selectedKeys: []
		}
		this.loadTreeIdMap = [];
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
        //初始化树
		this.getTree=this.getTree.bind(this);
	}
    //初始化树节点
    getTree(){
    	var that = this;
		apiGet(API_FOODING_DS,'/dataMulDiv1/dataMulDiv1/getTree',null,(response)=>{
			that.setState({
				gData:response.data,
			});
		},(message)=>{
				console.log(message);
		});
    }

    loadTreeChild (treeId){
		apiGet(API_FOODING_DS,'/dataMulDiv1/dataMulDiv1/getTree',{id: treeId},(response)=>{
		  		const gData = [...this.state.gData];
		  		let {checkedKeys, expandedKeys} = this.state;
		  		if (response.data.length){
					this.loadTreeIdMap[treeId] = true;
					!~expandedKeys.indexOf(treeId) && expandedKeys.push(treeId);
		  		} else {
	    			!~checkedKeys.indexOf(treeId) && checkedKeys.push(treeId);
		  		}
		        getNewTreeData(gData, treeId, response.data, 2);
		        this.setState({gData, checkedKeys});
		  },(error)=>{

		  })
    }

    onTreeSelect = (ids, {node}) =>{
    	let treeId = node.props.eventKey;
		if (treeId in this.loadTreeIdMap){
    		if( !this.loadTreeIdMap[treeId]){
    			let {checkedKeys} = this.state;
    			let ix = 0;
    			if ( (ix = checkedKeys.indexOf(treeId)) === -1){
					checkedKeys.push(treeId)
    			} else {
					checkedKeys.splice(ix, 1);
    			}
    			this.setState({checkedKeys}, ()=> this.onExpanTree(treeId));
    		} else {
    			this.onExpanTree(treeId);
    		}
    		
    	} else {
    		this.loadTreeIdMap[treeId] = false;
    		this.loadTreeChild(treeId);
    	}	
    }

    onExpanTree = treeId => {
    	let ix;
    	let {expandedKeys, checkedKeys} = this.state;
    	if ( (ix = expandedKeys.indexOf(treeId)) !== -1){
    		expandedKeys.splice(ix, 1);
    	} else if(this.loadTreeIdMap[treeId]){
    		expandedKeys.push(treeId);
    	}
    	this.setState({expandedKeys});
    };

	onSaveAndClose(){
		if(!this.state.checkedKeys.length){
			ServiceTips({text:i18n.t(200865/*请选择成品分类*/),type:"info"});
			return;
		}
		apiForm(API_FOODING_DS,'/platformMaterial/saveDataMulDiv1s',{id:this.props.id,dataMulDiv1id:this.state.checkedKeys},response => {
			ServiceTips({text:response.message,type:'success'});
			this.setState({checkedKeys:[],selectedKeys:[]},()=>this.props.onSaveAndClose())
		},error => {
			ServiceTips({text:error.message,type:'error'});
		})
	}
	onCancel(){
		this.props.onCancel();
	}
	componentDidMount(){
		this.getTree();
	}
	render(){
		let content;
	    content=( <div className='action-normal-buttons'>
	            <div className="client-normal-add scroll">
					<Tree
                        showIcon={false}
                        selectable={true}
                        checkable={true}
                        checkStrictly={true}
                        gData={this.state.gData}
                        onSelect={this.onTreeSelect}
                        checkedKeys={this.state.checkedKeys}
                        expandedKeys={this.state.expandedKeys}
                        onCheck={ ()=>{}}
						onLoadData={()=>new Promise(resolve => resolve())}
                    >
                    </Tree>				    
			    </div>
		    </div>);
		
		return (
			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
	           {content}
			</FormWrapper>
			);
	}
}
const ChenpsortForm =createForm()(ChenpsortDialog);
export default ChenpsortForm;
