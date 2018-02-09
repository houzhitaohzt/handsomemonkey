import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS , API_FOODING_ERP} from "../../../../../services/apiCall";
import OnlyreadyRuleTemplate from '../../../../../components/OnlyreadyRuleTemplate';
//引入国际化
import i18n, {I18n} from '../../../../../lib/i18n';
import xt from '../../../../../common/xt';
import ServiceTips, {errorTips} from "../../../../../components/ServiceTips";

export class  QuotProDialog extends Component{
    constructor(props){
        super(props);
        let that = this;
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state={
            productData:[]
        }
    }
    onSaveAndClose(){
        const {form, onSaveAndClose , businessOne, updateQuot, billDtlId} = this.props;
        form.validateFields((error, values) => {
            if(error){

            }else{
                let param = !updateQuot ? Object.assign({},{billId:businessOne.id,quoSet: values.quoSet}):Object.assign({},{billId:businessOne.id,billDtlId:billDtlId,quotationAmt:values.quoSet[0].quotationAmt||""});
                let uri = !updateQuot ? "/inquiryquote/save" : "/inquiryquote/changeVersion";
                // /nooquotation/changeVersion replace /inquiryquote/changeVersion
                apiPost(API_FOODING_ERP, uri, param, response => {
                        onSaveAndClose && onSaveAndClose();
                        ServiceTips({text:response.message, type:'success'});
                        this.props.form.resetFields();
                    }, error => {
                        errorTips(error.message);
                    });
            }
        });
    }
    onCancel(){
        this.props.onCancel && this.props.onCancel();
        this.props.form.resetFields();
    }

    componentDidMount(){
        let id = this.props.businessOne.id;
        if(this.props.updateQuot){//表示是单个报价
            let mtlDtlId = this.props.mtlDtlId;
            this.getUpdataQuot(mtlDtlId,id);
        }else{
            this.getListMtl(id);
        }
    }

    /**
     * 变更报价
     * @param billId
     * */
    getUpdataQuot = (mtlDtlId,billId) => {
        if(!mtlDtlId) return;
        let that = this;
        apiGet(API_FOODING_ERP, '/inquiry/mtl/getOne', {id:mtlDtlId},
            response => {
                let obj = response.data || {};
                let arr = [];
                arr.push(obj);
                that.getQuotList(arr,billId);
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 报价产品
     * @param billId
     */
    getListMtl = billId => {
        if(!billId) return;
        let that = this;
        apiGet(API_FOODING_ERP, '/inquiry/mtl/getList', {billId},
            response => {
                that.setState({productData: response.data || []});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 拉取报价
     * @param billId
     */
    getQuotList = (mtlList,billId) => {
      if(!mtlList.length || !billId) return;
      let that = this;
        apiGet(API_FOODING_ERP, '/inquiryquote/getsends', {billId,isSend:false},
            response => {
                that.getProductData(mtlList,response.data || [])
                //this.setState({productData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    getProductData = (mtlList, quotList) => {
        if(quotList.length == 0) {
            this.setState({productData:mtlList});
            return;
        }
        for(let i = 0; i < quotList.length; i++){
            for(let j = 0; j < mtlList.length; j++){
                if(quotList[i].mtlDtlId == mtlList[j].billDtlId){
                    mtlList[j].quotationAmt = quotList[i].quotationAmt;
                }
            }
        }
        let arr = Array.from(mtlList);
        this.setState({productData:arr})
    };


    render(){
        let that = this;
        const { getFieldProps, getFieldError, getNFieldProps, getFieldErrorStyle } = this.props.form;
        let {businessOne, updateQuot} = this.props;
        let cnyLcName = businessOne.cnyLcName || "";
        return(
            <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} buttonLeft={updateQuot?i18n.t(200427/*发送*/):i18n.t(100429/*保存并关闭*/)}>
            <OnlyreadyRuleTemplate
                onCancel ={this.onCancel}
                title ={i18n.t(200021/*询价产品*/)}
                   Zindex ={4}
                   showHeader ={true}
                   checkedRowsArray={[]}
                   id={'sendquotation-detail-01'}
                   columns ={
                       [{
                           title : i18n.t(100377/*产品编码*/),
                           dataIndex : 'code',
                           key : "code",
                           width : '7%',
                           render(data,row,index){
                               return (<div title={data}>{data}</div>)
                           }
                       },
                           {
                               title : i18n.t(500061/*产品名称*/),
                               dataIndex : 'mtlLcName',
                               key : "mtlLcName",
                               width : '10%',
                               render(data,row,index){
                                   return (<div title={data}>{data}</div>)
                               }
                           },
                           {
                               title : i18n.t(100382/*产品规格*/),
                               dataIndex : 'basSpeci',
                               key : "basSpeci",
                               width : '12%',
                               render(data,row,index){
                                   return (<div title={data} className={'text-ellipsis'}>{data}</div>)
                               }
                           },
                           {
                               title : i18n.t(400012/*品牌*/),
                               dataIndex : 'brandLcName',
                               key : "brandLcName",
                               width : '6%',
                               render(data,row,index){
                                   return (<div title={data}>{data}</div>)
                               }
                           },
                           {
                               title : i18n.t(500065/*需求数量*/),
                               dataIndex : 'requireQty',
                               key : "requireQty",
                               width : '6%',
                               render(data,row,index){
                                   return (<div>{data}{row.uomLcName}</div>)
                               }
                           },
                           {
                               title : i18n.t(200009/*目标价*/),
                               dataIndex : "aimPrc",
                               key : "aimPrc",
                               width : "6%",
                               cnyLcName: {cnyLcName},
                               render(data,row,index){
                                   return data + " " + cnyLcName;
                               }
                           },{
                           title : i18n.t(200065/*价格*/),
                           dataIndex : "quotationAmt",
                           key : "quotationAmt",
                           width : "10%",
                           ignore_equals: true,
                           render(data,row,{index}){
                               return (<div><input type='text' style={{width: 80}}
                                                   className={getFieldErrorStyle(`quoSet[${index}].quotationAmt`, 'error-border', 'text-input-nowidth')}
                                                   value={data}
                                                   {...getFieldProps(`quoSet[${index}].quotationAmt`, {
                                                       validateFirst:true,
                                                       rules:[{required:true, pattern: xt.pattern.positiveNonZero}],
                                                       initialValue: xt.isEmpty(data) ? '': data
                                                   })}
                               /><span {...getNFieldProps(`quoSet[${index}].mtlDtlId`, {
                                   initialValue: {
                                       mtlDtlId: row.billDtlId,
                                       s_label: row.billDtlId
                                   }
                               })}> {cnyLcName}</span></div>);
                           }
                       },{
                           title : i18n.t(500067/*包装*/),
                           dataIndex : "packagLcName",
                           key : "packagLcName",
                           width : "15%",
                           render(data,row,index){
                               return data;
                           }
                       },{
                           title : i18n.t(500068/*托盘*/),
                           dataIndex : "salvrLcName",
                           key : "salvrLcName",
                           width : "8%",
                           render(data,row,index){
                               return data;
                           }
                       },{
                           title : i18n.t(500069/*可否混装*/),
                           dataIndex : "isMixed",
                           key : "isMixed",
                           width : "8%",
                           render(data,row,index){
                               return data ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/);
                           }
                       }]
                   }
                   data={this.state.productData || []}
                />
            </FormWrapper>
        );
    }
}
QuotProDialog.propTypes ={
    onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
QuotProDialog.defaultProps ={
    onSaveAndClose(){},
    onCancel(){}
}
const QuotProDialogForm =createForm()(QuotProDialog);
export default QuotProDialogForm;
