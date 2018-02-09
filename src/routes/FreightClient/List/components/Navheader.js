import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
//引入select插件
import {ConstVirtualSelect} from "./../../../../components/Select";
import {createForm} from "../../../../components/Form";
//引入时间插件
import DataTime from "../../../../components/Calendar/Calendar";
import {I18n} from "../../../../lib/i18n";
// ajax
import {apiPost, API_FOODING_ES,API_FOODING_DS} from "../../../../services/apiCall";
import xt from "../../../../common/xt";
import WebData from "../../../../common/WebData";

import ProductSelect, {ProductName} from "../../../../components/FindGridSelect";

/**
 * 客户列表查询头
 */
class ClientFilterHeader extends Component {
    constructor(props) {
        super(props);
        this.state = this.initState();
        this.show_hide_filter = this.show_hide_filter.bind(this);
        this.search_more = this.search_more.bind(this);

        // this.stateClick = this.stateClick.bind(this);  // 省 click
        // this.cityClick = this.cityClick.bind(this);	 // 市 click
        // this.districtClick = this.districtClick.bind(this);	 // 区县 click

        // this.countryChange = this.countryChange.bind(this);	 // 国家 change
        // this.stateChange = this.stateChange.bind(this);	 // 省 change
        // this.cityChange = this.cityChange.bind(this);	 // 市 change
        props.formCall(this.props.form);

        this.searchData = {};
    }

    static propTypes = {
        expand: PropTypes.bool,
        expandFilter: PropTypes.func,
        initData: PropTypes.object
    };
    static defaultProps = {
        expand: false,
        expandFilter(){
        },
        showFilter: 'comb-panel',
        expandClassName: 'unfold',
        minor: 'filter-header-information-pre hidden',
        initData: null,
    };

    initState() {
        return {
            productSelectData: [],
            expand: false,
            showFilter: 'comb-panel',
            expandClassName: 'unfold',
            minor: 'filter-header-information-pre hidden',

            // area: [{id: "1",localName:''}],	// 地区
            // state: [{id: "1",localName:''}], // 省州
            // city: [{id:"1",localName:''}], // 市
            // district: [{id:"1",localName:''}], // 区县

            // countryNowID: '', // 国家 临时ID
            // stateNowID: '', // 省 临时ID
            // cityNowID: '', // 市 临时ID
        }
    }

    // // 省州 click
    // stateClick(){
    //     apiPost(API_FOODING_DS,'/object/getMiniList',
    //         {
    //             obj:'com.fooding.fc.ds.entity.Area',
    //             queryParams: [{
    //                 "attr":"parentId",
    //                 "expression":"=",
    //                 "value": this.state.countryNowID
    //             }]
    //         },
    //         (response)=>{
    //             this.setState({	state: response.data });
    //             response.data.length === 0 && ServiceTips({text: '请先选择国家！',type: 'info'});
    //         },(errors)=>{
    //             ServiceTips({text: errors.message,type: 'error'});
    //         });
    // }
    //
    // // 省 onChange
    // stateChange(ID){
    //     if(ID !== this.state.stateNowID){
    //         this.setState({ stateNowID: ID, cityNowID: ''});
    //         this.props.form.setFieldsValue({"cityId": undefined, "districtId": undefined});
    //     }
    // }
    //
    // // 市 click
    // cityClick(){
    //     apiPost(API_FOODING_DS,'/object/getMiniList',
    //         {
    //             obj:'com.fooding.fc.ds.entity.Area',
    //             queryParams: [{
    //                 "attr":"parentId",
    //                 "expression":"=",
    //                 "value": this.state.stateNowID
    //             }]
    //         },
    //         (response)=>{
    //             this.setState({	city: response.data });
    //             response.data.length === 0 && ServiceTips({text: '请先选择省/州！',type: 'info'});
    //         },(errors)=>{
    //             ServiceTips({text: errors.message,type: 'error'});
    //         });
    // }
    //
    // // 市 onChange
    // cityChange(ID){
    //     if (ID !== this.state.cityNowID){
    //         this.setState({ cityNowID: ID });
    //         this.props.form.setFieldsValue({ "districtId": undefined});
    //     }
    // }
    //
    // // 区县 click
    // districtClick(){
    //     apiPost(API_FOODING_DS,'/object/getMiniList',
    //         {
    //             obj:'com.fooding.fc.ds.entity.Area',
    //             queryParams: [{
    //                 "attr":"parentId",
    //                 "expression":"=",
    //                 "value": this.state.cityNowID
    //             }]
    //         },
    //         (response)=>{
    //             this.setState({	district: response.data });
    //             response.data.length === 0 && ServiceTips({text: '请先选择市！',type: 'info'});
    //         },(errors)=>{
    //             ServiceTips({text: errors.message,type: 'error'});
    //         });
    // }

