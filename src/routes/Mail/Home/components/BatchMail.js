import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';
import Page from '../../../../components/Page';//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from '../../../../components/Table';//Table表格
import {getQueryString, apiGet, apiPost, apiForm,API_FOODING_MassMailServer, API_FOODING_MAIL,API_FOODING_MAIL_SERVER,API_FOODING_DS, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {FormWrapper} from '../../../../components/Form';
import {themeAbb,availHeight,commonRow,commonAjax,NavBtnFunc} from "./Common.js"; // 公共库
import Nav from "./Nav.js"; // nav 导航
import MailDetail from "./MailDetail.js"; // 页面详情
import Tooltip from "../../../../components/Tip";
import {timeFormat} from "./Common.js"; // 公共库
import Card from "./Card.js"; // 卡片


export default class PageNow extends Component {

    constructor(props) {
        super(props);
        let that = this;
        let {loginMessageNow} = this.props;


        // init state
        this.state = {
            searchData: {}, // 搜索数据
            currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			color: '',	// 颜色过滤
			followMark: false, // 过滤收藏
            record: [], // table data
            keyvalue:true,
            scroll: availHeight-100,    // table 高度
            rodalShow:false,
            rowData: {}, // 行数据
            title:i18n.t(200087/*预览*/),
            context:<div></div>
        }

        // table list
		this.columns = [
        {
			title : i18n.t(200540/*收件人*/),
			dataIndex : 'mailDelivery.recipient',
			key : "mailDelivery.recipient",
			width : '9%',
			render(data,row,index){
                var row = Object.assign({},row,{sendAddress:data.split(';')[0],collectName:loginMessageNow['email'],sendMail:data.split(';')[0],sendName:data.split(';')[0]});
                return <Card email={data} id={`noohleMmail${loginMessageNow['id']}`} row={row} router={that.props.router}/>;
				// return (<div className="text-ellipsis">{data}</div>);
			}
		},
        {
			title : i18n.t(100304/*主题*/),
			dataIndex : 'mailDelivery.subject',
			key : "mailDelivery.subject",
			width : '55%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{themeAbb(data)}</div>);
			}
		},{
			title : i18n.t(700074/*状态*/),
			dataIndex : "status",
			key : "status",
			width : "7%",
      tooltip:false,
      ignore_equals: true,
			render(data,row,index){
        if(data == 'unSent'){
          return i18n.t(600040/*未发送*/);
        }else if(data == 'sentOk'){
          return i18n.t(700075/*发送成功！*/);
        }else if(data == 'sentFail'){
          return <Tooltip
            placement="bottomLeft"
            mouseEnterDelay={0.5}
            arrowPointAtCenter={true}
            mouseLeaveDelay={0.2}
            prefixCls="spctext-toolip"
           trigger="hover"
           overlay={<span>{row.wsStatusMsg}</span>}
                  arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
              ><span>{i18n.t(700073/*发送失败*/)}</span></Tooltip>;
        }else if(data == 'isRead'){
          return i18n.t(600043/*已查看*/);
        }
			}
		},{
			title : i18n.t(700076/*日期*/),
			dataIndex : "sendTime",
			key : "sendTime",
			width : "10%",
			render(data,row,index){
				return data?timeFormat(data):timeFormat(row.createTime);
			}
		}];
    this.replySend = this.replySend.bind(this); //重新发送
    this.previewHandle = this.previewHandle.bind(this);//预览
    this.onCancel = this.onCancel.bind(this);
    this.jiansuo = this.jiansuo.bind(this);
  }
  jiansuo(row){
      let that = this;
      let array = [];
      let mailId=[];
      row.map((e)=>{
          array.push(e.id);
          mailId.push(e.mailId)
      });
    //   apiGet(API_FOODING_MAIL_SERVER,'/mass/getState',{ids:array.join(',')},(response)=>{
    //       if(response.data && response.data.length>0){
    //           if(mailId.indexOf(response.data[0])>-1){
    //               that.getPage();
    //           }
    //       }
    //   },(error)=>{

    //   },{isLoading:false});
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
            apiGet(API_FOODING_MassMailServer,'/mass/getPage',Object.assign({email:loginMessageNow['email'],
                pageSize:pageSize,currentPage:currentPage},that.state.searchData,data),
                (response)=>{
                    if(response.data.data && response.data.data.length > 0){
                       that.jiansuo(response.data.data);
                    }
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

    previewHandle(){
      let selectArr = this.refs.product.getSelectArr();
      apiGet(API_FOODING_MassMailServer,'/mass/view',{id:selectArr[0].id},(response)=>{
        this.setState({rodalShow:true,context:response.data});
      },(error)=>{
        ServiceTips({text:error.message,type:'error'})
      });
    }
    // 写群邮件
    batchMailHandle = ()=>{
        window.navTabs.open(i18n.t(700103/*写群邮件*/),`/email/masswrite`,{},{refresh: true});
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
                keyvalue={this.state.keyvalue}
                resendClick={this.replySend.bind(this)} // 重新发送
                batchMailHandle={()=>this.refs.product.getSelectArr()} // 写群邮件
                forwardMailMassHandle={()=>this.refs.product.getSelectArr()} // 群发邮件 转发


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
                        onClick:this.replySend,
                        condition: [{key: 'status', value: ['unSent'], exp: '==='}],
                        content:<div>{i18n.t(200538/*重新发送*/)}</div>,
                    },
                    {
                            onClick:this.batchMailHandle,
                            content:<div>{i18n.t(700103/*写群邮件*/)}</div>,
                    }
                 ]
                }}
            />
            </div>
            	<Dialog visible={this.state.rodalShow} title={this.state.title} width={'80%'}>
                <div className="action-normal-buttons">
                  <FormWrapper showFooter={true} showSaveClose={false} onCancel={this.onCancel}>
                      <div className="html-page scroll" dangerouslySetInnerHTML={{__html: this.state.context}}></div>
                  </FormWrapper>
                </div>
              </Dialog>
        </div>
    }
}
