import i18n from '../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect} from '../../../../../components/Select';
import DataTime from  '../../../../../components/Calendar/Calendar';
import Radio from '../../../../../components/Radio';
import AddSelect from '../../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../../components/Dialog/Confirm';
import ServiceTips from '../../../../../components/ServiceTips';
import Calendar from  '../../../../../components/Calendar/Calendar';
import {
    apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS, language, pageSize, sizeList,
    API_FOODING_ES
} from '../../../../../services/apiCall';
import xt from "../../../../../common/xt";
export class AirPricePlug extends Component{
    constructor(props){
        super(props);
        this.state= this.initState(props);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.leixingClick=this.leixingClick.bind(this);
        this.planeIndex = 0;
    }

    initState = (props = {}) =>{
        return {
            leixingArray:[],
            data:{},
            getOne: props.getOne || {},
            priceArray:[]
        }
    };
    leixingClick(){
        var that = this;
        apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.ExeNumType'},
            (response)=>{
                that.setState({
                    leixingArray:response.data
                })
            },(error)=>{

            });
    }
    componentDidMount(){
        let that = this;

        apiGet(API_FOODING_ERP,'/specimen/mtl/getList',
            {billId:this.props.data.billId},(response)=>{
                this.setState({
                    priceArray:response.data.length>0?response.data:[{}]
                });
            },(error)=>{

            });
    }
    onSaveAndClose(isAdd){
        let that = this;
        this.props.form.validateFields((error, value) => {

            if(error){
                console.log(error, value);
            }else{
                console.log(value);
                apiPost(API_FOODING_ERP,'/specimen/feedback',value,(response)=>{
                    ServiceTips({text:response.message,type:'sucess'});
                    that.onCancel();
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'});
                });
            }

        });
    }
    onCancel(){
        this.setState({...this.initState()});
        this.props.form.resetFields();
        this.props.onCancel();
    }
    componentWillReceiveProps(props){
        if((props.getOne || {}).billDtlId !== (this.state.getOne || {}).billDtlId){

            this.setState({getOne: props.getOne||{}});
        }

    }
    render(){
        let that = this;
        const { getFieldProps, getFieldError,getFieldValue,getNFieldProps} = this.props.form;
        let {getTermModes,data} = this.props;
        let {getOne}= this.state;
        let initData = this.props.otherData ||{};
        let content = <div></div>;
        let common =<div></div>;
        let priceArray = this.state.priceArray;
        let lastIndex = -1;
        common=priceArray.map((e,i)=>{
            if( !e) return e;
            getFieldProps('mtlList['+i+'].updateDate', {
                validateFirst: true,
                initialValue:e.updateDate
            })
            getFieldProps('mtlList['+i+'].createDate', {
                validateFirst: true,
                initialValue:e.createDate
            })
            getFieldProps('mtlList['+i+'].baseQty', {
                validateFirst: true,
                initialValue:e.baseQty
            })
            getFieldProps('mtlList['+i+'].specOptStatus', {
                validateFirst: true,
                initialValue:e.specOptStatus
            })
            getFieldProps('mtlList['+i+'].optlock', {
                validateFirst: true,
                initialValue:e.optlock
            })
            getFieldProps('mtlList['+i+'].opackQty', {
                validateFirst: true,
                initialValue:e.opackQty
            })
            getFieldProps('mtlList['+i+'].problemDesc', {
                validateFirst: true,
                initialValue:e.problemDesc
            })
            getFieldProps('mtlList['+i+'].qualityFeedback', {
                validateFirst: true,
                initialValue:e.qualityFeedback
            })
            getFieldProps('mtlList['+i+'].setNetAgg', {
                validateFirst: true,
                initialValue:e.setNetAgg
            })
            getFieldProps('mtlList['+i+'].setTaxAgg', {
                validateFirst: true,
                initialValue:e.setTaxAgg
            })
            getFieldProps('mtlList['+i+'].sourceDtlId', {
                validateFirst: true,
                initialValue:e.sourceDtlId
            })
            getFieldProps('mtlList['+i+'].sourceId', {
                validateFirst: true,
                initialValue:e.sourceId
            })
            getFieldProps('mtlList['+i+'].sourceNo', {
                validateFirst: true,
                initialValue:e.sourceNo
            })
            getFieldProps('mtlList['+i+'].sourceType', {
                validateFirst: true,
                initialValue:e.sourceType
            })
            getFieldProps('mtlList['+i+'].sourceTypeName', {
                validateFirst: true,
                initialValue:e.sourceTypeName
            })
            getFieldProps('mtlList['+i+'].mtlListStockType', {
                validateFirst: true,
                initialValue:e.mtlListStockType
            })
            getFieldProps('mtlList['+i+'].mtlListStockTypeName', {
                validateFirst: true,
                initialValue:e.mtlListStockTypeName
            })
            getFieldProps('mtlList['+i+'].taxAgg', {
                validateFirst: true,
                initialValue:e.taxAgg
            })
            getFieldProps('mtlList['+i+'].createStaffName', {
                validateFirst: true,
                initialValue:e.createStaffName
            })
            getFieldProps('mtlList['+i+'].createStaffEnName', {
                validateFirst: true,
                initialValue:e.createStaffEnName
            })
            getFieldProps('mtlList['+i+'].updateStaffName', {
                validateFirst: true,
                initialValue:e.updateStaffName
            })
            getFieldProps('mtlList['+i+'].updateStaffEnName', {
                validateFirst: true,
                initialValue:e.updateStaffEnName
            })
            getFieldProps('mtlList['+i+'].billDtlId', {
                validateFirst: true,
                initialValue:e.billDtlId
            })
            getFieldProps('mtlList['+i+'].mtlId', {
                validateFirst: true,
                initialValue:e.mtlId
            })
            getFieldProps('mtlList['+i+'].mtlEnName', {
                validateFirst: true,
                initialValue:e.mtlEnName
            })
            getFieldProps('mtlList['+i+'].mtlTyId', {
                validateFirst: true,
                initialValue:e.mtlTyId
            })
            getFieldProps('mtlList['+i+'].mtlTyLcName', {
                validateFirst: true,
                initialValue:e.mtlTyLcName
            })
            getFieldProps('mtlList['+i+'].mtlTyEnName', {
                validateFirst: true,
                initialValue:e.mtlTyEnName
            })
            getFieldProps('mtlList['+i+'].hsCode', {
                validateFirst: true,
                initialValue:e.hsCode
            })
            getFieldProps('mtlList['+i+'].mtlStatusId', {
                validateFirst: true,
                initialValue:e.mtlStatusId
            })
            getFieldProps('mtlList['+i+'].mtlStatusLcName', {
                validateFirst: true,
                initialValue:e.mtlStatusLcName
            })
            getFieldProps('mtlList['+i+'].mtlStatusEnName', {
                validateFirst: true,
                initialValue:e.mtlStatusEnName
            })
            getFieldProps('mtlList['+i+'].sendQty', {
                validateFirst: true,
                initialValue:e.sendQty
            })
            getFieldProps('mtlList['+i+'].packagId', {
                validateFirst: true,
                initialValue:e.packagId
            })
            getFieldProps('mtlList['+i+'].packagLcName', {
                validateFirst: true,
                initialValue:e.packagLcName
            })
            getFieldProps('mtlList['+i+'].packagEnName', {
                validateFirst: true,
                initialValue:e.packagEnName
            })
            getFieldProps('mtlList['+i+'].uomId', {
                validateFirst: true,
                initialValue:e.uomId
            })
            getFieldProps('mtlList['+i+'].uomLcName', {
                validateFirst: true,
                initialValue:e.uomLcName
            })
            getFieldProps('mtlList['+i+'].uomEnName', {
                validateFirst: true,
                initialValue:e.uomEnName
            })
            getFieldProps('mtlList['+i+'].optStaffId', {
                validateFirst: true,
                initialValue:e.optStaffId
            })
            getFieldProps('mtlList['+i+'].packQty', {
                validateFirst: true,
                initialValue:e.packQty
            })
            getFieldProps('mtlList['+i+'].rate', {
                validateFirst: true,
                initialValue:e.rate
            })
            getFieldProps('mtlList['+i+'].refundRates', {
                validateFirst: true,
                initialValue:e.refundRates
            })
            getFieldProps('mtlList['+i+'].vndBeId', {
                validateFirst: true,
                initialValue:e.vndBeId
            })
            getFieldProps('mtlList['+i+'].vndBeLcName', {
                validateFirst: true,
                initialValue:e.vndBeLcName
            })
            getFieldProps('mtlList['+i+'].vndBeEnName', {
                validateFirst: true,
                initialValue:e.vndBeEnName
            })
            getFieldProps('mtlList['+i+'].purCnyId', {
                validateFirst: true,
                initialValue:e.purCnyId
            })
            getFieldProps('mtlList['+i+'].purCnyLcName', {
                validateFirst: true,
                initialValue:e.purCnyLcName
            })
            getFieldProps('mtlList['+i+'].purCnyEnName', {
                validateFirst: true,
                initialValue:e.purCnyEnName
            })
            getFieldProps('mtlList['+i+'].purTaxPrc', {
                validateFirst: true,
                initialValue:e.purTaxPrc
            })
            getFieldProps('mtlList['+i+'].purNetPrc', {
                validateFirst: true,
                initialValue:e.purNetPrc
            })
            getFieldProps('mtlList['+i+'].saleCnyId', {
                validateFirst: true,
                initialValue:e.saleCnyId
            })
            getFieldProps('mtlList['+i+'].saleCnyLcName', {
                validateFirst: true,
                initialValue:e.saleCnyLcName
            })
            getFieldProps('mtlList['+i+'].saleCnyEnName', {
                validateFirst: true,
                initialValue:e.saleCnyEnName
            })
            getFieldProps('mtlList['+i+'].updateUserId', {
                validateFirst: true,
                initialValue:e.updateUserId
            })
            getFieldProps('mtlList['+i+'].billId', {
                validateFirst: true,
                initialValue:e.billId
            })

           // let obj =e.countType?{countTypeName:e.countTypeName,countType:e.countType}:{countTypeName:i18n.t(200953/*指定数值*/),countType:20}
            let comp = (<div className={'row'} key={i} style={{marginBottom:'10px'}}>
                    <div className="form-group col-xs-1 col-md-1">
                    </div>
                    <div className="form-group col-xs-2 col-md-2">
                        <input type='text' disabled {...getFieldProps("mtlList[" + i + "].mtlLcName", {
                            initialValue: e.mtlLcName
                        })}
                               className="col-md-12 col-lg-12 text-input-nowidth"
                        />
                    </div>
                    <div className="form-group col-xs-4 col-md-4">
                        <input type='text' className={'col-xs-10 col-md-10 text-input-nowidth'}
                               placeholder=""
                               {...getFieldProps('mtlList['+i+'].basSpeci',{
                                   initialValue:e.basSpeci
                               })}
                               disabled
                        />
                    </div>
                    <div className="form-group col-xs-2 col-md-2">
                        <Select
                            {...getNFieldProps('mtlList['+i+'].isQualified',{
                                initialValue:e.isQualified?1:0
                            })}
                            animation='slide-up'
                            className={getFieldError('mtlList['+i+'].isQualified')?
                                'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
                            prefixCls="rc-select-filter-header"
                            choiceTransitionName="rc-select-selection__choice-zoom"
                            optionLabelProp="children"
                            allowClear={false}
                        >

                            <Option  value={0} title={i18n.t(500340/*不合格*/)}>{i18n.t(500340/*不合格*/)}</Option>
                            <Option  value={1} title={i18n.t(500339/*合格*/)}>{i18n.t(500339/*合格*/)}</Option>
                         </Select>
                    </div>
                    <div className="form-group col-xs-2 col-md-2">
                        <input type='text' className={'col-xs-10 col-md-10 text-input-nowidth'}
                               placeholder=""
                               {...getFieldProps('mtlList['+i+'].remark',{
                                   initialValue:e.remark?e.remark:''
                               })}
                        />
                    </div>

                </div>
            )
            lastIndex = i;
            return comp;
        });
        return (
            <div className="package-action-buttons">
                <FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft}
                             onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
                    <div className={'  girdlayout scorll'} style={{maxHeight: '300px',overflowY: 'auto'}}>
                        <div className={'row'}>
                            <div className="form-group col-xs-1 col-md-1">
                            </div>
                            <div className="form-group col-xs-2 col-md-2">
                                <label className={'col-xs-12 col-md-12'} style={{textAlign:'left'}}><span>*</span>{i18n.t(300077/*产品*/)}</label>
                            </div>
                            <div className="form-group col-xs-4 col-md-4">
                                <label className={'col-xs-12 col-md-12'} style={{textAlign:'left'}}><span>*</span>{i18n.t(100382/*产品规格*/)}</label>
                            </div>
                            <div className="form-group col-xs-2 col-md-2">
                                <label className={'col-xs-12 col-md-12'} style={{textAlign:'left'}}>{i18n.t(500338/*是否合格*/)}</label>
                            </div>
                            <div className="form-group col-xs-2 col-md-2">
                                <label className={'col-xs-12 col-md-12'} style={{textAlign:'left'}}><span>*</span>{i18n.t(100336/*备注*/)}</label>
                            </div>
                        </div>
                        {common}
                    </div>
                </FormWrapper>
            </div>
        )
    }
}
const ProductForm =createForm()(AirPricePlug);
export default ProductForm;