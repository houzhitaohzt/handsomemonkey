import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page"
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
import {FormWrapper} from '../../../../components/Form';
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {timeFormat} from "../../../Mail/Home/components/Common.js"; // 公共库
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_MassMailServer,API_FOODING_DS,API_FOODING_MAIL_SERVER,language,pageSize,sizeList,getQueryString,getUser} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import Tooltip from "../../../../components/Tip";
export class Clentlist extends Component{
    constructor(props){
        super(props);
        props.massEmail && props.massEmail(this);
        this.state = {
            rodalShow:false ,
            title:'',
            scroll:0,
            paddingTop:0,
            data : [],
            dataTyId:getQueryString("dataTyId"),
            currentPage:0,
            pageSize:pageSize,
            cp:1,
            billId:null,
            billType:null,
            context:''
        };
        this.getPages = this.getPages.bind(this);
        this.columns = [
            {
                title : i18n.t(200540/*收件人*/),
                dataIndex : 'mailDelivery.recipient',
                key : "mailDelivery.recipient",
                width : '9%',
                render(data,row,index){
                    return (<div className="text-ellipsis">{data}</div>);
                }
            },
            {
                title : i18n.t(100304/*主题*/),
                dataIndex : 'mailDelivery.subject',
                key : "mailDelivery.subject",
                width : '55%',
                render(data,row,index){
                    return (<div className="text-ellipsis">{data}</div>);
                }
            },{
                title : i18n.t(100230/*状态*/),
                dataIndex : "status",
                key : "status",
                width : "7%",
                tooltip:false,
                ignore_equals: true,
                render(data,row,index){
                    if(data == 'unSent'){
                        return i18n.t(600040/*未发送*/);
                    }else if(data == 'sentOk'){
                        return i18n.t(500265/*发送成功*/);
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
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.jiansuo = this.jiansuo.bind(this);
        this.previewHandle = this.previewHandle.bind(this);
    }
    previewHandle(){
        let selectArr = this.refs.product.getSelectArr();
        apiGet(API_FOODING_MassMailServer,'/mass/view',{id:selectArr[0].id},(response)=>{
            this.setState({rodalShow:true,context:response.data});
        },(error)=>{
            ServiceTips({text:error.message,type:'error'})
        });
    }
    jiansuo(row){
        let that = this;
        let array = [];
        let mailId=[];
        row.map((e)=>{
            array.push(e.id);
            mailId.push(e.mailId)
        });
        // apiGet(API_FOODING_MAIL_SERVER,'/mass/getState',{ids:array.join(',')},(response)=>{
        //     if(response.data && response.data.length>0){
        //         if(mailId.indexOf(response.data[0])>-1){
        //             that.getPage();
        //         }
        //     }
        // },(error)=>{

        // },{isLoading:false});
    }
    onSaveAndClose(value,data){
        var that = this;
        value = Object.assign({},value,{beId:getQueryString("id")});
        apiPost(API_FOODING_DS,'/entContact/save',value,(response)=>{
            ServiceTips({text:response.message,type:'sucess'});
            that.getPage();
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({
            rodalShow:false
        });
    }
    onCancel(that){
        this.setState({
            rodalShow:false
        });
    }
    handleResize(height){
        let sch=document.body.offsetHeight-226;
        let scroll = sch-135;

        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    getPages(){
        if(this.props.value && this.props.value.emailList.length>0){
            this.getPage(this.props.value);
        }else if(this.props.value&&this.props.value.billId){
            this.getPage(this.props.value)
        }
    }
    getPage(value){
        let that = this;
        let object ={};
        if(value){
            if(value.emailList){
                this.setState({
                    array:value.emailList
                })
            }
        }

        object=Object.assign({},{currentPage:this.state.currentPage,
        pageSize:this.state.pageSize,
        addressList:this.state.array && this.state.array.join(',')||value.emailList.join(',')});
        apiGet(API_FOODING_MassMailServer,'/mass/getPage',object,
            (response)=>{
                if(response.data.data && response.data.data.length > 0){
                    that.jiansuo(response.data.data);
                }
                that.setState({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage
                });
            },(errors)=>{
            });
    }
    componentDidMount(){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        let that = this;
        // if((this.props.value != nextProps.value)&&nextProps.value&&nextProps.value.emailList&&nextProps.value.emailList.length>0){
        //     this.getPage(nextProps.value);
        // }else if((this.props.value != nextProps.value)&&nextProps.value&&nextProps.value.billId){
        //     this.getPage(nextProps.value)
        // }
        window.addEventListener('resize', this.handleResize(0));
    }
    onRowDoubleClick(record,index,checked){
        // this.setState({
        // 	rodalShow:true,
        // 	title:i18n.t(200541/*邮件详细*/),
        // 	contentTemplate:<EmailDetaiDialog onCancel={this.onCancel}
        // 	  router ={this.props.router}
        // 	  record ={record}
        // 	/>
        // });
        // let row = record;
        // let active = '';
        // window.navTabs.open(`邮件详情(${row['subject']}){${row['id']}}`,`/mail/detail/${row['id']}`,{active:active,mailId:row['id'],collectionName:row['collectName'],isOwn:(getUser().staff.contacts.filter((o)=>o['localName']==row['collectName']).length ? true : false)},{refresh: true});
    }
    render(){
        var that = this;
        let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
        return (
            <div className="contact-fluid">
                <div className='content-margin'></div>
                <div className="contact-body" style = {{height:this.state.scrollHeight}}>
                    <Page
                        currentPage={this.state.currentPage}
                        totalPages={this.state.totalPages}
                        sizeList={[1,10]}
                        currentSize={this.state.pageSize}
                        pageSizeChange={(num)=>{
                            that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
                        }}
                        backClick={(num)=>{
                            that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                        }}
                        nextClick={(num)=>{
                            that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                        }}
                        goChange={(num)=>{
                            that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                        }}
                    />
                    <div className="action-normal-buttons">
                        <Table  ref = "product"
                                columns={this.columns}
                                scroll={{x:true,y:this.state.scroll}}
                                data={this.state.data}
                                checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                                colorFilterConfig={{show : false}}
                                followConfig={{show:false}}
                                style={{width:'100%'}}
                                onRowDoubleClick = {this.onRowDoubleClick}
                                contextMenuConfig={{
                                    enable:true,
                                    contextMenuId:'SIMPLE_TABLE_MENU',
                                    menuItems:[
                                        {
                                            onClick:this.previewHandle,
                                            content:<div><i className={'foddingicon fooding-eye-mail'}></i>{i18n.t(200087/*预览*/)}</div>
                                        }
                                    ]
                                }}
                        />
                        <Dialog visible={this.state.rodalShow} title={this.state.title} width={'80%'}>
                            <div className="action-normal-buttons">
                                <FormWrapper showFooter={true} showSaveClose={false} onCancel={this.onCancel}>
                                    <div className="html-page scroll" dangerouslySetInnerHTML={{__html: this.state.context}}></div>
                                </FormWrapper>
                            </div>
                        </Dialog>
                    </div>
                </div>

            </div>
        )
    }
}

export default NavConnect(Clentlist);
