import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option, ConstVirtualSelect} from '../../../../../components/Select';
import '../../../../../components/Select/assets/index.less';
import {API_FOODING_DS, apiGet} from "../../../../../services/apiCall";
import {I18n} from "../../../../../lib/i18n";
import xt from "../../../../../common/xt";
import Checkbox from '../../../../../components/CheckBox';

export class HarborDialog extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.addClick = this.addClick.bind(this);
        this.state = this.initState();
        this.deleteClick = this.deleteClick.bind(this);
        this.state = {
            nianxianArray:[{}],
            deleteArray: []
        };
        this.laotangRadio = null;
    }

    deleteClick(i) {
        let { deleteArray, nianxianArray} = this.state;
        let delObjc = nianxianArray[i];
        delObjc.id && !~deleteArray.indexOf(delObjc.id) && deleteArray.push(delObjc.id);
        nianxianArray.splice(i, 1,null);
        this.setState({
            nianxianArray,
            deleteArray,
        });
    }

    addClick() {
        this.props.form.validateFields((error, value) => {
            if (error) {
                console.log(error, value);
            } else {
                let that = this;
                let array = this.state.nianxianArray;
                array.push({});
                this.setState({
                    nianxianArray: array
                })
            }

        })
    }

    initState() {
        return {
            productArray: [],
            billDtlId: null,
            productData: {},
            priceArray: []
        }
    }

    componentWillReceiveProps(props) {
        let {data} = props;
        let {billDtlId} = this.state;
        let record = data.number === 1 ? null : data.record;
        if (record && record.billDtlId !== billDtlId) {
            this.getEditOne(record.billDtlId);
        }
    }

    componentDidMount() {
        let that = this;
        apiGet(API_FOODING_DS, '/tradruleStatn/getList',
            {sourceId: this.props.otherData}, (response) => {
                this.setState({
                    nianxianArray: response.data.length > 0 ? response.data : [{}]
                });
            }, (error) => {

            });
    }

    onSaveAndClose() {
        let {data, initData} = this.props;
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                value = Object.assign({delIdList: this.state.deleteArray}, value);
                this.props.onSaveAndClose(value,value);
                this.props.form.resetFields();
            }
        })

    }

    onCancel() {
        this.props.form.resetFields();
        this.setState({...this.initState()}, this.props.onCancel);
    }

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
        let {data, initData} = this.props;
        const {countrys, statnTypes, countryId} = initData;
        let content = <div></div>
        let common = <div></div>;
        let commons = <div></div>;
        let otherData = this.props.otherData
        let nianxianArray = this.state.nianxianArray;
        let lastIndex = -1;
        // 编辑 参数
        if (data.number == 1) { //新增
            if( !that.laotangRadio) that.laotangRadio = "beanList[0].dfutMrk";
            common = nianxianArray.map((e, i) => {
                if (e == null) return e;
                let comp = (<div className='row' key={i}>
                    <i {...getFieldProps('beanList[' + i + '].dataTyId', {  initialValue: 30 })}/>
                    <i {...getFieldProps('beanList[' + i + '].id', { initialValue: e.id || '' })}/>
                    <i {...getFieldProps('beanList[' + i + '].beId', {initialValue: this.props.otherData })}/>
                    <i {...getFieldProps('beanList[' + i + '].optlock', {initialValue: e.id ? e.optlock : null })}/>
                    <div className="form-group col-md-12 col-lg-12">
                        <div className="form-group col-xs-1 col-md-1">
                            <input
                                style={{paddingLeft: 10}}
                                type="radio"
                                name={'laotang'}
                                {...getFieldProps(`beanList[${i}].dfutMrk`,
                                    {
                                        valuePropName: 'checked',
                                        initialValue: that.laotangRadio === `beanList[${i}].dfutMrk`,
                                        onChange: ()=> that.laotangRadio = `beanList[${i}].dfutMrk`,

                                    }
                                )}
                            />
                        </div>

                        <div className="form-group col-xs-3 col-md-3">
                            <ConstVirtualSelect
                                form={this.props.form}
                                isRequest={false}
                                fieldName={'beanList[' + i + '].cntryId'}
                                rules
                                initialValue={e.cntryId}
                                className="col-md-8 col-lg-8"
                                initValueOptions={countrys}

                            />
                        </div>
                        <div className="form-group col-xs-3 col-md-3">
                            <ConstVirtualSelect
                                form={this.props.form}
                                isRequest={false}
                                fieldName={'beanList[' + i + '].statnTyId'}
                                rules
                                initValueOptions={statnTypes}
                                initialValue={e.statnTyId}
                                className="col-md-8 col-lg-8"
                            />
                        </div>
                        <div className="form-group col-xs-3 col-md-3">
                            <ConstVirtualSelect
                                form={this.props.form}
                                initialValue={e.statnId}
                                initValueOptions={e.statn && [e.statn] || e.statn}
                                isRequest={Boolean(getFieldValue('beanList[' + i + '].statnTyId')) && Boolean(getFieldValue('beanList[' + i + '].cntryId'))}
                                refreshMark={getFieldValue('beanList[' + i + '].statnTyId') + " " + getFieldValue('beanList[' + i + '].cntryId')}
                                fieldName={'beanList[' + i + '].statnId'}
                                apiUri="/statn/getByStCn"
                                rules
                                apiParams={{
                                    statnTyId: getFieldValue('beanList[' + i + '].statnTyId', e.statnTyId),
                                    cntryId: getFieldValue('beanList[' + i + '].cntryId', e.cntryId)
                                }}


                            />

                        </div>
                        <div className="form-group col-xs-2 col-md-2">
                            <i className='foddingicon fooding-add-icon3'
                               style={{paddingLeft: '20px'}}
                               onClick={this.addClick.bind(this, i)}></i>
                            {i == 0 ? '' :
                                <i className='foddingicon fooding-delete-icon4'
                                   style={{paddingLeft: '20px'}} onClick={this.deleteClick.bind(this, i)}></i>
                            }
                        </div>
                    </div>
                </div>)
                lastIndex = i;
                return comp;
            })
        } else {
            commons = nianxianArray.map((e, i) => {
                if (e == null) return e;
                that.laotangRadio = that.laotangRadio?that.laotangRadio: (e.dfutMrk? `beanList[${i}].dfutMrk` : null);
                let comp = (<div className='row' key={i}>
                    <i {...getFieldProps('beanList[' + i + '].dataTyId', {initialValue: e.dataTyId || 30,})}/>
                    <i {...getFieldProps('beanList[' + i + '].id', { initialValue:e.id})}/>
                    <i {...getFieldProps('beanList[' + i + '].beId', {initialValue: e.beId || otherData})}/>
                    <i {...getFieldProps('beanList[' + i + '].optlock', {initialValue: e.optlock})}/>
                    <div className="form-group col-md-12 col-lg-12">
                        <div className="form-group col-xs-1 col-md-1">
                            <input
                                style={{paddingLeft: 10}}
                                type="radio"
                                name={'laotang2'}
                                {...getFieldProps(`beanList[${i}].dfutMrk`,
                                    {
                                        valuePropName: 'checked',
                                        initialValue: that.laotangRadio === `beanList[${i}].dfutMrk`,
                                        onChange: ()=> that.laotangRadio = `beanList[${i}].dfutMrk`,
                                    }
                                )}
                            />
                        </div>

                        <div className="form-group col-xs-3 col-md-3">
                            <ConstVirtualSelect
                                form={this.props.form}
                                isRequest={false}
                                fieldName={'beanList[' + i + '].cntryId'}
                                rules
                                initialValue={e.cntryId}
                                className="col-md-8 col-lg-8"
                                initValueOptions={countrys}

                            />
                        </div>
                        <div className="form-group col-xs-3 col-md-3">
                            <ConstVirtualSelect
                                form={this.props.form}
                                isRequest={false}
                                fieldName={'beanList[' + i + '].statnTyId'}
                                rules
                                initValueOptions={statnTypes}
                                initialValue={e.statnTyId}
                                className="col-md-8 col-lg-8"
                            />
                        </div>
                        <div className="form-group col-xs-3 col-md-3">
                            <ConstVirtualSelect
                                form={this.props.form}
                                initialValue={e.statnId}
                                initValueOptions={getFieldValue('beanList[' + i + '].statnTyId', e.statnTyId) === e.statnTyId && getFieldValue('beanList[' + i + '].cntryId', e.statnTyId) === e.statnTyId && e.statn && [e.statn] || undefined}
                                isRequest={Boolean(getFieldValue('beanList[' + i + '].statnTyId', e.statnTyId)) && Boolean(getFieldValue('beanList[' + i + '].cntryId',e.cntryId))}
                                refreshMark={getFieldValue('beanList[' + i + '].statnTyId',e.statnTyId) + "" + getFieldValue('beanList[' + i + '].cntryId',e.cntryId)}
                                fieldName={'beanList[' + i + '].statnId'}
                                apiUri="/statn/getByStCn"
                                rules={true}
                                apiParams={{
                                    statnTyId: getFieldValue('beanList[' + i + '].statnTyId', e.statnTyId),
                                    cntryId: getFieldValue('beanList[' + i + '].cntryId', e.cntryId)
                                }}


                            />
                        </div>
                        <div className="form-group col-xs-2 col-md-2">
                            <i className='foddingicon fooding-add-icon3'
                               style={{paddingLeft: '20px'}}
                               onClick={this.addClick.bind(this, i)}></i>
                            {i == 0 ? '' :
                                <i className='foddingicon fooding-delete-icon4'
                                   style={{paddingLeft: '20px'}} onClick={this.deleteClick.bind(this, i)}></i>
                            }
                        </div>
                    </div>
                </div>)
                lastIndex = i;
                return comp;
            })
        }


        //订单产品
        if (data.number == 0 || data.number == 1) {
            content = (
                <div className={'girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-xs-1 col-md-1">
                            <label className={'col-xs-2 col-md-2'}></label>
                        </div>
                        <div className="form-group col-xs-3 col-md-3">
                            <label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
                        </div>
                        <div className="form-group col-xs-3 col-md-3">
                            <label className={'col-xs-5 col-md-5'}><span>*</span>{I18n.t(100224/*运输方式*/)}</label>
                        </div>
                        <div className="form-group col-xs-3 col-md-3">
                            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100155/*港口*/)}</label>
                        </div>
                    </div>
                    {common}
                    {commons}
                </div>)
        }
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose}
                             onCancel={this.onCancel} onSaveAdd={this.onSaveAdd} width={976}>
            {content}
        </FormWrapper>);
    }
}

