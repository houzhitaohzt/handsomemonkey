import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {FormWrapper} from "../../../../../components/Form";

import Table from "../../../../../components/Table";
import {API_FOODING_ERP, apiGet} from '../../../../../services/apiCall';

export default class extends Component{
	constructor(props){
		super(props);
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
			dataIndex : "userId",
			key : "userId",
			width : "30%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400106/*历史批注信息*/),
			dataIndex : "message",
			key : "message",
			width : "50%",
			render(data,row,index){
				return data;
			}
		}];
		this.state = {
		    dataList: [],
        };
		this.onCancel=this.onCancel.bind(this);
	}

    componentDidMount() {
        this.fetchList();
    }

    fetchList  = ()=>{
	    let {dataOne} = this.props;
        apiGet(API_FOODING_ERP, '/common/getApprovalRecords',
            {billId: dataOne.billId, billType: dataOne.billType},
            response => {
                this.setState({dataList: response.data});
            }, error => {
                window.Tip.errorTips(error.message);
            })
    };

	static propTypes = {
		onCancel:PropTypes.func
	};

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}

	render(){
		return(<FormWrapper showFooter={true} onCancel={this.onCancel} showSaveClose={false}>
				<div style={{height: 300}}>
					<Table 
						columns={this.coulmn}
						data={this.state.dataList}
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
