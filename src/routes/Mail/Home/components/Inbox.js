import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';
import Page from '../../../../components/Page';//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from '../../../../components/Table';//Table表格
import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_MAIL, API_FOODING_DS, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {themeAbb,detailFunc,timeFormat,availHeight,commonRow,commonAjax,NavBtnFunc} from "./Common.js"; // 公共库
import Nav from "./Nav.js"; // nav 导航
import Archive from "./Archive.js"; // 归档
import Card from "./Card.js"; // 卡片
import MailDetail from "./MailDetail.js"; // 页面详情

export default class PageNow extends Component {

    constructor(props) {
        super(props);
        let that = this;

        // init state
        this.state = {
            searchData: {}, // 搜索数据
            currentPage:1, // 当前页
            totalPages: 1, // 总页数
            pageSize: pageSize, // 每页 多少条
            color: '',	// 颜色过滤
            followMark: false, // 过滤收藏
            record: [], // table data

            scroll: availHeight-100,    // table 高度
            rowData: {}, // 行数据
            showDetail: false, // show 详情
            contentMenu:null,
            dialogContent:<div></div>
        }

        // table list
        this.moveClick = this.moveClick.bind(this);
        this.updataChild = this.updataChild.bind(this);
        //移动至历史邮箱
        this.historyClick = this.historyClick.bind(this);

        this.onCancel = this.onCancel.bind(this);
        this.addHandle = this.addHandle.bind(this);
    }
  onCancel(){
    this.setState({showDetail:false});
  }
  updataChild(e,row){
  }
  historyClick(e,row){
      let rows = this.refs.product.getSelectArr();
      let mailIds = [];
      rows.map((e)=>{mailIds.push(e.id)});
    apiForm(API_FOODING_MAIL,'/box/toHistory',{mailIds:mailIds,collectionName:row.record.collectName},(response)=>{
      this.getPage();
    },(error)=>{
      ServiceTips({type:'error',text:error.message});
    });
  }
  moveClick(e,row,data){
    let box = row.action?undefined:'TRASH';
    NavBtnFunc({row:Array.of(row['record']),message:{btn:'move',box:box,folder:row.action},callBack: this.getPage})
  }
	componentDidMount(){
		this.getPage();
        apiGet(API_FOODING_MAIL,'/getFolders',{email:this.props.loginMessageNow['email']},(response)=>{
        let contentMenu = [{onClick:this.moveClick,content:<div>{i18n.t(700011/*垃圾箱*/)}</div>},{onClick:this.historyClick,content:<div>{i18n.t(700012/*历史邮件*/)}</div>}];
        let data =response.data || [];
        data.map((e)=>{
            contentMenu.push({onClick:this.moveClick,content:<div>{e.name}</div>,data:{action:e.id}});
        })
        this.setState({contentMenu})
        },(error)=>{

        });
  };
	componentWillUnmount() {
	}

    // 邮件 移动文件夹
    filesDoubleHandle = (row)=>{
        console.log(row);
    }

    // 移动至文件夹
    moveHandle = (key)=>NavBtnFunc({row:this.refs.product.getSelectArr(),message:{btn:'move',box:key=='TRASH'?key:'',folder:key!='TRASH'?key:'',isLishi:true},callBack: this.getPage});

    // 标记为 已读|未读
    signHandle = (active)=>NavBtnFunc({row:this.refs.product.getSelectArr(),message:{btn:'signRead',active:active},callBack: this.getPage});

