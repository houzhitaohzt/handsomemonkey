import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../Form';
import Select, { Option, ConstMiniSelect, ConstVirtualSelect } from '../../Select';
import DataTime from  '../../Calendar/Calendar';
import Checkbox from '../../CheckBox';
import Radio from "../../Radio";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
import {I18n} from "../../../lib/i18n";
export class MeasureCommonDialog extends Component{
    constructor(props) {
        super(props);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.state=this.initState();
        this.onChange = this.onChange.bind(this);
        this.data ={};
    }
    onChange(e){
        if(e == 20){
            this.props.form.setFieldsValue({exePer:''});
        }else {
            this.props.form.setFieldsValue({exeNumb:''});
        }
    }
    onSaveAndClose(){
        const {form, onSaveAndClose} = this.props;
        form.validateFields({force: true}, (error, value) => {
            if(error){

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
    initState(){
        return {
            isBasMak: this.props.initData?(this.props.initData.measum?this.props.initData.measum.basMrk:false):false //基础计量单位是否选中
        }
    }
    onBasChange = e => {
        if(e.target.checked){
            this.props.form.setFieldsValue({"eqBasnum":'1'});
        }else{
            this.props.form.setFieldsValue({"eqBasnum":''});
        }
        this.setState({
            isBasMak:e.target.checked
        })
    }
    // componentWillReceiveProps(nextProps){
    // 	let initData = nextProps.initData || {};
    // 	let measum = initData.measum || undefined;
    // 	console.log(measum);
    // 	if(measum){
    // 		this.setState({isBasMak:measum.basMrk})
    // 	}
    // }
    render(){
        let content;
        const { getFieldProps, getFieldError, getNFieldProps, getFieldErrorStyle} = this.props.form;
        let {data,id} = this.props;

        /*
            每一次点击新增和编辑，从后台得到的数据 封装在initData对象里面
            也有些点击新增没有请求，所以就没有initData，没有就初始化一个对象
        */
        let initData = this.props.initData || {};

        if(data.number == 3){
            content = (<div  className='scroll lose scroll-style'>
							<span>
								<i>*</i>
								失效原因
							</span>
				<Select
					placeholder={''}
					style={{width: 450}}
					getPopupContainer={this.getPopupContainer}
				>
					<Option value={'111111'}>11</Option>
				</Select>
			</div>);
        }else if(id == 22){//表示计量单位
            this.data = Object.assign({},initData);
            //表示计量单位
            if(data.number == 0 || data.number == 1){
                content=(<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100589/*计量单位*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName="unitofmeaId"
								apiType={apiPost}
								apiHost={API_FOODING_DS}
								apiParams="com.fooding.fc.ds.entity.Unitofmea"
								rules
								initValueOptions={initData&&initData.unitofmea?[initData&&initData.unitofmea]:[]}
								initialValue={initData&&initData.unitofmea?initData.unitofmea.id:''}
								className="col-md-9 col-lg-9"
							/>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-6 col-lg-6'}><span>*</span>{i18n.t(100591/*基础计量*/)}</label>
							<Checkbox
                                {...getFieldProps('basMrk',{
                                    initialValue:initData&&initData.basMrk?initData.basMrk:false,
                                    onChange:this.onBasChange
                                })}
								checked={this.props.form.getFieldValue("basMrk")}
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-6 col-lg-6'}>{i18n.t(100592/*采购计量*/)}</label>
							<Checkbox
                                {...getFieldProps('purMrk',{
                                    initialValue:initData&&initData.purMrk?initData.purMrk:false
                                })}
								checked={this.props.form.getFieldValue("purMrk")}
							/>
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-6 col-lg-6'}>{i18n.t(100593/*销售计量*/)}</label>
							<Checkbox
                                {...getFieldProps('salMrk',{
                                    initialValue:initData&&initData.salMrk?initData.salMrk:false
                                })}
								checked={this.props.form.getFieldValue("salMrk")}
							/>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-6 col-lg-6'}><span>*</span>{i18n.t(100594/*基础单位数量*/)}</label>
							<input type="text" disabled={!!this.state.isBasMak} {...getFieldProps('eqBasnum', {
                                rules: [{required:true,}],
                                valuedateTrigger:"onBlur",
                                initialValue:initData&&initData.eqBasnum?initData.eqBasnum:''
                            })} className ={getFieldError('eqBasnum')?'col-md-6 col-lg-6 text-input-nowidth error-border':'col-md-6 col-lg-6 text-input-nowidth'}/>
						</div>
					</div>
				</div>)
            }
        }else if(id == 23){//箱型装载数据
            this.data = Object.assign({},initData);
            //箱型装载数据
            if(data.number == 0 || data.number == 1){
                content=(<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-5 col-lg-5">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100596/*包装名称*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName="packId"
								apiType={apiPost}
								apiHost={API_FOODING_DS}
								apiParams={{
                                    "attrs":["packaging"],
                                    "obj": "com.fooding.fc.ds.entity.Pack",
                                    "queryParams":[{
                                        "attr":"sourceId",
                                        "expression":"=",
                                        "value":this.props.otherData.sourceId
                                    }],
                                    "prettyMark":true
                                }}
								rules
								initValueOptions={initData&&initData.packaging?[initData&&initData.packaging]:[]}
								initialValue={initData&&initData.packaging?initData.packaging.id:''}
							/>
						</div>
						<div className="form-group col-md-5 col-lg-5">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100214/*箱型*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName="contnrTyId"
								apiType={apiPost}
								apiHost={API_FOODING_DS}
								apiParams="com.fooding.fc.ds.entity.ContnrType"
								rules
								initValueOptions={initData&&initData.contnrType?[initData&&initData.contnrType]:[]}
								initialValue={initData&&initData.contnrType?initData.contnrType.id:''}
							/>
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-7 col-lg-7'}><span>*</span>{i18n.t(100598/*箱型数量*/)}</label>
							<input type="text" {...getFieldProps('mtlContNum', {
                                rules: [{required:true,}],
                                valuedateTrigger:"onBlur",
                                initialValue:initData&&initData.mtlContNum?initData.mtlContNum:''
                            })} className ={getFieldError('mtlContNum')?'col-md-5 col-lg-5 text-input-nowidth error-border':'col-md-5 col-lg-5 text-input-nowidth'}/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-5 col-lg-5">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100589/*计量单位*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName="mtlUomId"
								apiType={apiPost}
								apiHost={API_FOODING_DS}
								apiParams={{
                                    "attrs":["unitofmea"],
                                    "obj": "com.fooding.fc.ds.entity.Measum",
                                    "queryParams":[{
                                        "attr":"sourceId",
                                        "expression":"=",
                                        "value":this.props.otherData.sourceId
                                    }],
                                    "prettyMark":true
                                }}
								rules
								initValueOptions={initData&&initData.unitofmea?[initData&&initData.unitofmea]:[]}
								initialValue={initData&&initData.unitofmea?initData.unitofmea.id:''}
							/>

						</div>
						<div className="form-group col-md-5 col-lg-5">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100124/*托盘类型*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName="salvrIdId"
								apiType={apiPost}
								apiHost={API_FOODING_DS}
								apiParams="com.fooding.fc.ds.entity.SalvrType"
								rules
								initValueOptions={initData&&initData.salvrType?[initData&&initData.salvrType]:[]}
								initialValue={initData&&initData.salvrType?initData.salvrType.id:''}
							/>
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-7 col-lg-7'}>{i18n.t(400164/*每件盘件数*/)}</label>
							<input type="text" {...getFieldProps('salvrIdNum', {
                                initialValue:initData&&initData.salvrIdNum?initData.salvrIdNum:''
                            })} className="col-md-5 col-lg-5 text-input-nowidth" />
						</div>
					</div>
				</div>)
            }
        }else if(id == 24){//产品规格细分
            //产品规格细分
            //数据在初始化拿到的数据
            this.data = Object.assign({},initData);
            if(data.number == 0 || data.number == 1){
                content=(<div className={' girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-6 col-lg-6'}>{i18n.t(100602/*主要*/)}</label>
							<Checkbox
                                {...getFieldProps('majMrk',{
                                    initialValue:initData&&initData.majMrk?initData.majMrk:false
                                })}
								checked={this.props.form.getFieldValue("majMrk")}
							/>
						</div>
						<div className="form-group col-md-10 col-lg-10">
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400163/*规格名称*/)}</label>
									<ConstVirtualSelect
										form={this.props.form}
										fieldName="qaItemId"
										apiType={apiPost}
										apiHost={API_FOODING_DS}
										apiParams="com.fooding.fc.ds.entity.QaItem"
										rules
										initValueOptions={initData&&initData.qaItem?[initData&&initData.qaItem]:[]}
										initialValue={initData&&initData.qaItem?initData.qaItem.id:''}
										className="col-md-9 col-lg-9"
									/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-1 col-lg-1'}/>
									<ConstVirtualSelect
										form={this.props.form}
										fieldName="maSymbId"
										apiType={apiPost}
										apiHost={API_FOODING_DS}
										style={{float: 'left'}}
										clearable
										apiParams="com.fooding.fc.enumeration.CalSymBol"
										initValueOptions={initData&&initData.calSymBol?[initData&&initData.calSymBol]:[]}
										initialValue={initData&&initData.calSymBol?initData.calSymBol.id:''}
										className="col-md-5 col-lg-5"
									/>
									<label className={'col-md-1 col-lg-1'}/>
									<input type="text" {...getFieldProps('maxQaValue', {
                                        initialValue:initData&&initData.maxQaValue?initData.maxQaValue:''
                                    })} className={"col-md-5 col-lg-5 text-input-nowidth"}  />

								</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100606/*测试方法*/)}</label>
									<ConstVirtualSelect
										form={this.props.form}
										fieldName="testMethId"
										apiType={apiPost}
										apiHost={API_FOODING_DS}
										apiParams="com.fooding.fc.ds.entity.TestMeth"
										clearable
										initValueOptions={initData&&initData.testMeth?[initData&&initData.testMeth]:[]}
										initialValue={initData&&initData.testMeth?initData.testMeth.id:''}
										className="col-md-9 col-lg-9"
									/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{i18n.t(400162/*指标检测值*/)}</label>
									<input type="text" {...getFieldProps('testQaValue', {
                                        initialValue:initData&&initData.testQaValue?initData.testQaValue:''
                                    })} className="col-md-8 col-lg-8 text-input-nowidth"/>
								</div>
							</div>
						</div>
					</div>
				</div>)
            }
        }else if(id == 26){//产品别名
            let {materialExtName} = initData;
            this.data = Object.assign({},materialExtName);
            //产品别名
            if(data.number == 0 || data.number == 1){
                content=(<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-8 col-lg-8">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100494/*产品别名*/)}</label>
							<input type="text" {...getFieldProps('extName', {
                                rules: [{required:true,}],
                                valuedateTrigger:"onBlur",
                                initialValue:materialExtName&&materialExtName.extName?materialExtName.extName:''
                            })} className ={getFieldError('extName')?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} />
						</div>
					</div>
				</div>)
            }
        }else if(id == 27){
            //BOM维护
            if(data.number == 0 || data.number == 1){
                content =(
					<div className='action-normal-buttons'>
						<div className="client-normal-add scroll">
							<div className="client-normal-add-line1">
								<div>
									<label><span>*</span>原材料</label>
									<Select
										placeholder=''
										optionLabelProp='children'
                                        {...getFieldProps('direction',{
                                            validateFirst: true,
                                            rules: [{required:true,}],
                                            valuedateTrigger:"onBlur",
                                            initialValue:data.number == 1 ? '':data.record.direction
                                        })}
										style={{width:200,marginRight:15}}
										className ='currency-btn select-from-currency'>
										<Option value ={'0'} title={'0'}>{'dd'}</Option>
									</Select>
									<label style={{width:50}}><span>*</span>{i18n.t(200080/*类型*/)}</label>
									<Select
										placeholder=''
										optionLabelProp='children'
                                        {...getFieldProps('direction',{
                                            validateFirst: true,
                                            rules: [{required:true,}],
                                            valuedateTrigger:"onBlur",
                                            initialValue:data.number == 1 ? '':data.record.direction
                                        })}
										style={{width:100,marginRight:15}}
										className ='currency-btn select-from-currency'>
										<Option value ={'0'} title={'0'}>{'dd'}</Option>
									</Select>
									<label><span>*</span>每单位数量</label>
									<input placeholder ='' type="text" {...getFieldProps('starttime', {
                                        validateFirst: true,
                                        rules: [
                                            {
                                                required: true,
                                            }
                                        ],
                                        validateTrigger: 'onBlur',
                                        initialValue:data.number == 1 ? '':data.record.starttime
                                    })} style={{width:100}} className="text-input" />
									<label><span>*</span>比例%</label>
									<input placeholder ='' type="text" {...getFieldProps('starttime', {
                                        validateFirst: true,
                                        rules: [
                                            {
                                                required: true,
                                            }
                                        ],
                                        validateTrigger: 'onBlur',
                                        initialValue:data.number == 1 ? '':data.record.starttime
                                    })} style={{width:100}} className="text-input" />
								</div>
							</div>
						</div>
					</div>);
            }
        }else if(id == 28){
            //供应品牌与原产地制造厂商
            if(data.number == 0 || data.number == 1){
                content =(
					<div className='action-normal-buttons'>
						<div className="client-normal-add scroll">
							<div className="client-normal-add-line1">
								<div>
									<label><span>*</span>主品牌</label>
									<Select
										placeholder=''
										optionLabelProp='children'
                                        {...getFieldProps('creatdate',{
                                            validateFirst: true,
                                            rules: [{required:true,}],
                                            valuedateTrigger:"onBlur",
                                            initialValue:data.number == 1 ? '':data.record.creatdate
                                        })}
										style={{width:150,marginRight:15}}
										className ='currency-btn select-from-currency'>
										<Option value ={'0'} title={'0'}>{'dd'}</Option>
									</Select>
									<label><span>*</span>制造厂商</label>
									<Select
										placeholder=''
										optionLabelProp='children'
                                        {...getFieldProps('direction',{
                                            validateFirst: true,
                                            rules: [{required:true,}],
                                            valuedateTrigger:"onBlur",
                                            initialValue:data.number == 1 ? '':data.record.direction
                                        })}
										style={{width:200,marginRight:15}}
										className ='currency-btn select-from-currency'>
										<Option value ={'0'} title={'0'}>{'dd'}</Option>
									</Select>
									<label style={{width:108}}><span>*</span>原产国家/地区</label>
									<input placeholder ='' type="text" {...getFieldProps('theme', {
                                        validateFirst: true,
                                        rules: [
                                            {
                                                required: true,
                                            }
                                        ],
                                        validateTrigger: 'onBlur',
                                        initialValue:data.number == 1 ? '':data.record.theme
                                    })} style={{width:90}} className="text-input" />
								</div>
							</div>
						</div>
					</div>);
            }
        }else if(id == 29){
            //产品包装计费
            if(data.number == 0 || data.number == 1){
                content =(
					<div className='action-normal-buttons'>
						<div className="client-normal-add scroll">
							<div className="client-normal-add-line1">
								<div>
									<label><span>*</span>{i18n.t(100596/*包装名称*/)}</label>
									<Select
										placeholder=''
										optionLabelProp='children'
                                        {...getFieldProps('creatdate',{
                                            validateFirst: true,
                                            rules: [{required:true,}],
                                            valuedateTrigger:"onBlur",
                                            initialValue:data.number == 1 ? '':data.record.creatdate
                                        })}
										style={{width:300,marginRight:15}}
										className ='currency-btn select-from-currency'>
										<Option value ={'0'} title={'0'}>{'dd'}</Option>
									</Select>
								</div>
								<div>
									<label><span>*</span>包装单价</label>
									<input placeholder ='' type="text" {...getFieldProps('direction', {
                                        validateFirst: true,
                                        rules: [
                                            {
                                                required: true,
                                            }
                                        ],
                                        validateTrigger: 'onBlur',
                                        initialValue:data.number == 1 ? '':data.record.direction
                                    })} style={{width:150}} className="text-input" />
									<label style={{width:50}}><span>*</span>{i18n.t(500125/*货币*/)}</label>
									<Select
										placeholder=''
										optionLabelProp='children'
                                        {...getFieldProps('theme',{
                                            validateFirst: true,
                                            rules: [{required:true,}],
                                            valuedateTrigger:"onBlur",
                                            initialValue:data.number == 1 ? '':data.record.theme
                                        })}
										style={{width:90,marginRight:15}}
										className ='currency-btn select-from-currency'>
										<Option value ={'0'} title={'0'}>{'dd'}</Option>
									</Select>
								</div>
							</div>
							<div className="client-normal-add-line1">
								<div>
									<label><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
									<Calendar width={300}
											  showTime = {false}
											  isShowIcon={true}
											  form={this.props.form}
											  name={'name'}/>
								</div>
								<div>
									<label style={{marginLeft:15}}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
									<Calendar width={300}
											  showTime = {false}
											  isShowIcon={true}
											  form={this.props.form}
											  name={'name'}
									/>
								</div>
							</div>
						</div>
					</div>);
            }
        }else if(id == 38){
            //产品
            if(data.number == 0 || data.number == 1){
                content = null;
            }
        }else if(id == 39){
            //费用名称
            if(data.number == 0 || data.number == 1){
                content =(
					<div className={'girdlayout'} style={{height:"344px"}}>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500129/*源单编号*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500121/*费用名称*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>报销金额</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
						</div>
					</div>
                )
            }
        }else if(id == 40){
            //出库明细
            if(data.number == 0 || data.number == 1){
                content =(
					<div className={'  girdlayout'} style={{height:"344px"}}>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100382/*产品规格*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(400035/*产品单位*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{i18n.t(400012/*品牌*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>

						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500163/*出库数量*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{i18n.t(100312/*供应商*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500129/*源单编号*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{i18n.t(500146/*源单类型*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
						</div>
					</div>)
            }
        }else if(id == 41){
            //入库明细
            if(data.number == 0 || data.number == 1){
                content =(
					<div className={'  girdlayout'} style={{height:"344px"}}>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100382/*产品规格*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(400035/*产品单位*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{i18n.t(400012/*品牌*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>

						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500139/*入库数量*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{i18n.t(100312/*供应商*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500141/*采购单价*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500145/*采购币种*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500129/*源单编号*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{i18n.t(500146/*源单类型*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
						</div>
					</div>)
            }
        }else if(id == 43){
            //收款计划
            if(data.number == 0|| data.number == 1){
                content =(
					<div className={'  girdlayout'} style={{height:"344px"}}>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{i18n.t(100181/*款项类型*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>预计收款时间</label>
								<div className={'col-md-9 col-lg-9 datetime'}>
									<DataTime
										showTime={true}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form}
										name={'startTime'}
									/>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>预计收款金额</label>
								<input type='text' className={'col-md-9 col-lg-9 text-input-nowidth'} />
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{i18n.t(100284/*币种*/)}</label>
								<Select
									animation='slide-up'
									placeholder=''
									className ='currency-btn select-from-currency col-xs-9 col-md-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getFieldProps('timearea',{
                                        validateFirst: true,
                                        rules: [{required:true,}]
                                    })}
								>
									<Option value="中国" title="中国">中国</Option>
									<Option value="美国" title="美国">美国</Option>
								</Select>
							</div>
						</div>
					</div>)
            }
        }else if(id == 44){
            let {basDayTypes,exeNumTypes,fundTypes,payTrmExecute} = initData;
            this.data = Object.assign({},payTrmExecute);
            getFieldProps('paytrmId',{
                initialValue: this.props.otherData
            });
            payTrmExecute=payTrmExecute||{}
            let eee = this.props.form.getFieldValue("exeNumTy",{}).exeNumTy||this.props.form.getFieldValue("exeNumTy") || payTrmExecute.exeNumTy;
            console.log(eee)
            //支付执行
            if(data.number == 0|| data.number == 1){
                content =(
					<div className={'girdlayout'} style={{height:"344px"}}>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100196/*付款顺序*/)}</label>
								<input type="text" {...getFieldProps('exeSN', {
                                    rules: [{required:true,}],
                                    valuedateTrigger:"onBlur",
                                    initialValue:payTrmExecute&&payTrmExecute.exeSN?payTrmExecute.exeSN:''
                                })}
									   className ={getFieldError('exeSN')?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'}
								/>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100197/*金额计算模式*/)}</label>
								<Select
									animation='slide-up'
									className ={getFieldError('exeNumTy')?'currency-btn select-from-currency col-md-9 col-lg-9  error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getNFieldProps('exeNumTy',{
                                        rules: [{required:true,}],
                                        valuedateTrigger:"onBlur",
                                        onChange:this.onChange,
                                        initialValue:payTrmExecute && payTrmExecute.exeNumTy?{s_label:payTrmExecute.exeNumType.name,exeNumTy:payTrmExecute.exeNumType.id}:undefined
                                    })}

									allowClear={false}
								>
                                    {
                                        exeNumTypes.map((e,i) =>{
                                            return (<Option key={i} value={e.id+''} title={e.name}>{e.name}</Option>)
                                        })
                                    }
								</Select>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100198/*百分比%*/)}</label>
								<input key="eee20" type="text" {...getFieldProps('exePer', {
                                    rules: [(rule, value, callback) => {
                                        console.log(eee, value, 'eeee10');
                                        if (eee == 10 && (xt.isEmpty(value) || String(value).trim() === '')) {
                                            callback([rule.field + " is required"]);
                                        } else {
                                            console.log(typeof value);
                                            callback([]);
                                        }

                                    }],
                                    valuedateTrigger:"onBlur",
                                    initialValue:payTrmExecute&&payTrmExecute.exePer?payTrmExecute.exePer:''
                                })} className ={getFieldError('exePer')?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} placeholder=""
									   disabled = {eee==20}
								/>


							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100199/*指定金额*/)}</label>
								<input key="eee11" type="text" {...getFieldProps('exeNumb', {
                                    rules: [(rule, value, callback) => {
                                        console.log(eee, value, 'eeee20');
                                        if (eee == 20 && (xt.isEmpty(value) || String(value).trim() === '')) {
                                            callback([rule.field + " is required"]);
                                        } else {
                                            console.log(typeof value);
                                            callback([]);
                                        }

                                    }],
                                    valuedateTrigger:"onBlur",
                                    initialValue:payTrmExecute&&payTrmExecute.exeNumb?payTrmExecute.exeNumb:''
                                })} className ={getFieldError('exeNumb')?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} placeholder=""
									   disabled = {eee==10}
								/>

							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{I18n.t(100200/*天数*/)}</label>
								<input type="text" {...getFieldProps('aftDays', {
                                    initialValue:payTrmExecute&&payTrmExecute.aftDays?payTrmExecute.aftDays:''
                                })} className ={'col-md-9 col-lg-9 text-input-nowidth'}/>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>附加月份</label>
								<input type="text" {...getFieldProps('exeAddMth', {
                                    initialValue:payTrmExecute&&payTrmExecute.exeAddMth?payTrmExecute.exeAddMth:''
                                })} className="col-md-9 col-lg-9 text-input-nowidth" />
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{I18n.t(100181/*款项类型*/)}</label>
								<Select
									animation='slide-up'
									className ='currency-btn select-from-currency col-md-9 col-lg-9'
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getNFieldProps('fundTy',{

                                        initialValue:payTrmExecute && payTrmExecute.fundTy?{s_label:payTrmExecute.fundType.name,fundTy:payTrmExecute.fundType.id}:undefined
                                    })}
								>
                                    {
                                        fundTypes.map((e,i) =>{
                                            return (<Option key={i} value={e.id+''} title={e.name}>{e.name}</Option>)
                                        })
                                    }
								</Select>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{I18n.t(100202/*基准日类型*/)}</label>
								<Select
									animation='slide-up'
									className ='currency-btn select-from-currency col-md-9 col-lg-9 '
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
                                    {...getNFieldProps('baseDayTy',{
                                        initialValue:payTrmExecute && payTrmExecute.baseDayTy?{s_label:payTrmExecute.basDayType.name,baseDayTy:payTrmExecute.basDayType.id}:undefined
                                    })}
								>
                                    {
                                        basDayTypes.map((e,i) =>{
                                            return (<Option key={i} value={String(e.id+'')} title={e.name}>{e.name}</Option>)
                                        })
                                    }
								</Select>
							</div>
						</div>
					</div>)
            }
        }
        return (
			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
                {content}
			</FormWrapper>
        );
    }
}
const MeasureCommonForm =createForm()(MeasureCommonDialog);
export default MeasureCommonForm;
