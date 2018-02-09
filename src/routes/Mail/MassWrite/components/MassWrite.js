import React from 'react';
import i18n from '../../../../lib/i18n';
import ServiceTips from "../../../../components/ServiceTips";//提示框
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import {createForm,FormWrapper} from '../../../../components/Form';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_MAIL_SERVER,API_FOODING_DS,
    API_FOODING_MAIL,language,commonAjax,getQueryString} from '../../../../services/apiCall';
import NavConnect from "../../../../components/NavigateTabs/containers/AddContainer";

import MassTemplate from  './MassTemplate';
export class MassWrite extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            shoujianArray:[],
            isShowLeixing:true
        };
        this.sendMail = this.sendMail.bind(this);
        this.close = this.close.bind(this);
        this.searchCustomer = this.searchCustomer.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onChange(e){
        if(e==80 || e==90){
            this.setState({
                isShowLeixing:false
            })
        }else{
            this.setState({
                isShowLeixing:true
            })
        }
    }
    close(){
        let that = this;
        that.props.navCloseCurrentTab();
    }
    sendMail(){
        let that = this;
        that.normalRef.sendMail();
    }
    searchCustomer(){
        let that = this;
        that.props.form.validateFields((error, value) => {
            if(error){
                console.log(error, value);
            }else{
                if(!value.mtlTyId && !value.cstmTypeId && !value.cstmLvId && !value.cntryId){
                    value = Object.assign({},value,{isDefault:false,isAll:true});
                }else {
                    value = Object.assign({},value,{isDefault:false,isAll:false});
                }
                apiGet(API_FOODING_DS,'/contact/getEnterpriseEmailList',value,(respose)=>{
                    this.setState({
                        shoujianArray:respose.data||[]
                    });
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'});
                })
            }

        });
    }
    render(){
        let that = this;
        return (
            <div className='write-page  srcoll' style={{height:document.body.offsetHeight-80,overflowY:'auto'}}>
                <div className='nav'>
                    <ul>
                        <li onClick={this.sendMail.bind(this,'SEND')}>{i18n.t(200427/*发送*/)}</li>
                        <li onClick ={this.close.bind(this)}>{i18n.t(100432/*关闭*/)}</li>
                    </ul>
                </div>
                <p style={{marginTop:'10px',fontSize: '14px'}}>{i18n.t(700123/*收件对象群*/)+':'}</p>
                <div className="client-list-header">
                    <div className="filter-header">
                        <div className="filter-header-information-pre">
                            <label>{i18n.t(700077/*往来类型*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName="dataTyId"
                                apiType={apiPost}
                                apiHost={API_FOODING_DS}
                                apiUri='/enterprise/getDataTypes'
                                initialValue={''}
                                style={{width:'150px'}}
                                clearable={true}
                                rules={true}
                                onChange={this.onChange}
                            />
                        </div>
                        {
                           this.state.isShowLeixing?<div className="filter-header-information-pre">
                               <label>{i18n.t(500061/*产品名称*/)}</label>
                               <ConstVirtualSelect
                                   form={this.props.form}
                                   fieldName="mtlTyId"
                                   apiType={apiPost}
                                   apiHost={API_FOODING_DS}
                                   initialValue={''}
                                   apiParams={'com.fooding.fc.ds.entity.MtlType'}
                                   style={{width:'150px'}}
                                   clearable={true}
                               />
                           </div>:''
                        }
                        {
                            this.state.isShowLeixing?<div className="filter-header-information-pre">
                                <label>{i18n.t(200080/*类型*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    fieldName="cstmTypeId"
                                    apiType={apiPost}
                                    apiHost={API_FOODING_DS}
                                    apiParams={{obj:"com.fooding.fc.ds.entity.CstmType"}}
                                    initialValue={''}
                                    style={{width:'150px'}}
                                    clearable={true}
                                />
                            </div>:''
                        }
                        {
                            this.state.isShowLeixing?<div className="filter-header-information-pre">
                                <label>{i18n.t(700124/*等级*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    fieldName="cstmLvId"
                                    apiType={apiPost}
                                    apiHost={API_FOODING_DS}
                                    apiParams="com.fooding.fc.ds.entity.CstmLevel"
                                    initialValue={''}
                                    style={{width:'150px'}}
                                    clearable={true}
                                />
                            </div>:''
                        }
                        <div className="filter-header-information-pre">
                            <label>{i18n.t(100087/*国家*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName="cntryId"
                                apiType={apiPost}
                                apiHost={API_FOODING_DS}
                                apiParams="com.fooding.fc.ds.entity.Country"
                                initialValue={''}
                                style={{width:'150px'}}
                                clearable={true}
                            />
                        </div>
                    </div>
                    <div className="filter-header">
                        <div className="filter-header-information-pre" style={{height:'auto'}}>
                            <label style={{color:'#333'}}>{i18n.t(200457/*接受对象*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName='positionIds'
                                apiHost={API_FOODING_DS}
                                multi={true}
                                apiType={apiPost}
                                apiParams={'com.fooding.fc.ds.entity.Positn'}
                                style={{width:'400px'}}
                            />
                        </div>
                        <div className={'filter-header-key'}>
                            <span className="search" onClick={this.searchCustomer}><i className="foddingicon fooding-search_icon"/></span>
                        </div>
                    </div>
                </div>
                <MassTemplate proprs={this.props}
                              normalRef={no => this.normalRef = no}
                              shoujianArray ={this.state.shoujianArray}
                              router ={this.props.router}
                />
            </div>
        )
    }
}
export default createForm()(NavConnect(MassWrite));