import i18n from '../../../../lib/i18n';
import React,{Component,PorpTypes} from "react"
import Upload from 'antd/lib/upload';
//引入按钮键
import  Confirm from  '../../../../components/button/confirm'
import {
    permissionsBtn, apiGet, apiPost, apiForm, API_FOODING_OA, language, pageSize, sizeList,
    API_NOOHLE_OA
} from '../../../../services/apiCall';
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
        const addUploadWJ = {
            name: 'file',
            action: API_NOOHLE_OA +'/upload',
            headers: {
                authorization: 'zhang',
            },
            data:{
                businessType:this.props.businessType,
                businessId:this.props.id
                // parent_id:this.props.muluId
            }
        };
        const {paymentClick,shangchuangClick,deleteClick}=this.props;
        return (
            <div className="oprate-btn">
                {
                    this.props.iconArray.map((e,i)=>{
                        if( e['permissions'] && !(permissionsBtn(e['permissions'])) ) return;  // 控制按钮 权限
                        if(e.type == 'delete'){
                            return (<a className='btn-group' data-permissions={e['permissions']} title={e.title} key={i} style={{float:'right'}}>
                                <i onClick={e.onClick.bind(this,that)} className = {e.classn}></i>
                            </a>)
                        }
                        if(e.type == 'add'){
                            return( <Upload  showUploadList={false} {...addUploadWJ}  onChange ={this.props.onChange} key={i} multiple={true}>
                                <label className='btn-group'>
                                    <i className = {e.classn}></i>
                                </label>
                            </Upload>);
                        }
                    })
                }

            </div>
        )
    }
}

export default FunctionKeys
