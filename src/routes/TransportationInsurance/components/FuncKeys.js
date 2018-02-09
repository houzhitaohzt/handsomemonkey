import i18n from './../../../lib/i18n';
import React,{Component,PorpTypes} from "react"
import Upload from 'antd/lib/upload';
//引入按钮键
import  Confirm from  '../../../components/button/confirm'
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../services/apiCall';
const props = {
  name: 'file',
  action: API_FOODING_ERP +'/excelhandle/upload',
  headers: {
    authorization: 'zhang',
	}
};
class FunctionKeys extends Component{
	constructor(props){
		super(props);
		this.onChange = this.onChange.bind(this);
	}
	onChange(info) {
	    if (info.file.status !== 'uploading') {
	      // console.log(info.file, info.fileList);
	    }
	    if (info.file.status === 'done') {
	    	this.props.getPage();
	    } else if (info.file.status === 'error') {
	      // message.error(`${info.file.name} file upload failed.`);
	    }
  	}
	render(){
		let that = this;
		const {paymentClick,shangchuangClick,deleteClick}=this.props;
		let  iconArray = [{type:'payment',onClick:paymentClick}]
		let  downloadUrl = API_FOODING_ERP+'/excelhandle/download?fileCode=PREMIUM';
		return (
			<div className="oprate-btn">
									<a className='btn-group' title={i18n.t(100437/*删除*/)}>
										<i className = {'foddingicon fooding-delete-icon4'} onClick={deleteClick}></i>
									</a>
				<a className='btn-group' title={i18n.t(200406/*费用单*/)}>
               		 <i className = {'foddingicon fooding-payment-apply'} onClick={paymentClick}></i>
                </a>
        <a className='btn-group' title={i18n.t(100448/*报销*/)}>
                       		 <i className = {'foddingicon fooding-baoxiao'} onClick={this.props.baoxiaoClick}></i>
        </a>
				<a className='btn-group' title={i18n.t(200083/*下载*/)}  href = {downloadUrl}>
               		 <i className = {'foddingicon fooding-download '}></i>
                </a>
                 <Upload {...props} showUploadList={false} onChange ={this.onChange}>
				    <label className='btn-group'>
				      <i className = {'foddingicon fooding-uploading'}></i>
				    </label>
				 </Upload>
			</div>
		)
	}
}

export default FunctionKeys
