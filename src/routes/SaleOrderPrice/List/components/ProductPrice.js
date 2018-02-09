import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
import Dialog from "../../../../components/Dialog/Dialog";
const {Table} = require("../../../../components/Table");
import Checkbox from "../../../../components/CheckBox";
import Radio from "../../../../components/Radio";
import Select, {ConstVirtualSelect} from '../../../../components/Select'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {I18n} from '../../../../lib/i18n';

class ProductPrice extends Component{
	constructor(props){
		super(props);
		this.columns={left:[{
			title:I18n.t(100407/*添加客户*/),
			dataIndex : 'localName',
			key : 'localName',
			width : "90%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		}],
		right:[{
			title:I18n.t(100408/*已选客户*/),
			dataIndex:'localName',
			key:"localName",
			width:'90%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		}]}

		this.leftTable = null;
        this.rightTable = null;
        this.tableLeftSearch = this.tableLeftSearch.bind(this);
        this.state = this.initState();
        this.leftClick=this.leftClick.bind(this);
        this.rightClick=this.rightClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		this.tableLeftSearch=this.tableLeftSearch.bind(this);
		this.searchClick=this.searchClick.bind(this);
		this.state=this.initState()
	}
	static PropTypes={
		data:PropTypes.object,
		form:PropTypes.object,
		onSaveAndClose:PropTypes.func,
		onCancel:PropTypes.func,
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){},
	}

	initState(){
		return{
			mtlIdchecked:false,
			autoSend:false,
			leftChoised : false,
			rightChoised : false,
			selectValue:'',
			left:[],
			right:[]
		}
	}

	//自动报价 保存并关闭
	onSaveAndClose(){
		if(!this.state.mtlIdchecked && this.state.right.length == 0){
			ServiceTips({text:I18n.t(100409/*请选择要报价客户*/),type:'warning'})
			return false;
		}

		const {form, onSaveAndClose} = this.props;
		let {right,mtlIdchecked,autoSend} = this.state;
		//已选客户的id
		let beIds = right.map((o) => o.id);
		//已选产品的id数组
		let ormbs = this.props.proArr.map((o) => ({mtlId:o.mtlId,offerId:o.billId}));
		let positnId = form.getFieldValue("positnId");
		let value = Object.assign({},{beIds:beIds,ormbs:ormbs,mtlIdchecked:mtlIdchecked,autoSend:autoSend,positnId:positnId});
		apiPost(API_FOODING_DS,'/offerRec/material/save',value, response => {
			this.setState(this.initState(),onSaveAndClose)
			ServiceTips({text:response.message,type:'success'});
			this.props.getPage();
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel()
		}
	}
	rightClick(){	
		let {left,right}=this.state;
		let selectLeft = this.leftTable.getSelectArr();

		for(let i = 0; i < selectLeft.length; i++){
			for(let j = 0; j< right.length; j++){
				if(selectLeft[i].id === right[j].id){
					left.remove(selectLeft[i]);
					selectLeft.remove(selectLeft[i]);					
					i--;
					break;
				}				
			}
			left.remove(selectLeft[i]);
		}

		right = right.concat(selectLeft);
		this.setState({left,right});
	}
	leftClick(){		
		let {left, right} = this.state;
        let selectRight = this.rightTable.getSelectArr();

        for (let i = 0; i < selectRight.length; i++) {
			for(let j = 0; j < left.length; j++){
				if(selectRight[i].id === left[j].id){
					right.remove(selectRight[i]);
					selectRight.remove(selectRight[i]);					
					i--;
					break;
				}
			}
            right.remove(selectRight[i]);
        }

        left = left.concat(selectRight);
        this.setState({left, right});
	}

	//搜索框内容
	tableLeftSearch(e){
		this.setState({
	      selectValue:e.target.value
	    });
	}

	//左边表格 搜索按钮
	searchClick =() => {
		let keyword = this.state.selectValue;
        apiGet(API_FOODING_DS,'/customer/search',{keyword:keyword},response => {
            this.setState({left: response.data});
        }, error => {
            console.log(error);
        })
	}

	//复选框的选中与不选中事件
	handleChange(name, e) {
        this.setState({[name]: e.target.checked });
    }
	render(){
		const {getFieldProps, getFieldError,form} = this.props.form;
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
			<div className="productprice scroll" style={{marginBottom:'10px',maxHeight:'320px',overflowX:'hidden'}}>
				<div className="row" style={{marginBottom:'5px'}}>
					<div className="form-group col-md-4 col-lg-4">
						<Checkbox
                            defaultChecked
                            checked={this.state.mtlIdchecked}
                            onChange={this.handleChange.bind(this, 'mtlIdchecked')}
                        />
						<p className="client-price-content-show" style={{marginLeft:'10px'}}>{I18n.t(100410/*关注此产品客户*/)}</p>
					</div>
					<div className="form-group col-md-4 col-lg-4">
						<span style={{color:'#9facbd', marginRight: '10px'}}>{I18n.t(100411/*是否发邮件*/)}</span>
						 <Checkbox
                            defaultChecked
                            checked={this.state.autoSend}
                            onChange={this.handleChange.bind(this, 'autoSend')}
                            style={{marginRight:'10px'}}

                        />
					</div>
					<div className="form-group col-md-4 col-lg-4 none">
                               <p className="client-price-content-show col-xs-4">{i18n.t(200457/*接受对象*/)}</p>
                               <ConstVirtualSelect
                                    pageSize={6}
                                    multi
                                    apiType={apiPost}
                                    form={this.props.form}
                                    fieldName='positnId'
                                    rules={false}
                                    apiParams="com.fooding.fc.ds.entity.Positn"
                                    className="col-xs-8"
                                />
                            </div>
				</div>
				<div className="productprice-content-table-more">
					<div className="table-left">
						<Table 
							ref={table => this.leftTable = table}
							columns={this.columns.left}
							data={this.state.left}
							checkboxConfig={{show:true,checkedAll:this.state.leftChoised,checkedRows:this.state.leftCheckedRows}}
							colorFilterConfig={{show:false}}
							followConfig={{show:false}}
							prefixCls={"rc-confirm-table"}
							scroll={{x:false, y:270}}
							contextMenuConfig={{
		                        enable: true,
		                        contextMenuId: 'SIMPLE_TABLE_MENU',
		                        menuItems: [{
		                            onClick: this.rightClick,
		                            content: <div><i className={'foddingicon fooding-arrow-right_16'}></i></div>
		                        }]
		                    }}
						/>
						<a className={'productprice-content-table-search'} href="javascript:;">
	                      	<input type='text' onChange={this.tableLeftSearch} value={this.state.selectValue} onKeyDown={(e)=>{
                        		if(e.keyCode == 13){this.searchClick()}
		                    }}/>
		                    <i className='foddingicon fooding-search_32' onClick={this.searchClick} />
						</a>
					</div>
					<div className="content-button">
		               <i className='foddingicon fooding-arrow-right_16 move-right' onClick={this.rightClick.bind(this)}></i>
		               <i className='foddingicon fooding-arrow_left_16 move-left' onClick={this.leftClick.bind(this)}></i>
					</div>
					<div className="table-right">
						<Table 
							ref={table => this.rightTable = table}
							columns={this.columns.right}
							data={this.state.right}
							checkboxConfig={{show:true,checkedAll:this.state.rightChoised,checkedRows:this.state.rightCheckedRows}}
							colorFilterConfig={{show:false}}
							followConfig={{show:false}}
							prefixCls={"rc-confirm-table"}
							scroll={{x:false, y:270}}
							contextMenuConfig={{
		                        enable: true,
		                        contextMenuId: 'SIMPLE_TABLE_MENU',
		                        menuItems: [{
		                            onClick: this.leftClick,
		                            content: <div><i className={'foddingicon fooding-arrow_left_16'}></i></div>
		                        }]
                    		}}						
						/>
					</div>
				</div>
			</div>
		</FormWrapper>);
	}
}

ProductPrice=createForm()(ProductPrice);

export default ProductPrice;
