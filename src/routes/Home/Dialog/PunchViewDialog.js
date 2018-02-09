import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../components/Form';
//引入select插件
import Select, {Option,ConstVirtualSelect} from '../../../components/Select';
//引入ajax请求
import {
    apiGet, apiPost, apiForm, API_FOODING_ES,hrefFunc,permissionsBtn,
    API_FOODING_ERP, API_FOODING_DS, pageSize, sizeList, toDecimal, language
} from "../../../services/apiCall";

import {I18n} from "../../../lib/i18n";
import DataTime from '../../../components/Calendar/Calendar';
import xt from '../../../common/xt';
import WebData from '../../../common/WebData';

export class  PunchViewDialog extends Component{
    constructor(props){
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state = {
            fileList:[], //文件列表
            businessId:props.getOne.no || ""
        }
    }
    onCancel(){
        const {onCancel}=this.props;
        if(onCancel){
            onCancel();
        }
    }

    /**
     * 拉取上传文件列表
     * */
    getFileRadioList = () => {
        let that = this;
        apiGet(API_FOODING_OA, '/fastdfs/getList', {businessId: this.state.businessId, businessType: "card-file-oa"}, response => {
            let fileList = response.data.data || [];
            that.setState({fileList})
        }, error => ServiceTips({text: error.message, type: 'error'}))
    };

    renderFileDown = () => {
        return (<div className="file-down">
            {
                this.state.fileList.map((e, i) => {
                    return (
                        <div className="file-down-own" key={i}>
                            <div className="word">
                                <h4>{e.fileName}</h4>
                                <h5>{e.length || "0KB"}</h5>
                            </div>
                            <a href={API_FOODING_OA + "/fastdfs/download?fileName=" + e.fileName + "&fullPath=" + e.fullPath}><i
                                className='foddingicon fooding-download2'></i></a>
                        </div>
                    )
                })
            }
        </div>)
    };

    componentDidMount(){
        this.getFileRadioList();
    }
    render(){
        let that = this;
        let { getOne = {} } = this.props;
        const { getFieldProps, getFieldError } = this.props.form;
        return(
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} onCancel={this.onCancel} width={976} showSaveClose={false}>
                    <div className={'girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(400256/*申述类型*/)}</label>
                                <div className={'col-md-8 col-lg-8'}>
                                    <p className={'paragraph shengyue'}>{getOne.explainTypeName || ""}</p>
                                </div>
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(400257/*班次信息*/)}</label>
                                <div className={'col-md-8 col-lg-8'}>
                                    <p className={'paragraph shengyue'}>{getOne.schduleName || ""}</p>
                                </div>
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(400258/*打卡信息*/)}</label>
                                <div className={'col-md-8 col-lg-8'}>
                                    <p className={'paragraph shengyue'}>{getOne.statusName || ""}</p>
                                </div>
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(400259/*申述原因*/)}</label>
                                <div className={'col-md-8 col-lg-8'}>
                                    <p className={'paragraph shengyue'}>{getOne.remark || ""}</p>
                                </div>
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(200817/*申请人*/)}</label>
                                <div className={'col-md-8 col-lg-8'}>
                                    <p className={'paragraph shengyue'}>{getOne.applyLcName || ""}</p>
                                </div>
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}>{i18n.t(400260/*申请时间*/)}</label>
                                <div className={'col-md-8 col-lg-8'}>
                                    <p className={'paragraph shengyue'}>{getOne.scheduleDate || ""}</p>
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            {this.renderFileDown()}
                        </div>
                    </div>
                </FormWrapper>
            </div>
        );
    }
}
PunchViewDialog.propTypes ={
    onSaveAdd:PropTypes.func,
    onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
PunchViewDialog.defaultProps ={
    onSaveAdd(){},
    onSaveAndClose(){},
    onCancel(){}
}
export default createForm()(PunchViewDialog);

