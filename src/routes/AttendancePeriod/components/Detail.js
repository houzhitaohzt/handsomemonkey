import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
import {I18n} from "../../../lib/i18n";
import Table from "../../../components/Table";//Table表格

import {apiGet,apiPost,apiForm,API_FOODING_HR,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';

import WebData from '../../../common/WebData';
import Checkbox from "../../../components/CheckBox";
import ServiceTips from "../../../components/ServiceTips";//提示框


export class Page extends Component{
	
	constructor(props){
		super(props);	
		let groupData = WebData.user.data.staff.cluster || {};

		// this state 
		this.state = {
			groupData:groupData, // 集团
			dataOne:{}, // getOne
		}; 	

		this.columns = [{
			title : I18n.t(600303/*周期编号*/),
			dataIndex : 'code',
			key : "code",
			width : '30%',
			render(data,row,index){
				return (<div className={'text-ellipsis'}>{data || ''}</div>);
			}
		},{
			title : I18n.t(400233/*开始日期*/),
			dataIndex : 'beginDate',
			key : "beginDate",
			width : '30%',
			render(data,row,index){
				return (<div className={'text-ellipsis'}>{data || ''}</div>);
			}
		},{
			title : I18n.t(400234/*结束日期*/),
			dataIndex : 'endDate',
			key : "endDate",
			width : '20%',
			render(data,row,index){
				return (<div className={'text-ellipsis'}>{data || ''}</div>);
			}
		}];	


	}

	componentDidMount(){
		this.getPage(); 
    }

	// get one 
	getPage = ()=> {
		let that = this;
		let {checkedData} = this.props;	

		apiGet(API_FOODING_HR,'/attendanceCycle/getOne',{id:checkedData['id']},
			(response)=>{
				that.setState({
					dataOne: response['data']
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	onCancel = ()=> {
		const {form, onCancel} = this.props;
		this.props.onCancel();
	}

	render(){
		let that = this;
		let {dataOne,groupData} = this.state;
		let {checkedData} = this.props;

		return (
			<div className="package-action-buttons">
				<FormWrapper
					showFooter={true}
					showSaveClose={false}
					onCancel={this.onCancel}
					>
						<div className={'addnormal scroll'}>
							<div className={'girdlayout'} style={{height:'290px'}}>
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(100243/*集团*/)}</label>
										<span>{groupData['localName']}</span>
									</div>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(100244/*企业*/)}</label>
										<span>{ dataOne.company ? dataOne.company['localName'] :'' }</span>
									</div>
								</div>					
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(400232/*年度*/)}</label>
										<span>{ dataOne.year || '' }</span>
									</div>	
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(700074/*状态*/)}</label>
										<span>{ dataOne.irowSts ? dataOne.irowSts['name'] : '' }</span>
									</div>
								</div>
								<div className="row">
									<div className="col-md-10" style={{marginLeft:'90px'}}>
										<Table
											ref ="frexrat"
											columns={this.columns}
											data={dataOne['list']}
											checkboxConfig={{show:false,position:'first'}}
											colorFilterConfig={{show:false,dataIndex:'colorType'}}
											followConfig={{show:false}}
											scroll={{x:true, y:160}}
										/>
									</div>
								</div>
							</div>
						</div>						
				</FormWrapper>
			</div>
		)
	}
}

export default Page;

