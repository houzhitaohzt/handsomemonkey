/*
	create by houzhitao
	查看审批 公共的流程 (应该仅仅用于HR)
*/
import React, {Component, PropTypes} from "react";
import {createForm,FormWrapper} from "../../../../../components/Form";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,API_FOODING_HR} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import { I18n } from '../../../../../lib/i18n';
class ApprovalDialog extends Component{
    constructor(props){
        super(props)
        this.state = {
            commonList:[] //审批记录列表
        }
    }
    onCancel = () => {
        let {onCancel} = this.props;
        if(onCancel){
            onCancel();
        }
    }
    //拉取查看审批列表
    initApprovalList = (billId,billType) => {
        if(!billId) return;
        if(!billType) return;
        apiGet(API_FOODING_HR,'/common/getApprovalRecords',{billType:billType,billId:billId},response => {
            let commonList = response.data || [];
            this.setState({commonList})
        },error => ServiceTips({text:error.message,type:'error'}))
    }
    componentDidMount(){
        let {billId,billType} = this.props;
        this.initApprovalList(billId,billType);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.billId !== nextProps.billId || this.props.billType !== nextProps.billType){
            this.initApprovalList(nextProps.billId,nextProps.billType);
        }
    }
    /*componetWillUnMount(){
        this.setState({commonList:[]});
    }*/
    render(){
        let titleDom,listDom;
        if(this.state.commonList.length == 0){
            titleDom=<span></span>;
            listDom = (<div className={"row"} style={{fontSize:"30px"}}>{I18n.t(400107/*暂时没有批注信息*/)}</div>);
        }else{
            titleDom = (<div className={'row'} style={{padding:'5px 0',backgroundColor:"#cacce4",borderRadius:"50%"}}>
                <div className="form-group col-md-4 col-lg-4" style={{textAlign:'center',fontSize:"20px"}}>{I18n.t(400104/*时间*/)}</div>
                <div className="form-group col-md-4 col-lg-4" style={{textAlign:'center',fontSize:"20px"}}>{I18n.t(400105/*批注人*/)}</div>
                <div className="form-group col-md-4 col-lg-4" style={{textAlign:'center',fontSize:"20px"}}>{I18n.t(400106/*历史批注信息*/)}</div>
            </div>);
            listDom = this.state.commonList.map((e,i) => {
                return (<div key={i} className={'row'} style={{padding:'2px 0'}}>
                    <div className="form-group col-md-4 col-lg-4">
                        <div className={'col-md-12 col-lg-12'}>
                            <p className={'paragraph shengyue'} style={{textAlign:'center'}}>{new Date(e.time || "").Format('yyyy-MM-dd hh:mm:ss')}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-4 col-lg-4">
                        <div className={'col-md-12 col-lg-12'}>
                            <p className={'paragraph shengyue'} style={{textAlign:'center'}}>{e.userId || ""}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-4 col-lg-4">
                        <div className={'col-md-12 col-lg-12'}>
                            <p className={'paragraph shengyue'} style={{textAlign:'center'}}>{e.message || ""}</p>
                        </div>
                    </div>
                </div>)
            })
        }
        return (<FormWrapper showFooter={true} showSaveClose={false} onCancel={this.onCancel}>
            {titleDom}
            {listDom}
        </FormWrapper>);
    }
}
export default ApprovalDialog;