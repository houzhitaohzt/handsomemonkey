import React, {PropTypes, Component} from "react";


// upload 
import Upload from 'antd/lib/upload';	// JS

// import 'antd/lib/upload/style'; 		


import 'antd/lib/upload/style/index.css';		// css
import 'antd/lib/progress/style/index.css';		// css
import 'antd/lib/tooltip/style/index.css';		// css
import './index.less';		// 自定义 样式




// tip
import ServiceTips from '../../components/ServiceTips';



class UploadImg extends Component {
	constructor(props){
		super(props);
	}

	// 控制 图片格式|大小
	beforeUpload = (file)=>{
		let isJPG = ( (file.type === 'image/jpeg') || (file.type === 'image/png') );
		if (!isJPG) {
			ServiceTips({text:'只支持格式 jpg/png！',type:'info'});
		}
  		let isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			ServiceTips({text:'Image must smaller than 2MB!',type:'info'});			
		}

		return isJPG && isLt2M;
	}





	render(){

		let that = this;
		const {onRemove,ID,action='',label='上传图片',showBtn=true} = this.props;

		// 图片上传  展示
		const fileList = [
			// {
			// uid: -1,
			// name: 'xxx.png',
			// status: 'done',
			// url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
			// thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
			// }
		];

		// 图片上传  路径
		const props = {
			action: action,
			listType: 'picture',
			defaultFileList: [...fileList],
			data:{businessType:'register--picture',businessId:ID},
			// multiple: true,	// 一次多张

			// ajax 请求流程
			onChange(info) {
				if (info.file.status !== 'uploading') {
      				// console.log(info.file, info.fileList);
					if (info.file.status === 'error') {
						that.props.onChange({
							type:'error',
							fileReturn:info.file.response,
						});
						return;					
					}
					if ( (info.file.status === 'done') || (info.file.status === 'removed') ) {
						that.props.onChange({
							type:'success',
							fileReturn:info.file.response,
							fileListReturn:info.fileList,
						});
					}
				}
 
			},
		};



		return   <div>
					<Upload 
						{...props}
						beforeUpload={this.beforeUpload}
						onRemove={onRemove}
					>
						{ showBtn ?
							<button>
								{label}
							</button>
							:
							''
						}

					</Upload>
				</div>

	}
}

module.exports = {
	UploadImg:UploadImg
}