const DialogFrom = createForm()(HarborDialog);
export default DialogFrom;


/*<Select
    animation='slide-up'
    placeholder={""}
    choiceTransitionName="rc-select-selection__choice-zoom"
    optionLabelProp="children"
    optionFilterProp="children"
    allowClear={false}
    {...getFieldProps('pickTy',{
        validateFirst: true,
        rules: [{required:true,}],
        valuedateTrigger:"onBlur",
        initialValue:String(tradruleStatn && tradruleStatn.pickTy?tradruleStatn.pickTy:'10')
    })}
    className = {getFieldError('pickTy')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
>
    {
        pickTypes.map((e,i) =>{
            return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)
        })
    }
</Select>
<Select
    animation='slide-up'
    placeholder={""}
    choiceTransitionName="rc-select-selection__choice-zoom"
    optionLabelProp="children"
    optionFilterProp="children"
    allowClear={false}
    {...getFieldProps('cntryId',{
        validateFirst: true,
        rules: [{required:true,}],
        valuedateTrigger:"onBlur",
        initialValue:tradruleStatn && tradruleStatn.cntryId?tradruleStatn.cntryId:countryId
    })}
    className = {getFieldError('cntryId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
>
    {
        countrys.map((e,i) =>{
            return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)
        })
    }
</Select>

<Select
    animation='slide-up'
    placeholder={I18n.t(100156*/
