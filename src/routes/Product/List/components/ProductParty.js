import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
//引入select插件
import Select, { Option } from 'rc-select'
//引入table
const {Table} = require("../../../../components/Table");
//引入分页
import Page from "../../../../components/Page";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips,{errorTips, successTips} from '../../../../components/ServiceTips';

import {I18n} from '../../../../lib/i18n';

class ProductParty extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.searchParty=this.searchParty.bind(this);
		this.getPartyPages=this.getPartyPages.bind(this);
		this.state=this.initState();
	}
	
	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func,
		columns_party:PropTypes.array,
		searchParty:PropTypes.func
	};

	initState(){
		return {
			data:[],
			selectArr:[],
			checkedRows:[],
			choised:false,
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: 20, // 每页 多少条
		}
	}

	getPartyPages(currentPage,size,filter,order){
		filter=filter||{};
		order=order||{column:'id',order:'desc'};
		let {page}=this.state;
		currentPage = currentPage||1;
		size=size||this.state.pageSize;
		let params=Object.assign({rowSts: 10},{currentPage:currentPage,pageSize:size},filter,order);
		apiGet(API_FOODING_DS,'/platformMaterial/getPage',params,(response)=>{
			this.setState({
				data:response.data.data,
				pageSize:response.data.pageSize,
				totalPages:response.data.totalPages,
				currentPage:response.data.currentPage,
				totalRecords:response.data.totalRecords
			})
		},(message)=>{
			ServiceTips({text: message.message,type:'error'});
		});
	}

	static defaultProps={
		columns_party:[{
			title : I18n.t(100377/*产品编码*/),
			dataIndex : "code",
			key : "code",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : I18n.t(100379/*产品*/),
			dataIndex : 'localName',
			key : "localName",
			width : '30%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : I18n.t(100226/*英文名称*/),
			dataIndex : "enName",
			key : "enName",
			width : "20%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100382/*产品规格*/),
			dataIndex : "specTxt",
			key : "specTxt",
			width : "20%",
			render(data,row,index){
				return data;
			}
		}],
		onSaveAndClose(){},
		onCancel(){}
	};

	componentDidMount(){
	    this.getPartyPages();
	}

	onSaveAndClose(){
	    let selectArr = this.mainTable.getSelectArr();
		if(selectArr.length === 0){
			//没有选中列表中的任何一条数据
            return errorTips(I18n.t(100404/*请选择需要引入的数据*/));
		}

		apiForm(API_FOODING_DS,'/material/leadIn',{
		    id: selectArr.map(da => da.id)
        },response =>{
			//成功之后，就吧所用的东西都设置为空
			this.setState({
				data:[],
				selectArr:[],
				checkedRows:[],
				choised:false,
				currentPage:1, // 当前页
				totalPages: 1, // 总页数
				pageSize: 20, // 每页 多少条
			});
			successTips(I18n.t(100405/*引入成功！*/));
            this.props.onSaveAndClose();
		},error =>{
            errorTips(error.message);
		})
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	searchParty(){
		//用于查询(查到产品后，下面列表中的单条数据就变字体颜色就变成#bec2c7)
		const { form } = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.getPartyPages(null,null,this.props.form.getFieldsValue());
			}
		})
	}
	render(){
		const {form} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		const inputStar=(<span className={''}>*</span>);
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<div className="common-party">
						<div className="row">
							<div className={'col-xs-3'}>
								<label className="party-label">{I18n.t(100377/*产品编码*/)}</label>
								<input type="text" placeholder={I18n.t(100377/*产品编码*/)} className="text-input" {...getFieldProps('code',{
											initialValue:''
										})} style={{width:"140px"}}/>
							</div>
							<div className={'col-xs-3'}>
								<label className="party-label">{I18n.t(100379/*产品*/)}</label>
								<input type="text" placeholder={I18n.t(100379/*产品*/)} className="text-input" {...getFieldProps('name',{
											initialValue:''
										})}/>
							</div>
							<div className={'col-xs-3'}>
								<label className="party-label">{I18n.t(100226/*英文名称*/)}</label>
								<input type="text" placeholder={I18n.t(100226/*英文名称*/)} className="text-input" {...getFieldProps('enName',{
										initialValue:''
									})}/>
							</div>
							<button type="button" className={'col-xs-1'} onClick={this.searchParty}>{I18n.t(100406/*查询*/)}</button>
						</div>
						<div className="common-party-table">
							<Table ref={rf=>this.mainTable=rf}
								columns={this.props.columns_party}
								data={this.state.data}
								checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
								colorFilterConfig={{show:false}}
								followConfig={{show:false}}
                                prefixCls={"rc-confirm-table"}
								scroll={{x:false, y:220}}
							/>
						</div>
						<div className="common-party-page">
							<Page 
								currentPage={this.state.currentPage}
								totalPages={this.state.totalPages} 
								sizeList={[20,50,200]}
								currentSize={this.state.pageSize}
								pageSizeChange={(num)=>{	
									if(this.state.currentPage == num) return;							
									this.getPartyPages(this.state.currentPage,num);
								}} 
								backClick={(num)=>{
									if(this.state.currentPage == num) return;
									this.getPartyPages(num);
								}} 
								nextClick={(num)=>{
									if(this.state.currentPage == num) return;
									this.getPartyPages(num);									
								}}
								goChange={(num)=>{
									if(this.state.currentPage == num) return;
									this.getPartyPages(num);																				
								}}								
							/>
						</div>
					</div>
			</FormWrapper>);
	}
}

ProductParty = createForm()(ProductParty);

export default ProductParty;


