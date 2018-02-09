import React from 'react';
import ReactSummernote from '../../../../components/Summernote/components/react-summernote';
import {apiGet,apiPost,apiForm,API_FOODING_MassMailServer,API_FOODING_ES,API_FOODING_MAIL_SERVER,
    API_FOODING_MAIL,language,commonAjax,getQueryString} from '../../../../services/apiCall';
import {createForm,FormWrapper} from '../../../../components/Form';
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import WebData from '../../../../common/WebData';
import ServiceTips from "../../../../components/ServiceTips";//提示框
import UploadRequest from '../../../../services/request';
import 'bootstrap/js/modal';
import 'bootstrap/js/dropdown';
import '../../../../components/Summernote/components/tooltip';
import i18n from '../../../../lib/i18n';
export class MassTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            emailTemplate:[{name:i18n.t(700122/*邮件模板*/),context:'<div></div><br><br>'}],//邮件模板的下拉
            youxiangArray:[],//发件人的下拉框
            expandClassName: 'foddingicon fooding-zk_icon',
            isXiala:false
        }
        props.normalRef && props.normalRef(this);
        this.emailClick = this.emailClick.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.userClick = this.userClick.bind(this);
        this.search_more = this.search_more.bind(this);
        this.sendMail = this.sendMail.bind(this);
        props.normalRef && props.normalRef(this);
        //上传图片
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
                email:this.props.form.getFieldValue("sender")||this.state.collectionName
            }
        });
        UploadRequest(obj);
    }
    upload(img){
        for(var i = 0;i<img.length;i++){
           this.imgUpload(img[i]);
        }
    }
    sendMail(){
        //发送邮件
        let that = this;
        that.props.form.validateFields((error, value) => {
            if(error){
                console.log(error, value);
            }else{
                if(this.props.shoujianArray.length == 0){
                    ServiceTips({text:i18n.t(700120/*收件人不能为空*/),type:'error'});
                    return false;
                }
                if(!ReactSummernote.getText()){
                    ServiceTips({text:i18n.t(700121/*邮件内容不能为空*/),type:'error'});
                    return false;
                }
                let array = [];
                this.props.shoujianArray.map((e)=>{array.push(e.email)});
                value = Object.assign({},value,{content:ReactSummernote.getText(),receiver:array.join(';')});
                apiPost(API_FOODING_MassMailServer,'/mass/write',value,(response)=>{
                    if(that.props.type == 'client'){
                        this.props.onCancel();
                        ServiceTips({text:response.message,type:'success'});
                    }else{
                        ServiceTips({text:response.message,type:'success'});
                        this.props.proprs.navRemoveCurrentTab();
                        this.props.proprs.navReplaceTab({name:i18n.t(100586/*邮件*/),component:i18n.t(100586/*邮件*/),url:'/mail'});
                        this.props.router.push({pathname:'/mail',query:{type:'batchMail'}});
                    }
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'});
                })

            }

        });

    }
    search_more() {
        let classN;
        let isXiala;
        if (this.state.expandClassName === 'foddingicon fooding-zk_icon') {
            classN = 'foddingicon fooding-up-circle-cavity';
            isXiala = true;
        } else {
            classN = "foddingicon fooding-zk_icon";
            isXiala = false;
        }
        this.setState({
            expandClassName: classN,
            isXiala:isXiala
        });
    }
    userClick(){
        apiGet(API_FOODING_ES,'/contact/getContactByLinkTypeAndBeId',{beId:WebData.user.data.staff.id,linkTyId:80,dataTyId:160},
            (response)=>{
                this.setState({youxiangArray:response.data})
            },(error)=>{

            }
        )
    }
    emailClick(){
        let that = this;
        apiGet(API_FOODING_MAIL,'/template/content/getAll',{mail:this.props.form.getFieldValue("sender")||this.state.collectionName},
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
        ReactSummernote.replace(e.context);
    }

    render(){

        let {getFieldProps,getNFieldProps,getFieldError} = this.props.form;
        let email = xt.getItemValue(WebData.user, 'data.staff.emailAddress');
        return (<div>
                <div style={{display:'flex'}}>
                    <label style={{fontSize: '14px'}}>{i18n.t(200540/*收件人*/)+':'}<br/><span style={{color:'red'}}>{'['+this.props.shoujianArray.length+']'}</span></label>
                    <div style={{flex:1,height:'auto'}} className="text-input">
                        {
                            this.props.shoujianArray.map((e,i)=>{
                                if(!this.state.isXiala && i>4) return;
                                return <span key={i} style={{display:'inline-block', lineHeight: '18px', marginLeft: '5px',
                                    padding: '0px 8px 0px 7px', border: '1px solid #eef2f6', borderRadius: '10px',marginTop:'6px',
                                    background: '#d5dee7'}}>{e.name?e.name+'<'+e.email+'>':e.email}</span>
                            })
                        }
                    </div>
                    {this.props.shoujianArray.length >5 ? <span style={{paddingLeft:'10px',fontSize:'20px'}}  onClick={this.search_more}>
                        <i className={this.state.expandClassName}/></span>:''}
                </div>
            <div style={{width: '100%', fontSize: '14px',lineHeight: '25px',margin:'10px 0',display:'flex'}}>
                <label style={{marginRight:'10px',fontSize: '14px'}}>{i18n.t(100304/*主题*/)+':'}</label>
                <input placeholder='' type="text" style={{flex:1,border:0,borderBottom:'1px solid #ddd',outline:'none' }}
                       {...getFieldProps('subject', {
                           initialValue:'',
                           rules: [{required:true}],
                       })}
                       className={getFieldError('subject')?'error-border':''}
                />
            </div>
            <div style={{marginBottom:'10px'}}>
                <Select
                    allowClear={false}
                    animation='slide-up'
                    placeholder=''
                    defaultValue={i18n.t(700122/*邮件模板*/)}
                    optionLabelProp="children"
                    optionFilterProp="children"
                    onClick={this.emailClick}
                    onChange={this.emailChange}
                    style={{width:250,marginLeft:5}}
                >
                    {this.state.emailTemplate.map((o,i)=><Option key={i} objValue={o} title={o.name}>{o.name}</Option>)}
                </Select>
                <span style={{marginLeft:'10px'}}>{i18n.t(200539/*发件人*/)+'：'}</span>
                <Select
                    {...getNFieldProps('sender',{
                        rules: [{required:true}],
                        initialValue:email,
                    })}
                    allowClear={false}
                    animation='slide-up'
                    placeholder=''
                    optionLabelProp="children"
                    optionFilterProp="children"
                    onClick={this.userClick}
                    style={{width:250}}
                    className={getFieldError('sender')?'error-border':''}
                >
                    {this.state.youxiangArray.map((o,i)=><Option key={i} value={String(o.localName)} title={o.localName}>{o.localName}</Option>)}
                </Select>
            </div>
            <ReactSummernote
                value={''}
                options={{
                    // lang: 'ru-RU',
                    height: 300,
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
        </div>)
    }
}

export default createForm()(MassTemplate);