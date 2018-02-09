import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';
import Page from '../../../../components/Page';//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from '../../../../components/Table';//Table表格
import {getQueryString, apiGet, apiPost, apiForm,API_FOODING_MassMailServer,API_FOODING_MAIL,API_FOODING_MAIL_SERVER,API_FOODING_DS, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {FormWrapper} from '../../../../components/Form';
import {themeAbb,availHeight,commonRow,commonAjax,NavBtnFunc} from "./Common.js"; // 公共库
import Nav from "./Nav.js"; // nav 导航
import MailDetail from "./MailDetail.js"; // 页面详情
import Tooltip from "../../../../components/Tip";
import {timeFormat,detailFunc} from "./Common.js"; // 公共库
import Archive from "./Archive.js"; // 归档
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
            rodalShow:false,
            rowData: {}, // 行数据
            title:'',
            context:<div></div>
        }

        // table list
		this.columns = [
        {
			title : i18n.t(200539/*发件人*/),
			dataIndex : 'sendAddress',
			key : "sendAddress",
			width : '15%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},
        {
			title : i18n.t(100304/*主题*/),
			dataIndex : 'subject',
			key : "subject",
			width : '35%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{themeAbb(data)}</div>);
			}
		},{
			title : i18n.t(200080/*类型*/),
			dataIndex : "box",
			key : "box",
			width : "7%",
			render(data,row,index){
        return  data;
			}
		},{
			title : i18n.t(700076/*日期*/),
			dataIndex : "sendTime",
			key : "sendTime",
			width : "7%",
			render(data,row,index){
				return data?timeFormat(data):timeFormat(row.createTime);
			}
		},{
			title : i18n.t(700071/*归档*/),
			dataIndex : "salBeCode",
			key : "salBeCode",
			width : "7%",
			render(data,row,index){
				return <Archive row={row} getPage={that.getPage} isAdd = {true}/>
			}
		}];
    this.replySend = this.replySend.bind(this); //重新发送
    this.previewHandle = this.previewHandle.bind(this);//预览
    this.onCancel = this.onCancel.bind(this);
    this.recoverHandle = this.recoverHandle.bind(this);//恢复
  }
  recoverHandle(){
    let selectArr = this.refs.product.getSelectArr();
    if(selectArr.length == 0){
      ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'error'});
      return false;
    }
    let loginMessageNow = this.props.loginMessageNow;
    apiForm(API_FOODING_MAIL,'/box/fromHistory',{mailIds:selectArr[0].id,collectionName:loginMessageNow['email']},(response)=>{
      ServiceTips({text:response.message,type:'success'});
      this.getPage();
    },(error)=>{
        ServiceTips({text:error.message,type:'error'});
    })
  }
  onCancel(){
    this.setState({rodalShow:false})
  }
  replySend(e,row){
    let selectArr = this.refs.product.getSelectArr();
    if(selectArr.length == 0){ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'error'});return false;}
    apiForm(API_FOODING_MassMailServer,'/mass/resend',{id:selectArr[0].id},(response)=>{
      ServiceTips({text:response.message,type:'success'});
      this.getPage();
    },(error)=>{
      ServiceTips({text:error.message,type:'error'});
    })
  }
	componentDidMount(){
		this.getPage();
    };
	componentWillUnmount() {
	}

	// 页面 刷新
	getPage = (search)=>{
        let that = this;
        let {searchData,pageSize, currentPage} = this.state;
        let {loginMessageNow} = this.props;

        function Ajax(data={}){
            apiGet(API_FOODING_MAIL,'/box/getList',Object.assign({userAddress:loginMessageNow['email'],
                box:null,isHistory:true,
                pageSize:pageSize,currentPage:currentPage},that.state.searchData,data),
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

    previewHandle(){
      let selectArr = this.refs.product.getSelectArr();
      apiGet(API_FOODING_MAIL,'/box/getOne',{mailId:selectArr[0].id,collectionName:selectArr[0].collectName},(response)=>{
        this.setState({rodalShow:true,context:response.data.context});
      },(error)=>{
        ServiceTips({text:error.message,type:'error'})
      });
    }
    render(){
        let that = this;
        let {searchData,record,scroll,rowData} = this.state;
        let {loginMessageNow} = this.props;

        return <div className="mail-list">
            <Nav
                searchData={searchData}
                loginMessageNow={loginMessageNow}
                getPage={this.getPage}
                recoverHandle={this.recoverHandle} // 重新发送
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
                singleSelect ={true}
                checkboxConfig={{show:true,position:'first'}}
                scroll={{x:true,y:scroll}}
                onRowDoubleClick={(row)=>detailFunc(row,'history')}
                accessoryConfig={{show : true,dataIndex:'containAttach',accessoryHeaderSelect:this.accessoryHeaderSelect}}
                contextMenuConfig={{
                    enable:true,
                    contextMenuId:'SIMPLE_TABLE_MENU',
                    menuItems:[
                    {
                        onClick:this.previewHandle,
                        //content:<div><i className={'foddingicon fooding-eye-mail'}></i>{i18n.t(200087/*预览*/)}</div>
                        content:<div>{i18n.t(200087/*预览*/)}</div>
                    },
                    {
                        onClick:this.recoverHandle,
                        //content:<div><i className={'foddingicon fooding-storage'}></i>{i18n.t(700092/*恢复*/)}</div>,
                        content:<div>{i18n.t(700092/*恢复*/)}</div>,
                    }
                    ]
                }}
            />
            </div>
            	<Dialog visible={this.state.rodalShow} title={i18n.t(200087/*预览*/)} width={'80%'}>
                <div className="action-normal-buttons">
                  <FormWrapper showFooter={true} showSaveClose={false} onCancel={this.onCancel}>
                      <div className="html-page scroll" dangerouslySetInnerHTML={{__html: this.state.context}}></div>
                  </FormWrapper>
                </div>
              </Dialog>
        </div>
    }
}
