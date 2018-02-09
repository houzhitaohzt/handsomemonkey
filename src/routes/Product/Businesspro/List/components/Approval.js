import i18n from './../../../../../lib/i18n';
import React, {PropTypes,Component} from 'react';
import {createForm, FormWrapper} from "../../../../../components/Form";

const {Table} = require("../../../../../components/Table");

class CommonForm extends Component{
	constructor(props){
		super(props)
		this.coulmn=[{
			title : i18n.t(400104/*时间*/),
			dataIndex : 'time',
			key : "time",
			width : '20%',
			render(data,row,index){
				return new Date(data).Format("yyyy-MM-dd hh:mm:ss");
			}
		},{
			title : i18n.t(400105/*批注人*/),
			dataIndex : "annotate",
			key : "annotate",
			width : "12%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400106/*历史批注信息*/),
			dataIndex : "history",
			key : "history",
			width : "20%",
			render(data,row,index){
				return data;
			}
		}]
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
	}

	static propTypes = {
		onSaveAndClose:PropTypes.func,
		onCancel:PropTypes.func
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors,value) => {
			if(null==errors){
				if(onSaveAndClose){
					onSaveAndClose(form.getFieldsValue())
				}
			}
		})
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}

	render(){
		const {data } = this.props;
		return(<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
				<div>
					<Table 
						columns={this.coulmn}
						data={data}
						checkboxConfig={{show:false}}
						colorFilterConfig={{show:false}}
						followConfig={{show:false}}
						prefixCls={"rc-confirm-table"}
						scroll={{x:false, y:300}}
					/>
				</div>
		</FormWrapper>)
	}
}
CommonForm = createForm()(CommonForm);
export default CommonForm;