    // 删除
    deleteHandle = ()=>NavBtnFunc({row:this.refs.product.getSelectArr(),message:{btn:'delete'},confirm:i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/),callBack: this.getPage});

	// 页面 刷新
	getPage = (search)=>{
        let that = this;
        let {searchData,pageSize, currentPage, followMark, color} = this.state;
        let {loginMessageNow} = this.props;

        function Ajax(data={}){
            apiGet(API_FOODING_MAIL,'/box/getList',Object.assign({box:'RECEIVE',userAddress:loginMessageNow['email'],followMark:followMark,color:color,pageSize:pageSize,currentPage:currentPage},that.state.searchData,data),
                (response)=>{
                    that.props.getInit();
                    that.setState({
                        record: []
                    },function(){
                        that.setState({
                            record: response.data.data || [],
                            totalPages: response.data.totalPages,
                            currentPage: response.data.currentPage
                        });
                    });
                },(errors)=>{
                    ServiceTips({text:errors.message,type:'error'});
            });            
        }


        if(search){
            this.setState({searchData:search},function(){
                Ajax({currentPage:1});
            });
        } else{
            Ajax();          
        }        

	}

    // 过滤 已读|未读
    emailHeaderSelect = (icon)=>this.getPage(icon.includes('fooding-mail') ? {markRead:''} : (icon.includes('no-readly') ? {markRead:false} : {markRead:true}));

    // 列表 附件过滤
    accessoryHeaderSelect = (icon)=>this.getPage(icon.includes('all') ? {containAttach:''} : (icon.includes('yes') ? {containAttach:true} : {containAttach:false}));

	// 过滤颜色
	searchColor = (color)=> this.setState({color: color}, function(){ this.getPage()} );

	// 过滤 收藏
	searchFollow = (result)=>this.setState({followMark: result}, function(){ this.getPage() } );

    // 保存颜色
	savePrefers = (color,row)=>commonAjax({url:'/box/prefer',data:{mailId:row.id, collectionName:row.collectName, color:color},callBack:this.getPage});

	// 保存收藏
	saveFollow = (row,index,result)=>commonAjax({url:'/box/prefer',data:{mailId:row.id, collectionName:row.collectName, followMark:result},callBack:this.getPage});

    // 列表标记 已读|未读
    emailSelect = (row)=>NavBtnFunc({row:Array.of(row),message:{btn:'signRead',active:row['markRead'] ? 'unread' : 'read'},callBack: this.getPage});

    // 预览详情
    previewHandle = (e,row)=>row ? this.setState({showDetail:true,title:i18n.t(200087/*预览*/),dialogContent:<MailDetail previewHandle={this.previewHandle} row={row['record']} onCancel={this.onCancel} />}) : this.setState({showDetail:false});
    
    //点击归档
    addHandle(Template){
      this.setState({
        dialogContent:Template,
        showDetail:true,
        title:i18n.t(700071/*归档*/)
      });
    }
    // 全部回复
    replyAllHandle = ()=>{
        let row = this.refs.product.getSelectArr()[0];
        row && window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,{type:'replyall',collectionName:row['collectName'],mailId:row['id']},{refresh: true});
    };
    // 回复
    replyHandle = ()=>{
        let row = this.refs.product.getSelectArr()[0];
        row && window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,{type:'reply',collectionName:row['collectName'],mailId:row['id']},{refresh: true});
    };
    // 转发
    forwardMailHandle = ()=>{
        let row = this.refs.product.getSelectArr()[0];
        row && window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,{type:'forward',collectionName:row['collectName'],mailId:row['id']},{refresh: true});
    };
    render(){
        let that = this;
        let {searchData,record,scroll,showDetail,rowData} = this.state;
        let {loginMessageNow} = this.props;



        return <div className="mail-list">
            <Nav
                ref='nav'
                searchData={searchData}
                loginMessageNow={loginMessageNow}
                getPage={this.getPage}
                replyAllHandle={()=>this.refs.product.getSelectArr()} // 全部回复
                replyHandle={()=>this.refs.product.getSelectArr()} // 回复
                forwardMailHandle={()=>this.refs.product.getSelectArr()} // 转发
                shareHandle={()=>this.refs.product.getSelectArr()} // 共享
                deleteHandle={this.deleteHandle}
                signHandle={this.signHandle}
                moveHandle={this.moveHandle}
                isLishi ={true}
                caogao={true}
            />
            <div className={'keys-page'} style={{paddingTop:'6px'}}>
                <Page
                    currentPage={this.state.currentPage}
                    totalPages={this.state.totalPages}
                    sizeList={sizeList}
                    currentSize={this.state.pageSize}
                    pageSizeChange={(num)=>{
                        that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
                    }}
                    backClick={(num)=>{
                        that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
                    }}
                    nextClick={(num)=>{
                        that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
                    }}
                    goChange={(num)=>{
                        that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
                    }}
                />
            </div>
            <div>
            <Table
                ref = "product"
                columns={[
                    {
            			title : i18n.t(200539/*发件人*/),
            			dataIndex : 'sendName',
            			key : "sendName",
            			width : '9%',
                        tooltip: (data)=>data,
            			render(data,row,index){
            				// return (<div className="text-ellipsis">{data}</div>);
            				return <Card id={`noohleMmail${loginMessageNow['id']}`} row={row} router={that.props.router}/>;
            			}
            		},
                    {
            			title : i18n.t(100304/*主题*/),
            			dataIndex : 'subject',
            			key : "subject",
            			width : '55%',
            			render(data,row,index){
            				return (<div className="text-ellipsis" title={data}>{themeAbb(data)}</div>);
            			}
            		},{
            			title : i18n.t(200756/*日期*/),
            			dataIndex : "sendTime",
            			key : "sendTime",
            			width : "9%",
            			render(data,row,index){
                            return timeFormat(data);
            			}
            		},{
            			title : i18n.t(700071/*归档*/),
            			dataIndex : "salBeCode",
            			key : "salBeCode",
            			width : "7%",
            			render(data,row,index){
            				return <Archive row={row} getPage={that.getPage} addHandle = {that.addHandle} onCancel={that.onCancel}/>
            			}
            		}]}
                data={record}
                checkboxConfig={{show:true,position:'first'}}
                scroll={{x:true,y:scroll}}
                colorFilterConfig={{show : true, dataIndex:'color', onSelect: this.savePrefers, onHeaderSelect: this.searchColor}}
                followConfig={{show:true, onClick:this.saveFollow, dataIndex:'followMark', onHeaderClick: this.searchFollow}}
                emailFilterConfig={{show : true,dataIndex:'markRead',emailSelect:this.emailSelect,emailHeaderSelect:this.emailHeaderSelect}}
                accessoryConfig={{show : true,dataIndex:'containAttach',accessoryHeaderSelect:this.accessoryHeaderSelect}}
                onRowDoubleClick={(row)=>{
                    detailFunc(row,'Inbox');
                    this.signHandle('read');
                }}
                contextMenuConfig={{
                    enable:true,
                    contextMenuId:'SIMPLE_TABLE_MENU',
                    menuItems:[
                    {
                        onClick:this.previewHandle,
                        content:<div>{i18n.t(200087/*预览*/)}</div>,
                    },                        
                    {
                        onClick:this.replyAllHandle,
                        content:<div>{i18n.t(700107/*全部回复*/)}</div>,
                    },
                    {
                        onClick:this.replyHandle,
                         content:<div>{i18n.t(300057/*回复*/)}</div>,
                    },
                    {
                            onClick:this.forwardMailHandle,
                            content:<div>{i18n.t(300042/*转发*/)}</div>,
                    },
                    {
                            onClick: ()=>this.refs['nav'].refs['share'].handleClick(),
                            content:<div>{i18n.t(700101/*共享*/)}</div>,
                    },                    
                    {
                        onClick:(e,row)=>NavBtnFunc({row:Array.of(row['record']),message:{btn:'delete'},callBack: this.getPage}),
                        content:<div>{i18n.t(100437/*删除*/)}</div>,
                    },
                    {
                        onClick:this.updataChild,
                        content:<div>{i18n.t(700098/*移动至*/)}</div>,
                        isSubMenu:true,
                        children:this.state.contentMenu
                    },
                    {
                        condition: [{key: 'markRead', value: [false], exp: '=='}],
                        onClick:(e,row)=>NavBtnFunc({row:Array.of(row.record),message:{btn:'signRead',active:row.record['markRead'] ? 'unread' : 'read'},callBack: this.getPage}),
                        content:<div>{i18n.t(700099/*标记为已读*/)}</div>,
                    },
                    {   condition: [{key: 'markRead', value: [true], exp: '==='}],
                        onClick:(e,row)=>NavBtnFunc({row:Array.of(row.record),message:{btn:'signRead',active:row.record['markRead'] ? 'unread' : 'read'},callBack: this.getPage}),
                        content:<div>{i18n.t(700100/*标记为未读*/)}</div>,
                    },
                    {
                        onClick:(e,row)=>commonAjax({url:'/blacklist/add',data:{mail:row.record['collectName'], address:row.record['sendMail']},callBack:this.getPage,success:true}),
                        content:<div>{i18n.t(600178/*加入黑名单*/)}</div>,
                    }
                    ]
                }}
            />
            </div>
            <Dialog visible={this.state.showDetail} title={this.state.title} width={'95%'}>
                { this.state.dialogContent}
            </Dialog>
        </div>
    }
}
