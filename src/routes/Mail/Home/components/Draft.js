import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';
import Page from '../../../../components/Page';//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from '../../../../components/Table';//Table表格
import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_MAIL, API_FOODING_DS, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {themeAbb,timeFormat,detailFunc,availHeight,commonRow,commonAjax,NavBtnFunc} from "./Common.js"; // 公共库
import Nav from "./Nav.js"; // nav 导航
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
        }

        // table list
		this.columns = [
        {
			title : i18n.t(200540/*收件人*/),
			dataIndex : 'toAddress',
			key : "toAddress",
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
			title : i18n.t(200756/*日期*/),
			dataIndex : "sendTime",
			key : "sendTime",
			width : "9%",
			render(data,row,index){
				// return new Date(data).Format('yyyy-MM-dd');
                return timeFormat(data);
			}
		}];

    this.onCancel = this.onCancel.bind(this);
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

	// 页面 刷新
	getPage = (search)=>{
        let that = this;
        let {searchData,pageSize, currentPage, followMark, color} = this.state;
        let {loginMessageNow} = this.props;

        function Ajax(data={}){
            apiGet(API_FOODING_MAIL,'/box/getList',Object.assign({box:'DRAFT',userAddress:loginMessageNow['email'],followMark:followMark,color:color,pageSize:pageSize,currentPage:currentPage},that.state.searchData,data),
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
    previewHandle = (e,row)=>row ? this.setState({rowData:row['record'],showDetail:false},function(){ this.setState({showDetail:true,title:i18n.t(200087/*预览*/)}) }) : this.setState({showDetail:false});

    // 重新编辑
    editHandle = ()=>{
        let row = this.refs.product.getSelectArr()[0];
        row && window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,{type:'rewrite',collectionName:row['collectName'],mailId:row['id']},{refresh: true});
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
                destroyHandle={this.destroyHandle}
                editHandle={()=>this.refs.product.getSelectArr()} // 重新编辑
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
                columns={this.columns}
                data={record}
                checkboxConfig={{show:true,position:'first'}}
                scroll={{x:true,y:scroll}}
                colorFilterConfig={{show : true, dataIndex:'color', onSelect: this.savePrefers, onHeaderSelect: this.searchColor}}
                followConfig={{show:true, onClick:this.saveFollow, dataIndex:'followMark', onHeaderClick: this.searchFollow}}
                accessoryConfig={{show : true,dataIndex:'containAttach',accessoryHeaderSelect:this.accessoryHeaderSelect}}
                contextMenuConfig={{
                    enable:true,
                    contextMenuId:'SIMPLE_TABLE_MENU',
                    menuItems:[
                    {
                        onClick:this.previewHandle,
                        content:<div>{i18n.t(200087/*预览*/)}</div>,
                    },
                    {
                        onClick:(e,row)=>NavBtnFunc({row:Array.of(row['record']),message:{btn:'destroy',isFolder:false},callBack: this.getPage}),
                        content:<div>{i18n.t(700093/*彻底删除*/)}</div>,
                    },
                    {
                       onClick:this.editHandle,
                        content:<div>{i18n.t(700106/*重新编辑*/)}</div>,
                    }
                    ]
                }}
            />
            </div>
            <Dialog visible={this.state.showDetail} title={this.state.title} width={'80%'}>
                { showDetail ? <MailDetail previewHandle={this.previewHandle} row={rowData} onCancel={this.onCancel} /> : '' }
            </Dialog>
        </div>
    }
}
