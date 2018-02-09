import React,{Component, PropTypes} from "react";
import {createForm,FormWrapper} from '../../../components/Form';
import i18n from './../../../lib/i18n';


import Tree ,{TreeNode} from '../../../components/Tree';
import ServiceTips from '../../../components/ServiceTips';

import {apiGet,apiPost,apiForm,API_FOODING_ES,getQueryString} from '../../../services/apiCall';


export class Addnormal extends Component{

	constructor(props) {
        super(props);

		let {data,moduleIdArray} = this.props;
        let IDAll = !data['number'] ? moduleIdArray.map(o=>o['id']) : [];


        // state init 
        this.state = {
            dataTree:[], // getOne      
            checkedKeys: IDAll, // 选中的 key 
            expandedKeys:IDAll, // 展开的 key 
      
        };
    }

    componentDidMount(){
        this.getOne();
    }

	componentWillUnmount() {
	}

    // checkBox 
    secondonCheck = (keys, {checkedNodes}) => {
        let checkedNames = [];
        let checkedKeys = [];
        checkedNodes.forEach(node => {
            checkedKeys.push(node.key);
            checkedNames.push(node.props.title);
        });

        this.props.form.setFieldsValue({partyNames: checkedNames.join(",")});
        this.setState({checkedKeys, checkedNames});
    }  

    // 展开 
    onExpand = (expandedKeys, {node}) =>{
        let expand = children =>{
            if( !children) return;
            children.forEach(da => {
               expand(da.props.children);

                let ix;
                if( ( ix = expandedKeys.indexOf(da.key)) !== -1){
                    expandedKeys.splice(ix, 1);
                }
            });
        };
        expand(node.props.children);
        this.setState({expandedKeys});
    };

    // getOne 
    getOne = ()=> {
		var that = this;
		apiGet(API_FOODING_ES,'/menu/getTree',null,
            (response)=>{
                let array = [];
                array.push(response.data);
                that.setState({
                    dataTree:array,
                    //nodeParent:response.data.id
                });
		    },(message)=>{
				console.log(message);
		});
    }

	// 保存
	onSaveAndClose =()=> {
		let that = this;
        let {checkedKeys} = this.state;
        let {menusetView} = this.props;

        if(!checkedKeys['length']) return;
        apiPost(API_FOODING_ES,'/menu/saveCorrelationMenu',Object.assign({},{menuId:menusetView['id'],menuIds:checkedKeys}),
            (response)=>{	
                    ServiceTips({text:response.message,type:'success'});
                    that.props.onSaveAndClose();
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });

	}




	render(){

		let that = this;
		const { getFieldProps, getNFieldProps, getFieldError} = this.props.form;
		let {data,moduleIdArray} = this.props;
        let {dataTree,expandedKeys,checkedKeys} = this.state;


        return 	<FormWrapper showSaveClose={true} showFooter={true}  onSaveAndClose={this.onSaveAndClose.bind(this,true)} onCancel={this.props.onCancel}>
                    <div className={'girdlayout scroll'} style={{height:"270px"}}>
                        <div className="row">
                            <Tree                        
                                disableCheckboxParent={true} // 父级 不勾选                              
                                showIcon={false}
                                selectable={true}
                                draggable={true}
                                checkable={true}
                                checkStrictly={true}
                                defaultExpandedKeys={['menu']}
                                gData={dataTree}
                                onCheck={this.secondonCheck}
                                onExpand={this.onExpand}
                                checkedKeys={this.state.checkedKeys}
                                expandedKeys={this.state.expandedKeys}
                            />						
                        </div>
                      
                    </div>
			    </FormWrapper>
    }

}
const ProductForm =createForm()(Addnormal);
export default ProductForm;