    show_hide_filter() {
        let classN;
        if (this.state.showFilter === "comb-panel") {
            classN = "comb-panel-floating";
        } else {
            classN = "comb-panel";
        }
        this.setState({
            showFilter: classN
        },()=>this.props.expandFilter(null, this.refs.header.offsetHeight==0?1:this.refs.header.offsetHeight))
    }

    search_more() {
        let classN, classMinor;
        if (this.state.expandClassName === 'unfold') {
            classN = 'fold';
            classMinor = "filter-header-information-pre";//显示的全部条件输入框
        } else {
            classN = "unfold";
            classMinor = "filter-header-information-pre hidden";//隐藏条件输入框
        }
        this.setState({
            expandClassName: classN, minor: classMinor
        }, ()=>this.props.expandFilter(null, this.refs.header.offsetHeight));

    }

    cleanForm = () => {
        let that = this;
        if(this.props.form.getFieldsValue().mtlTyId){
            this.refs.productSelect.clear(this.props.getPages);
            this.props.form.resetFields();
        }else {
            this.props.form.resetFields();
        }
    };

    shouldComponentUpdate(props, state) {
        return xt.equalsObject(state, this.state) || xt.equalsObject(props.form.getFieldsValue(), this.searchData);
    }

    componentDidUpdate() {
        this.searchData = this.props.form.getFieldsValue();
    }

