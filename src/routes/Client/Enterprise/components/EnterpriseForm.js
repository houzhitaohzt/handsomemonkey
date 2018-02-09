import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option} from '../../../../components/Select';
import Checkbox from "../../../../components/CheckBox";
import Radio from '../../../../components/Radio';
import {API_FOODING_DS, apiPost} from "../../../../services/apiCall";
import Input from '../../../../components/FormValidating/FormValidating';

import {I18n} from "../../../../lib/i18n";

export class  EnterpriseForm extends Component{
    constructor(props){
        super(props);
        let that = this;
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.companyChange=this.companyChange.bind(this);
        this.state={
            companyState:this.props.initData.partner?this.props.initData.partner.type:0,
            clientSelectData:[]
        }
        this.data = null;
    }
    companyChange(e){
        this.setState({
            companyState:e.target.value
        })
    }
    onClientChange = data => {
        if (data.trim() === '') return;
        apiPost(API_FOODING_DS, '/enterprise/search', {dataTyId:this.props.dataTyId,keyword: data}, response => {
            this.setState({clientSelectData: response.data || []});
        }, error => {
            
        })
    };
    componentWillReceiveProps(nextProps){
        //新增
        if(!nextProps.initData.partner) return false;
        //编辑时，根据返回的type类型获取
        if(this.props.initData.partner.type !== nextProps.initData.partner.type){
            this.setState({
                companyState:nextProps.initData.partner.type
            })
        }
    }
    render(){
        let that = this;
        const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
        let {data, initData} = this.props;
        const {prtnTypes} = initData;
        let enterprises =initData.enterprises || [];
        let partner = initData.partner || {};
        this.data = Object.assign({},partner);
        let SelectDom;
        if(this.state.companyState === 0){
            SelectDom = (<div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100528/*公司名称*/)}</label>
                            <Select
                                animation='slide-up'
                                placeholder={I18n.t(100477/*请搜索*/)}
                                className ={getFieldError('prtnBeId')?'currency-btn select-from-currency col-lg-8 col-md-8 error-border':'currency-btn select-from-currency col-lg-8 col-md-8'}
                                choiceTransitionName="rc-select-selection__choice-zoom"
                                optionLabelProp="children"
                                allowClear={false}
                                onSearch={this.onClientChange}
                                {...getNFieldProps('prtnBeId',{
                                    validateFirst: true,
                                    rules: [{required:true,}],
                                    initialValue:partner && partner.enterprise? {id:partner.enterprise,s_label:partner.enterprise.localName}:undefined
                                })}>
                                {this.state.clientSelectData.map(
                                        da => <Option key={da.id} objValue={{
                                            s_label: da.localName,
                                            prtnBeId: da.id,
                                        }}>{da.localName}</Option>
                                    )
                                }
                            </Select>
                    </div>)
        }else{
            SelectDom = (<div className={'row'}>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100528/*公司名称*/)}</label>
                        <input type="text" {...getFieldProps('companyName', {
                            rules: [{required:true,}],
                            valuedateTrigger:"onBlur",
                            initialValue:partner&&partner.companyName?partner.companyName:''
                            })} className ={ getFieldError("companyName") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'} 
                        />	
                    </div>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100370/*联系人*/)}</label>
                        <input type="text" {...getFieldProps('contactor', {
                            rules: [{required:true,}],
                            valuedateTrigger:"onBlur",
                            initialValue:partner&&partner.contactor?partner.contactor:''
                            })} className ={ getFieldError("contactor") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'} 
                        />
                    </div>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-4 col-md-4'}>{I18n.t(100478/*电话*/)}</label>
                         <input type="text" {...getFieldProps('phone', {
                            initialValue:partner&&partner.phone?partner.phone:''
                            })} className ={ getFieldError("phone") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'} 
                        />
                    </div>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-4 col-md-4'}>{I18n.t(100479/*传真*/)}</label>
                        <input type="text" {...getFieldProps('fax', {
                            initialValue:partner&&partner.fax?partner.fax:''
                            })} className ={ getFieldError("fax") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'} 
                        />
                    </div>
                    <div className="form-group col-xs-12 col-md-12">
                        <label className={'col-xs-2 col-md-2'}>{I18n.t(100481/*地址*/)}</label>
                        <input type="text" {...getFieldProps('address', {
                            initialValue:partner&&partner.address?partner.address:''
                            })} className ={ getFieldError("address") ?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'} 
                        />
                    </div>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-4 col-md-4'}>{I18n.t(100123/*默认*/)}</label>
                        <Checkbox
                                {...getNFieldProps('dfutMrk',{
                                    initialValue:partner&&partner.dfutMrk?partner.dfutMrk:false
                            })}
                            checked={this.props.form.getFieldValue('dfutMrk')}
                        />
                    </div>
            </div>) 
        }       
        return(
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976} >
                        <div className="girdlayout">
                            <div className="row">
                                <div className="form-group col-xs-6 col-md-6">
                                        <label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(500431/*关系*/)}</label>
                                        <Select
                                            animation='slide-up'
                                            placeholder={""}
                                            className ={getFieldError('prtnTyId')?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}
                                            choiceTransitionName="rc-select-selection__choice-zoom"
                                            optionLabelProp="children"
                                            {...getNFieldProps('prtnTyId',{
                                                validateFirst: true,
                                                rules: [{required:true,}],
                                                initialValue:partner&&partner.prtnType?partner.prtnType.id:undefined,
                                            })}>
                                            {
                                                prtnTypes.map((e,i) =>{
                                                    return (<Option key={i} value={e.id} title={e.name}>{e.name}</Option>)
                                                })
                                            }
                                        </Select>
                                </div>
                                <div className="form-group col-xs-6 col-md-6" style={{height:"34px"}}>
                                    <label className={'col-xs-4 col-md-4'}></label>
                                    <div className={'col-md-8 col-lg-8'}>
                                        <Radio
                                            name = "type"
                                            checked = {this.state.companyState == 0}                
                                            {...getNFieldProps('type',{
                                                initialValue:0==  this.state.companyState?0:1,
                                                onChange:this.companyChange,
                                                checked:0==this.state.companyState
                                            })}
                                            value ={0}
                                        />
                                        <span className={'radio-text'}>{I18n.t(100486/*公司*/)}</span>
                                        <Radio
                                            name = "type"
                                            checked = {this.state.companyState == 1}
                                            {...getNFieldProps('type',{
                                                initialValue:1==this.state.companyState?1:0,
                                                onChange:this.companyChange,
                                                checked:1==this.state.companyState
                                            })}
                                            value={1}
                                        />
                                        <span className={'radio-text'}>{I18n.t(100488/*其他*/)}</span>
                                    </div>
                                </div>
                                {SelectDom}
                            </div>
                        </div>
                </FormWrapper>
            </div>
            );
    }
    onSaveAndClose(){
        const {form, onSaveAndClose } = this.props;
        form.validateFields((errors, value) => {
            if(errors){

            }else{
                this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.data);
                this.props.form.resetFields();
            }
        })
    }
    onCancel(){
        const {onCancel}=this.props;
        if(onCancel){
            onCancel();
            this.props.form.resetFields();
        }
    }
    onSaveAdd(){
        const {form, onSaveAdd } = this.props;
        form.validateFields((errors, value) => {
            if(errors){

            }else{  
                this.props.onSaveAdd(this.props.form.getFieldsValue(),this.props.data);
                this.props.form.resetFields();
            }
        })
    }
}
EnterpriseForm.propTypes ={
    onSaveAdd:PropTypes.func,
    onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
EnterpriseForm.defaultProps ={
    onSaveAdd(){},
    onSaveAndClose(){},
    onCancel(){}
}
EnterpriseForm =createForm()(EnterpriseForm);
export default EnterpriseForm;
