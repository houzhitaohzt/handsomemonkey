import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
//引入select插件
import Select, { Option ,ConstVirtualSelect} from '../../../../components/Select';
import {createForm,FormWrapper} from "../../../../components/Form";
import Calendar from  '../../../../components/Calendar/Calendar';
import DataTime from '../../../../components/Calendar/Calendar';

//引入时间插件
import {I18n} from '../../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.qiyunClick = this.qiyunClick.bind(this);
		this.huodaiClick = this.huodaiClick.bind(this);
		this.chuangsClick = this.chuangsClick.bind(this);
		this.search = this.search.bind(this);
		this.clear = this.clear.bind(this);
		props.normalRef && props.normalRef(this);
		this.getForm = this.getForm.bind(this);
        let nowData = new Date();
        this.yearList = [nowData.getFullYear(), nowData.getFullYear() + 1].map(da => ({id:da, name: da}));
        this.monthSelectData = [1,2,3,4,5,6,7,8,9,10,11,12];
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			qiyunArray:[],
			huodaiArray:[],
			chuangArray:[]
		}
	}
	show_hide_filter(){
		let classN;
		if(this.state.showFilter==="comb-panel"){
			classN="comb-panel-floating";
		}else{
			classN="comb-panel";
		}
		this.setState({
			showFilter:classN
		},()=>this.props.expandFilter(null, this.refs.header.offsetHeight==0?1:this.refs.header.offsetHeight))
	}
	search(){
		this.props.getPage();
	}
	clear(){
		this.props.form.resetFields();
		this.props.getPage();
	}
	qiyunClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{
			attr:"statnTyId",
			expression:"=",
			value:10
		}]
		},
			(response)=>{
				that.setState({
					qiyunArray:response.data
				})
		},(error)=>{

		});
	}
	huodaiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.AgnShipBe'},
			(response)=>{
				that.setState({
					huodaiArray:response.data
				});
		},(error)=>{

		});
	}
	chuangsClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',
			{
				"obj":"com.fooding.fc.ds.entity.Carrier",
				"prettyMark":true
			},
			(response)=>{
				that.setState({
					chuangArray:response.data
				});
		},(error)=>{

		});
	}
	render(){
		let domFilter;
        let that = this;
		const { getFieldProps, getFieldError,getNFieldProps} = this.props.form;
		getFieldProps('type',{
										                    initialValue:10
			});
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(700076/*日期*/)}</label>
                        <DataTime
                            showTime={false}
                            isShowIcon={true}
                            width={'100%'}
                            form={this.props.form}
                            name={'startActivitiDate'}
                        />
                        &nbsp;&nbsp;-&nbsp;&nbsp;
                        <DataTime
                            showTime={false}
                            isShowIcon={true}
                            width={'100%'}
                            form={this.props.form}
                            name={'endActivitiDate'}
                        />
					</div>
                    <div className={'filter-header-information-pre'}>
                        <label>异常</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            rules={true}
                            isRequest = {false}
                            fieldName="month"
                            initValueOptions={this.monthSelectData}
                            valueKeys={da => String(da)}
                            pageSize={4}
                            className ={'col-xs-7 col-md-7'}
                        />
                    </div>
					<div className={'filter-header-key'}>
						<span className="search" onClick={this.search}><i className="foddingicon fooding-search_icon"></i></span>
						<span className="clean"   onClick={this.clear}><i className="foddingicon fooding-clean_icon"></i></span>
					</div>
					<div className={this.state.showFilter}>
						<span className="screen" onClick={this.show_hide_filter
						}><i className="foddingicon fooding-screen_icon"></i></span>
					</div>
				</div>)
		}else{
			domFilter=(<div className={this.state.showFilter}>
					<span className="screen" onClick={this.show_hide_filter
					}><i className="foddingicon fooding-screen_icon"></i></span>
				</div>)
		}
		return(<div className={'clientcontact-list-header'} ref='header'>{domFilter}</div>)
	}
}
ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
