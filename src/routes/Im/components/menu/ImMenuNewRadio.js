import React, { Component } from "react";

import Upload from 'antd/lib/upload';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_OA, API_FOODING_MESSAGE} from '../../../../services/apiCall';
import ServiceTips, {errorTips} from "../../../../components/ServiceTips";

import GoComponent from "./GoComponent";

export const BUSINESSTYPE = "Noohle-Message-Radio";
import i18n from "../../../../lib/i18n";

const FixStyle = {
  headerStyle :{
      position:"fixed",
      width:"98%",
      height:"96%",
      top:"2%",
      left:"1%",
      backgroundColor:"#fff",
      borderRadius:"6px",
      boxShadow: "1px 1px 16px 0 rgba(0, 0, 0, 0.5)"
  }
};

class ImMenuNewRadio extends Component{
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            receivers : [], //接收者
            attentment: [], //上传的附件
            radioId:null,  //广播id
            textContent:""  //内容
        }
    }

    /**
     * 选中 得到数据
     * */
    onChange = receivers => {
      this.setState({receivers})
    };

    /**
     * 头部
     * */
    renderHeader = () => {
      return(
          <div className='im-radio-header'>
              <div className='im-radio-center'>
                  <i className='foddingicon fooding-broadcast'/>&nbsp;&nbsp; {i18n.t(400263/*新建广播*/)}
              </div>
              <i className='foddingicon fooding-close-01' onClick={this.props.onClose}/>
          </div>
      )
    };

    /**
     * 取消新建广播
     * */
    onClose = () => {
        this.fileDelAllNoSend();
        this.props.onClose && this.props.onClose();
    };

    /**
     * 接收者
     * */
    renderReceive = (item,index) => {
        let that = this;
        return (<h4 className="text" key={index}>
            <span className={'word'}>{item.localName || item.staffLocalName}</span>
            <i className='foddingicon fooding-close-01' onClick={that.onDelReceiveClick.bind(that, item)}></i>
        </h4>)
    };

    /**
     * 删除
     * onDelReceiveClick
     * */
    onDelReceiveClick = (item, e) => {
      e.stopPropagation && e.stopPropagation();
      let receivers = Array.from(this.state.receivers);
      let idx = receivers.findIndex( e => e.id == item.id);
      receivers.splice(idx,1);
      this.setState({receivers});
    };

    /**
     * 上传附件后的文件
     * */
    renderAttachment = (item,index) => {
      return (
          <div className="attachment-a" key={index}>
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

    /**
     * 当上传文件后,, 没有选中发送按钮,而是点击关闭弹窗
     * 是否把刚才上传的文件删除掉???
     * 我目前是选中删除的
     * */
    fileDelAllNoSend = () => {
      let { attentment }  = this.state;
      if(attentment.length) return false;
      let ids = attentment.map( e => e.id);
      apiPost(API_FOODING_OA, "/fastdfs/delete", {id: ids}, response => {}, error => ServiceTips({text:error.message, type:'error'}))
    };

    /**
     * 获取新建广播的id
     * */
    getNewRaidoId = () => {
        let that = this;
        apiGet(API_FOODING_MESSAGE, "/broadcast/getNewId", {}, response => {
            console.log(response.data, 'radioId');
            that.setState({radioId:response.data})
        }, error => ServiceTips({text:error.message, type:'error'}))
    };


    /**
     * 点击发送,, 新建广播
     * */
    onSendNewRaido = () => {
        let that = this;
        let { receivers, radioId, textContent } = this.state;
        let receiverId = receivers.filter(e => e.isUser).map(da => da.id);
        let partyIds = receivers.filter(e => e.isOrg).map(da => da.id);
        let broadcast = Object.assign({}, {id:radioId, content:textContent, receiverId, partyIds});
        apiPost(API_FOODING_MESSAGE, "/broadcast/sendBroadcast", broadcast, response => {
            ServiceTips({text:response.message, type:'success'});
            that.props.onClose && that.props.onClose();
        }, error => {
            ServiceTips({text:error.message, type:'error'});
            that.props.onClose && that.props.onClose();
        });
    };

    /**
     * 获取content 内容
     * */
    onTextareaChange = e => {
        let txt = e.target.value;
        this.setState({textContent:txt});
    };

    /**
     * 拉取上传文件列表
     * */
    getRadioAttentmentList = () => {
        let that = this;
        apiGet(API_FOODING_OA, '/fastdfs/getList', {businessId: this.state.radioId, businessType: BUSINESSTYPE
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
            ServiceTips({text: '文件大小不能大于400M', type: 'error'});
        }
        return isLt2M;
    };

    componentDidMount() {
        this.getNewRaidoId();
    }

    render(){
        let {receivers, attentment, textContent } = this.state;

        const addUploadWJ = {
            name: 'file',
            action: API_FOODING_OA + '/fastdfs/upload',
            data: {
                businessType: BUSINESSTYPE,
                businessId: this.state.radioId
            }
        };

        return(<div style={FixStyle.headerStyle}>
            {this.renderHeader()}
            <div className={'im-radio-body'}>
                <div className="im-radio-body-content">
                    <div className="im-radio-body-content-all">
                        <div className="rece">
                            <h4 className="text title"><span className={'word'}>接收者:</span></h4>
                            <div className="rece-select">
                                {this.state.receivers.map(this.renderReceive)}
                            </div>
                            <h4 className="rece-count"><span>{receivers.length} / 500</span></h4>
                        </div>
                        <h4 className="text title" style={{paddingLeft:"0px",position:'absolute',top:"50px",left:"10px"}}><span className={'word'}>{i18n.t(200041/*内容*/)}</span></h4>
                        <div className="cont">
                            <textarea className="scroll" onChange={this.onTextareaChange} value={textContent}></textarea>
                        </div>
                        <div className="attachment scroll">
                            {this.state.attentment.map(this.renderAttachment)}
                        </div>
                        <div className="assnoy">
                            <span className={'assnoy-span'}>
                                <i className="foddingicon fooding-lianjie"></i>
                                {attentment.length ? <span className={'word'}>{attentment.length}个附件</span>:null}
                                <Upload
                                    {...addUploadWJ}
                                    onChange={this.handleChange}
                                    beforeUpload={this.beforeUpload}
                                    showUploadList={false}
                                >
                                    <span className={'word'}>{!attentment.length?i18n.t(400264/*添加附件*/):i18n.t(400265/*继续添加*/)}</span>
                                </Upload>
                            </span>
                            <button className={'button'} onClick={this.onSendNewRaido}>{i18n.t(200427/*发送*/)}</button>
                        </div>
                    </div>
                </div>
                <div className="im-radio-body-select">
                    <GoComponent onChange={this.onChange} selectedArr={receivers}/>
                </div>
            </div>
        </div>)
    }
}
export default ImMenuNewRadio;