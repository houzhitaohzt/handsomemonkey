import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
const {Table} = require("../../../components/Table");


import {ConstVirtualSelect} from '../../../components/Select/';
import {getQueryString,apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';

export class  ContactDialog extends Component{
	constructor(props){
		super(props);

		// list 
		this.columns = [{
			title : i18n.t(100000/*代码*/),
			dataIndex : 'code',
			key : "code",
			width : '7%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(500061/*产品名称*/),
			dataIndex : "localName",
			key : "localName",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100382/*产品规格*/),
			dataIndex : "specTxt",
			key : "specTxt",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		}];

		this.state = {
			data: [],
		}		
	}

	componentDidMount(){
        this.getPage();
    };

	// 关闭
	onCancel = ()=>{
		this.props.onCancel();
	}

	getPage = ()=>{
		let that = this;
		apiGet(API_FOODING_DS,'/beMtl/getCustRivalMtlList',{customerId:getQueryString("id"),rivalId:that.props['id']},
			(response)=>{	
				that.setState({	
					data: response.data || [],
				});
			},(errors)=>{
		});		
	}


	render(){
		return(
			<div className=" ">
				<FormWrapper showSaveClose={false} showFooter={true} onCancel={this.onCancel} width={976}>
					<Table  
						columns={this.columns}
						scroll={{x:true,y:230}}
						data={this.state.data}
						checkboxConfig={{show:false}}
						style={{width:'100%'}}
					/>
				</FormWrapper>
			</div>
		);
	}
}
const DialogFrom =createForm()(ContactDialog);
export default DialogFrom;

