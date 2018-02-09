import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
//引入select插件
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import {createForm} from "../../../../components/Form";
//引入时间插件
import DataTime from "../../../../components/Calendar/Calendar";
import xt from "../../../../common/xt";
import ProductSelect, {CustomerFind} from "../../../../components/FindGridSelect";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,API_FOODING_ES} from '../../../../services/apiCall';
import WebData from '../../../../common/WebData';
class BusinessFilterHeader extends Component{
	constructor(props){
		super(props);
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
        props.formCall(this.props.form);
        this.searchData = {};
        this.ccidClick = this.ccidClick.bind(this);
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			ccidArray:[]
		}
	}
	ccidClick(){
		var that =this;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{},(response)=>{
			that.setState({
				ccidArray:response.data
			});
		},(errors)=>{

		})
	}
    cleanForm = () => {
    	let that = this;
    	if(this.props.form.getFieldsValue().mtlId){
            this.props.form.resetFields();
			this.refs.productSelect.clear(this.props.getPages);
		}else {
			this.props.form.resetFields();
			this.props.getPages();
		}
    };

	show_hide_filter(){
		let classN;
		if(this.state.showFilter==="comb-panel"){
			classN="comb-panel-floating";
		}else{
			classN="comb-panel";	
		}
		this.setState({
			showFilter:classN
		})
	}
	search_more(){
		let classN,classMinor;
		if(this.state.expandClassName==='unfold'){
			classN ='fold';
			classMinor="filter-header-information-pre";//显示的全部条件输入框
		}else{
			classN="unfold";
			classMinor="filter-header-information-pre hidden";//隐藏条件输入框
		}
		this.setState({
			expandClassName:classN,minor:classMinor
		}, ()=>this.props.expandFilter(null, this.refs.header.offsetHeight));
	}

    shouldComponentUpdate(props, state) {
        return xt.equalsObject(state, this.state) || xt.equalsObject(props.form.getFieldsValue(), this.searchData);
    }

    componentDidUpdate() {
        this.searchData = this.props.form.getFieldsValue();
    }

	render(){
		let domFilter;
        let {getNFieldProps,getFieldValue,getFieldProps,getFieldError}= this.props.form;
        let that = this;
        let ccLocalName = WebData.user.data.staff.company.localName;
		let Cid = WebData.user.data.staff.ccid;
         // <ConstVirtualSelect
         //                    form={this.props.form}
         //                    fieldName='mtlId'
         //                    style={{width: 200}}
         //                    apiUri='/material/search'
         //                    async clearable
         //                    apiParams='keyword'
         //                />
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100304/*主题*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder=""
                            {...getFieldProps('theme',{
                                initialValue: '',
							})}
							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.props.searchCustomer()}
                            }}
                        />
					</div>
					<div className={'filter-header-information-pre'} style={{width:'300px'}}>
						<label>{i18n.t(100379/*产品*/)}</label>
						<div style ={{float:'right',width:'200px'}}>
							<ProductSelect 
							    ref ="productSelect"
								form={this.props.form}
								width={'379%'}
								titleClass={"col-md-12 col-lg-12"}
								url='/material/search'
							/>
						</div>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100311/*客户*/)}</label>
                        <div style ={{float:'right',width:'200px'}}>
                            <CustomerFind
                                form={this.props.form}
                                fieldName='salBeId'
                                style={{width: 200}}
                                apiUri='/customer/search'
                                async clearable
                                apiParams='keyword'
                            />
                        </div>

					</div>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(400049/*业务状态*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            style={{width: 200}}
                            isRequest={false}
                            fieldName="status"
                            initValueOptions={[
                                {id: '5', name: i18n.t(200258/*已提交*/)},
                                {id: '15', name: i18n.t(200259/*开启*/)},
                                {id: '20', name: i18n.t(100432/*关闭*/)}
                            ]}
                        />
                    </div>
                    <div className={this.state.minor}>
                        <div className={'filter-header-information-pre'}>
                            <label>{i18n.t(400011/*销售员*/)}</label>
                            <input type="text" className={'text-input-filter-header'} placeholder=""
                                   {...getFieldProps('saleStaffLcName',{
                                       initialValue: '',
                                   })}
								   onKeyDown={(e)=>{
                                       if(e.keyCode == 13){this.props.searchCustomer()}
                                   }}
                            />
                        </div>
                    </div>
					<div className={this.state.minor}>
						<label>{i18n.t(200252/*实际截止日期*/)}</label>
						<DataTime
                            name="startActEDate"
							showTime={false}
							width={200}
							isShowIcon={true}
							form={this.props.form}
							padding={'3px 10px 4px'}
						/>&nbsp;-&nbsp;
                        <DataTime
                            name="endActEDate"
                            showTime={false}
                            width={200}
                            isShowIcon={true}
                            form={this.props.form}
                            padding={'3px 10px 4px'}
                        />
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(100323/*业务日期*/)}</label>
						<DataTime
							name="startDate"
							showTime={false}
							width={200}
							isShowIcon={true}
							form={this.props.form}
							padding={'3px 10px 4px'}
						/>&nbsp;-&nbsp;
						<DataTime
							name="endDate"
							showTime={false}
							width={200}
							isShowIcon={true}
							form={this.props.form}
							padding={'3px 10px 4px'}
						/>
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(100244/*企业*/)}</label>
						<Select
											animation='slide-up'
											onClick={this.ccidClick}
											style={{width: 200}}
											optionLabelProp="children"
												{...getNFieldProps('ccId',{
													validateFirst: true,
													rules: [{required:true}],
													initialValue:ccLocalName?{s_label:ccLocalName,ccId:Cid}:undefined
												})}
												allowClear
										>
										{
											this.state.ccidArray.map((e,i)=>{
															return  <Option value={e.id+""} title={e.name} key={i}>{e.localName}</Option>
														})
										}
								</Select>
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(200119/*销售组织*/)}</label>
						<ConstMiniSelect form={this.props.form}
						refreshMark={getFieldValue('ccId',{}).ccId||getFieldValue('ccId')} 
							 pbj={{
								apiType:apiGet,
								 host:API_FOODING_ES,
								 uri: '/party/getPartysByType',
								 params:{typeAttributeIds:["44"],partyId:getFieldValue('ccId',{}).ccId||getFieldValue('ccId')}
							}} fieldName="sorId"
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                 sorId: da.id,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>} reles={true}
	                             style={{width: 200}}
	                             
	                        />
					</div>
                    <div className={this.state.minor}>
                        <label>{i18n.t(400048/*单据编号*/)}</label>
                        <input type="text" className={'text-input-filter-header'} placeholder=""
                               {...getFieldProps('no',{
                                   initialValue: '',
                               })}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.props.searchCustomer()}
                               }}
                        />
                    </div>
                    <div className={this.state.minor}>
                        <label>{i18n.t(200253/*关闭类型*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            style={{width: 200}}
                            isRequest={false}
                            fieldName="closeCauseId"
                            pageSize={4}
                            initValueOptions={[
                                {id: '90', name: i18n.t(200284/*赢单关闭*/)},
                                {id: '110', name: i18n.t(200914/*部分赢单关闭*/)},
                                {id: '80', name: '接受不了客户要求的支付条款'},
                                {id: '140', name: '录入重复'},
                                {id: '10', name: '无真实需求'},
                                {id: '50', name: '订不到船'},
                                {id: '100', name: i18n.t(200915/*丢单关闭*/)}
                            ]}
                        />
                    </div>
					<div className={'filter-header-key'}>
						<span className="search" onClick={this.props.searchCustomer}><i className="foddingicon fooding-search_icon"/></span>
						<span className="clean" onClick={this.cleanForm}><i className="foddingicon fooding-clean_icon"/></span>
						<span className={this.state.expandClassName} onClick={this.search_more}><i className="foddingicon fooding-zk_icon"/></span>
					</div>
					<div className={this.state.showFilter}>
						<span className="screen" onClick={this.show_hide_filter
						}><i className="foddingicon fooding-screen_icon"/></span>
					</div>
				</div>)
		}else{
			domFilter=(<div className={this.state.showFilter}>
					<span className="screen" onClick={this.show_hide_filter
					}><i className="foddingicon fooding-screen_icon"/></span>
				</div>)
		}
		return(<div className={'clientcontact-list-header'}  ref="header">{domFilter}</div>)
	}
}
BusinessFilterHeader = createForm()(BusinessFilterHeader);
export default BusinessFilterHeader;
