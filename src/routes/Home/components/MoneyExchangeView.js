import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Input from '../../../components/FormValidating/FormValidating';
import Select, { Option ,ConstMiniSelect ,ConstVirtualSelect} from '../../../components/Select/';
import {createForm,FormWrapper} from "../../../components/Form";
import xt from '../../../common/xt';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax} from '../../../services/apiCall';
export class MoneyExchangeView extends Component{
	getPopupContainer(node) {
	    return node.parentNode;
	}
	constructor(props) {
		super(props);
		this.onSelect=this.onSelect.bind(this);
		this.buttonClick=this.buttonClick.bind(this);
		this.state ={
			value:'',
			mubiaobi:[],
			jieguo:[]
		}
	}
	onSelect(event){
		this.setState({
			value:event.target.value
		})
	}

	onClick(){

	}
	buttonClick(value,data){
		var that = this;
		const {form} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(value.basId && value.targetId && value.money){
					apiGet(API_FOODING_DS, '/frExRat/getFrExRat', {basId:value.basId,money:value.money,targetId:value.targetId}, response => {
					that.setState
						({
							jieguo:response.data
						});
					}, error => {
	    		})
				}else{
					return;
				}

				//this.props.form.resetFields();
			}
		})
	}


    //onDrageEdit 拖拽编辑
    onDrageEdit = () => {
        let {onDrageEdit, laysingle} = this.props;
        onDrageEdit && onDrageEdit(laysingle)
    };

    //onDrageDelete 单个模块删除
    onDrageDelete = () => {
        let {onDrageDelete, laysingle} = this.props;
        onDrageDelete && onDrageDelete(laysingle)
    };

	render(){
		const { getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
		let param = this.props.form.getFieldsValue();
     	let {mubiaobi,jieguo} = this.state;
		return (
			<div className="dragesingle" >
				<div className={"dragetitle"}>
					<span className={"drageshow"}>{i18n.t(500276/*汇率换算*/)}</span>
					<span className="dragehandle"></span>
					<span className={"drageaction"}>
                        <i className={"foddingicon fooding-sd-icon2"}></i>
                        <span className="action">
                            <span onClick={this.onDrageEdit}><i className={"foddingicon fooding-alter_icon2"}></i>&nbsp;&nbsp;{i18n.t(100439/*编辑*/)}</span>
                            <span onClick={this.onDrageDelete}><i className={"foddingicon fooding-delete-icon4"}></i>&nbsp;&nbsp;{i18n.t(100437/*删除*/)}</span>
                        </span>
                    </span>
				</div>
				<div className={"dragecontent"} style={{height:Number(this.props.rowHeight + 10) * Number(this.props.laysingle.h) - 50 + "px"}}>
					<div className="index-bd-box hh-radius mt10 shadow">
						<div className="currency-bd">
							<div>
								<h2 className={(jieguo.frExRat?jieguo.frExRat.basRat:'')?"zhuanhuan":'none'}>
                                    {jieguo.num} {jieguo.frExRat?jieguo.frExRat.basCurren.localName:""}
									=
                                    {jieguo.money} {jieguo.frExRat?jieguo.frExRat.curren.localName:''}</h2>


							</div>
							<div>
								<input type="text" className='text-input-nowidth'
                                       {...getFieldProps('money',{
                                           initialValue:'',
                                       })}
									   style={{width:40,marginRight:5,float:'left'}}
								/>
								<ConstVirtualSelect
									placeholder=""
									form={this.props.form}
									style={{width:80,float:'left'}}
									fieldName='basId'
									apiHost={API_FOODING_DS}
									apiType = {apiPost}
									apiUri='/object/getMiniList'
									apiParams={{
                                        obj:'com.fooding.fc.ds.entity.Curren'
                                    }}
									onSelect={this.onSelect}
									onChange={this.yuanbiChange}

									valueKeys={ da => ({
                                        basId: da.id,
                                        basLcName: da.localName,
                                        basEnName: da.name,
                                        s_label: da.localName
                                    })}

								/>

							</div>
							<span className="c-switch">=</span>
							<ConstMiniSelect form={this.props.form}
											 isRequest={Boolean(getFieldValue("basId",{}).basId)}
											 refreshMark={getFieldValue("basId", {}).basId}
											 pbj={{
                                                 apiType: apiGet, host: API_FOODING_DS, uri: '/frExRat/getCurrenIdList',
                                                 params: {basId:getFieldValue("basId",{}).basId}
                                             }} fieldName="targetId"
											 optionValue={da => <Option key={da.id} objValue={{
                                                 targetId: da.id,
                                                 targetLcName: da.localName,
                                                 targetEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
											 style={{width:100}}
											 className ={'currency-btn select-from-currency'}

							/>
							<button type="button" onClick={this.buttonClick.bind(this)} className="ar-btn hh-btn-primary hh-radius">{i18n.t(200636/*转换*/)}</button>

							<div className='dictionary-title t10'>汇率:{jieguo.frExRat?jieguo.frExRat.basRat:''}</div>
							<div className="dictionary-title">
								更新时间:
                                {new Date(jieguo.frExRat?jieguo.frExRat.updateDate:'').Format('yyyy-MM-dd hh:mm:ss') || ''}</div>
						</div>
					</div>
				</div>
			</div>


			)
	}
}
MoneyExchangeView = createForm()(MoneyExchangeView);
export default MoneyExchangeView;
