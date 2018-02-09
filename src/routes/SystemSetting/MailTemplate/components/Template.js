import React, {Component} from "react";
import i18n from './../../../../lib/i18n';

import {createForm,FormWrapper} from '../../../../components/Form';
import {getUser,getQueryString, apiGet, apiPost, apiForm,API_FOODING_MAIL_SERVER,API_FOODING_MAIL} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import Confirm from '../../../../components/Dialog/Confirm';
import Dialog from "../../../../components/Dialog/Dialog";
import Select, { Option } from '../../../../components/Select'; // 下拉


import ReactSummernote from '../../../../components/Summernote/components/react-summernote';
// import '../../../../components/Summernote/assets/react-summernote.less'; // import styles
// import 'react-summernote/dist/react-summernote.css'; // import styles
//TODO 这里注意,如果有样式问题
import '../../../../components/Summernote/assets/react-summernote.css'; // import styles

// import 'react-summernote/lang/summernote-ru-RU'; // you can import any other locale

// Import bootstrap(v3 or v4) dependencies
import 'bootstrap/js/modal';
import 'bootstrap/js/dropdown';
import 'bootstrap/js/tooltip';


import './index.less';
import UploadRequest from '../../../../services/request';

// dialog
class Template extends Component {
    constructor(props) {
        super(props);

        // init state
        this.state = {
            content: undefined, // 文本
        }
        this.imgUpload = this.imgUpload.bind(this);
        this.imgUploadSuccess = this.imgUploadSuccess.bind(this);
        this.imgUploadError = this.imgUploadError.bind(this);
        this.upload = this.upload.bind(this);
    }
    imgUploadError(inf0){

    }
    imgUploadSuccess(info){
        if(info.status == 'error'){
            ServiceTips({text:info.message,type:'error'});
            return false;
        }
      let imgNode = document.createElement('img');
      imgNode.src = info.data;
      ReactSummernote.insertNode(imgNode);
    }
    imgUpload(img){
      let obj = Object.assign({},{
        filename: "file",
        file: img,
        action:API_FOODING_MAIL_SERVER +  '/image/upload',
        onSuccess:this.imgUploadSuccess,
        onError:this.imgUploadError,
        headers: {
          authorization: 'authorization-text',
        },
        data: {
            email:this.props.form.getFieldValue("sendMail")||this.state.collectionName
        }
      });
      UploadRequest(obj);
    }
    upload(img){
      for(var i = 0;i<img.length;i++){
          this.imgUpload(img[i]);
      }


    }
	componentDidMount(){
        this.setState({
            content:this.props.getOne.context
        });
    }

    // confirim
    confirmHandle = ()=>{
        let that = this;
        let {content} = this.state;
        let {getPage,getOne} = this.props;

        this.props.form.validateFields((errors, value) =>{
			if(errors){
			}else{
        if(!content){  ServiceTips({text:i18n.t(700113/*请输入模板内容*/),type:'error'}); return false;}
                apiPost(API_FOODING_MAIL,'/template/content/save',Object.assign(getOne,value,{context:content || getOne['context']}),
                    (response)=>{
                        ServiceTips({text:response.message,type:'success'});
                        getPage();
                        that.cancelHandle();
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });
			}
        });

    }

    // cancel
    cancelHandle = ()=>{
        this.props.cancelHandle();
    }

    // 取值
    onChange = (content)=>this.setState({content:content});