/*港口类型*/
/*)}
			choiceTransitionName="rc-select-selection__choice-zoom"
			optionLabelProp="children"
			optionFilterProp="children"	
			allowClear={false}
			{...getFieldProps('statnTyId',{
				validateFirst: true,
				rules: [{required:true,}],
				valuedateTrigger:"onBlur",
				initialValue:String(tradruleStatn && tradruleStatn.statnTyId?tradruleStatn.statnTyId:'10'),
				onChange:this.statnTyIdChange
			})}
			className = {getFieldError('statnTyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
		>
			{
				statnTypes.map((e,i) =>{
					return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)							
				})
			}
		</Select>
		<Select
			animation='slide-up'
			placeholder={I18n.t(100523*/
/*请选择港口*/
/*)}
			choiceTransitionName="rc-select-selection__choice-zoom"
			optionLabelProp="children"
			optionFilterProp="children"	
			allowClear={false}
			{...getFieldProps('statnId',{
				validateFirst: true,
				rules: [{required:true,}],
				valuedateTrigger:"onBlur",
				initialValue:tradruleStatn && tradruleStatn.statnId?tradruleStatn.statnId:undefined
			})}
			onClick={this.statnIdClick}
			className = {getFieldError('statnId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
		>
			{
				this.state.protArr.map((e,i) =>{
					return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)							
				})
			}
		</Select>
			//初始化 通过港口类型过滤
	initPortData(statnTyId){
		let that = this;
		apiGet(API_FOODING_DS,'/statn/getByTyId',{statnTyId:statnTyId},response => {
			that.setState({
				protArr:response.data
			})
		}, error => console.log(error.message))
	}
	//港口类型过滤
	statnTyIdChange(e){
		this.props.form.setFieldsValue({'statnId':''});
		this.setState({
			statnTyId :e
		})
	}
	//每一次点击 进行一次请求，获取港口类型
	statnIdClick(){
		let statnTyId = this.state.statnTyId || 10;
		if(statnTyId == "") return false;
		this.initPortData(statnTyId)
	}
*/
