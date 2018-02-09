import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import {FormWrapper} from '../../../../components/Form';
//引入弹层
import {API_FOODING_DS, apiGet} from "../../../../services/apiCall";

export class UpdateDialog extends Component{
	constructor(props){
		super(props);
		this.onCancel = this.onCancel.bind(this);
        this.state={
        	updateList:[]
        }
	}
	initObj = () => {
		apiGet(API_FOODING_DS,"/staffChangeRecord/getList",{sourceId:this.props.sourceId},response => {
			let updateList = response.data || [];
			this.setState({updateList})
		},error => {})
	}
	onCancel(){
		const { onCancel} = this.props;
		onCancel();
	}
	componentDidMount() {
        this.initObj();
    }

    componentWillReceiveProps(props) {
        if(props.sourceId !== this.props.sourceId){
            this.initObj();
        }
    }
	render(){
		let listDom = this.state.updateList.map((e,i) => {
			return (<div className={'row'} key={i}>
						<div className="form-group col-xs-4 col-md-4">
							<div className={'col-xs-12 col-md-12'}>
								<p className={'paragraph'}>{e.startDate?new Date(e.startDate).Format('yyyy-MM-dd hh:mm:ss'):""}</p>
							</div>
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<div className={'col-xs-12 col-md-12'}>
								<p className={'paragraph'}>{e.endDate?new Date(e.endDate).Format('yyyy-MM-dd hh:mm:ss'):i18n.t(200461/*至今*/)}</p>
							</div>
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<div className={'col-xs-12 col-md-12'}>
								<p className={'paragraph'}>{String(e.newStaffs.map(e => e.localName))}</p>
							</div>
						</div>
					</div>)
		})
		return (
				<FormWrapper showFooter={true} onCancel={this.onCancel} showSaveClose={false}>
					<div className={'girdlayout scroll'} style={{overflow:'auto',height:"334px"}}>
					<div className={'row'}>
						<div className="form-group col-xs-4 col-md-4">
							{i18n.t(100305/*开始时间*/)}
						</div>
						<div className="form-group col-xs-4 col-md-4">
							{i18n.t(100306/*结束时间*/)}
						</div>
						<div className="form-group col-xs-4 col-md-4">
							{i18n.t(100361/*分管人*/)}
						</div>
					</div>
					{listDom}
				</div>
			</FormWrapper>
		)
	}
}
export default UpdateDialog;
