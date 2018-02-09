import React, {Component} from "react";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import {getUser, apiGet, apiPost, apiForm, API_FOODING_MAIL_SERVER, API_FOODING_MAIL, API_FOODING_ES, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import xt from "../../../../common/xt.js";

import { Menu, Dropdown, Button, Icon, Input  } from 'antd';
import {commonRow, availHeight} from "./Common.js"; // 公共库
import i18n from '../../../../lib/i18n';
// page list
import Staff from "./Staff.js"; // 职员选择
import Inbox from "./Inbox.js"; // 收件箱
import OutBox from "./OutBox.js"; // 已发送
import Deleted from "./Deleted.js"; // 已删除
import Verify from "./Verify.js"; // 审核箱
import Dustbin from "./Dustbin.js"; // 垃圾箱
import Draft from "./Draft.js"; // 草稿箱
import History from "./History.js";
import BatchMail from "./BatchMail.js"; // 群发邮件
import BlackList from "./BlackList.js"; // 黑名单


import Folder from "./Folder.js"; // 自定义文件夹
import Share from "./Share.js"; // 共享记录


import SetPage from "./Set.js"; // 设置

import Select, {ConstVirtualSelect, Option} from "../../../../components/Select";
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import {createForm,FormWrapper} from '../../../../components/Form';
// menu
class MenuPage1 extends Component {

    constructor(props) {
        super(props);

        // this state
        this.state = {
            InboxSign: 0,   // 收件箱 未读
            draftSign: 0,   // 草稿箱 未读
            recordFolder: [], // 文件夹列表
            showStaff: false, // 展开职员
            mailList: [], // 邮箱列表

            isShowLoadding:false,
            showFolder: false, // toggle folder
            rodalShow:false,
        }
        props.normalRef && props.normalRef(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.getInit = this.getInit.bind(this);
        this.isShowLoadding = false;
    }
  onCancel(){
    this.setState({rodalShow:false})
  }
  onSaveAndClose(){
    let that = this;
    const {form} = this.props;
    form.validateFields((errors, value) => {
        if( !errors){
           let obj = Object.assign({},value,{email:this.props.loginMessageNow['email']});
            apiForm(API_FOODING_MAIL, '/addReceiveScope', obj,
                response => {
                  this.getNewMail();
                  this.onCancel();
                }, error => {
                  ServiceTips({text:error.message,type:'error'});
                })
        }
    })
  }
	componentDidMount(){
        this.getInit();
    }

    // toggle folder
    folderHandle = ()=>{
        let {showFolder} = this.state;
        this.setState({showFolder: !showFolder});
        if(showFolder) return;

        // TODO
        let that = this;
        let {loginMessageNow} = this.props;
        apiGet(API_FOODING_MAIL,'/getFolders',{email: loginMessageNow['email']},
            (response)=>{
                that.setState({
                    recordFolder: response.data || [],
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
    }

    // staff
    staffHandle = (o)=>this.setState({showStaff:o==true ? false : true});

    // mail list
    moreListHandle = (result)=>{
        if(!result) return;

        let that = this;
        let {loginMessageNow} = this.props;
        apiGet(API_FOODING_ES,'/contact/getContactByLinkTypeAndBeId',{beId: loginMessageNow['id'],linkTyId:80,dataTyId:160},
            (response)=>{
                that.setState({mailList:response['data'] || []});
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
    }

    // mail toggle
    mailToggleHandle = (o)=>{
        this.props.staffHandle({email: o['key']});
        this.getInit();
    }

    // 职员刷新
    staffRefresh = (o)=>{
        this.props.staffHandle(o);
        this.getInit();
    }

    // 收邮件
    getNewMail = ()=>{
        let that = this;
        let {loginMessageNow} = this.props;
        if(this.isShowLoadding){
            return false;
        }
        this.isShowLoadding = true;
        apiGet(API_FOODING_MAIL_SERVER,'/receive',{email:loginMessageNow['email']},
            (response)=>{
              if(response.data == -1){
                this.setState({rodalShow:true});
              }else if(response.data == -2){
                ServiceTips({text:i18n.t(700000/*没有设置邮件服务器，请联系管理员！*/),type:'error'});
              }else if(response.data == -9){
                ServiceTips({text:i18n.t(700001/*正在收件中*/),type:'success'});
              }else if(response.data == 0){
                ServiceTips({text:i18n.t(700002/*没有新邮件*/),type:'success'});
              }else if(response.data >0){
                that.props.pageHandle.bind(that,'Inbox')();
                ServiceTips({text:i18n.t(700003/*您有*/)+response.data+i18n.t(700004/*封新邮件*/),type:'success'});
                this.getInit();
              }
              setTimeout(()=>{
                  this.isShowLoadding = false;
                  that.setState({isShowLoadding:false});
              },500);

            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
                setTimeout(()=>{
                    this.isShowLoadding = false;
                    that.setState({isShowLoadding:false});
                },500);
        },{isLoading:false});
        this.setState({isShowLoadding:true});
    }

    // 页面 初始化
    getInit(){
        let that = this;
        let {loginMessageNow} = this.props;

        // 收件箱
        apiGet(API_FOODING_MAIL,'/getUnreadCount',{email:loginMessageNow['email']},
            (response)=>{
                that.setState({	InboxSign: response['data'] });
            },(errors)=>{
                // ServiceTips({text:errors.message,type:'error'});
        },{isLoading:false});

        // 草稿
        apiGet(API_FOODING_MAIL,'/getDraftCount',{email:loginMessageNow['email']},
            (response)=>{
                that.setState({	draftSign: response['data'] });
            },(errors)=>{
                // ServiceTips({text:errors.message,type:'error'});
        },{isLoading:false});
    }

    render(){
        let {InboxSign,draftSign,showFolder,recordFolder,showStaff,mailList} = this.state;
        let {toggle,page,folderID,toggleHandle,pageHandle,loginMessageNow} = this.props;


        // more mail 下拉
        const menuSign = (
            <Menu onClick={this.mailToggleHandle} style={{width:230}}>
                { mailList.map((o)=><Menu.Item key={o['localName']} title={o['localName']} className="font-hide">{o['localName']}</Menu.Item>) }
            </Menu>
        );


        return <menu className={toggle ? 'on' : ''}>
            <header>
                <h2 className="font-hide">{loginMessageNow['name'] || i18n.t(700005/*无*/)}</h2>
                <p className="font-hide">{loginMessageNow['position'] || i18n.t(700005/*无*/)}</p>
                <li className="font-hide">{loginMessageNow['email'] || i18n.t(700005/*无*/)}</li>
                <button onClick={this.staffHandle} className="btn btn-xs top"><i className="foddingicon fooding-search_icon"></i></button>
                <button className="btn btn-xs bot">
                <Dropdown overlay={menuSign} onVisibleChange={this.moreListHandle} trigger={['click']}>
                    <Icon type="down" />
                </Dropdown>
                </button>
            </header>
            <hr/>
            <mark onClick={toggleHandle} className="toggle"><i className={toggle ? 'glyphicon glyphicon-chevron-right' : 'glyphicon glyphicon-chevron-left'}></i></mark>
            <ul className="scroll">
                <li onClick={this.getNewMail} style={{paddingTop: 0}} >
                    <i className={this.state.isShowLoadding?"none":"foddingicon fooding-receive-mail-new"}></i>
                    <img src={require('../assets/loading.gif')} className={this.state.isShowLoadding?'':'none'} style={{width: '14px', marginLeft: '8px', marginRight: '8px'}}/>
                    <span>{i18n.t(700007/*收邮件*/)}</span>
                </li>
                <hr style={{height: '1px', marginRight: '89px', marginLeft: '7px'}} />
                <li onClick={()=>window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,{type:'compose',collectionName:loginMessageNow['email']},{refresh: true})}><i className="foddingicon fooding-write-mail-new"></i><span>{i18n.t(700006/*写邮件*/)}</span></li>
                <li onClick={pageHandle.bind(this,'batchMail')} className={page=='batchMail'?'on':''}><i className="foddingicon fooding-mass-mail-new"></i><span>{i18n.t(700013/*群发邮件*/)}</span></li>
                <li onClick={pageHandle.bind(this,'Inbox')} className={page=='Inbox'?'on':''}><i className="foddingicon fooding-inbox-box-new"></i>
                    <span>{i18n.t(700008/*收件箱*/)}</span>
                    {InboxSign?<b className="font-hide">{InboxSign < 99 ? InboxSign : '99+'}</b>:''}
                </li>
                <li onClick={pageHandle.bind(this,'outbox')} className={page=='outbox'?'on':''}><i className="foddingicon fooding-send-mail-new"></i><span>{i18n.t(700009/*已发送*/)}</span></li>
                <li onClick={pageHandle.bind(this,'deleted')} className={page=='deleted'?'on':''}><i className="foddingicon fooding-deleted-mail-new"></i><span>{i18n.t(700010/*已删除*/)}</span></li>
                {/* <li onClick={pageHandle.bind(this,'verify')} className={page=='verify'?'on':''}><i className="foddingicon fooding-verify-mail"></i><span>审核箱</span></li>*/}
                <li onClick={pageHandle.bind(this,'dustbin')} className={page=='dustbin'?'on':''}><i className="foddingicon fooding-dustbin-mail-new"></i><span>{i18n.t(700011/*垃圾箱*/)}</span></li>
                <li onClick={pageHandle.bind(this,'draft')} className={page=='draft'?'on':''}><i className="foddingicon fooding-draft-mail-new"></i>
                    <span>{i18n.t(700015/*草稿箱*/)}</span>
                    {draftSign?<b className="font-hide">{draftSign < 99 ? draftSign : '99+'}</b>:''}
                </li>
                <li onClick={pageHandle.bind(this,'history')} className={page=='history'?'on':''}><i className="foddingicon fooding-history-mail-new"></i><span>{i18n.t(700012/*历史邮件*/)}</span></li>
                <li onClick={pageHandle.bind(this,'blacklist')} className={page=='blacklist'?'on':''}><i className="foddingicon fooding-blacklist"></i><span>{i18n.t(600177/*黑名单*/)}</span></li>
                
                <br/>
                <li onClick={this.folderHandle} ><i className="foddingicon fooding-files-mail-new"></i><span>{i18n.t(700014/*我的文件夹*/)}</span></li>
                { showFolder ?
                    <ol className="scroll">
                        {  recordFolder['length'] ?
                            recordFolder.map((o,i)=><p onClick={pageHandle.bind(this,'folder',o['id'])} key={i} className={folderID==o['id']?'font-hide on':'font-hide'} title={o['name']}><i className="glyphicon glyphicon-file"></i>{o['name']}</p>)
                            :<p>{i18n.t(700016/*空*/)}</p>
                        }
                    </ol>
                    :''
                }
                <li onClick={pageHandle.bind(this,'share')} className={page=='share'?'on':''}><i className="foddingicon fooding-share-mail-new"></i><span>{i18n.t(700017/*共享记录*/)}</span></li>
                <li onClick={pageHandle.bind(this,'set')} className={page=='set'?'on':''}><i className="foddingicon fooding-set-mail-new"></i><span>{i18n.t(700018/*设置*/)}</span></li>

            </ul>
            {showStaff ? <Staff staffHandle={this.staffHandle} staffRefresh={this.staffRefresh} loginMessageNow={loginMessageNow}/> : ''}
            <Dialog visible={this.state.rodalShow} title={i18n.t(700007/*收邮件*/)} width={'50%'}>
              <div className="girdlayout">
                <FormWrapper  onCancel={this.onCancel} onSaveAndClose={this.onSaveAndClose}>
                  <div className={'row'}>
                      <div className="form-group col-xs-12 col-md-12">
                          <label className={'col-xs-4 col-md-4'}><span>*</span>{}</label>
                          <ConstVirtualSelect
                              isRequest={false}
                              initValueOptions={[{localName:i18n.t(700020/*近30天*/),receiveScope:-30},{localName:i18n.t(700021/*近60天*/),receiveScope:-60},
                              {localName:i18n.t(700022/*不收*/),receiveScope:null}]}
                              form={this.props.form}
                              fieldName='receiveScope'
                              initialValue={xt.initSelectValue(true, {localName:i18n.t(700022/*不收*/),receiveScope:null}, ['receiveScope'], 'localName', this.props.form)}
                              valueKeys={ da => ({
                                  s_label:da.localName,
                                  receiveScope:da.receiveScope,
                              })} rules={true}
                          />
                      </div>
                  </div>
                </FormWrapper>
              </div>
            </Dialog>
        </menu>
    }
}
const MenuPage = createForm()(MenuPage1);


// page
class PageList extends Component {

    constructor(props) {
        super(props);

    }

    render(){
        let {toggle,folderID,page,loginMessageNow} = this.props;

        switch (page) {

            case 'write' : // 写邮件
                console.log('跳转到写邮件');
            break;
            case 'putMail' : // 收邮件

                var NowPage = <Inbox loginMessageNow={loginMessageNow} router={this.props.router}/>;
            break;
            case 'Inbox' : // 收件箱
                var NowPage = <Inbox loginMessageNow={loginMessageNow} getInit={this.props.getInit} router={this.props.router}/>;
            break;
            case 'outbox' : // 已发送
                var NowPage = <OutBox loginMessageNow={loginMessageNow} router={this.props.router}/>;
            break;
            case 'deleted' : // 已删除
                var NowPage = <Deleted loginMessageNow={loginMessageNow} router={this.props.router}/>;
            break;
            case 'verify' : // 审核箱
                var NowPage = <Verify loginMessageNow={loginMessageNow} router={this.props.router}/>;
            break;
            case 'dustbin' : // 垃圾箱
                var NowPage = <Dustbin loginMessageNow={loginMessageNow} router={this.props.router} />;
            break;
            case 'draft' : // 草稿箱
                var NowPage = <Draft loginMessageNow={loginMessageNow} router={this.props.router} />;
            break;
            case 'history' : //历史邮件
                var NowPage = <History loginMessageNow ={loginMessageNow} router={this.props.router} />;
            break;
            case 'batchMail' : // 群发邮件
                var NowPage = <BatchMail loginMessageNow={loginMessageNow} router={this.props.router}  />;
            break;
            case 'blacklist' : // 黑名单
                var NowPage = <BlackList loginMessageNow={loginMessageNow} router={this.props.router}  />;
            break;            
            case 'folder' : // 指定文件夹
                var NowPage = <Folder folderID={folderID} loginMessageNow={loginMessageNow} getInit={this.props.getInit} router={this.props.router} />;
            break;
            case 'share' : // 共享记录
                var NowPage = <Share loginMessageNow={loginMessageNow} router={this.props.router} />;
            break;
            case 'set' :  // 设置
                var NowPage = <SetPage  loginMessageNow={loginMessageNow} router={this.props.router} />;
            break;
            default:
            break;


        }

        return <article className={toggle ? 'on article' : 'article'}>
            {NowPage}
        </article>
    }
}



// output
class MailHome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            toggle: false,
            page: this.props.location.query.type||'Inbox',
            folderID: '', // 指定文件夹ID

            availHeight: availHeight, // 屏幕高度

            loginMessage: getUser(), // 登录信息
            loginMessageNow:{}, // 当前 登录信息


        }
        this.getInit = this.getInit.bind(this);
    }

	componentDidMount(){
        let {loginMessage} = this.state;
        let that = this;
        
        this.setState({
            loginMessageNow:{ 
                id: xt.getQueryParameter('id') || loginMessage.staff['id'],
                name: decodeURIComponent(xt.getQueryParameter('name')) || loginMessage['staffName'],
                position: decodeURIComponent(xt.getQueryParameter('position')) || (loginMessage.staff.positn ? loginMessage.staff.positn['localName'] : ''),
                email: decodeURIComponent(xt.getQueryParameter('email')) || loginMessage['defaultEmail'],
            }
        });

        
    }

	componentWillUnmount() {
	}
    getInit(){
        let that = this;
        that.normalRef.getInit();
    }
    // staff
    staffHandle = (o)=>this.setState({loginMessageNow: Object.assign(this.state['loginMessageNow'],o),page:''},function(){ this.setState({page:'Inbox'}) });

    // toggle menu
    toggleHandle = ()=>{
        let {toggle} = this.state;
        this.setState({ toggle: !toggle });
    }

    // toggle page
    pageHandle = (name,ID)=>this.setState({page:''},function(){this.setState({page:name,folderID:ID})});


    render(){
        let that = this;
        let {toggle,folderID,page,availHeight,loginMessage,loginMessageNow} = this.state;
        
        if(!loginMessageNow['email']) loginMessageNow['email'] = (decodeURIComponent(xt.getQueryParameter('email')) || loginMessage['defaultEmail']);

        let temID = `noohleMmail${loginMessageNow['id']}`;   // 临时 ID


        return <div id={temID} className="noohle-email" style={{height:availHeight}}>
            <MenuPage normalRef={no => this.normalRef = no} staffHandle={this.staffHandle} loginMessage={loginMessage}
              loginMessageNow={loginMessageNow} pageHandle={this.pageHandle}
              toggleHandle={this.toggleHandle} toggle={toggle} page={page} folderID={folderID}/>
            <PageList loginMessageNow={loginMessageNow} folderID={folderID} toggle={toggle} page={page} getInit={this.getInit} router={this.props.router}/>
        </div>
    }

}

export default NavConnect(MailHome);
