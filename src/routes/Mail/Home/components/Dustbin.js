import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';
import Page from '../../../../components/Page';//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from '../../../../components/Table';//Table表格
import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_MAIL, API_FOODING_DS, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {themeAbb,timeFormat,detailFunc,availHeight,commonRow,commonAjax,NavBtnFunc} from "./Common.js"; // 公共库
import Nav from "./Nav.js"; // nav 导航
import Archive from "./Archive.js"; // 归档
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
            dialogContent:<div></div>
        }

        // table list
    this.onCancel = this.onCancel.bind(this);
    this.addHandle = this.addHandle.bind(this);
  }
  onCancel(){
  this.setState({showDetail:false});
  }
	componentDidMount(){
		this.getPage();
    };
	componentWillUnmount() {
	}

    // 彻底删除
    destroyHandle = ()=>NavBtnFunc({row:this.refs.product.getSelectArr(),message:{btn:'destroy',isFolder:false},confirm:i18n.t(700095/*确定彻底删除?*/),callBack: this.getPage});

    // 删除
    deleteHandle = ()=>NavBtnFunc({row:this.refs.product.getSelectArr(),message:{btn:'delete'},confirm:i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/),callBack: this.getPage});

    // 移动到收件箱
    moveInboxHandle = ()=>NavBtnFunc({row:this.refs.product.getSelectArr(),message:{btn:'move',box:'RECEIVE'},confirm:i18n.t(700096/*确定移动到收件箱?*/),callBack: this.getPage});

	// 页面 刷新
	getPage = (search)=>{
        let that = this;
        let {searchData,pageSize, currentPage, followMark, color} = this.state;
        let {loginMessageNow} = this.props;

        function Ajax(data={}){
            apiGet(API_FOODING_MAIL,'/box/getList',Object.assign({box:'TRASH',userAddress:loginMessageNow['email'],followMark:followMark,color:color,pageSize:pageSize,currentPage:currentPage},that.state.searchData,data),
                (response)=>{
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
    render(){
        let that = this;
        let {searchData,record,scroll,showDetail,rowData} = this.state;
        let {loginMessageNow} = this.props;


        return <div className="mail-list">
            <Nav
                searchData={searchData}
                loginMessageNow={loginMessageNow}
                getPage={this.getPage}
                deleteHandle={this.deleteHandle}
                destroyHandle={this.destroyHandle}
                moveInboxHandle={this.moveInboxHandle}
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
            			dataIndex : 'sendAddress',
            			key : "sendAddress",
            			width : '9%',
            			render(data,row,index){
            				return (<div className="text-ellipsis">{data}</div>);
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
            			title : i18n.t(700076/*日期*/),
            			dataIndex : "sendTime",
            			key : "sendTime",
            			width : "9%",
            			render(data,row,index){
            				// return new Date(data).Format('yyyy-MM-dd');
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
                accessoryConfig={{show : true,dataIndex:'containAttach',accessoryHeaderSelect:this.accessoryHeaderSelect}}
                onRowDoubleClick={(row)=>detailFunc(row,'dustbin')}
                contextMenuConfig={{
                    enable:true,
                    contextMenuId:'SIMPLE_TABLE_MENU',
                    menuItems:[
                    {
                        onClick:this.previewHandle,
                        content:<div>{i18n.t(200087/*预览*/)}</div>,
                    },
                    {
                        onClick:(e,row)=>NavBtnFunc({row:Array.of(row['record']),message:{btn:'delete'},callBack: this.getPage}),
                        content:<div>{i18n.t(100437/*删除*/)}</div>,
                    },
                    {
                        onClick:(e,row)=>NavBtnFunc({row:Array.of(row['record']),message:{btn:'move',box:'RECEIVE'},callBack: this.getPage}),
                        content:<div>{i18n.t(700097/*移动至收件箱*/)}</div>,
                    },
                    {
                        onClick:(e,row)=>NavBtnFunc({row:Array.of(row['record']),message:{btn:'destroy',isFolder:false},callBack: this.getPage}),
                        content:<div>{i18n.t(700093/*彻底删除*/)}</div>,
                    },
                    {
                        onClick:(e,row)=>commonAjax({url:'/blacklist/remove',data:{mail:row.record['collectName'], address:row.record['sendMail']},callBack:this.getPage,success:true}),
                        content:<div>{i18n.t(600179/*解锁黑名单*/)}</div>,
                    }
                    ]
                }}
            />
            </div>
            <Dialog visible={this.state.showDetail} title={this.state.title} width={'80%'}>
               {this.state.dialogContent}
            </Dialog>
        </div>
    }
}
