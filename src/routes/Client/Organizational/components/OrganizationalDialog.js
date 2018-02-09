import i18n from './../../../../lib/i18n';
import React from 'react'
import ServiceTips from "../../../../components/ServiceTips";//提示框
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import {createForm,FormWrapper} from '../../../../components/Form';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_MAIL_SERVER,API_FOODING_DS,
    API_FOODING_MAIL,language,commonAjax,getQueryString} from '../../../../services/apiCall';
import Checkbox from "../../../../components/CheckBox";

export class MassWrite extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            shoujianArray:[]
        };
        this.onSaveClick = this.onSaveClick.bind(this);
        this.isAll = undefined;
    }
    onSaveClick(){
        //发送
        this.props.form.validateFields((error, value) => {
            if(error){
                console.log(error, value);
            }else{
                apiPost(API_FOODING_DS,'/enterpriseOrg/save',value,(response)=>{
                    ServiceTips({text:response.message,type:'success'});
                    this.props.onSaveAndClose && this.props.onSaveAndClose();
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'});
                })
            }
        });
    }

    render(){
        let that = this;
        let {type,menuData,relationship,dataTyId} = that.props;
        let {getFieldProps} = this.props.form;
        getFieldProps('orgnizationTypeId', {
            initialValue: type
        });
        getFieldProps('dataTyId', {
            initialValue: dataTyId
        });
        getFieldProps('selfId', {
            initialValue: menuData.orgCompanyId
        });
        return (
            <FormWrapper showFooter={true} onCancel={this.props.onCancel} buttonLeft ={i18n.t(500269/*创建*/)} onSaveAndClose={this.onSaveClick}>
                <div className='write-page  srcoll common-add'>
                    <div className={'col-xs-12'}>
                        <label className={'add-label'} style={{float:'left',marginRight:'10px'}}>{i18n.t(300083/*组织关系*/)}</label>
                        <p className="col-xs-8 col-md-8" style={{paddingLeft:0}}>{relationship}</p>
                    </div>
                    {
                        !this.props.form.getFieldValue("unknown",false)?<div className={'col-xs-12'} style={{marginBottom:10}}>
                            <label className={'add-label'} style={{float:'left',marginRight:'10px'}}><span>*</span>{i18n.t(100528/*公司名称*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiUri={'/enterprise/search?dataTyId='+dataTyId}
                                apiType={apiPost}
                                style={{width: 320}}
                                onChange={this.selectOneCus}
                                rules ={true}
                                async={true}
                                apiParams='keyword'
                                fieldName='orgCompanyId'
                            />
                        </div>:null
                    }
                    {type == 0?<div className={'col-xs-12'}>
                        <label className={'add-label'} style={{float: 'left', marginRight: '10px'}}>{i18n.t(500270/*未知*/)}</label>
                        <div className={'col-xs-8 col-md-8'} style={{paddingLeft: 0}}>
                            <Checkbox
                                {...getFieldProps('unknown', {
                                    initialValue: false,
                                })}
                                checked={this.props.form.getFieldValue("unknown") ? true : false}
                            />
                        </div>
                    </div> :''
                    }
                </div>
            </FormWrapper>
        )
    }
}
export default createForm()(MassWrite);