    render() {
        let {form} = this.props;
        let domFilter;
        const {getFieldProps, getNFieldProps,getFieldError} = form;
        if (this.state.showFilter === 'comb-panel') {
            domFilter = (
                <div className={'filter-header'}>
                    <div className={this.state.minor}>
                        <label>{i18n.t(100354/*客户代码*/)}</label>
                        <input type="text" className="text-input-filter-header" name="code"
                               {...getFieldProps('code', {initialValue: ''})}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.props.searchCustomer();}
                               }}
                        />
                    </div>
                     {/*<div className={'filter-header-information-pre'} 
                        style={{width:'300px'}}>
                         <label>{i18n.t(100350*//*关注产品*//*)}</label>
                         <div style ={{float:'right',width:'200px'}}>
                             <ProductName
                                 ref ="productSelect"
                                 form={this.props.form}
                                 width={'379%'}
                                 fieldName ='mtlTyId'
                                 className={'currency-btn select-from-currency text-input-nowidth'}
                                 titleClass={"col-md-12 col-lg-12"}
                                 apiUri='/mtlType/search'
                             />
                         </div>
                    </div>*/}
                    <div className="filter-header-information-pre">
                        <label>{I18n.t(100355/*客户名称*/)}</label>
                        <input type="text" className="text-input-filter-header" name="name" {...getFieldProps('name', {initialValue: ''})}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.props.searchCustomer();}
                               }}
                        />
                    </div>
                    {/*<div className={this.state.minor}>*/}
                        {/*<label>{i18n.t(100091*//*地区*//*)}</label>*/}
                        {/*<ConstVirtualSelect*/}
                            {/*form={form}*/}
                            {/*style={{width: 200}}*/}
                            {/*apiType={apiPost}*/}
                            {/*fieldName="beAreaId"*/}
                            {/*apiParams="com.fooding.fc.ds.entity.BeAreaId"*/}
                        {/*/>*/}
                    {/*</div>*/}
                    <div className="filter-header-information-pre">
                        <label>{I18n.t(100087/*国家*/)}</label>
                        <ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="cntryId"
                            apiParams="com.fooding.fc.ds.entity.Country"
                            valueKeys={ da => ({
                                cntryId: da.id,
                                cntryLocalName: da.localName,
                                s_label:da.localName
                            })}
                        />
                    </div>
                    <div className="filter-header-information-pre">
                        <label>{i18n.t(100229/*邮箱*/)}</label>
                        <input type="text" className="text-input-filter-header" placeholder=""
                               {...getFieldProps("email", {initialValue: ''})}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.props.searchCustomer();}
                               }}
                        />
                    </div>
                    <div className="filter-header-information-pre">
                        <label>{i18n.t(100359/*客户等级*/)}</label>
                        <ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="cstmLvId"
                            apiParams="com.fooding.fc.ds.entity.CstmLevel"
                            valueKeys={ da => ({
                                cstmLvId: da.id,
                                cstmLvLocalName: da.localName,
                                s_label:da.localName
                            })}
                        />
                    </div>
                    <div className={this.state.minor}>
                        <label>{i18n.t(100362/*客户来源*/)}</label>
                        <ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="cstmSrcId"
                            apiParams="com.fooding.fc.ds.entity.CstmCrsekt"
                            valueKeys={ da => ({
                                cstmSrcId: da.id,
                                cstmSrcLocalName: da.localName,
                                s_label:da.localName
                            })}
                        />
                    </div>
                    <div className={this.state.minor}>
                        <label>{i18n.t(100361/*分管人*/)}</label>
                        <ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            fieldName="staffId"
                            apiHost={API_FOODING_ES}
                            apiUri='/user/getListForPermissionsInParty'
                            labelKey="staffLocalName"
                            apiParams={{
                                partyId: WebData.user.data.staff.ccid,
                                typeAttributeIds: [601, 602, 603, 604]
                            }}
                            valueKeys={ da => ({
                                staffId: da.refId,
                                staffLocalName: da.staffLocalName,
                                s_label:da.staffLocalName
                            })}
                        />
                    </div>
                    <div className={this.state.minor}>
                        <label>{i18n.t(200450/*客户联系人*/)}</label>
                        <input type="text" className="text-input-filter-header" name="contactor"
                               {...getFieldProps('contactor', {initialValue: ''})}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.props.searchCustomer();}
                               }}
                        />
                    </div>   
                    <div className={this.state.minor}>
                        <label>{i18n.t(100358/*税号*/)}</label>
                        <input type="text" className="text-input-filter-header" name="taxIdenSN"
                               {...getFieldProps('taxIdenSN', {initialValue: ''})}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.props.searchCustomer();}
                               }}
                        />
                    </div>
                    {/*<div className={this.state.minor}>
                        <label>{i18n.t(200451*//*是否下单*//*)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            fieldName="tradMark"
                            style={{width: 200}}
                            isRequest={false}
                            initValueOptions={[
                                {name:所有的, value: ''},{name:已下单, value: true},{name:未下单, value: false}
                                ]}
                            valueKeys={ da => ({
                                tradMark: da.value,
                                tradMarkLocalName: da.name,
                                s_label:da.name
                            })}
                        />
                    </div>*/}
                    <div className={this.state.minor}>
                        <label className="current-data-label">{i18n.t(300084/*分配给我的客户*/)}</label>
                        <DataTime
                            showTime={false}
                            name="assignTime"
                            width={200}
                            isShowIcon={true}
                            form={this.props.form}
                            padding={"3px 10px 4px"}
                        />
                    </div>                    
                    <div className={this.state.minor}>
                        <label className="current-data-label">{i18n.t(200453/*最新修改日期*/)}</label>
                        <DataTime
                            showTime={false}
                            name="startTime"
                            width={200}
                            isShowIcon={true}
                            form={this.props.form}
                            padding={"3px 10px 4px"}
                        />
                        &nbsp;&nbsp;-&nbsp;&nbsp;
                        <DataTime
                            name="endTime"
                            showTime={false}
                            width={200}
                            form={this.props.form}
                            isShowIcon={true}
                            padding={"3px 10px 4px"}
                        />
                    </div>
                    <div className={'filter-header-key'}>
                        <span className="search" onClick={this.props.searchCustomer}><i className="foddingicon fooding-search_icon"/></span>
                        <span className="clean" onClick={this.cleanForm}><i className="foddingicon fooding-clean_icon"/></span>
                        <span className={this.state.expandClassName} onClick={this.search_more}><i className="foddingicon fooding-zk_icon"/></span>
                    </div>
                    <div className={this.state.showFilter}>
						<span className="screen" onClick={this.show_hide_filter }><i className="foddingicon fooding-screen_icon"/></span>
                    </div>
                </div>)
        } else {
            domFilter = (<div className={this.state.showFilter}>
                <span className="screen" onClick={this.show_hide_filter}><i className="foddingicon fooding-screen_icon"/></span>
            </div>)
        }
        return (<div className={'client-list-header'} ref="header">{domFilter}</div>)
    }
}
ClientFilterHeader = createForm()(ClientFilterHeader);
export default ClientFilterHeader;

