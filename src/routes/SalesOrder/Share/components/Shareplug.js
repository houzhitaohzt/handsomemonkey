import i18n from '../../../../lib/i18n';
import React,{Component,PorpTypes} from "react";
import Upload from 'antd/lib/upload';
import ReactDOM from 'react-dom';
import {createForm,FormWrapper} from "../../../../components/Form";
import {apiGet,apiPost,apiForm,API_FOODING_OA,language,pageSize,sizeList} from '../../../../services/apiCall';
import WebData from '../../../../common/WebData';
export class Accessoryplug extends Component{
	constructor(props){
		super(props);
		console.log(this.props.id);
		this.floderChange = this.floderChange.bind(this);
	}
	floderChange(e){
		 var filesize = 0;
		// var flag = document.getElementById("uploadFolder");
		// //var parentId= document.getElementById("parentId").value;
		var maxsize = 100*1024*1024;//100M
		// //判断单窗口上传文件的个数
		var fileNums =0;
		// //判断节点是否存在,若存在,则显示
		// if(flag){
			   var onlyId = document.getElementById("onlyId").value;
				// document.getElementById("uploadFolder").onchange = function(e) {
					var fdata = new FormData();
					var paths ="";
					//计算上传文件的个数
				    fileNums = e.target.files.length;
				    //单窗口上传文件个数不超过500dsdfsf f
					    if(fileNums<500){
					    	for (var i = 0, f; f = e.target.files[i]; ++i) {
							    paths +=f.webkitRelativePath+"###";
							    //统计上传文件的总大小
							    filesize+=f.size;
							}
							if(filesize==-1){
						         alert(tipMsg);
						    }
						   if(filesize>maxsize){//当上传文件夹超过100MB,返回
							   alert(errMsg);
							   //location.href=$$f.ctx_fooding_oa+"/netdisk/home.action?id="+parentId;
							   //location.href = '../oa/netdistHome.html?id='+=parentId;
						   }else{
						    fdata.append('paths', paths);
							fdata.append('onlyId', onlyId);
							var xhr = new XMLHttpRequest();
							xhr.open("POST", API_FOODING_OA+"/fastdfs/upload",true);
							xhr.send(fdata);
						   }
					    }
				    // }
				
			   // }

		// let obj = Object.assign({},this.props.form.getFieldsValue(),{id:this.props.muluId,
		// 				businessType:this.props.businessType,
		// 				businessId:this.props.id,
		// 				parent_id:this.props.muluId});
		// apiForm(API_FOODING_OA,'/netdisk/folder/upload',obj,(response)=>{

		// },(error)=>{

		// })
	}
	componentDidMount(){
	  // var input = ReactDOM.findDOMNode(this.refs.customAttributes)
	  // input.setAttribute('webkitdirectory', '')
	  // input.setAttribute('directory', '')
	  // input.setAttribute('multiple', '')
	}
	render(){
		let that = this;
		const addUploadWJ = {
	  				name: 'file',
	  				action: API_FOODING_OA +'/fastdfs/upload',
	  				headers: {
	    				authorization: 'zhang',
					},
					data:{
						businessType:'saleNo',
						businessId:this.props.id,
						maybe:'flag',
					    isShareFlag:1
						// parent_id:this.props.muluId
					}
		};
		const addUploadWJJ={
	  				name: 'floder',
	  				action: API_FOODING_OA +'/fastdfs/upload',
	  				headers: {
	    				authorization: 'zhang',
					},
					data:{
						id:this.props.muluId,
						businessType:this.props.businessType,
						businessId:this.props.id
						// parent_id:this.props.muluId
					}
		};
			// <form name={'uploadFolder'} onChange = {this.floderChange}>
									 //    <input type='file'
									 //    ref='customAttributes'
									 //    id='onlyId'
									 //    />
									 //    </form>
		return (

					<FormWrapper showFooter={true} showSaveClose={false}
					onSaveAndClose={this.props.onSaveAndClose}
					onCancel={this.props.onCancel.bind(this,that)}>
									<div className="client-add scroll">
										<div className="button">
											<Upload {...addUploadWJ}  onChange ={this.props.onChange} multiple={true}>
												<div className="wenjian">
													<span>{i18n.t(200090/*添加文件*/)}</span>
												</div>
											</Upload>
										</div>
								   </div>
					</FormWrapper>
		)                                                                             
	}
}
export default Accessoryplug;
