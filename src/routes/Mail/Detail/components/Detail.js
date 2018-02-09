import React, {PropTypes, Component} from "react";
import {createForm,FormWrapper} from '../../../../components/Form';

import i18n from '../../../../lib/i18n';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Calendar from  '../../../../components/Calendar/Calendar';

import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_MAIL, API_FOODING_DS,API_FOODING_MAIL_SERVER,language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import xt from '../../../../common/xt';

import {ButtonDIV,themeAbb,timeFormat,availHeight,commonRow,commonAjax,NavBtnFunc} from "../../Home/components/Common.js"; // 公共库
import Nav from "../../Home/components/Nav.js"; // nav 导航
import Card from "../../Home/components/Card.js"; // 卡片


import {SubMenu, Popover, Menu, Dropdown, Button, Icon, Input  } from 'antd';
import RightKey from '../../../../components/RightKey/RightKey';

import 'bootstrap/js/dropdown';
import 'bootstrap/js/tooltip';


// 定时发送 
class IntervalDIV extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
            time: '', // 发送时间 
        }
    }

	componentDidMount(){
    }

	componentWillUnmount() {
	}

    // 预计时间 
    timeHandle = (key)=>{
        let that = this;

        if(!key) {
            setTimeout(function(){
                that.setState({time:that.props.form.getFieldsValue()['updateTime']});
            },500);
        }
    }

    // confirm
    confirmHandle = ()=>{
        let {adjustTime} = this.props;
		this.props.form.validateFields((errors, value) => !errors &&  adjustTime(value));
    }

    // cancel
    cancelHandle = ()=>{
        this.props.adjustTime();
    }


    render(){
        let {time} = this.state;
        let {data} = this.props;
		const {getFieldProps,getFieldError} = this.props.form;

        return (<div className={'addnormal girdlayout'}>
            <div className="row">
                <div className="col-md-offset-1 col-md-10">
                    <label className={'col-md-2'}><span>*</span>{i18n.t(600173/*选择时间*/)}</label>
                    <div className={'col-md-10 datetime'}>
                        <Calendar 
                            beginData={new Date()}
                            onOpenChange={this.timeHandle}
                            width={'100%'}  
                            showTime={true}
                            isShowIcon={true} 
                            form={this.props.form}
                            validate={true}
                            className ={getFieldError('billDate')?'error-border':''}
                            name={'updateTime'}
                            value={data['regularSendTime']}												
                        />
                    </div>
                </div>
                { time ? 
                    <div className="col-md-offset-1 col-md-10">
                        <div className={'col-md-10 datetime'}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>本邮件将在 </span>
                            <b>{new Date(time).Format('yyyy年MM月dd日hh时mm分')}</b>
                            <span> 投递到对方邮箱。</span>
                        </div>
                    </div>  
                    :''
                }              
            </div>
            <br/>
            <ButtonDIV confirmText={i18n.t(200427/*发送*/)} confirmHandle={this.confirmHandle} cancelHandle={this.cancelHandle}/>
        </div>);  
    }

}
let IntervalDIVForm = createForm()(IntervalDIV);

export class PageNow extends Component {

    constructor(props) {
        super(props);
        let that = this;

        // init state
        this.state = {
            showDialog: false, // show 修改时间

            context: '', // 邮件内容
            param: {}, // 参数
            getOne:{}, //单挑数据
            timestamp: 0, // 时间戳

            headToggle: true, // head 暂开
            download: {}, // 下载附件
            downloadAll: [], // 下载全部附件

        }

    }

	componentDidMount(){
        let param = xt.parseQueryParameter(decodeURIComponent(window.location.href));
        this.setState({param:param},function(){
            this.getPage();
        });
    }

	componentWillUnmount() {
	}

    // 关闭页面 
    closePageHandle = ()=>{
        let page = this.props.location.query.page;
        let param = this.props.location.query.param ? {param:this.props.location.query.param} :{};
        let {navReplaceTab} = this.props;
            navReplaceTab({ name: i18n.t(100586/*邮件*/), component: i18n.t(100586/*邮件*/), url: `/mail`});
            this.props.router.push({pathname: `/mail`,query:Object.assign(param,{type:page}),state: {refresh: true}});         
    }

