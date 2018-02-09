import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../components/Form';
//引入select插件
import Select, {Option,ConstVirtualSelect} from '../../../components/Select';
//引入ajax请求
import {API_FOODING_DS, apiPost} from "../../../services/apiCall";

import {I18n} from "../../../lib/i18n";
import xt from '../../../common/xt';

export class  DragEditDialog extends Component{
    constructor(props){
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        // this.onSaveAdd=this.onSaveAdd.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.model = [
            {id:"time",localName:i18n.t(200643/*打卡*/)},
            {id:'transfer',localName:i18n.t(500276/*汇率换算*/)},
            {id:"/schedule",localName:i18n.t(400141/*日程*/)},
            {id:"/activetask",localName:i18n.t(500277/*任务*/)},
            {id:"/businessOpportunity/list",localName:i18n.t(100321/*商机*/)},
            {id:"/salesorder/list",localName:i18n.t(200237/*销售订单*/)},
            {id:"/saleorderprice",localName:i18n.t(200070/*产品价格*/)},
            {id:"/pruchaseneed/list",localName:i18n.t(500278/*采购需求*/)},
            {id:"/seaPrice",localName:i18n.t(500284/*海运运价*/)},
            {id:"/corporationapplylimit/list",localName:i18n.t(200517/*信保限额申请*/)},
            {id:"/sinkrecord",localName:i18n.t(201098/*收汇记录*/)},
            {id:"/Purchasequote/list",localName:i18n.t(200022/*供应商报价*/)},
            {id:"/paymentApplication/list",localName:i18n.t(400040/*付款申请*/)},
            {id:"/pruchaseorder/list",localName:i18n.t(400020/*采购订单*/)},
            {id:'/Booking/list',localName:i18n.t(200373/*物流订单*/)}
        ];

        this.number = [
            {id:"3",localName:"1/4"},
            {id:"4",localName:"1/3"},
            {id:"5",localName:"5/12"},
            {id:"6",localName:"1/2"},
            {id:"7",localName:"7/12"},
            {id:"8",localName:"3/4"},
            {id:"9",localName:"2/3"},
            {id:"10",localName:"5/6"},
            {id:"11",localName:"11/12"},
            {id:"12",localName:"100%"}
        ]
    }
    onSaveAdd(){
        const {form, onSaveAdd} = this.props;
        form.validateFields((errors, value) => {
            if(errors){

            }else{
                this.props.onSaveAdd(this.props.form.getFieldsValue());
                this.props.form.resetFields();
            }
        })
    }
    onSaveAndClose(){
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if(errors){

            }else{
                this.props.onSaveAndClose(this.props.form.getFieldsValue());
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
    componentDidMount(){
        //this.shipInit();
    }
    render(){
        let that = this;
        const { getFieldProps, getFieldError } = this.props.form;
        let {data = {}} = this.props;
        return(
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
                    <div className={'girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-xs-12 col-md-12">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500285/*模块区块*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    isRequest={false}
                                    fieldName="i"
                                    rules
                                    initValueOptions={this.model}
                                    initialValue={data.i}
                                    className="col-md-6 col-lg-6"
                                    disabled
                                />
                            </div>
                            <div className="form-group col-xs-12 col-md-12">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500287/*外观*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    isRequest={false}
                                    fieldName="w"
                                    rules
                                    initValueOptions={this.number}
                                    initialValue={data.w}
                                    className="col-md-6 col-lg-6"
                                />
                            </div>
                            <div className="form-group col-xs-12 col-md-12">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100033/*规格高*/)}</label>
                                <input
                                    type="text"
                                    className={getFieldError('h')?'text-input-nowidth col-md-6 col-lg-6 error-border':'text-input-nowidth col-md-6 col-lg-6'}
                                    {...getFieldProps('h',{
                                        validateFirst: true,
                                        rules: [{required:true,pattern: xt.pattern.positiveInteger}],
                                        initialValue:Number(data.h)
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </FormWrapper>
            </div>
        );
    }
}
DragEditDialog.propTypes ={
    onSaveAdd:PropTypes.func,
    onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
DragEditDialog.defaultProps ={
    onSaveAdd(){},
    onSaveAndClose(){},
    onCancel(){}
}
export default createForm()(DragEditDialog);
