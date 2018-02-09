import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import {I18n} from "../../../../lib/i18n";
import {apiGet,apiPost,apiForm,API_FOODING_HR,API_FOODING_ES,API_FOODING_DS} from '../../../../services/apiCall';

import WebData from '../../../../common/WebData';
import Checkbox from "../../../../components/CheckBox";


export class Page extends Component{
	
	constructor(props){
		super(props);	
		let groupData = WebData.user.data.staff.cluster || {};

		// this state 
		this.state = {
			groupData:groupData, // 集团
			dataOne:{}, // getOne
		}; 		
	}

	componentDidMount(){
		this.getPage(); 
    }

	// get one 
	getPage = ()=> {
		let that = this;
		let {checkedData} = this.props;	

		apiGet(API_FOODING_HR,'/schedule/getOne',{id:checkedData['id']},
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
							<div className={'girdlayout'}>
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(100243/*集团*/)}</label>
										<span>{ dataOne['cluster'] ? dataOne.cluster['localName'] : ''}</span>
									</div>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(100244/*企业*/)}</label>
										<span>{ dataOne.company ? dataOne.company['localName'] :'' }</span>
									</div>
								</div>					
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600273/*班次编号*/)}</label>
										<span>{ dataOne.code || '' }</span>
									</div>	
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600274/*班次名称*/)}</label>
										<span>{ dataOne.name || '' }</span>
									</div>
								</div>
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600277/*考勤开始时间*/)}</label>
										<span>{ dataOne.attenceBeginTime || '' }</span>
									</div>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600275/*上班时间*/)}</label>
										<span>{ dataOne.officeTime || '' }</span>
									</div>
								</div>
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600278/*休息开始时间*/)}</label>
										<span>{ dataOne.halfTimeBegin || '' }</span>
									</div>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600279/*休息结束时间*/)}</label>
										<span>{ dataOne.halfTimeEnd || '' }</span>
									</div>
								</div>						
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600276/*下班时间*/)}</label>
										<span>{ dataOne.closingTime || '' }</span>
									</div>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600280/*早退允许值*/)}</label>
										<span>{dataOne['leaveEarly'] || '0'}</span>
										<span>&nbsp;{I18n.t(400196/*分钟*/)}</span>								  
									</div>
								</div>
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600281/*迟到允许值*/)}</label>
										<span>{dataOne['beLate'] || '0'}</span>
										<span>&nbsp;{I18n.t(400196/*分钟*/)}</span>								  
									</div>	
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600282/*加班起始值*/)}</label>
										<span>{dataOne['overTime'] || '0'}</span>
										<span>&nbsp;{I18n.t(400196/*分钟*/)}</span>								  
									</div>
								</div>						
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600283/*旷工起始值*/)}</label>
										<span>{dataOne['absenteeism'] || '0'}</span>
										<span>&nbsp;{I18n.t(400196/*分钟*/)}</span>								  
									</div>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(100300/*创建日期*/)}</label>
										<span>{new Date(dataOne['createDate']).Format('yyyy-MM-dd')}</span>
									</div>
								</div>
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(600270/*标准工时*/)}</label>
										<span>{dataOne['manHour']}</span>
									</div>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(100002/*描述*/)}</label>
										<textarea readOnly style={{height:"90px",border:'none'}} name="lsbePort" value={dataOne['memo']}></textarea>
									</div>
								</div>
								<div className={'row'}>
										<div className='form-group col-md-6'>
											<label className={'col-md-4'}>{I18n.t(100549/*是否默认*/)}</label>
											<Checkbox
									
												checked={dataOne['approve']}
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

