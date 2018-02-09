import i18n from '../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import Calendar from  '../../../../components/Calendar/Calendar';
import PriceProductMore from '../../../Client/List/components/PriceProductMore';
import Table from  "../../../../components/Table";
import Checkbox from "../../../../components/CheckBox";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips, {errorTips} from '../../../../components/ServiceTips';
import xt from '../../../../common/xt'; // 下拉
import AddMoreLanguage from "../../../../components/AddMoreLanguage";
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";
export class  ContactDialog extends Component{
    constructor(props){
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.statusClick = this.statusClick.bind(this);
        this.lbizPrnClick = this.lbizPrnClick.bind(this);
    }
    initState(){
        return {
            data:{main:{
                bizEntprisCode:"CUS001608150056",
                bizEntprisName:'DaD',
                bizEntprisCntryId:i18n.t(200465/*还原胶*/),
                country:i18n.t(200464/*曼恩岛*/)
            },
            },
            columns_party:[{
                title : i18n.t(100324/*订单*/),
                dataIndex : "code",
                key : "code",
                width : "40%",
                render(data,row,index){
                    return (<div className="text-ellipsis" title={data}>{data}</div>);
                }
            },{
                title : i18n.t(100304/*主题*/),
                dataIndex : 'name',
                key : "name",
                width : '40%',
                render(data,row,index){
                    return (<div className="text-ellipsis" title={data}>{data}</div>)
                }
            },{
                title : i18n.t(500023/*订单日期*/),
                dataIndex : "day",
                key : "day",
                width : "20%",
                render(data,row,index){
                    return data;
                }
            }],
            tableSources:[],
            statusArray:[],
            lbizPrns:[],
            checkedData:this.props.data && this.props.data.record ? this.props.data.record:{}
        }
    }
    lbizPrnClick(){
        var that = this;
        let {checkedData} = this.state;
        if(checkedData.beId){
            apiGet(API_FOODING_DS,'/entContact/getByBeIdDataTyId',{beId:checkedData.beId,dataTyId:100},
                (response)=>{
                    that.setState({
                        lbizPrns:response.data
                    });
                },(errors)=>{
                });
        }
    }
    onSaveAndClose(){
        var that = this;
        let {checkedData} = this.state;
        this.props.form.validateFields((error, value) => {
            if(error){
                console.log(error, value);
            }else{
                let aa = checkedData;
                let defaultEmailId = aa.defaultEmail?aa.defaultEmail.id:undefined;
                let defaultEmailOptlock = aa.defaultEmail?aa.defaultEmail.optlock:undefined;
                let defaultMobileId = aa.defaultMobile?aa.defaultMobile.id:undefined;
                let defaultMobileOptlock = aa.defaultMobile?aa.defaultMobile.optlock:undefined;
                let defaultSkypeId = aa.defaultSkype?aa.defaultSkype.id:undefined;
                let defaultSkypeOptlock = aa.defaultSkype?aa.defaultSkype.optlock:undefined;
                var contactList = [
                    {name:value.email,isOfferRec:aa.defaultEmail?aa.defaultEmail.isOfferRec:false,linkTyId:80,dfutMark:true,id:defaultEmailId,optlock:defaultEmailOptlock,dataTyId:this.props.dataTyId},
                    {name:value.defaultMobile,linkTyId:100,dfutMark:true,id:defaultMobileId,optlock:defaultMobileOptlock,dataTyId:this.props.dataTyId},
                    {name:value.skype,linkTyId:110,dfutMark:true,id:defaultSkypeId,optlock:defaultSkypeOptlock,dataTyId:this.props.dataTyId}];
                delete value.email;
                delete value.defaultMobile;
                delete value.skype;
                value = Object.assign({},checkedData,value,{contactList:contactList});
                value = Object.assign({},value,{beId:this.props.id});
                apiPost(API_FOODING_DS,'/entContact/save',value,(response)=>{
                    ServiceTips({text:response.message,type:'sucess'});
                    that.props.onSaveAndClose(value,checkedData);
                    that.props.form.resetFields();
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'});
                })

            }

        });
    }
    onCancel(){
        const {form}=this.props;
        this.props.onCancel();
        form.resetFields();
    }

