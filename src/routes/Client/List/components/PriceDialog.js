import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
import Checkbox from "../../../../components/CheckBox";
import ColorSelect from "../../../../components/Table/ColorColumn";
import Select, {ConstVirtualSelect} from '../../../../components/Select'; // 下拉
import PriceProduct from "./PriceProduct";
import * as ApiCall from "../../../../services/client/call";
import {apiPost} from "../../../../services/apiCall";
import {errorTips, successTips} from "../../../../components/ServiceTips";

//引入弹层

class CommonForm extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.starClick = this.starClick.bind(this);
        this.state = this.initState();
    }

    initState() {
        this.selectColor = '';
        return {
            selectProducts: [],
            sendEmail: true,
            selectCus: true,
            selectPro: false,
            followMark: false,
            starClass: 'glyphicon glyphicon-star-empty',
        }
    }

    static propTypes = {
        data: PropTypes.object,
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func,
        num: PropTypes.number
    };

    static defaultProps = {
        onSaveAndClose(){
        },
        onCancel(){
        }
    };

    onSaveAndClose() {
        const {form, onSaveAndClose, num} = this.props;
        if(this.state.selectPro && !this.state.selectProducts.length){
            return errorTips(i18n.t(201281/*请搜索并添加产品!*/));
        }
        if(!this.state.selectPro && !this.state.selectCus){
            return errorTips(i18n.t(201282/*请选择客户关注选项或者选择明细产品!*/));
        }

        form.validateFields((errors, value) => {
            if( !errors){
                let cntryId = form.getFieldValue("bizEntprisCntryId");
                let positnId = form.getFieldValue("positnId");
                let cstmLevelId = form.getFieldValue("bizEntprisSourceLvId");

                if(num == 0 && !cntryId && !cstmLevelId && !this.selectColor && !this.state.followMark){
                    return errorTips(i18n.t(201283/*请先选择客户过滤条件*/));
                }

                ApiCall.saveOfferRec({
                    type: num > 0 ? 1: 0,
                    cntryId: cntryId,
                    color: this.selectColor,
                    cstmLevelId: cstmLevelId,
                    followMark: this.state.followMark,
                    beIds: this.props.cusArr.map(cus=>cus.id),
                    ormbs: this.state.selectProducts.map(pro=> ({mtlId: pro.id, offerId: undefined})),
                    //autoSend: this.state.sendEmail,
                    //beIdchecked: this.state.selectCus,
                    mtlIdchecked: this.state.selectPro,
                    positnId
                }, response => {
                    successTips(response.message);
                    onSaveAndClose();
                }, error => errorTips(error.message));
            }
        });


    }

    onCancel() {
        const {onCancel} = this.props;
        this.setState(this.initState(), onCancel);
    }

    handleChange(name, e) {
        this.setState({[name]: e.target.checked });
    }

    starClick() {
        let className, followMark;
        if (this.state.starClass === "glyphicon glyphicon-star-empty") {
            className = "glyphicon glyphicon-star";
            followMark = true;
        } else {
            className = "glyphicon glyphicon-star-empty";
            followMark = false;
        }
        this.setState({starClass: className, followMark})
    }

    render() {
        const {num} = this.props;
        const {getFieldProps, getFieldErrorStyle, form} = this.props.form;

        let dom;
        let domAll;
        if (this.state.selectPro) {
            dom = (<PriceProduct type={num} sendEmail={this.state.sendEmail} selectProducts={(products) => {
                this.setState({selectProducts: products});
            }}/>)
        } else {
            dom =  <div/>;
        }
        if (num == 0) {
            domAll = (
                <div className="client-price-choice" style={{paddingBottom:'10px'}}>                   
                    <div className="row">
                        <div className="col-xs-2">
                            <p className="client-price-choice-label">{i18n.t(200454/*客户筛选*/)}</p>
                        </div>
                        <div className="col-xs-4">
                            <label className="client-price-choice-label" style={{float:'left'}}>{i18n.t(100087/*国家*/)}</label>
                            <ConstVirtualSelect
								form={this.props.form}
								apiParams="com.fooding.fc.ds.entity.Country"
		                        fieldName="bizEntprisCntryId"
								apiType={apiPost}
		                        initValueOptions={ []}
		                        rules={false}
                                style={{width:'250px'}}
		                    />
                        </div>
                        <div className="col-xs-4">
                            <label className="client-price-choice-label" style={{float:'left'}}>{i18n.t(100359/*客户等级*/)}</label>
                            <ConstVirtualSelect
								form={this.props.form}
								apiParams="com.fooding.fc.ds.entity.CstmLevel"
		                        fieldName="bizEntprisSourceLvId"
								apiType={apiPost}
		                        initValueOptions={ []}
		                        rules={false}
                                multi
                                style={{width:'250px'}}
		                    />
                        </div>
                        <div className="col-xs-1">
                            <label className="client-price-choice-label">{i18n.t(400132/*颜色*/)}</label>
                            <ColorSelect value={this.selectColor} onSelect={(data) => {
                                this.selectColor = data;
                            }}/>
                        </div>
                        <div className="col-xs-1">
                            <label className="client-price-choice-label">{i18n.t(200455/*追随*/)}</label>
                            <span className={this.state.starClass} onClick={this.starClick}/>
                        </div>
                    </div>
                </div>
            )
        } else {
            // domAll = (<PriceProductMore sendEmail={this.state.sendEmail} selectProducts={(products, sendEmail) => {
            //     this.setState({selectProducts: products, sendEmail});
            // }}/>)
            domAll = <div/>
        }
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
                <div className="client-price scroll" style={{marginBottom:'10px',maxHeight:'320px',overflowX:'hidden'}}>
                
                    {domAll}
                    <div className="client-price-content" style={{height: 200}}>
                        <div className="row content" style={{marginBottom:'5px'}}>
                            <div className="col-xs-1 left-product">
                                <Checkbox
                                    defaultChecked
                                    checked={this.state.selectPro}
                                    onChange={this.handleChange.bind(this, 'selectPro')}
                                />
                                <p className="client-price-content-show" style={{marginLeft:'10px'}}>{i18n.t(100379/*产品*/)}</p>
                            </div>                           
                            
                            <div className="col-xs-4 none">
                                <p className="client-price-content-show col-xs-3" style={{textAlign: 'right', paddingRight: 10}}>{i18n.t(200457/*接受对象*/)}</p>
                                <ConstVirtualSelect
                                    pageSize={6}
                                    multi
                                    apiType={apiPost}
                                    form={this.props.form}
                                    fieldName='positnId'
                                    apiParams="com.fooding.fc.ds.entity.Positn"
                                    rules={false}
                                    className="col-xs-9"
                                />
                            </div>
                            {
                                false?<div className="col-xs-2">
                                    <Checkbox
                                        defaultChecked
                                        checked={this.state.selectCus}
                                        onChange={this.handleChange.bind(this, 'selectCus')}
                                    />
                                    <p className="client-price-content-show" style={{marginLeft:'10px'}}>{i18n.t(200456/*客户关注产品*/)}</p>
                                </div>:""
                            }

                            <div className="col-xs-3">
                                <p className="client-price-content-show" style={{marginRight:'10px'}}>{i18n.t(400181/*所有接收自动报价者*/)}</p>
                                <Checkbox
                                    checked={true}
                                />
                            </div>
                            {
                               false? <div className="col-xs-2 email-right">
                                    <p className="client-price-content-show">{i18n.t(100411/*是否发邮件*/)}</p>
                                    <Checkbox
                                        defaultChecked
                                        checked={this.state.sendEmail}
                                        onChange={this.handleChange.bind(this, 'sendEmail')}
                                    />
                                </div>:""
                            }

                            {dom}
                        </div>
                    </div>
                </div>
        </FormWrapper>);
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