    render(){
		const {getFieldProps,getNFieldProps,getFieldError} = this.props.form;
        let {getOne} = this.props;
        let companiesList = getUser()['companies'] || [];

        return  <div className="addnormal girdlayout">
            <div className={'row'}>
                <div className="col-md-6">
                    <label className={'col-md-2'}><span>*</span>{i18n.t(100304/*主题*/)}</label>
                    <input type="text"
                        className ={getFieldError('name')?'col-md-9 text-input-nowidth error-border':'col-md-9 text-input-nowidth'}
                        {...getFieldProps('name',{
                            rules: [{required:true}],
                            initialValue: getOne['name'] || ''
                        })}
                    />
                </div>
                <div className="col-md-6">
                    <label className={'col-md-2'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
                    <Select
                        {...getNFieldProps('ccId',{
                            rules: [{required:true}],
                           initialValue: getOne.id ? {s_label:getOne.ccName,ccName:getOne.ccName,ccId:getOne.ccId } : ''
                        })}
                        placeholder=''
                        //optionLabelProp="children"
                        //optionFilterProp="children"
                        className ={getFieldError('ccId')?'col-md-10 error-border':'col-md-10'}
                        showArrow={false}
                        allowClear={false}
                    >
                    {companiesList.map((o,i)=><Option key={i} objValue={{s_label:o.localName,ccId:o.id,ccName:o.localName,}} title={o.localName}>{o.localName}</Option>)}
                    </Select>
                </div>

            </div>
            <ReactSummernote
                value={getOne['context']}
                options={{
                    height: 230,
                    dialogsInBody: true,
                    toolbar: [
                        ['style', ['undo','redo']],
                        ['font', ['fontsize','bold', 'underline', 'clear','color','backColor','italic']],
                        ['fontname', ['fontname']],
                        ['para', ['ul', 'ol', 'paragraph','paragraph1','height']],
                        ['table', ['table']],
                        ['insert', ['link',]],
                        ['view', ['codeview']]
                    ]
                }}
                onImageUpload={this.upload}
                onChange={this.onChange}
            />
            <div className="row">
                <p style={{textAlign:'center'}}>
                    <button type="button" onClick={this.confirmHandle} className="btn btn-primary btn-sm">{i18n.t(200043/*确定*/)}</button>
                    &nbsp;&nbsp;&nbsp;
                    <button type="button" onClick={this.cancelHandle} className="btn btn-default btn-sm">{i18n.t(100461/*取消*/)}</button>
                </p>
            </div>
        </div>
    }
}
let TemplateForm = createForm()(Template);


// list
class ListDIV extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
            showDialog: false, // showDialog

            record: [], // 列表
            getOne: {}, // 单条数据
        }
    }

	componentDidMount(){
        this.getPage();
    }

    // confirm
    confirmHandle = ()=>this.getPage();

    // cancel
    cancelHandle = ()=>this.setState({showDialog: false});

    // add
    addHandle = ()=>this.setState({showDialog: true, getOne: {}});

    // detail
    detailHandle = (ID)=>{
        let that = this;

        apiGet(API_FOODING_MAIL,'/template/content/getOne',{id: ID},
            (response)=>{
                //ServiceTips({text: response.message,type: 'success'});
                that.setState({showDialog: true, getOne: response.data || {}});
            },(errors)=>{
                ServiceTips({text: errors.message,type: 'error'});
        });
    }

    // deleted
    deletedHandle = (ID)=>{
        let that = this;

        apiForm(API_FOODING_MAIL,'/template/content/delete',{id: ID},
            (response)=>{
                ServiceTips({text: response.message,type: 'success'});
                that.getPage();
            },(errors)=>{
                ServiceTips({text: errors.message,type: 'error'});
        });
    }


    // getInit
    getPage = ()=>{
        let that = this;

        apiGet(API_FOODING_MAIL,'/template/content/getPublishList',{},
            (response)=>{
                that.setState({	record: response.data || []});
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
    }

    render(){
        let {showDialog,record,getOne} = this.state;

        return  <div className="template-email">
                <div className="detail">
                    <ul>
                        <li onClick={this.addHandle} className="first"><i className="glyphicon glyphicon-plus"></i></li>
                        { record.map((o,i)=><li key={i}>
                            <p className="font-hide top">{o['name']}</p>
                            <i onClick={this.detailHandle.bind(this,o['id'])} className="left glyphicon glyphicon-eye-open"></i>
                            <i onClick={this.deletedHandle.bind(this,o['id'])} className="right glyphicon glyphicon-remove-sign"></i>
                            <p>
                                <b>{new Date(o['createTime']).Format('yyyy-MM-dd')}</b>
                                { o['defaultTemplate'] != undefined ?
                                    <b className={o['defaultTemplate'] ? 'right on' : 'right'}>{o['defaultTemplate'] ? i18n.t(400185/*当前默认*/) : i18n.t(400186/*置为默认*/) }</b>
                                    :''
                                }
                            </p>
                        </li>) }
                    </ul>
                </div>
                <Dialog width={900}  visible={showDialog} title={(getOne['id']?i18n.t(100439/*编辑*/):i18n.t(100392/*新增*/))+'公共模板'}>
                    <TemplateForm getOne={getOne} cancelHandle={this.cancelHandle} getPage={this.getPage} />
                </Dialog>
        </div>
    }
}



export default class PageNow extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
        }
    }

    componentDidMount(){
    }

    render(){
        let that = this;

        return <ListDIV />
    }
}