    statusClick(){
        var that = this;
        apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.WorkingState'},
            (response)=>{
                that.setState({
                    statusArray:response.data
                });
            },(error)=>{

            });
    }


    onCusChange = value => {
        let that = this;
        let dataType = this.props.data;
        apiGet(API_FOODING_DS, '/country/getOne', {
            id: value.cntryId
        }, ({data}) => {
            if(dataType.type == 2){
                console.log('xianz')
                let country = Object.assign({}, that.state.checkedData.country,{ localeCode: data.locale && data.locale.code ? data.locale.code :"",
                    locale: data.locale && data.locale.name ? data.locale.name :"" });
                let checkedAAA = Object.assign({},that.state.checkedData, {country});
                that.setState({checkedData:checkedAAA});
            }else if(dataType.type == 5){
               let locale = Object.assign({}, that.state.checkedData.locale,{ id: data.locale && data.locale.code ? data.locale.code :"",
                    name: data.locale && data.locale.name ? data.locale.name :"" });
                let checkeBBB = Object.assign({},that.state.checkedData, {locale});
                that.setState({checkedData:checkeBBB});
            }


        }, (error) => {
            errorTips(error.message);
        })
    };

    componentDidMount(){
        this.statusClick();
    }
    render(){
        let that = this;
        const { getFieldProps, getFieldError,getNFieldProps,getFieldValue} = this.props.form;
        let {checkedData} = this.state;
        let {data,pageIdent} = this.props;
        let content = <div></div>;
        getFieldProps('dataTyId', {
            initialValue:this.props.dataTyId
        })
        let common1 = <div></div>;

        if(checkedData.id){
            common1 =<AddMoreLanguage
                menusetView={checkedData}
                object = {'entprisContact'}
                upload={this.props.onSaveAndClose}
                onCancel ={this.onCancel}
            />
        }
        let common =<div></div>;

        if( (this.props.dataTyId == 100) && (pageIdent != 'client')) {
            common=(<span><label style={{width:200,paddingRight:10}}>{i18n.t(300014/*是否接受自动报价*/)}</label>
													<Checkbox
                                                        {...getFieldProps('isOfferRec',{
                                                            initialValue:checkedData.isOfferRec?checkedData.isOfferRec:false
                                                        })}
                                                        checked={this.props.form.getFieldValue("isOfferRec")?true:false}
                                                    /></span>);
        }
        if(data.type == 2){
            checkedData.maryType = checkedData.maryType ||{};
            checkedData.country = checkedData.country||{};
            checkedData.sex = checkedData.sex||{};
            checkedData.lbizPrn = checkedData.lbizPrn||{};
            checkedData.depmnt = checkedData.depmnt || {};
            checkedData.positn = checkedData.positn || {};
            let demp = getFieldValue("depmntId",{}).depmntId || checkedData.depmnt.id;
            let beId = checkedData.enterprise?checkedData.enterprise.id:'';

            content = (
                <div className="contact-edit scroll" style={{maxHeight: '344px'}}>
                    <div className="girdlayout">
                        <div className="row">
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100000/*代码*/)}</label>
                                <input type="text"
                                       placeholder={i18n.t(100378/*自动生成*/)}
                                       {...getFieldProps('code', {
                                           initialValue:checkedData.code?checkedData.code:''
                                       })} className='text-input-nowidth col-md-8 col-lg-8' readOnly/>
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100229/*邮箱*/)}</label>
                                <input type="text"
                                       placeholder=''
                                       {...getFieldProps('email', {
                                           validateFirst: true,
                                           rules: [{required: true,pattern:(/[@]/g)}],
                                           initialValue:checkedData.defaultEmail&&checkedData.defaultEmail.localName?checkedData.defaultEmail.localName:''
                                       })} className={getFieldError('email')?'text-input-nowidth col-md-8 col-lg-8 error-border':'text-input-nowidth col-md-8 col-lg-8'} />
                            </div>

                        </div>
                        <div className="row">
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100231/*姓名*/)}</label>
                                <NameCheck
                                    form={this.props.form}
                                    fieldName='localName'
                                    rules={true}
                                    initialValue={checkedData.localName?checkedData.localName:''}
                                    className={'col-md-8 col-lg-8'}
                                />
                                {common1}
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(300009/*手机*/)}</label>
                                <input type="text"
                                       placeholder=''
                                       {...getFieldProps('defaultMobile', {
                                           rules: [{pattern:(/^\s*\+?\s*(\(\s*\d+\s*\)|\d+)(\s*-?\s*(\(\s*\d+\s*\)|\s*\d+\s*))*\s*$/g)}],
                                           initialValue:checkedData.defaultMobile&&checkedData.defaultMobile.localName?checkedData.defaultMobile.localName:''
                                       })} className={'text-input-nowidth col-md-8 col-lg-8'} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100239/*性别*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.Sex'}
                                                 }} fieldName="sexId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(checkedData.sex.id, {sexId:checkedData.sex.id, ...checkedData.sex}, ['sexId'], 'name', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     sexId: da.id,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>} reles={true}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>Skype</label>
                                <input type="text"
                                       placeholder=''
                                       {...getFieldProps('skype', {
                                           initialValue:checkedData.defaultSkype&&checkedData.defaultSkype.localName?checkedData.defaultSkype.localName:''
                                       })} className="text-input-nowidth col-md-8 col-lg-8" />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(300010/*婚姻状况*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.MaryType'}
                                                 }} fieldName="maryTypeId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(checkedData.maryType.id,{maryTypeId:checkedData.maryType.id,...checkedData.maryType}, ['maryTypeId'], 'name', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     maryTypeId: da.id,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />

                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(300011/*出生日期*/)}</label>
                                <div className='col-md-8 col-lg-8 datetime'>
                                    <Calendar width={'100%'}
                                              showTime = {false}
                                              value ={checkedData.birthDate}
                                              isShowIcon={true}
                                              name={'birthDate'}
                                              form={this.props.form}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(300012/*国籍*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 onChange={this.onCusChange}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Country'}
                                                 }} fieldName="cntryId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(checkedData.country.id,{cntryId:checkedData.country.id,...checkedData.country}, ['cntryId'], 'localName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     cntryId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100238/*部门*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Depmnt'}
                                                 }} fieldName="depmntId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(checkedData.depmnt || "5972a5940cf2ef8372a3bb7d", {
                                                         depmntId: checkedData.depmnt && checkedData.depmnt.id ? checkedData.depmnt.id : "5972a5940cf2ef8372a3bb7d",
                                                         localName: checkedData.depmnt && checkedData.depmnt.localName ? checkedData.depmnt.localName : i18n.t(500326/*采购部*/)
                                                     }, ['depmntId'], 'localName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     depmntId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles ={true}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100227/*职务*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 isRequest={Boolean(getFieldValue("depmntId",{}).depmntId||checkedData.depmnt.id)}
                                                 refreshMark={getFieldValue("depmntId",{}).depmntId+checkedData.depmnt.id}
                                                 pbj={{apiType: apiGet, host: API_FOODING_DS, uri: '/positn/getPositnsByDepmntId',
                                                     params: {depmntId:getFieldValue("depmntId",{}).depmntId||checkedData.depmnt.id}
                                                 }} fieldName="positnId"
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     positnId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 reles={true}
                                                 initialValue={
                                                     xt.initSelectValue(getFieldValue('depmntId', {}).depmntId === (checkedData.depmnt.id || "5972a5940cf2ef8372a3bb7d" ), {
                                                         positnId: checkedData.positn.id || "583ced06d1072ad765871af2",
                                                         localName: checkedData.positn.localName || i18n.t(500341/*采购专员*/)
                                                     }, ['positnId'], 'localName', this.props.form)}
                                                 className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}

                                />
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100228/*在职状态*/)}</label>
                                <Select
                                    {...getNFieldProps('status',{
                                        validateFirst: true,
                                        rules: [{required:true,}],
                                        valuedateTrigger:"onBlur",
                                        initialValue:checkedData.workingState?{s_label:checkedData.workingState.name,status:checkedData.workingState.id}:{s_label:i18n.t(201206/*正式*/),status:10}
                                    })}
                                    optionLabelProp="children"
                                    optionFilterProp="children"
                                    className ={getFieldError('status')?'currency-btn select-from-currency col-md-8 col-lg-8  error-border' :'currency-btn select-from-currency col-md-8 col-lg-8'}
                                    onClick={this.statusClick}
                                >
                                    {
                                        this.state.statusArray.map((e,i)=>{
                                            return <Option value ={String(e.id)} title={e.name} key={i}>{e.name}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(300013/*领导人*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 isRequest={true}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/entContact/getByBeIdDataTyId',
                                                     params: {beId:this.props.id,dataTyId:this.props.dataTyId,id:checkedData.id}
                                                 }} fieldName="lbizPrnId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(checkedData.lbizPrn, {s_label:checkedData.lbizPrn.localName,...checkedData.lbizPrn}, ['lbizPrnId'],'localName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     lbizPrnId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(100372/*主联系人*/)}</label>
                                <Checkbox
                                    {...getFieldProps('dfutMark',{
                                        initialValue:checkedData.dfutMark?checkedData.dfutMark:false
                                    })}
                                    checked={this.props.form.getFieldValue("dfutMark")?true:false}
                                />
                                {common}
                            </div>
                        </div>
                        <div className='row'>

                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(500334/*母语*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 refreshMark={getFieldValue("cntryId",{}).cntryId +''+checkedData.motherLanguage+''+checkedData.country.motherLanguage}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Locale'}
                                                 }} fieldName="motherLanguage"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(checkedData.country || checkedData.motherLanguage,{motherLanguage:checkedData.country.localeCode,locale: checkedData.country.locale}, ['motherLanguage','locale'], 'locale', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     motherLanguage: da.code,
                                                     locale:da.name,
                                                     s_label:da.name
                                                 }}>{da.name}</Option>}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(300015/*首选联系方式*/)}</label>
                                <ConstVirtualSelect form={this.props.form}
                                                    apiType={apiPost}
                                                    apiParams="com.fooding.fc.enumeration.ContactType"
                                                    fieldName="contactTypeId"
                                                    initRequest
                                                    initialValue={checkedData.contactType?checkedData.contactType.id:0}
                                                    rules={true}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(100002/*描述*/)}</label>
                                <input type="text"
                                       placeholder=''
                                       {...getFieldProps('description', {

                                           initialValue:checkedData.description?checkedData.description:''
                                       })} className={'text-input-nowidth col-md-8 col-lg-8'} />
                            </div>
                        </div>

                        </div>
                </div>
            );
        }else if(data.type == 3){
            content = (
                <div className="contact-offer scroll">
                    <PriceProductMore />
                </div>
            );
        }else if(data.type  == 4){
            content = (
                <div  className='send'>
                    <div className="client-party-table">
                        <FreeScrollBar style={{height:"284px"}} className="scroll-style">
                            <Table
                                columns={this.state.columns_party}
                                data={this.state.tableSources}
                                checkboxConfig={{show:false}}
                                colorFilterConfig={{show:false}}
                                followConfig={{show:false}}
                                prefixCls={"rc-confirm-table"}
                                scroll={{x:false, y:250}}
                            />
                        </FreeScrollBar>
                    </div>
                </div>
            );
        }else if(data.type  == 5){
            checkedData.maryType = checkedData.maryType ||{};
            checkedData.country = checkedData.country||{};
            checkedData.sex = checkedData.sex||{};
            checkedData.lbizPrn = checkedData.lbizPrn||{};
            checkedData.depmnt = checkedData.depmnt || {};
            checkedData.positn = checkedData.positn || {};
            checkedData.motherLanguage = checkedData.motherLanguage || {};
            checkedData.locale = checkedData.locale || {};
            let demp = getFieldValue("depmntId",{}).depmntId || checkedData.depmnt.id;
            let beId = checkedData.enterprise?checkedData.enterprise.id:'';
            content = (
                <div className="contact-edit scroll" style={{maxHeight: '344px'}}>
                    <div className="girdlayout">
                        <div className="row">
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100000/*代码*/)}</label>
                                <input type="text"
                                       placeholder={i18n.t(100378/*自动生成*/)}
                                       {...getFieldProps('code', {
                                           initialValue:checkedData.code?checkedData.code:''
                                       })} className='text-input-nowidth col-md-8 col-lg-8' readOnly/>
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100229/*邮箱*/)}</label>
                                <input type="text"
                                       placeholder=''
                                       {...getFieldProps('email', {
                                           validateFirst: true,
                                           rules: [{required: true,pattern:(/[@]/g)}],
                                           initialValue:checkedData.defaultEmail&&checkedData.defaultEmail.localName?checkedData.defaultEmail.localName:''
                                       })} className={getFieldError('email')?'text-input-nowidth col-md-8 col-lg-8 error-border':'text-input-nowidth col-md-8 col-lg-8'} />
                            </div>

                        </div>
                        <div className="row">
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100231/*姓名*/)}</label>
                                <NameCheck
                                    form={this.props.form}
                                    fieldName='localName'
                                    rules={true}
                                    initialValue={checkedData.localName?checkedData.localName:''}
                                    className={'col-md-8 col-lg-8'}
                                />
                                {common1}
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(300009/*手机*/)}</label>
                                <input type="text"
                                       placeholder=''
                                       {...getFieldProps('defaultMobile', {
                                           rules: [{pattern:(/^\s*\+?\s*(\(\s*\d+\s*\)|\d+)(\s*-?\s*(\(\s*\d+\s*\)|\s*\d+\s*))*\s*$/g)}],
                                           initialValue:checkedData.defaultMobile&&checkedData.defaultMobile.localName?checkedData.defaultMobile.localName:''
                                       })} className={'text-input-nowidth col-md-8 col-lg-8'} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100239/*性别*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.Sex'}
                                                 }} fieldName="sexId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(checkedData.sex.id, {sexId:checkedData.sex.id, ...checkedData.sex}, ['sexId'], 'name', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     sexId: da.id,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>} reles={true}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>Skype</label>
                                <input type="text"
                                       placeholder=''
                                       {...getFieldProps('skype', {
                                           initialValue:checkedData.defaultSkype&&checkedData.defaultSkype.localName?checkedData.defaultSkype.localName:''
                                       })} className="text-input-nowidth col-md-8 col-lg-8" />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(300010/*婚姻状况*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.MaryType'}
                                                 }} fieldName="maryTypeId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(checkedData.maryType.id,{maryTypeId:checkedData.maryType.id,...checkedData.maryType}, ['maryTypeId'], 'name', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     maryTypeId: da.id,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />

                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(300011/*出生日期*/)}</label>
                                <div className='col-md-8 col-lg-8 datetime'>
                                    <Calendar width={'100%'}
                                              showTime = {false}
                                              value ={checkedData.birthDate}
                                              isShowIcon={true}
                                              name={'birthDate'}
                                              form={this.props.form}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(300012/*国籍*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 onChange={this.onCusChange}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Country'}
                                                 }} fieldName="cntryId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(checkedData.country.id,{cntryId:checkedData.country.id,...checkedData.country}, ['cntryId'], 'localName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     cntryId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100238/*部门*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Depmnt'}
                                                 }} fieldName="depmntId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(checkedData.depmnt || "5927f4bdeba6e648b43b94aa", {
                                                         depmntId: checkedData.depmnt && checkedData.depmnt.id ? checkedData.depmnt.id : "5927f4bdeba6e648b43b94aa",
                                                         localName: checkedData.depmnt && checkedData.depmnt.localName ? checkedData.depmnt.localName : i18n.t(500326/*采购部*/)
                                                     }, ['depmntId'], 'localName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     depmntId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles ={true}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100227/*职务*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 isRequest={Boolean(getFieldValue("depmntId",{}).depmntId||checkedData.depmnt.id)}
                                                 refreshMark={getFieldValue("depmntId",{}).depmntId+checkedData.depmnt.id}
                                                 pbj={{apiType: apiGet, host: API_FOODING_DS, uri: '/positn/getPositnsByDepmntId',
                                                     params: {depmntId:getFieldValue("depmntId",{}).depmntId||checkedData.depmnt.id}
                                                 }} fieldName="positnId"
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     positnId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 reles={true}
                                                 initialValue={
                                                     xt.initSelectValue(getFieldValue('depmntId', {}).depmntId === (checkedData.depmnt.id || "5972a5940cf2ef8372a3bb7d" ), {
                                                         positnId: checkedData.positn.id || "583ced06d1072ad765871af2",
                                                         localName: checkedData.positn.localName || i18n.t(500341/*采购专员*/)
                                                     }, ['positnId'], 'localName', this.props.form)}
                                                 className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}

                                />
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100228/*在职状态*/)}</label>
                                <Select
                                    {...getNFieldProps('status',{
                                        validateFirst: true,
                                        rules: [{required:true,}],
                                        valuedateTrigger:"onBlur",
                                        initialValue:checkedData.workingState?{s_label:checkedData.workingState.name,status:checkedData.workingState.id}:{s_label:i18n.t(201206/*正式*/),status:10}
                                    })}
                                    optionLabelProp="children"
                                    optionFilterProp="children"
                                    className ={getFieldError('status')?'currency-btn select-from-currency col-md-8 col-lg-8  error-border' :'currency-btn select-from-currency col-md-8 col-lg-8'}
                                    onClick={this.statusClick}
                                >
                                    {
                                        this.state.statusArray.map((e,i)=>{
                                            return <Option value ={String(e.id)} title={e.name} key={i}>{e.name}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(300013/*领导人*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 isRequest={true}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/entContact/getByBeIdDataTyId',
                                                     params: {beId:this.props.id,dataTyId:this.props.dataTyId,id:checkedData.id}
                                                 }} fieldName="lbizPrnId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(checkedData.lbizPrn, {s_label:checkedData.lbizPrn.localName,...checkedData.lbizPrn}, ['lbizPrnId'],'localName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     lbizPrnId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(100372/*主联系人*/)}</label>
                                <Checkbox
                                    {...getFieldProps('dfutMark',{
                                        initialValue:checkedData.dfutMark?checkedData.dfutMark:false
                                    })}
                                    checked={this.props.form.getFieldValue("dfutMark")?true:false}
                                />
                                {common}
                            </div>
                        </div>
                        <div className='row'>

                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(500334/*母语*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 refreshMark={getFieldValue("cntryId",{cntryId:checkedData.country&&checkedData.country.id}).cntryId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Locale'}
                                                 }} fieldName="motherLanguage"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                     xt.initSelectValue(getFieldValue('cntryId',{cntryId:checkedData.country&&checkedData.country.id}).cntryId ,
                                                         {motherLanguage:checkedData.locale.id  ,locale: checkedData.locale.name},
                                                          ['motherLanguage','locale'],
                                                         'locale', this.props.form)}

                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     motherLanguage: da.code,
                                                     locale:da.name,
                                                     s_label:da.name
                                                 }}>{da.name}</Option>}
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'

                                />
                            </div>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(300015/*首选联系方式*/)}</label>
                                <ConstVirtualSelect form={this.props.form}
                                                    apiType={apiPost}
                                                    apiParams="com.fooding.fc.enumeration.ContactType"
                                                    fieldName="contactTypeId"
                                                    initRequest
                                                    initialValue={checkedData.contactType?checkedData.contactType.id:0}
                                                    rules={true}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col-xs-6 col-md-6'>
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(100002/*描述*/)}</label>
                                <input type="text"
                                       placeholder=''
                                       {...getFieldProps('description', {

                                           initialValue:checkedData.description?checkedData.description:''
                                       })} className={'text-input-nowidth col-md-8 col-lg-8'} />
                            </div>
                        </div>

                    </div>
                </div>
            );
        }else if(data.type  == 6){
            content = (
                <div  className='send'>
                    <div className="client-party-table">
                        <FreeScrollBar style={{height:"284px"}} className="scroll-style">
                            <Table
                                columns={this.state.columns_party}
                                data={this.state.tableSources}
                                checkboxConfig={{show:false}}
                                colorFilterConfig={{show:false}}
                                followConfig={{show:false}}
                                prefixCls={"rc-confirm-table"}
                                scroll={{x:false, y:250}}
                            />
                        </FreeScrollBar>
                    </div>
                </div>
            );
        }
        return(
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
                    {content}
                </FormWrapper>
            </div>
        );
    }
}
const DialogFrom =createForm()(ContactDialog);
export default DialogFrom;