    // 删除
    deleteHandle = ()=>NavBtnFunc({row:Array.of(this.state.param),message:{btn:'delete'},confirm:i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/),callBack:()=>this.closePageHandle()});

    // 恢复
    recoverHandle = ()=>NavBtnFunc({row:Array.of(this.state.param),message:{btn:'recover',isFolder:false},confirm:i18n.t(700094/*确定恢复?*/),callBack:()=>this.closePageHandle()});

    // 彻底删除
    destroyHandle = ()=>NavBtnFunc({row:Array.of(this.state.param),message:{btn:'destroy',isFolder:false},confirm:i18n.t(700095/*确定彻底删除?*/),callBack:()=>this.closePageHandle()});

    // 移动到收件箱
    moveInboxHandle = ()=>NavBtnFunc({row:Array.of(this.state.param),message:{btn:'move',box:'RECEIVE'},confirm:i18n.t(700096/*确定移动到收件箱?*/),callBack:()=>this.closePageHandle()});

    // 移动至文件夹
    moveHandle = (key)=>NavBtnFunc({row:Array.of(this.state.param),message:{btn:'move',box:key=='TRASH'?key:'',folder:key!='TRASH'?key:''}});

    // 标记为 已读|未读
    signHandle = (active)=>NavBtnFunc({row:Array.of(this.state.param),message:{btn:'signRead',active:active}});


	// 页面 刷新
	getPage = (search={})=>{
        let that = this;
        let {param} = this.state;

        apiGet(API_FOODING_MAIL,'/box/getOne',Object.assign({},param),
            (response)=>{
                that.setState({
                    context: response.data['context'],
                    param: Object.assign({},param,{collectName:param['collectionName'],id:param['mailId'],active:param['active']}),
                    getOne:response.data
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
	}

    // head 展开
    headHandle = ()=>this.setState({headToggle: !this.state.headToggle})

    // 颜色分类
    colorHandle = (e)=>commonAjax({url:'/box/prefer',data:{mailId:this.state.param['id'], collectionName:this.state.param['collectionName'], color:e['key']},callBack:this.getPage});

    // 收藏
    collectHandle = (e)=>commonAjax({url:'/box/prefer',data:{mailId:this.state.param['id'],collectionName:this.state.param['collectionName'],followMark:!e ? true : false},callBack:this.getPage});

    // 附件下载
    downloadHandle = (e)=>{
        let timestamp = new Date().getTime();
        this.setState({download:{},timestamp:timestamp},function(){
            this.setState({download:e},function(){
                document.getElementById(`singleDownload${timestamp}`).submit();
            });
        });
    }

    // 附件右键
    handleClick =(option,e,action)=>{
        let timestamp = new Date().getTime();

        // 保存附件
        if( action['action']==1 ){
            this.downloadHandle(option);
        }

        // 保存全部附件
        if( action['action']==2 ){
            let {attachs} = this.state.getOne;
            this.setState({downloadAll:[],timestamp:timestamp},function(){
                this.setState({downloadAll:attachs},function(){
                    //return;
                    document.getElementById(`singleDownloadAll${timestamp}`).submit();
                });
            });
        }
    }

    // show 修改时间 Dialog 
    showAdjustHandle = (key,result)=> {
        
        if( result == true) this.getPage();
        this.setState({showDialog:key}); 
    }

    // 调整时间 
    adjustTime = (o)=>{
        let that = this;

        if(o) { 
            // 判断是否 小于当前时间 
            if( new Date(o['updateTime']) < new Date() ) {
                ServiceTips({text:'修改时间，不能小于当前时间！',type:'info'});
                return;
            }

            // 修改时间
            commonAjax({url:'/box/updateTime',data:{mailId:this.state.param['id'], collectionName:this.state.param['collectionName'],updateTime:o['updateTime']},callBack:that.showAdjustHandle.bind(that,false,true),success:true});
    } else{
            // 不 修改时间
            this.showAdjustHandle(false);
            //commonAjax({url:'/box/cancelSend',data:{mailId:this.state.param['id'], collectionName:this.state.param['collectionName']},callBack:this.showAdjustHandle(false)})
        } 
        
    }

    // 取消 修改时间 

    render(){
        let that = this;
        let {showDialog,timestamp,headToggle,downloadAll,download,context,param,getOne} = this.state;
        var NavHTML = <div></div>;

        // 判断页面
        if(getOne.isDelete){ //删除
          NavHTML = <Nav
                              Nosearch={true}
                              getPage={this.getPage}
                              destroyHandle={this.destroyHandle} // 彻底删除
                              recoverHandle={this.recoverHandle} // 恢复
                          />;
        }else if(getOne.box == 'RECEIVE'){ //收件箱
          NavHTML = <Nav
                              Nosearch={true}
                              getPage={this.getPage}
                              replyAllHandle={()=>Array.of(param)} // 全部回复
                              replyHandle={()=>Array.of(param)} // 回复
                              deleteHandle={this.deleteHandle} // 删除
                              forwardMailHandle={()=>Array.of(param)} // 转发
                              shareHandle={()=>Array.of(param)} // 共享
                              signHandle={this.signHandle} // 标记为 已读|未读
                              // moveHandle={this.moveHandle} // 移动至文件夹
                          />;
        }else if(getOne.box == 'SEND'){ //已发送
          NavHTML = <Nav
                              Nosearch={true}
                              getPage={this.getPage}
                              deleteHandle={this.deleteHandle} // 删除
                              forwardMailHandle={()=>Array.of(param)} // 转发
                              shareHandle={()=>Array.of(param)} // 共享
                              resendHandle={()=>Array.of(param)} // 重新发送
                              // moveHandle={this.moveHandle} // 移动至文件夹
                          />;
        }else if(getOne.box == 'TRASH'){ //垃圾箱
          NavHTML = <Nav
                              Nosearch={true}
                              getPage={this.getPage}
                              deleteHandle={this.deleteHandle} // 删除
                              destroyHandle={this.destroyHandle} // 彻底删除
                              moveInboxHandle={this.moveInboxHandle} // 移动到收件箱
                          />;
        }


        // 颜色分类
        const Colormenu = (
            <Menu onClick={this.colorHandle}>
                <Menu.Item key={'#ff001f'} style={{padding:'3px 5px'}}><p style={{background:'#ff001f'}}>&nbsp;</p></Menu.Item>
                <Menu.Item key={'#e8a82c'} style={{padding:'3px 5px'}}><p style={{background:'#e8a82c'}}>&nbsp;</p></Menu.Item>
                <Menu.Item key={'#c030ef'} style={{padding:'3px 5px'}}><p style={{background:'#c030ef'}}>&nbsp;</p></Menu.Item>
                <Menu.Item key={'#16c42b'} style={{padding:'3px 5px'}}><p style={{background:'#16c42b'}}>&nbsp;</p></Menu.Item>
                <Menu.Item key={' '}><p style={{textAlign:'center'}}>{i18n.t(700136/*取消分类*/)}</p></Menu.Item>
            </Menu>
        );

        // 右键
        var rightHandArray = [
            {type: 1,child:<div>{i18n.t(700142/*保存附件*/)}</div>},
            {type: 2,child:<div>{i18n.t(700143/*保存全部附件*/)}</div>},
        ];


        let temID = `detail${new Date().getTime()}`;   //卡片临时  ID
        let rightID = `right${new Date().getTime()}`;   // 右键临时 ID


        return <div id={temID} className="noohle-email">
            <div className="detail-mail">
                {/*<Nav
                    Nosearch={true}
                    getPage={this.getPage}
                    replyAllHandle={()=>Array.of(param)} // 全部回复
                    replyHandle={()=>Array.of(param)} // 回复
                    forwardMailHandle={()=>Array.of(param)} // 转发
                    resendHandle={()=>Array.of(param)} // 重新发送
                    editHandle={()=>Array.of(param)} // 重新编辑
                    shareHandle={()=>Array.of(param)} // 共享
                    deleteHandle={this.deleteHandle} // 删除
                    destroyHandle={this.destroyHandle} // 彻底删除
                    moveInboxHandle={this.moveInboxHandle} // 移动到收件箱
                    recoverHandle={this.recoverHandle} // 恢复
                    moveHandle={this.moveHandle} // 移动至文件夹
                    signHandle={this.signHandle} // 标记为 已读|未读
                />*/}
                {NavHTML}
                <div style={{height:document.body.offsetHeight-129,overflowY:'auto',marginTop:0}} className='scroll'>
                <header className={ headToggle ? '' : 'on' }>
                    <i onClick={this.headHandle} className={headToggle ? 'toggle glyphicon glyphicon-chevron-up' : 'toggle glyphicon glyphicon-chevron-down'} title={headToggle? i18n.t(700140/*合闭*/) : i18n.t(700139/*展开*/)}></i>
                    <h2 className="font-hide" title={getOne['subject']}>{themeAbb(getOne['subject'])}</h2>
                    <Dropdown overlay={Colormenu} trigger={['click']}>
                        <i className="glyphicon glyphicon-stop" style={{color:getOne['color'] || 'dimgrey'}}></i>
                    </Dropdown>
                    <i onClick={this.collectHandle.bind(this,getOne['followMark'])} style={{color: getOne['followMark'] ? '#ff001f' : 'dimgrey'}} className="glyphicon glyphicon-star" title={i18n.t(700138/*标记收藏*/)}></i>
                    <li className="addresser">
                        <label className="bold">{i18n.t(200539/*发件人*/)+':'}</label>
                        <span>{getOne['sendMail']}</span>
                        { (getOne.box != 'SEND') ? <Card page="detail" row={getOne} id={temID}/> : '' }
                    </li>                    
                    <li className="send">
                        <label className="bold">{i18n.t(200540/*收件人*/) + ':'}</label>
                        <span className="font-hide" title={getOne['toAddress']}>{getOne['toAddress']}</span>
                    </li>
                    { getOne['ccAddress'] ?
                        <li className="send">
                            <label className="bold">{i18n.t(700137/*抄送人*/)+'：'}</label>
                            <span className="font-hide" title={getOne['ccAddress']}>{getOne['ccAddress']}</span>
                        </li> 
                        :''
                    }
                  
                    <li>
                        <label>{i18n.t(400104/*时间*/)+'：'}</label>
                        <span>{timeFormat(getOne['sendTime'],'detail')}</span>
                    </li>
                    { getOne['regularSendTime'] && (new Date(getOne['regularSendTime']) > new Date()) ? 
                        <li>
                            <label>
                                {i18n.t(600175/*此邮件是定时邮件, 将在*/)}
                                &nbsp;&nbsp;
                                <b>{new Date(getOne['regularSendTime']).Format('yyyy年MM月dd日hh时mm分')}</b>
                                &nbsp;&nbsp;
                                {i18n.t(600176/*发出。*/)}                                
                            </label>
                            { !getOne['sendResults'] ? <span onClick={this.showAdjustHandle.bind(that,true)}><a href="javascript:;" title={i18n.t(600174/*修改时间*/)}>{i18n.t(600174/*修改时间*/)}</a></span> :''}
                        </li> 
                        :'' 
                    }                  
                    
                    { Array.from(getOne.attachs || {}).length ?
                        <li className="down">
                            {getOne.attachs.map((o,i)=>
                                <RightKey key={i} id={rightID+i} isShowMenu={true} handleClick={this.handleClick.bind(this,o)} array={rightHandArray}>
                                    <span className="down"><i className="down foddingicon fooding-accessory"></i><b className="font-hide" title={o['fileName']}>{o['fileName']}</b><i onClick={this.downloadHandle.bind(this,o)} className="downBtn foddingicon fooding-download" title={i18n.t(200083/*下载*/)}></i></span>
                                </RightKey>)
                            }
                        </li>
                        :''
                    }

                    { Array.from(getOne.newAttachs || {}).length ?
                        <li className="down">
                            {getOne.newAttachs.map((o,i)=>
                                <a href={o['fullPath']} target="_black" key={i}>
                                    <span className="down"><i className="down foddingicon fooding-accessory"></i><b className="font-hide" title={o['fileName']}>{o['fileName']}</b><i className="downBtn foddingicon fooding-download" title={i18n.t(200083/*下载*/)}></i></span>
                                </a>
                            )}
                        </li>
                        :''
                    }

                </header>
                <div  className="html-page" dangerouslySetInnerHTML={{__html: context}}></div>
              </div>
            </div>
            { download['filePath'] ?
                <form id={`singleDownload${timestamp}`} className="hide" action={API_FOODING_MAIL_SERVER + `/file/down`} method="post">
                    <input name="filePath" value={download['filePath']}/>
                    <input name="fileName" value={download['fileName']}/>
                </form>
                :
                ''
            }
            { downloadAll['length'] ?
                <form id={`singleDownloadAll${timestamp}`} className="hide" action={API_FOODING_MAIL_SERVER + `/file/downAll`} method="post">
                    { downloadAll.map((o,i)=><input key={i} name={`attachs[${i}].${'filePath'}`} value={o['filePath']}/>)}
                    { downloadAll.map((o,i)=><input key={i} name={`attachs[${i}].${'fileName'}`} value={o['fileName']}/>)}
                </form>
                :
                ''
            }

            <Dialog visible={showDialog} title={i18n.t(100146/*修改时间*/)} width={'43%'} onClose={()=>this.showAdjustHandle(false)}>
                <IntervalDIVForm data={getOne} adjustTime={this.adjustTime} />
            </Dialog>            
        </div>
    }
}

export default NavConnect(PageNow);
