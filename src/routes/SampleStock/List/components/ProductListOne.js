import React, {Component, PropTypes} from "react";
import Page from "../../../../components/Page";//分页
import I18n from '../../../../lib/i18n';
import {createForm, FormWrapper} from '../../../../components/Form';
import {ConstMiniSelect, Option} from '../../../../components/Select';
const {Table} = require("../../../../components/Table");//Table表格



class ProductOne extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
	}

	initState(){
		return {
		}
	}

	// 保存 
	saveHandle = ()=> {
		let that = this;
		this.props.form.validateFields((errors,value) => {
			if(errors){
			}else{
				console.log( value );
				
				console.log( that );
			}
		});	
		// this.onCancel();
	}

	// 取消 
	onCancel = ()=> this.props.onCancel();

	render(){
		const {columns,data} = this.props;

		return(<FormWrapper showFooter={true} onSaveAndClose={this.saveHandle}  onCancel={this.onCancel} showAddSave={false}>
				<div style={{height:'334px',overflow:'auto'}} className={'scroll'}>
					<div className={'client-body-single'}>
						<div className={'girdlayout'}>
							<div className={'row'}>
								<div className="col-md-4">
									<label className={'col-md-4'}>{I18n.t(100379/*产品*/)}</label>
									<div className={'col-md-8'}>
										<p className={'paragraph'}>{data.no || ''}</p>
									</div>
								</div>
								<div className="col-md-4">
									<label className={'col-md-4'}>{I18n.t(200173/*样品数量*/)}</label>
									<div className={'col-md-8'}>
										<p className={'paragraph'}>{data.statusName || ''}</p>
									</div>
								</div>
								<div className="col-md-4">
									<label className={'col-md-4'}>{I18n.t(400035/*产品单位*/)}</label>
									<div className={'col-md-8'}>
										<p className={'paragraph'}>{data.statusName || ''}</p>
									</div>
								</div>						
							</div>
							<div className={'row'}>
								<div className="col-md-4">
									<label className={'col-md-4'}>HSCODE</label>
									<div className={'col-md-9 col-lg-8'}>
										<p className={'paragraph'}>{data.sourceTypeName || ''}</p>
									</div>
								</div>
								<div className="col-md-4">
									<label className={'col-md-4'}>{I18n.t(100382/*产品规格*/)}</label>
									<div className={'col-md-8'}>
										<p className={'paragraph'}>{data.statusName || ''}</p>
									</div>
								</div>
								<div className="col-md-4">
									<label className={'col-md-4'}><span>*</span>{I18n.t(200177/*样品库*/)}</label>
									<div className={'col-md-8'}>
										<ConstMiniSelect form={this.props.form}
											pbj={{
												params: {obj:'com.fooding.fc.ds.entity.StorLocatn',
													queryParams:[
														{ attr:'ccid',  expression:'=', value:'583b8dfe0cf2e134dc8fba60' || ""},
														{ attr:'stroTyId',  expression:'=', value:10},
														// { attr:'plntId',  expression:'=', value:businessOne.plantId || ""}
														]
												}
											}} fieldName="receSlId"
											optionValue={(da, di) => <Option key={di} objValue={{
												receSlId: da.id,
												receSlLcName: da.localName,
												receSlEnName: da.name,
												s_label: da["localName"]
											}}>{da.localName}</Option>}
											reles={true}
										/>
									</div>
								</div>					
							</div>
						</div>				
						<Table 
							columns={columns}
							data={data}
							checkboxConfig={{show:false}}
							followConfig={{show:false}}
							scroll={{x:false,y:false}}
						/>
					</div>				
				</div>
		</FormWrapper>)
	}
}
export default createForm()(ProductOne);

