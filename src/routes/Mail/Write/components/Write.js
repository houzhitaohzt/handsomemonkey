import React from 'react'
import '../../../../components/Summernote/assets/email/semail.less'; // import styles
import ReactSummernote from '../../../../components/Summernote/components/react-summernote';
import 'bootstrap/js/modal';
import 'bootstrap/js/dropdown';
import '../../../../components/Summernote/components/tooltip';

import {emitter} from '../../../../common/EventEmitter';
import Dialog from "../../../../components/Dialog/LinkMainDialog";
import xt from "../../../../common/xt.js";
import Checkbox from "../../../../components/CheckBox";
import ServiceTips from "../../../../components/ServiceTips";//提示框
import Select, {Option,ConstVirtualSelect} from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import {createForm,FormWrapper} from '../../../../components/Form';
import WebData from '../../../../common/WebData';
import Upload from 'antd/lib/upload';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_MAIL_SERVER,
  API_FOODING_MAIL,language,commonAjax,getQueryString} from '../../../../services/apiCall';
const Dragger = Upload.Dragger;
import UploadRequest from '../../../../services/request';
import i18n from '../../../../lib/i18n';

import LinkMan from './LinkMan';//联系人
import NavConnect from "../../../../components/NavigateTabs/containers/AddContainer";
export class AboutView extends React.Component{
  constructor(props){
    super(props);
    this.state={
      caosong:false,
      misong:false,
      qunfa:false,
      showDilaog:false,
      getOne:{},
      indexC:0,//更新哪个信息的数据
      collectionName:getQueryString('collectionName'),
      type:getQueryString('type'),//compose 写邮件，forward //转发 ，reply //回复，replyall //全部回复，rewrite//重新编辑，resend//重新发送
      mailId:getQueryString('mailId'),
      isDingshi:false,
      youxiangArray:[],//发件人的下拉框
      qianmingArray:[],//签名
         qianmingValue:i18n.t(700125/*默认签名*/),
      accessoryArray:[],//附件的数组
      data:{},
      toAddressArray:[], //收件人数组
      ccAddressArray:[],//抄送
      bccAddressArray:[],//密送
      selectArray:[], //选中的联系人的数组
      emailTemplate:[{name:i18n.t(700122/*邮件模板*/),context:'<div></div><br><br>'}]//邮件模板的下拉

    }
    this.signContent = '';
    this.originalContent = '';
    this.originalContent = this.state.originalContent;
    this.upload = this.upload.bind(this);

    //抄送点击
    this.linkClick = this.linkClick.bind(this);
    this.onCancal = this.onCancal.bind(this);
    //发送邮件
    this.sendMail = this.sendMail.bind(this);
    this.onWosiClick = this.onWosiClick.bind(this);
    this.userClick = this.userClick.bind(this);

    //上传附件
    this.accessoryUpload = this.accessoryUpload.bind(this);
    this.accessoryError = this.accessoryError.bind(this);
    this.accessorySuccess = this.accessorySuccess.bind(this);

    //上传图片
    this.imgUpload = this.imgUpload.bind(this);
    this.imgUploadSuccess = this.imgUploadSuccess.bind(this);
    this.imgUploadError = this.imgUploadError.bind(this);
    //签名模板切换
    this.qianmingClick = this.qianmingClick.bind(this);
    this.qianmingChange = this.qianmingChange.bind(this);

    this.toAddressChange = this.toAddressChange.bind(this);
    this.validate = this.validate.bind(this);
    this.deleteInputValue = this.deleteInputValue.bind(this);

    this.confirmClick = this.confirmClick.bind(this);

    //关闭
    this.close = this.close.bind(this);
    this.emailClick = this.emailClick.bind(this);
    this.emailChange = this.emailChange.bind(this);

    this.userChange = this.userChange.bind(this);
  }
  userChange(e){
    let that = this;
    // that.setState({qianmingValue:'默认签名'});
    //   let str = ReactSummernote.getText();
    //   if(str.indexOf('sign')>-1){
    //       if(this.state.getOne.signContent){
    //           $('sign').html(this.state.getOne.signContent);
    //       }else{
    //           $('sign').html('<div></div>');
    //       }
    //   }
    //   this.signContent = that.state.getOne.signContent || null;
      this.setState({
          collectionName:e,
          qianmingValue:i18n.t(700125/*默认签名*/)
      });
  }
  emailClick(){
    let that = this;
    apiGet(API_FOODING_MAIL,'/template/content/getAll',{mail:this.props.form.getFieldValue("sendAddress")||this.state.collectionName},
        (response)=>{
          let array = [{name:i18n.t(700122/*邮件模板*/),context:'<div></div><br><br>'}];
          let data = response.data || [];
          data.map((e)=>{array.push(e)});
          this.setState({emailTemplate:array})
        },(error)=>{

        }
    )
  }
  emailChange(e){
    let that = this;
    let content = '<div></div>';
    if(this.signContent){
      content = '<br><br>'+e.context + '<sign>'+this.signContent+'</sign>';
    }else {
      content = '<br><br>'+e.context + '<figure></figure>';
    }

    ReactSummernote.replace(content);
    ReactSummernote.focus();
  }
  close(){
    let that = this;
    that.props.navCloseCurrentTab();
  }
  confirmClick(array){
    let that = this;
    if(this.state.indexC == 1){
      this.setState({toAddressArray:array});
    }else if(this.state.indexC == 2){
      this.setState({ccAddressArray:array});
    }else if(this.state.indexC == 3){
      this.setState({bccAddressArray:array});
    }
    this.onCancal();
  }
  toAddressChange(index,e){
    $('.toAddress').eq(index-1).find('input').css({color:'#333'});
    if(e.keyCode == 8 && e.target.value == ''){
      this.deleteInputValue(index);
    }else if(e.keyCode == 13){
      this.validate(index,e);
    }
  }
  //回退删除元素
  deleteInputValue(index){
    if(index == 1){
      let toAddressArray = this.state.toAddressArray;
      let length = toAddressArray.length;
      toAddressArray.splice(length-1,1);
      this.setState({toAddressArray:toAddressArray});
    }else if(index == 2){
      let ccAddressArray = this.state.ccAddressArray;
      let length = ccAddressArray.length;
      ccAddressArray.splice(length-1,1);
      this.setState({ccAddressArray:ccAddressArray});
    }else if(index == 3){
      let bccAddressArray = this.state.bccAddressArray;
      let length = bccAddressArray.length;
      bccAddressArray.splice(length-1,1);
      this.setState({bccAddressArray:bccAddressArray});
    }
  }
  //邮箱验证
  validate(index,e){
    let value = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
    if(/[@]/g.test(value)){
        if(index == 1){
          let toAddressArray = [];
          let vaile =[];
          this.state.toAddressArray.map(e=>{
            toAddressArray.push({email:e.email,entity:{localName:e.entity.localName}});
              vaile.push(e.email);
          });
          if(vaile.indexOf(value) == -1){
            toAddressArray.push({
              email:value,entity:{localName:null}});
            this.setState({toAddressArray:toAddressArray});
          }
        }else if(index == 2){
          let ccAddressArray = [];
          let vaile =[];
          this.state.ccAddressArray.map(e=>{
            ccAddressArray.push({email:e.email,entity:{localName:e.entity.localName}});
            vaile.push(e.email);
          });
          if(vaile.indexOf(value) == -1){
            ccAddressArray.push({
              email:value,entity:{localName:null}});
            this.setState({ccAddressArray:ccAddressArray});
          }
        }else if(index == 3){
          let bccAddressArray = [];
          let vaile =[];
          this.state.bccAddressArray.map(e=>{
            bccAddressArray.push({email:e.email,entity:{localName:e.entity.localName}});
              vaile.push(e.email);
          });
          if(vaile.indexOf(value) == -1){
            bccAddressArray.push({
              email:value,entity:{localName:null}});
            this.setState({bccAddressArray:bccAddressArray});
          }
        }
        $('.toAddress').eq(index-1).find('input').val('');
    }else{
      $('.toAddress').eq(index-1).find('input').css({color:'red'});
    }
  }
  qianmingClick(){
    apiGet(API_FOODING_MAIL,'/template/sign/getList',{mail:this.props.form.getFieldValue("sendAddress")||this.state.collectionName},
        (response)=>{
          this.setState({qianmingArray:response.data})
        },(error)=>{

        }
    )
  }
  qianmingChange(item){
    let str = ReactSummernote.getText();
    if(str.indexOf('sign')>-1){
      $('sign').html(''+item.context);
    }else{
      $('figure').html('<sign>'+item.context+'</sign>');
    }
    this.signContent = item.context;
    this.setState({qianmingValue:item.name});
  }
  userClick(){
    apiGet(API_FOODING_ES,'/contact/getContactByLinkTypeAndBeId',{beId:WebData.user.data.staff.id,linkTyId:80,dataTyId:160},
        (response)=>{
          this.setState({youxiangArray:response.data})
        },(error)=>{

        }
    )
  }
  sendMail(box,active){
    //发送邮件
    let that = this;
    let {newAttachs} = this.state;
    this.props.form.validateFields((error, value) => {
    if(error){
      console.log(error, value);
    }else{
      //收件人
      let toAddressArray = [];
      let caosongStr;
      let misongStr;
      this.state.toAddressArray.map((e)=>{
        let obj = e.entity.localName?e.entity.localName+'<'+e.email+'>':e.email;
        toAddressArray.push(obj);
      });
      //抄送人
      if(this.state.caosong){
        let ccAddressArray = [];
        this.state.ccAddressArray.map((e)=>{
          let obj = e.entity.localName?e.entity.localName+'<'+e.email+'>':e.email;
          ccAddressArray.push(obj);
        });
        caosongStr = ccAddressArray.join(';');
      }

      //密送人
      if(this.state.misong){
        let bccAddressArray = [];
        this.state.bccAddressArray.map((e)=>{
          let obj = e.entity.localName?e.entity.localName+'<'+e.email+'>':e.email;
          bccAddressArray.push(obj);
        });
        misongStr = bccAddressArray.join(';');
      }
     //附件
      let accessoryArray = this.state.accessoryArray;
      // console.log(ReactSummernote.getText());
      let needReply = value.needReply ? 1:0;
      let str;
      let signContent;
      let originalContent;
      if(box == 'DRAFT'){
          str = ReactSummernote.getText()?ReactSummernote.getText().replace(/<figure>/g,'div').replace(/<\/figure>/g,'</div>').replace(/webContentwrite/g,''):null;
          signContent = this.signContent;
          originalContent = this.originalContent;
      }else{
          str = ReactSummernote.getText()? ReactSummernote.getText().replace(/<includetail>/g,'<div>').replace(/<\/includetail>/g,'</div>').
          replace(/<sign>/g,'<div>').replace(/<\/sign>/g,'</div>').replace(/<figure>/g,'<div>').replace(/<\/figure>/g,'</div>').replace(/webContentwrite/g,''):null;
          signContent = this.signContent?this.signContent.replace(/<includetail>/g,'<div>').replace(/<\/includetail>/g,'</div>').
          replace(/<sign>/g,'<div>').replace(/<\/sign>/g,'</div>').replace(/<figure>/g,'<div>').replace(/<\/figure>/g,'</div>'):null;
          originalContent = this.originalContent?this.originalContent.replace(/<includetail>/g,'<div>').replace(/<\/includetail>/g,'</div>').
          replace(/<sign>/g,'<div>').replace(/<\/sign>/g,'</div>').replace(/<figure>/g,'<div>').replace(/<\/figure>/g,'</div>').replace(/webContentwrite/g,''):null;
      }


      value = Object.assign({},this.state.getOne,value,{
        webContent:str,
        attachs:accessoryArray,
        toAddress:toAddressArray.join(';'),
        ccAddress:caosongStr,
        bccAddress:misongStr,
        signContent:signContent,
        originalContent:originalContent,
        viewSingle:this.state.qunfa,
        box:box,needReply:needReply,
        newAttachs:newAttachs, // 附件  新版的
      });
      if( (this.state.toAddressArray.length<=0) && (box == 'SEND') ) {
        ServiceTips({text:i18n.t(700126/*请填写收件人!*/),type:'error'});
        return false;
      }
      if((!value.subject) && (box == 'SEND') ) {
        ServiceTips({text:i18n.t(700127/*请填写主题!*/),type:'error'});
        return false;
      }


      apiPost(API_FOODING_MAIL,'/write/save',value,(response)=>{

        // 关闭跳转
        if( active == 'close' ){
            // let {navReplaceTab} = this.props;
            // navReplaceTab({ name: i18n.t(100586/*邮件*/), component: i18n.t(100586/*邮件*/), url: '/mail'});
            // this.props.router.push({pathname: '/mail',state: {refresh: true}});
        }

         if(box == 'DRAFT'){
           let getOne = this.state.getOne;
           getOne = Object.assign({},getOne,{id:response.data.mailId});
           this.setState({getOne:getOne});

         }else{
           this.props.navReplaceTab({ name:i18n.t(700006/*写邮件*/), component:i18n.t(700006/*写邮件*/), url:'/email/success'});
           this.props.router.push({pathname: '/email/success',query:{
             mailId:response.data.mailId,
             collectionName:response.data.sendMail,
             statusCode:response.data.statusCode
           }});
         }
         ServiceTips({text:response.message,type:'success'});
      },(error)=>{
           ServiceTips({text:error.message,type:'error'});
      })
    }
    });
  }
  linkClick(index,array){
      let that = this;
    //弹出联系人
    this.setState({
      showDilaog:true,
      indexC:index,
      selectArray:array
    });
  }
  onCancal(){
    this.setState({showDilaog:false});
  }
  accessoryError(info){

  }
  accessorySuccess(info){
    let that = this;
    if(!xt.isArray(info.data)){
      ServiceTips({text:info.message,type:'error'});
      return false;
    }
    let accessoryArray = this.state.accessoryArray;
    let data = info.data ||[];
    data.map((e)=>{accessoryArray.push(e)});
    that.setState({accessoryArray:accessoryArray});
  }
  accessoryUpload(img){
    let obj = Object.assign({},{
      filename: "files",
      file: img,
      action:API_FOODING_MAIL_SERVER + '/file/upload',
      onSuccess:this.accessorySuccess,
      onError:this.accessoryError,
      headers: {
        authorization: 'authorization-text',
      },
      data: {
          email:this.props.form.getFieldValue("sendAddress")||this.state.collectionName
      }
    });
    UploadRequest(obj);
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
          email:this.props.form.getFieldValue("sendAddress")||this.state.collectionName
      }
    });
    UploadRequest(obj);
  }
  upload(img){
    for(var i = 0;i<img.length;i++){
      if(img[i].type.toUpperCase() == 'IMAGE/JPEG' || img[i].type.toUpperCase()=='IMAGE/PNG'){
        this.imgUpload(img[i]);
      }else{
        this.accessoryUpload(img[i]);
      }
    }


  }

  // 点击标签 关闭
  labelCloseHandle =(option={})=> {
    if( (option['url']=='/email/write') && (option['search'].includes('type=compose')) ) this.sendMail('DRAFT','close');
  }

  componentDidMount(){

    emitter.on("NavigateTabsItemRemove",this.labelCloseHandle);


    $(".toAddress").click(function(){
      $(this).find('input').focus();
    });


    // 有抄送时  添加抄送
    if( decodeURIComponent(xt.getQueryParameter('ccAddressArray')) ) this.setState({ccAddressArray:decodeURIComponent(xt.getQueryParameter('ccAddressArray')).split(';').map(o=>{ return {"email":o,"entity":{}} }),caosong:true});


    apiGet(API_FOODING_MAIL,'/write/getOne',
    {type:this.state.type,collectionName:this.state.collectionName,mailId:this.state.mailId,subject:getQueryString('subject'),
    toAddress:decodeURIComponent(xt.getQueryParameter('toAddress'))},
          (response)=>{
            this.signContent = response.data.signContent;
            this.originalContent = response.data.originalContent;
            let webContent = response.data.webContent ?response.data.webContent:'<span></span>';
            $('.webContentwrite').html(webContent);
            if(this.signContent){
                  if(webContent.indexOf('sign')>-1){
                      $('sign').html(""+this.signContent);
                  }else {
                      webContent = webContent + "<sign>"+this.signContent+'</sign>';
                      $('.webContentwrite').html(webContent);
                  }
            }
            if(this.originalContent) {
                  $('includetail').html(this.originalContent);
            }
            ReactSummernote.focus();
            if(response.data.toAddress){
              let str = response.data.toAddress;
              let a = [];
              a = str.split(';');
              let toAddressArray =[];
              a.map((e)=>{
                if(e){
                  toAddressArray.push({email:e,entity:{}})}
                }
              );
              this.setState({toAddressArray:toAddressArray});
            }
            if(response.data.ccAddress){
              let str = response.data.ccAddress;
              let a = [];
              a = str.split(';');
              let ccAddressArray =[];
              a.map((e)=>{
                if(e){ccAddressArray.push({email:e,entity:{}})}
              });
              this.setState({ccAddressArray:ccAddressArray,caosong:true});
            }
            if(response.data.bccAddress){
              let str = response.data.bccAddress;
              let a = [];
              a = str.split(';');
              let bccAddressArray =[];
              a.map((e)=>{
                if(e){
                    bccAddressArray.push({email:e,entity:{}})
                }
              });
              this.setState({bccAddressArray:bccAddressArray,misong:true});
            }
            this.setState({
              getOne:response.data,
              accessoryArray:response.data.attachs||[],
              newAttachs:response.data.newAttachs || []
            });
          },(error)=>{

    });
    let collectionName = getQueryString('collectionName');
    apiGet(API_FOODING_ES,'/contact/getContactByLinkTypeAndBeId',{beId:WebData.user.data.staff.id,linkTyId:80,dataTyId:160},
        (response)=>{
            let array = [];
            let data = response.data ||[];
            data.map((e)=>{
              array.push(e.localName)
            });
            if(array.indexOf(collectionName)>-1){

            }else{
              collectionName = array[0];
            }
            this.setState({collectionName:collectionName});

        },(error)=>{

        }
    )
  }

	componentWillUnmount() {
    emitter.off("NavigateTabsItemRemove", this.labelCloseHandle);
  }

  onWosiClick(varl){
    let that = this;
    this.setState({isDingshi:varl.target.checked});
  }
  removeAccessList(index){
    let accessoryArray = this.state.accessoryArray;
    accessoryArray.splice(index,1);
    this.setState({accessoryArray:accessoryArray});
  }

  // 新版的 删除附件 
  delAccessoryHandle = (row)=> {
    let {newAttachs} = this.state;
    this.setState({newAttachs:newAttachs.filter(o=>o['id'] != row['id'])});
  }


  render(){
    let that = this;
    let {newAttachs} = this.state;
    let {getFieldProps,getNFieldProps,getFieldError,getFieldValue} = this.props.form;
    let getOne = this.state.getOne;

    //附件上传配置
    const accessory = {
       name: 'file',
       multiple:true,
       action:API_FOODING_MAIL_SERVER + '/file/upload',
       headers: {
         authorization: 'authorization-text',
       },
       data:{
         email:this.props.form.getFieldValue("sendAddress")||this.state.collectionName
       },
       onChange(info) {
         if (info.file.status !== 'uploading') {
           if(!xt.isArray(info.file.response.data)){
             ServiceTips({text:info.file.response.message,type:'error'});
             return false;
           }
           let data = xt.isArray(info.file.response.data)?info.file.response.data:[];
           let accessoryArray = that.state.accessoryArray;
           data.map((e)=>{accessoryArray.push(e)});
           that.setState({accessoryArray:accessoryArray});
         }
         if (info.file.status === 'done') {
          //  message.success(`${info.file.name} file uploaded successfully`);
         } else if (info.file.status === 'error') {
          //  message.error(`${info.file.name} file upload failed.`);
         }
       },
    };



    return (
    <div className='write-page  srcoll' style={{height:document.body.offsetHeight-80,overflowY:'auto'}}>
      <div className='nav'>
        <ul>
          <li onClick={this.sendMail.bind(this,'SEND')}>{i18n.t(200427/*发送*/)}</li>
          <li onClick={this.sendMail.bind(this,'DRAFT')}>{i18n.t(700128/*存草稿*/)}</li>
          <li onClick ={this.close.bind(this)}>{i18n.t(100432/*关闭*/)}</li>
        </ul>
      </div>
      <div className='content'>
        <div className='head'>
          <li className="li">
            <label onClick={that.linkClick.bind(this,1,this.state.toAddressArray)}>{i18n.t(200540/*收件人*/)+'：'}</label>
            <mark className='toAddress'>
              {
                this.state.toAddressArray.map((e,i)=>{
                  return <span key={i}>{e.entity.localName?e.entity.localName+'<'+e.email+'>':e.email}<b>;</b><i className='foddingicon fooding-menu_delete_32' onClick={()=>{
                    let toAddressArray = that.state.toAddressArray;
                    toAddressArray.splice(i,1);
                    that.setState({toAddressArray:toAddressArray})
                  }}></i></span>
                })
              }
              <input placeholder='' type="text"
                 onKeyDown={this.toAddressChange.bind(this,1)}
                 onBlur={this.validate.bind(this,1)}
              />
            </mark>
          </li>
          <li className={that.state.caosong?'li':'none'}>
            <label onClick={that.linkClick.bind(this,2,this.state.ccAddressArray)}>{i18n.t(700129/*抄送*/)+'：'}</label>
            <mark className='toAddress'>
              {
                this.state.ccAddressArray.map((e,i)=>{
                  return <span key={i}>{e.entity.localName?e.entity.localName+'<'+e.email+'>':e.email}<b>;</b><i className='foddingicon fooding-menu_delete_32' onClick={()=>{
                    let ccAddressArray = that.state.ccAddressArray;
                    ccAddressArray.splice(i,1);
                    that.setState({ccAddressArray:ccAddressArray})
                  }}></i></span>
                })
              }
              <input placeholder='' type="text"
                 onKeyDown={this.toAddressChange.bind(this,2)}
                 onBlur={this.validate.bind(this,2)}
              />
            </mark>
          </li>
          <li className={that.state.misong?'li':'none'}>
            <label onClick={that.linkClick.bind(this,3,this.state.bccAddressArray)}>{i18n.t(700130/*密送*/)+'：'}</label>
            <mark>
              <mark className='toAddress'>
                {
                  this.state.bccAddressArray.map((e,i)=>{
                    return <span key={i}>{e.entity.localName?e.entity.localName+'<'+e.email+'>':e.email}<b>;</b><i className='foddingicon fooding-menu_delete_32' onClick={()=>{
                      let bccAddressArray = that.state.bccAddressArray;
                      bccAddressArray.splice(i,1);
                      that.setState({bccAddressArray:bccAddressArray})
                    }}></i></span>
                  })
                }
                <input placeholder='' type="text"
                   onKeyDown={this.toAddressChange.bind(this,3)}
                   onBlur={this.validate.bind(this,3)}
                />
              </mark>
            </mark>
          </li>
          <li className={that.state.qunfa?'li':'none'}>
            <span>{i18n.t(700131/*每个收件人将单独收到发给他/她的邮件.*/)}</span>
            <a className={that.state.qunfa?'link-a':''} onClick={()=>{
              that.setState({qunfa:false})
            }}>
              {that.state.qunfa?i18n.t(700156/*取消群发单显*/):i18n.t(700157/*群发单显*/)}
            </a>
          </li>
          <li className={that.state.qunfa?'none':''}>
            <a  onClick={()=>{
              that.setState({caosong:!that.state.caosong})
            }} className={that.state.caosong?'link-a':''}>
              {that.state.caosong?i18n.t(700158/*删除抄送*/):i18n.t(700129/*抄送*/)}
            </a>
            <em>|</em>
            <a  onClick={()=>{
              that.setState({misong:!that.state.misong})
            }} className={that.state.misong?'link-a':''}>
              {that.state.misong?i18n.t(700159/*删除密送*/):i18n.t(700130/*密送*/)}
            </a>
            <em>|</em>
            <a  onClick={()=>{
              that.setState({qunfa:!that.state.qunfa,
              caosong:false,misong:false})
            }}>{i18n.t(700132/*群发单显*/)}</a>
          </li>
          <li className="li">
            <label>{i18n.t(100304/*主题*/)+'：'}</label>
            <mark>
              <input placeholder='' type="text"
                 {...getFieldProps('subject', {
                       initialValue:getOne.subject ? getOne.subject:''
                   })}
                  style ={{width:'100%'}}
              />
            </mark>
          </li>
          <li style={{marginBottom:'20px',marginTop:'10px',position:'relative'}} className="li">
            <Upload {...accessory} style={{position:'absolute',top:'9px',left:'0',zIndex:5}} showUploadList={false}>
              <span className='accessory'>
                  <i className='foddingicon fooding-lianjie' style={{fontSize:'16px'}}></i>
              </span>
            </Upload>
            <div style={{position: 'absolute',top: '5px',width: '100%',paddingLeft: '25px'}}>
              {/*<span className='span'>|</span>*/}
              <label></label>
              <Checkbox
                   {...getFieldProps('needReply',{
                     initialValue:getOne.needReply?1:0
                   })}
                   checked={this.props.form.getFieldValue("needReply")}
              />
              <span className='span' style={{paddingLeft:10}}>{i18n.t(700133/*需要回执*/)}</span>
              {/*|*/}
              <div style={{paddingLeft:10,display:'inline-block'}}>
                <Checkbox
                   onChange = {this.onWosiClick}
                />
              </div>
              <span className='span' style={{paddingLeft:10}}>{i18n.t(600157/*定时发送*/)}</span>

              {
                that.state.isDingshi?<DataTime
                    showTime={true}
                    isShowIcon={true}
                    validate={true}
                    width={'200px'}
                    style={{paddingRight:0}}
                    form={this.props.form}
                    name={'regularSendTime'}
                />:''
              }
              {/*|*/}
              {/*<span className='span' style={{paddingLeft:10}}>{i18n.t(700135*//*格式*//*)}</span>*/}
              <Select
                  allowClear={false}
                  animation='slide-up'
                  placeholder=''
                  optionLabelProp="children"
                  optionFilterProp="children"
                  value={this.state.qianmingValue}
                  onClick={this.qianmingClick}
                  onChange={this.qianmingChange}
                  style={{width:100,marginLeft:5}}
              >
                  {this.state.qianmingArray.map((o,i)=><Option key={i} objValue={o} title={o.name}>{o.name}</Option>)}
              </Select>
              <Select
                  allowClear={false}
                  animation='slide-up'
                  placeholder=''
                  defaultValue={i18n.t(700122/*邮件模板*/)}
                  optionLabelProp="children"
                  optionFilterProp="children"
                  onClick={this.emailClick}
                  onChange={this.emailChange}
                  style={{width:100,marginLeft:5}}
              >
                  {this.state.emailTemplate.map((o,i)=><Option key={i} objValue={o} title={o.name}>{o.name}</Option>)}
              </Select>
            </div>
          </li>
          {
            this.state.accessoryArray.map((e,i)=>{
              return <div key={i} className='access-hover'>
                  <span><i className='foddingicon fooding-fj-icon2' style={{paddingRight:10}}></i>{e.fileName}</span>
                  <span style={{marginLeft: '30px',fontSize: '12px',lineHeight: '27px',
                   color: 'red',cursor: 'pointer'}} onClick={this.removeAccessList.bind(this,i)}>{i18n.t(100437/*删除*/)}</span>
              </div>
            })
          }

          { Array.from(newAttachs || {}).length ?
            getOne.newAttachs.map((o,i)=>
              <li className="access-hover">
                  <a href={o['fullPath']} target="_black" key={i} style={{color:'#0e77ca'}}>
                        <i className="down foddingicon fooding-accessory"></i>
                        &nbsp;&nbsp;
                        <b className="font-hide" title={o['fileName']}>{o['fileName']}</b>
                        &nbsp;&nbsp;
                       <i className="downBtn foddingicon fooding-download" title={i18n.t(200083/*下载*/)}></i>
                  </a>
                  <span style={{marginLeft:'10px',fontSize: '12px',lineHeight: '27px',color: 'red',cursor: 'pointer'}} title={i18n.t(100437/*删除*/)} onClick={this.delAccessoryHandle.bind(that,o)}>{i18n.t(100437/*删除*/)}</span>
              </li>
            )
            :''
          }

          <ReactSummernote
              value={'<br><br><div class="webContentwrite"></div><figure></figure><includetail></includetail>'}
              options={{
                // lang: 'ru-RU',
                height: 350,
                dialogsInBody: true,
                  dialogsFade:false,
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
            <div className='sendUser'>
              <span>{i18n.t(200539/*发件人*/)+':'}</span>
              <Select
                  {...getNFieldProps('sendAddress',{
                    initialValue:this.state.collectionName,
                   })}
                  allowClear={false}
                  animation='slide-up'
                  placeholder=''
                  optionLabelProp="children"
                  optionFilterProp="children"
                  value={this.state.collectionName}
                  onClick={this.userClick}
                  onChange={this.userChange}
                  style={{width:150}}
                >
                {this.state.youxiangArray.map((o,i)=><Option key={i} value={String(o.localName)} title={o.localName}>{o.localName}</Option>)}
              </Select>
            </div>
        </div>
      </div>
        <Dialog visible={this.state.showDilaog}  width={200}>
          <LinkMan  onCancal ={this.onCancal} confirmClick = {this.confirmClick}
            selectArray = {this.state.selectArray}
          />
        </Dialog>

    </div>
  )}
}
export default createForm()(NavConnect(AboutView));
