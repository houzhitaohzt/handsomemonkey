import i18n, {I18n } from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import Select, {ConstVirtualSelect,Option ,ConstMiniSelect} from '../../../../components/Select'; // 下拉

import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_MAIL,API_FOODING_ERP,API_FOODING_HR} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import FilterHeader from "./FilterHeader";
import UsetheSetoffPlug from './UsetheSetoffPlug';
//复选框
import Checkbox from '../../../../components/CheckBox';
import WebData from "../../../../common/WebData";
class PriceParameters extends Component {
    constructor(props) {
        super(props)
        var that = this;
        this.alterClick=this.alterClick.bind(this);
        this.initOneData =this.initOneData.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.state = {
            data:{},
            rodalShow:false,

        }

    }



    componentDidMount() {
        this.initOneData();
    };

    componentWillUnmount() {
    }

    //初始化数据
    initOneData = () => {
        apiGet(API_FOODING_HR,'/adjustvacation/getOne',{ccId:WebData.user.data.staff.company.id},(response)=>{
            let getOneData = response.data || {};
            this.setState({data:getOneData})
        },(error)=>{
            ServiceTips({text:error.message, tyep:'error'})
        })
    };


    onSaveAndClose(bool){
        var that = this;
        this.initOneData();
        !bool && this.onCancel();
    }
    onCancel = (that) =>{
        this.setState({
            rodalShow:false
        })
    }

    alterClick=() =>{
        this.setState({
            rodalShow : true,
            showHeader:true,
            title:'调休使用设置编辑',
            showSaveAdd:false,
            showSaveClose:true,
            DialogContent:3,
            getOneData:this.state.data
        })

    }
    render() {
        let data = this.state.data || {};
        let {form} = this.props;
        const { getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
        return (
            <div style={{padding:'10px'}}>
                <div className='addnormal' style={{padding:"0 20px"}}>
                    <div className={'addnormal-title'}>
                        <span>调休使用设置</span>
                        <span onClick={this.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-alter'}></i></span>
                    </div>
                    <div className={'girdlayout'} style={{paddingBottom:'20px',paddingTop:'30px'}}>
                        <div className={'row'}>
                            <div className="col-md-12">
                                <label className={'col-md-3 col-md-offset-3'}  >集团</label>
                                <div className={'col-md-6'}>
                                    <ConstVirtualSelect
                                        form={this.props.form}
                                        apiHost={API_FOODING_ES}
                                        apiUri="/party/getLoginClusters"
                                        fieldName="cluster"
                                        initialValue={xt.initSelectValue(true, WebData.user.data.staff.cluster, ['cluster'], 'localName', form, true)}
                                        valueKeys={da => ({
                                            ...da,
                                            s_ignore_label: true
                                        })} disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="col-md-12">
                                <label className={'col-md-3 col-md-offset-3'}>企业</label>
                                <div className={'col-md-6'}>
                                    <ConstVirtualSelect
                                        apiHost={API_FOODING_ES}
                                        form={this.props.form}
                                        apiUri='/party/getLoginCompanies'
                                        apiParams={{clusId: WebData.user.data.staff.clusId}}
                                        rules={true}
                                        fieldName="company"
                                        initialValue={xt.initSelectValue(true, WebData.user.data.staff.company, ['company'], 'localName', form, true)}
                                        valueKeys={da => ({
                                            ...da,
                                            s_ignore_label: true
                                        })}
                                        disabled={true}

                                    />
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-12 col-lg-12">
                                <label className={'col-md-3 col-md-offset-3'}>调休使用失效日</label>
                                <div className={'col-md-6 col-lg-6'}>
                                    {data.choose?<p className={'paragraph col-md-4 col-lg-4'}>加班后{data.validDays?data.validDays:''}天内修完</p>: <div className={'col-md-4 col-lg-4'}>
                                        <span className={'paragraph col-md-4 col-lg-4'}>下个年度&nbsp;&nbsp;{data.month?data.month:''}月</span> <span className={'paragraph col-md-4 col-lg-4'} style={{float:'left'}}> {data.date?data.date:''}日</span>
                                    </div>}


                                </div>
                            </div>
                        </div>
                        <div style={{borderBottom:'1px solid rgb(204, 204, 204)',paddingTop:'300px'}}></div>
                        </div>
                    </div>
                    <Dialog width={926}  visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
                        <UsetheSetoffPlug DialogContent={this.state.DialogContent}
                            checkedData = {this.state.checkedData}
                                          getOneData={this.state.getOneData}
                            info = {this.state.info}
                            showSaveAdd ={this.state.showSaveAdd}
                            showSaveClose={this.state.showSaveClose}
                            buttonLeft = {this.state.buttonLeft}
                            upload ={this.getPage}
                                          oneData = {this.state.data}
                            onSaveAndClose ={this.onSaveAndClose}
                            contentDate = {this.state.contentDate}
                            onCancel = {this.onCancel}/>
                    </Dialog>
            </div>)
    }
}


PriceParameters =createForm()(PriceParameters);
export default PriceParameters;
