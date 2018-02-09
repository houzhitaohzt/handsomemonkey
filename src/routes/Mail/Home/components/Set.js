import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';

import Dialog from '../../../../components/Dialog/Dialog';//弹层
import {createForm,FormWrapper} from '../../../../components/Form';

import {getQueryString, apiGet, apiPost, apiForm,API_FOODING_MAIL_SERVER,API_FOODING_MAIL, API_FOODING_DS, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import Confirm from '../../../../components/Dialog/Confirm';

import '../../../../components/Summernote/assets/email/semail.less'; // import styles
import ReactSummernote from '../../../../components/Summernote/components/react-summernote';
import 'bootstrap/js/modal';
import 'bootstrap/js/dropdown';
import '../../../../components/Summernote/components/tooltip';
// import 'bootstrap/dist/css/bootstrap.css';


import {ButtonDIV,commonAjax} from "./Common.js"; // 公共库
import UploadRequest from '../../../../services/request';
// 新增 签名
class AutographDIV extends Component {
    constructor(props) {
        super(props);

        // init state
        this.state = {
            content: undefined, // 文本
        }
        this.upload = this.upload.bind(this);
        //上传图片
        this.imgUpload = this.imgUpload.bind(this);
        this.imgUploadSuccess = this.imgUploadSuccess.bind(this);
        this.imgUploadError = this.imgUploadError.bind(this);
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
      ReactSummernote.focus();
      this.setState({
          content:this.props.getOne.context
      });
    }

    // confirim
    confirmHandle = ()=>{
        let that = this;
        let {content} = this.state;
        let {loginMessageNow,getPage,getOne} = this.props;

        this.props.form.validateFields((errors, value) =>{
			if(errors ){
			}else{
        if(!content){  ServiceTips({text:i18n.t(700113/*请输入模板内容*/),type:'error'}); return false;}
                apiPost(API_FOODING_MAIL,'/template/sign/save',Object.assign({mail:loginMessageNow['email']},getOne,value,{context:content || getOne['context']}),
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
		const {getFieldProps,getFieldError} = this.props.form;
        let {getOne} = this.props;


        return  <div className="addnormal girdlayout">
            <div className={'row'}>
                <div className="col-md-8">
                    {/*<label className={'col-md-2'}><span>*</span>{i18n.t(100304*//*主题*//*)}</label>*/}
                    <input type="text"
                        className ={getFieldError('name')?'col-md-9 text-input-nowidth error-border':'col-md-9 text-input-nowidth'}
                        {...getFieldProps('name',{
                            rules: [{required:true}],
                            initialValue: getOne['name'] || ''
                        })}
                    />
                </div>
            </div>
            <ReactSummernote
                value={getOne['context']}
                onImageUpload={this.upload}
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
                onChange={this.onChange}
            />
            <ButtonDIV confirmHandle={this.confirmHandle} cancelHandle={this.cancelHandle} />
        </div>
    }
}
let AutographForm = createForm()(AutographDIV);


// 新增 个人
class FolderDIV extends Component {
    constructor(props) {
        super(props);

        // init state
        this.state = {
        }
    }

    // confirim
    confirmHandle = ()=>{
        let that = this;
        let {loginMessageNow,getPage,getOne} = this.props;

        this.props.form.validateFields((errors, value) =>{
			if(errors){
			}else{
                apiForm(API_FOODING_MAIL,'/folder/save',Object.assign({mail:loginMessageNow['email']},getOne,value),
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

    render(){
		const {getFieldProps,getFieldError} = this.props.form;
        let {getOne} = this.props;


        return  <div className="addnormal girdlayout">
            <div className={'row'}>
                <div className="col-md-offset-2 col-md-8">
                    <label className={'col-md-2'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
                    <input type="text"
                        className ={getFieldError('name')?'col-md-9 text-input-nowidth error-border':'col-md-9 text-input-nowidth'}
                        {...getFieldProps('name',{
                            rules: [{required:true}],
                            initialValue: getOne['name'] || ''
                        })}
                    />
                </div>
            </div>
            <ButtonDIV confirmHandle={this.confirmHandle} cancelHandle={this.cancelHandle} />
        </div>
    }
}
let FolderForm = createForm()(FolderDIV);


// 新增 个人模板
class OwnDIV extends Component {
    constructor(props) {
        super(props);

        // init state
        this.state = {
            content: undefined, // 文本
        }
        this.upload = this.upload.bind(this);
        //上传图片
        this.imgUpload = this.imgUpload.bind(this);
        this.imgUploadSuccess = this.imgUploadSuccess.bind(this);
        this.imgUploadError = this.imgUploadError.bind(this);
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
        ReactSummernote.focus();
        this.setState({
            content:this.props.getOne.context
        });
    }

    // confirim
    confirmHandle = ()=>{
        let that = this;
        let {content} = this.state;
        let {loginMessageNow,getPage,getOne} = this.props;

        this.props.form.validateFields((errors, value) =>{
			if(errors){
			}else{
          if(!content){  ServiceTips({text:i18n.t(700113/*请输入模板内容*/),type:'error'}); return false;}
                apiPost(API_FOODING_MAIL,'/template/content/save',Object.assign({mail:loginMessageNow['email']},getOne,value,{context:content || getOne['context']}),
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
		const {getFieldProps,getFieldError} = this.props.form;
        let {getOne} = this.props;


        return  <div className="addnormal girdlayout">
            <div className={'row'}>
                <div className="col-md-8">
                    {/*<label className={'col-md-2'}><span>*</span>{i18n.t(100304*//*主题*//*)}</label>*/}
                    <input type="text"
                        className ={getFieldError('name')?'col-md-9 text-input-nowidth error-border':'col-md-9 text-input-nowidth'}
                        {...getFieldProps('name',{
                            rules: [{required:true}],
                            initialValue: getOne['name'] || ''
                        })}
                    />
                </div>
            </div>
            <ReactSummernote
                value={getOne['context']}
                onImageUpload={this.upload}
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
                onChange={this.onChange}
            />
            <ButtonDIV confirmHandle={this.confirmHandle} cancelHandle={this.cancelHandle} />
        </div>
    }
}
let OwnForm = createForm()(OwnDIV);




/***************************************  common  ************************************/

// 公共模板
class ListDIV extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
            showDialog: false, // showDialog

            record: [], // 列表
            getOne: {}, // 单条数据

        }
        this.title= i18n.t(700115/*新增模板*/);
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
        let {active} = this.props;

        switch (active) {
            case 'autograph':
                var URL = '/template/sign/getOne';
            break;
            case 'folder':
                var URL = '/folder/getOne';
            break;
            case 'own':
                var URL = '/template/content/getOne';
            break;
            default:
                break;
        }

        // TODO
        apiGet(API_FOODING_MAIL,URL,{id: ID},
            (response)=>{
                that.setState({
                    getOne: response.data || {},
                    showDialog: true
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
    }

    // deleted
    deletedHandle = (ID)=>{
        let {loginMessageNow,active} = this.props;

        switch (active) {
            case 'autograph':
                var URL = '/template/sign/delete';
            break;
            case 'folder':
                var URL = '/folder/delete';
            break;
            case 'own':
                var URL = '/template/content/delete';
            break;
            default:
                break;
        }
        // TODO
        commonAjax({message:i18n.t(700114/*确认删除?*/),url:URL,data:{id:ID,mail:loginMessageNow['email']},callBack:this.getPage});

    }

    // reset
    resetHandle = (ID)=>commonAjax({url:'/template/sign/setDefault',data:{id:ID,mail:this.props.loginMessageNow['email']},callBack:this.getPage});

    // getInit
    getPage = ()=>{
        let that = this;
        let {loginMessageNow,active} = this.props;

        switch (active) {
            case 'autograph':
                var URL = '/template/sign/getList';
            break;
            case 'folder':
                var URL = '/folder/getList';
            break;
            case 'own':
                var URL = '/template/content/getPrivateList';
            break;
            default:
                break;
        }

        apiGet(API_FOODING_MAIL,URL,{mail: loginMessageNow['email']},
            (response)=>{
                that.setState({	record: response.data || []});
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
    }

    render(){
        let {showDialog,record,getOne} = this.state;
        let {active,loginMessageNow} = this.props;
        let that = this;
        var dialogDIV =<div></div>;
        switch (active) {
            case 'autograph':
                dialogDIV = <AutographForm getOne={getOne} cancelHandle={this.cancelHandle} getPage={this.getPage} loginMessageNow={loginMessageNow} />;
                this.title= i18n.t(700115/*新增模板*/);
            break;
            case 'folder':
                dialogDIV = <FolderForm getOne={getOne} cancelHandle={this.cancelHandle} getPage={this.getPage} loginMessageNow={loginMessageNow}  />;
                this.title= i18n.t(700116/*新增文件夹*/);
            break;
            case 'own':
                dialogDIV = <OwnForm getOne={getOne} cancelHandle={this.cancelHandle} getPage={this.getPage} loginMessageNow={loginMessageNow} />;
                this.title= i18n.t(700115/*新增模板*/);
            break;
            default:
                break;
        }

        return  <div className="detail">
                <ul>
                    <li onClick={this.addHandle} className="first li"><i className="glyphicon glyphicon-plus"></i></li>
                    { record.map((o,i)=><li key={i} className="li">
                        <p className="font-hide top">{o['name']}</p>
                        <i onClick={this.detailHandle.bind(this,o['id'])} className="left glyphicon glyphicon-eye-open"></i>
                        <i onClick={this.deletedHandle.bind(this,o['id'])} className="right glyphicon glyphicon-remove-sign"></i>
                        <p>
                            <b>{new Date(o['createTime']).Format('yyyy-MM-dd')}</b>
                            { o['defaultTemplate'] != undefined ?
                                <b onClick={this.resetHandle.bind(this,o['id'])} className={o['defaultTemplate'] ? 'right on' : 'right'}>{o['defaultTemplate'] ? i18n.t(400185/*当前默认*/) : i18n.t(400186/*置为默认*/) }</b>
                                :''
                            }
                        </p>
                    </li>) }
                </ul>
                <Dialog width={900}  visible={showDialog} title={this.title}>
                    {dialogDIV}
                </Dialog>
        </div>
    }
}


export default class PageNow extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
            active: 'autograph', // tag toggle
        }
    }

    // toggle page
    toggleHandle = (active)=>this.setState({active: ''},function(){this.setState({active: active})});

    render(){
        let that = this;
        let {active} = this.state;
        let {loginMessageNow} = this.props;

        return <div className="set-home">
            <ul>
                <li className={active == 'autograph' ? 'on ' : ''} onClick={this.toggleHandle.bind(this,'autograph')}>{i18n.t(700117/*签名模板*/)}</li>
                <li className={active == 'folder' ? 'on ' : ''} onClick={this.toggleHandle.bind(this,'folder')}>{i18n.t(700118/*文件夹设置*/)}</li>
                <li className={active == 'own' ? 'on ' : ''} onClick={this.toggleHandle.bind(this,'own')}>{i18n.t(700119/*个人模板*/)}</li>
            </ul>
            { active && <ListDIV active={active} loginMessageNow={loginMessageNow}/>}
        </div>
    }
}
