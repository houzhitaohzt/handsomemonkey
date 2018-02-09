import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'
import {I18n} from '../../../../lib/i18n';
import Upload from 'antd/lib/upload';
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_HR,API_FOODING_DS,API_FOODING_ERP} from '../../../../services/apiCall'; // ajax
import ServiceTips from '../../../../components/ServiceTips'; // 提示框


const props = {
  name: 'file',
  action: API_FOODING_HR +'/record/upload',
  headers: {
    authorization: 'zhang',
	}
};


class FunctionKeys extends Component{
	constructor(props){
		super(props);

		this.state = {
			downParam:''
		}
	}

	// 上传 
	onChange =(info)=> {
	    // if (info.file.status !== 'uploading') {
	    //   // console.log(info.file, info.fileList);
	    // }
		if(!info.file.response) return;

		// 成功
	    if( info.file.response.status == 'success' ) {
			ServiceTips({text:info.file.response.message,type:'sucess'});
	    	this.props.getPage();
	    } 

		// 失败		
		if( info.file.response.status == 'error' ) {
			ServiceTips({text:`${info.file.name} ${info.file.response.message}`,type:'error'});
	    }

  	}

	//   
	downHandle = ()=>{
		let data = this.props.that.refs.heard.getFieldsValue();

		// 时间补零
        data.leaveStartDate = data.leaveStartDate ? data.leaveStartDate + ' 00:00:00' : data.leaveStartDate;
        data.leaveEndDate = data.leaveEndDate ? data.leaveEndDate + ' 23:59:59' : data.leaveEndDate;
        data.enterStartDate = data.enterStartDate ? data.enterStartDate + ' 00:00:00' : data.enterStartDate;
        data.enterEndDate = data.enterEndDate ? data.enterEndDate + ' 23:59:59' : data.enterEndDate;

		let param = '';

		for( let key in data) {
			param += key+'='+(data[key] || '')+'&'; 
		}

		this.setState({downParam:param});
	}


	render(){
		let that = this;
		let {downParam} = this.state;
		const {deleteClick,priceClick}=this.props;
		let  iconArray = [
			// {type:'add',onClick:addClick,permissions:'competitors.add'},

			
		];
		let  downloadUrl = API_FOODING_DS+'/customsData/download?' + downParam;



		return (
			<div className="oprate-btn">

				{ permissionsBtn('attendancerobot.reckon') ? 
					<a className='btn-group' title={I18n.t(200062/*计算价格*/)}>
						<i className="foddingicon fooding-count-cost" onClick={priceClick}></i>
					</a>
					: ''
				}

				{/*{ permissionsBtn('Customs.export') ? */}
				{ 0 ? 
					<a className='btn-group' title={I18n.t(201308/*导出*/)} href={downloadUrl} onClick={this.downHandle}>
						<i className = {'foddingicon fooding-Export'}></i>
					</a>				
					: ''
				}

				{ permissionsBtn('robotattence.import') ? 
					<Upload {...props} showUploadList={false} onChange ={this.onChange}>
						<label className='btn-group' title={I18n.t(500252/*导入*/)}>
							<i className = {'foddingicon fooding-import'}></i>
						</label>
					</Upload>					
					: ''
				}



																			
			</div>
		)
	}
}

export default FunctionKeys

