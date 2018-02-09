import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../components/Form';
//引入select插件
import Select, {Option,ConstVirtualSelect} from '../../../components/Select';
//引入ajax请求
import {
    apiGet, apiPost, apiForm, API_FOODING_ES , API_FOODING_OA, hrefFunc,permissionsBtn,
    API_FOODING_ERP, API_FOODING_DS, API_FOODING_HR, pageSize, sizeList, toDecimal, language
} from "../../../services/apiCall";
import ServiceTips, {errorTips} from "../../../components/ServiceTips";

import {I18n} from "../../../lib/i18n";
import DataTime from '../../../components/Calendar/Calendar';

import xt from '../../../common/xt';
import WebData from '../../../common/WebData';

// ant
import {TimePickerN} from "../../../components/TimePicker/TimePicker";
import Upload from 'antd/lib/upload';

export class  PunchEditDialog extends Component{
    constructor(props){
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state = {
            attentment:[] , //文件数组
            businessId:props.data.no || ""
        };

    }
    onSaveAndClose(){
        const {form, onSaveAndClose,onCancel, data,attendId} = this.props;
        form.validateFields((errors, value) => {
            if(errors){

            }else{
                let params = Object.assign({},data, value, {attendId:attendId});
                apiPost(API_FOODING_HR, "/explainRegister/save", params, response => {
                    onSaveAndClose && onSaveAndClose();
                    onCancel && onCancel();
                    form.resetFields();
                }, error => ServiceTips({text:error.message,type:'error'}))

            }
        })
    }
    onCancel(){
        const {onCancel}=this.props;
        if(onCancel){
            onCancel();
            this.props.form.resetFields();
        }
    }

    /**
     * 拉取上传文件列表
     * */
    getRadioAttentmentList = () => {
        let that = this;
        apiGet(API_FOODING_OA, '/fastdfs/getList', {businessId: this.state.businessId, businessType: "card-file-oa"
        }, response => {
            let attentment = response.data.data || [];
            that.setState({attentment})
        }, error => ServiceTips({text: error.message, type: 'error'}))
    };

    /**
     * 每一次上传图片判断是否成功
     * */
    handleChange = info => {
        if (info.file.status === 'uploading') {

        }
        if (info.file.status === 'done') {
            this.getRadioAttentmentList();
        }
    };

    /**
     * 上传之前,对图片的判断
     * */
    beforeUpload = (info) => {
        const isLt2M = info.size / 1024 / 1024 < 400;
        if (!isLt2M) {
            ServiceTips({text: "文件大小不能大于400M", type: 'error'});
        }
        return isLt2M;
    };

    componentDidMount() {
        this.getRadioAttentmentList();
    }

    componentWillReceiveProps(props){
        if(this.props.no !== props.no){
            this.setState({businessId:props.no})
        }
    }

    /**
     * 上传附件后的文件
     * */
    renderAttachment = (item,index) => {
        return (
            <div className="attachment-a" key={index} style={{float:"left"}}>
                <span>{item.fileName}</span>
                <i className='foddingicon fooding-close-01' onClick={this.onDelFileClick.bind(this,item)}></i>
            </div>
        )
    };

    /**
     * 删除某一个 上传的文件
     * */
    onDelFileClick = (item,e) => {
        e.stopPropagation && e.stopPropagation();
        let that = this;
        apiForm(API_FOODING_OA, '/fastdfs/delete', {id: item.id}, response => {
            that.getRadioAttentmentList();
        }, error => ServiceTips({text:error.message, type:'error'}))
    };

    render(){
        let that = this;
        const { getFieldProps, getFieldError } = this.props.form;
        let { data } = this.props;

        const addUploadWJ = {
            name: 'file',
            action: API_FOODING_OA + '/fastdfs/upload',
            data: {
                businessType: "card-file-oa",
                businessId: this.state.businessId
            }
        };
        return(
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976} buttonLeft={"提交"}>
                    <div className={'girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-xs-12 col-md-12">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(400261/*申述日期*/)}</label>
                                <div className={'col-md-6 col-lg-6 datetime'}>
                                    <DataTime
                                        showTime={false}
                                        isShowIcon={false}
                                        width={'100%'}
                                        value={data.scheduleDate || ""}
                                        form={this.props.form}
                                        name={'scheduleDate'}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-xs-12 col-md-12">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(400256/*申述类型*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    fieldName="explainType"
                                    apiType={apiPost}
                                    apiParams="com.fooding.fc.enumeration.ExplainType"
                                    rules
                                    initValueOptions={[]}
                                    initialValue={""}
                                    className="col-md-4 col-lg-4"
                                    style={{marginRight: "10px"}}
                                />
                                <TimePickerN
                                    form={this.props.form}
                                    name={"newDate"}
                                    defaultValue={undefined}
                                    rules={true}
                                />
                            </div>
                            <div className="form-group col-xs-12 col-md-12">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(400259/*申述原因*/)}</label>
                                <textArea className={getFieldError('remark')?'col-md-6 col-lg-6 textarea error-border':'col-md-6 col-lg-6 textarea'}
                                {...getFieldProps('remark', {
                                    validateFirst:true,
                                    rules:[{required:true}],
                                    initialValue: ""
                                })}></textArea>
                            </div>
                            <div className="form-group col-xs-12 col-md-12">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(400260/*申请时间*/)}</label>
                                <div className={'col-md-5 col-lg-5 datetime'}>
                                    <p>{new Date(data.createDate).Format('yyyy-MM-dd hh:mm:ss')}</p>
                                </div>
                                <Upload
                                    {...addUploadWJ}
                                    onChange={this.handleChange}
                                    beforeUpload={this.beforeUpload}
                                    showUploadList={false}
                                >
                                    <span style={{color:"#0066cc", cursor:"pointer"}}>{i18n.t(400262/*上传附件*/)}</span>
                                </Upload>

                            </div>
                            <div className="form-group col-xs-12 col-md-12">
                                <label className={'col-xs-3 col-md-3'}></label>
                                <div className={'col-md-6 col-lg-6'}>
                                    {this.state.attentment.map(this.renderAttachment)}
                                </div>
                            </div>
                        </div>
                    </div>
                </FormWrapper>
            </div>
        );
    }
}
PunchEditDialog.propTypes ={
    onSaveAdd:PropTypes.func,
    onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
PunchEditDialog.defaultProps ={
    onSaveAdd(){},
    onSaveAndClose(){},
    onCancel(){}
}
export default createForm()(PunchEditDialog);

