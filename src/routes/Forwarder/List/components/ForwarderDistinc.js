import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react'
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
//引入Table
import Table from "../../../../components/Table";
import Page from "../../../../components/Page";


// common
import Select, { Option } from '../../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall'; // ajax
import ServiceTips from '../../../../components/ServiceTips'; // 提示框


class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);


		// init func
		this.getPage = this.getPage.bind(this);		
		this.searchFunc = this.searchFunc.bind(this);
		this.countryClick = this.countryClick.bind(this); // 国家 click


		// init state
		this.state = {
			data: [], // tabal
			totalRecords:0,
			pageSize:pageSize,
			currentPage:1,
			filter:null,
			searchVal:{}, // 去重查询
			country: [{id:1,name:''}], // 国家

		}

	}

	
	
	componentWillUnmount() {

	}

	static PropTypes={
		data:PropTypes.object,
		form:PropTypes.object,
		onSaveAndClose:PropTypes.func,
		onCancel:PropTypes.func
	}

	static defaultProps = {
		columns_distinct : [{
			title : i18n.t(400158/*货代代码*/),
			dataIndex : "code",
			key : "code",
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(100299/*货代公司*/),
			dataIndex : 'name',
			key : "name",
			width : '30%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100087/*国家*/),
			dataIndex : "country",
			key : "country",
			width : "30%",
			render(data,row,index){
				return data;
			}
		}],
		onSaveAndClose(){},
		onCancel(){}
	}
	compoentDidMount(){
		

	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(null == errors){
				if(onSaveAndClose){
					onSaveAndClose(form.getFieldsValue());
				}
			}
		})
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel()
		}
	}

	// 国家 click
	countryClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Country'},
			(response)=>{							
				this.setState({	country: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 查找
	searchFunc(){
 		let {form} = this.props;
        let that = this;
        let param = form.getFieldsValue();
        // console.log(param);
       
            this.getPage(1, that.state.pageSize, param);

		
	}

	// 刷新页面
	getPage(currentPage,objValue,filter){

		let that = this;
        filter=filter || this.state.filter;
        var sID = sID || '';
        let currentP = !isNaN(currentPage)?currentPage:1;
        let params = Object.assign({}, {pageSize: that.state.pageSize, currentPage: currentP},filter);

		apiGet(API_FOODING_DS,'/agnShipBe/repeat/getPage',params,
			(response)=>{
				that.setState({
					data:response.data.data,
					totalPages: response.data.totalPages,
					totalRecords: response.data.totalRecords,
					currentPage: response.data.currentPage,
					filter:filter  
				});
			},(errors)=>{
		});		
	}

	render(){
		let that = this;
		let {page,currentPage} =this.state;
		const {getNFieldProps, getFieldProps, getFieldError} = this.props.form;
		
		return(<FormWrapper showFooter={true} showSaveClose={false} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
				<div className="common-distinct">
					<div className="row">
						<div className="col-xs-3">
							<label className="distinct-label">{i18n.t(400158/*货代代码*/)}</label>
							<input type="text" placeholder="" className="text-input"
								{...getFieldProps('code',{
									initialValue:''
								})}
								style={{width:'120px'}}
							/>
						</div>
						<div className="col-xs-3">
							<label className="distinct-label">{i18n.t(100299/*货代公司*/)}</label>
							<input type="text" placeholder="" className="text-input"
								{...getFieldProps('name',{
									initialValue:''
								})}
							/>
						</div>
						<div className="col-xs-3">
							<label className="distinct-label">{i18n.t(100087/*国家*/)}</label>
							<Select
								animation='slide-up'
								style={{width:140}}
								className ='currency-btn select-from-currency'
								prefixCls="rc-select-filter-header"
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								placeholder=""
								{...getNFieldProps('cntryId',{
									initialValue: undefined
								})}
								onClick={this.countryClick}	
								onSelect={this.countryChange}						
								>
								{this.state.country.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.localName}</Option>)}
							</Select>
						</div>
						 <div className="filter-header-key">
							<span onClick={this.searchFunc} className="search"><i className="foddingicon fooding-search_icon" style={{textAlign:'center'}}></i></span>
						</div>
					</div>
					<div className="common-distinct-table">
						<Table 
							columns={this.props.columns_distinct}
							data={this.state.data}
							checkboxConfig={{show:false}}
							colorFilterConfig={{show:false}}
							followConfig={{show:false}}
							prefixCls={"rc-confirm-table"}
							scroll={{x:false, y:260}}
						/>
					</div>
					<div className="common-distinct-page">
						<Page 
                            currentPage={this.state.currentPage}
                            totalPages={this.state.totalPages} 
                            totalRecords={this.state.totalRecords}
                            sizeList={sizeList}
                            currentSize={this.state.pageSize}
                            pageSizeChange={(num)=>{
                                this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(currentPage, num));
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
					</div>
				</div>
				<br/>
				<br/>
		</FormWrapper>)
	}
}

CommonForm = createForm()(CommonForm)

export default CommonForm;
