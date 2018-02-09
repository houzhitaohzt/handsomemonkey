import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import {I18n} from "../../../../../lib/i18n";
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, getUser} from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
export class ProviderDetail extends Component{
    constructor(props) {
        super(props);
        props.detail && props.detail(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        //地址列表 保存并关闭
        this.onAddressListSaveAndClose=this.onAddressListSaveAndClose.bind(this);
             //联系方式 保存并关闭
        this.onContactSaveAndClose=this.onContactSaveAndClose.bind(this);
        this.onAddressListInitData=this.onAddressListInitData.bind(this);
        this.onContactInitData=this.onContactInitData.bind(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.onAddressListInitData();
        this.onContactInitData();
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
            let that = this;
            let id = [],tempString = I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = I18n.t(100395/*已选中*/) + data.selectArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
             Confirm(tempString, {
                  done: () => {
                     if(data.id == "client-contact-addressList"){//地址列表
                        //id = "client-detail-addressList"  表示是地址列表 此处id和传过去的id一样
                         apiForm(API_FOODING_DS,'/address/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.onAddressListInitData();
                        },(error) => {

                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-contact-contact"){//联系方式
                        //id = "client-detail-contact" 表示是联系方式
                        apiForm(API_FOODING_DS,'/contact/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onContactInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }
                }
            });
        }else{
            let dialogTitle= data.action+data.name.title;
             this.setState({
                visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
            });
        }
    }
    //地址列表的数据拉取
    onAddressListInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/address/address/getList',{beId:this.state.id}, response => {
            that.setState({
                addressList:response.data||[]
            })
        }, error => console.log(error.message))
    }
    //联系方式 数据拉取
    onContactInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/contact/getList',{sourceId:this.state.id}, response => {
            that.setState({
                contactList:response.data||[]
            })
        }, error => console.log(error.message))
    }
     //地址列表 保存并关闭
    onAddressListSaveAndClose(value,data){
        /*let that = this;
        value = Object.assign({},{beId:this.state.id,dfutMrk:false},value);
        if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/address/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onAddressListInitData();
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});*/
        this.setState({visible:false},() => this.onAddressListInitData())
    }

    //联系方式 保存并关闭
    onContactSaveAndClose(value,data){
        let that = this;
        //cntryId:data.cntryId  国家ID 是否必要，要的话就要到customer
        value = Object.assign({},{beId:this.state.id,dataTyId:100},value);
        if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/contact/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onContactInitData()
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
      //联系方式，保存并新增
    onContactSaveAdd = (value,data) => {
       let that = this;
       value = Object.assign({},{beId:this.state.id,dataTyId:100},value);
        apiPost(API_FOODING_DS,'/contact/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onContactInitData()
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    onSaveAndClose(values){
        this.props.getDetailData();
        this.onContactInitData();
        this.setState({visible:false});
    }
    onCancel(){
        this.setState({visible:false});
    }
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            addressList:  [], //地址列表
            contactList:  [], //联系方式列表
            id:this.props.location.query.id,
            isLink:this.props.location.query.isLink
        }
    }
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
       if(!this.props.isDetail){
           this.onAddressListInitData();
           this.onContactInitData();
       }
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
    // 写邮件
    writeHandle = (toAddress) => {
        let login = getUser(); // 登录信息
        window.navTabs.open(i18n.t(700006/*写邮件*/), `/email/write`, Object.assign({}, {
            type: 'compose',
            collectionName: login['defaultEmail'],
            toAddress: toAddress
        }), {refresh: true});
    };
    render(){
        const commonForm = this.state.dilogTelmp;
         const {addressList,contactList} = this.state;
        const customer = this.props.customer;
        let value = this.props.value.entPrisContact || {};
        var that = this;
        return (
              <div>
                   <div className='scroll' style={{backgroundColor:'#f0f4f8',
                   height:this.state.scrollHeight,overflow:'auto'}}>
                       <div className = 'col'>
                        <div  style={{marginBottom:'10px'}}>
                            <Template1
                            menuList={[
                                {permissions:'clientcontact.edit',type:I18n.t(100439/*编辑*/),
                                child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
                            ]}
                            onCancel ={this.onCancel}
                            width={107}
                            DialogTempalte={require('./NormalDialog').default}
                            isShowMenu={true}
                            openDialog={this.handleClick}
                            info={this.state.isLink}
                            onSaveAndClose={this.onSaveAndClose}
                            AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/entContact/getOne'}
                            params={{id:this.state.id,sourceId:this.state.sourceId,dataTyId:100}}
                            id={'client-contact-Noraml'} title={i18n.t(100138/*常规*/)} tempArray={[
                                {key:I18n.t(100227/*职务*/),value:value.positn?value.positn.localName:''},
                                {key:I18n.t(100238/*部门*/),value:value.depmnt?value.depmnt.localName:''},
                                {key:I18n.t(300012/*国籍*/),value:value.country?value.country.localName:''},
                                {key:I18n.t(300013/*领导人*/),value:value.lbizPrn?value.lbizPrn.localName:''},
                                {key:I18n.t(100239/*性别*/),value:value.sex?value.sex.name:''},
                                {key:I18n.t(300011/*出生日期*/),value:value.birthDate?new Date(value.birthDate).Format('yyyy-MM-dd'):''},
                                {key:I18n.t(100372/*主联系人*/),value:value.dfutMark?I18n.t(100141/*是*/):I18n.t(100142/*否*/)},
                                {key:I18n.t(300010/*婚姻状况*/),value:value.maryType?value.maryType.name:''},
                                {key:I18n.t(100002/*描述*/),value:value.description?value.description:''},
                               {key:I18n.t(300015/*首选联系方式*/),value:value.contactType?value.contactType.name:""}
                            ]}/>
                    </div>
                      <MeasureCommon
                        menuList={[
                            {type:'add',permissions:'clientcontact.dtl.add'},
                            {type:'delete',permissions:'clientcontact.dtl.del'},
                            {type:'edit',permissions:'clientcontact.edit'}
                        ]}
                        onCancel ={this.onCancel} title ={I18n.t(100246/*地址列表*/)}
                        Zindex ={9}
                        openDialog={this.handleClick}
                        onSaveAndClose={this.onAddressListSaveAndClose}
                         DialogTempalte ={require('../../../../Client/Detail/Content/components/AddressPurposeDialog').default}
                         showHeader ={false}
                         checkedRowsArray={[]}
                         id={'client-contact-addressList'}
                         AjaxInit={true}
                         API_FOODING={API_FOODING_DS}
                         portname={'/address/getInit'}
                         params={{beId:this.state.id,dataTyId:100}}
                         otherData={{beId:this.state.id,dataTyId:100}}
                         columns ={
                            [{
                                title : I18n.t(100087/*国家*/),
                                dataIndex : 'country',
                                key : "country",
                                width : '14%',
                                render(data,row,index){
                                    if(data&&data.localName){
                                        return (<div title={data.localName}>{data.localName}</div>)
                                    }
                                    return;
                                }
                            },
                            {
                                title : I18n.t(100247/*省*/),
                                dataIndex : 'province',
                                key : "province",
                                width : '14%',
                                render(data,row,index){
                                    if(data&&data.localName){
                                        return (<div title={data.localName}>{data?data.localName:''}</div>)
                                    }
                                    return;
                                }
                            },
                            {
                                title : I18n.t(100248/*市*/),
                                dataIndex : 'city',
                                key : "city",
                                width : '14%',
                                render(data,row,index){
                                    if(data&&data.localName){
                                        return (<div title={data.localName}>{data?data.localName:''}</div>)
                                    }
                                    return;
                                }
                            },
                            {
                                title : I18n.t(100249/*区县*/),
                                dataIndex : 'district',
                                key : "district",
                                width : '14%',
                                render(data,row,index){
                                    if(data&&data.localName){
                                        return (<div title={data.localName}>{data?data.localName:''}</div>)
                                    }
                                    return;
                                }
                            },
                            {
                                title : I18n.t(100250/*详细地址*/),
                                dataIndex : 'localName',
                                key : "localName",
                                width : '24%',
                                render(data,row,index){
                                    return (<div title={data}>{data}</div>)
                                }
                            },
                            {
                                title : I18n.t(100251/*邮编*/),
                                dataIndex : "zip",
                                key : "zip",
                                width : "10%",
                                render(data,row,index){
                                    return data;
                                }
                            },{
                                title :I18n.t(100547/*地址类型*/),
                                dataIndex : 'bizFuncType',
                                key : "bizFuncType",
                                width : '14%',
                                render(data,row,index){
                                    return (<div title={data}>{data.name?data.name:''}</div>)
                                }
                            },{
                                title :I18n.t(100123/*默认*/),
                                dataIndex : "dfutMrk",
                                key : "dfutMrk",
                                width : "8%",
                                render(data,row,index){
                                    return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                }
                            }]
                        }
                        data={addressList}
                    />
                    <Template1
                            title={I18n.t(100194/*系统信息*/)} id ={'31'}  isShowIcon={false} DialogTempalte={require('./NormalDialog').default}
                            tempArray={[{key:I18n.t(100143/*创建人*/),value:value.createUserName?value.createUserName:''},
                            {key:I18n.t(100144/*修改人*/),value:value.updateUserName?value.updateUserName:''},
                            {key:I18n.t(100145/*创建时间*/),value:value.createDate?new Date(value.createDate).Format('yyyy-MM-dd hh:mm:ss'):''},{key:I18n.t(100146/*修改时间*/),value:value.updateDate?new Date(value.updateDate).Format('yyyy-MM-dd hh:mm:ss'):''}]}/>
                       </div>
                       <div className = 'col' style={{paddingLeft:0}}>
                          <MeasureCommon
                            menuList={[
                                {type:'add',permissions:'clientcontact.dtl.add'},
                                {type:'delete',permissions:'clientcontact.dtl.del'},
                                {type:'edit',permissions:'clientcontact.edit'}
                            ]}
                            onCancel ={this.onCancel} title ={I18n.t(100245/*联系方式*/)}
                        Zindex={7}
                        openDialog={this.handleClick}
                         DialogTempalte ={require('../../../../Client/Detail/Content/components/ContactDialog').default}
                         showHeader ={false}
                         checkedRowsArray={[]}
                         id={'client-contact-contact'}
                         onSaveAndClose={this.onContactSaveAndClose}
                         onSaveAdd={this.onContactSaveAdd}
                         AjaxInit={true}
                         API_FOODING={API_FOODING_DS}
                         portname={'/contact/getInit'}
                         params={{sourceId:this.state.id,dataTyId:100}}
                         columns ={
                                    [{
                                        title : "linkType",
                                        dataIndex : 'linkType',
                                        key : "linkType",
                                        width : '16%',
                                        render(data,row,index){
                                           let classN = '';
                                            let iconArray = [
                                                {classn:'foddingicon fooding-company_icon',type:'site',num:10},
                                                {classn:'foddingicon fooding-tel_icon2',type:'phone',num:20},
                                                {classn:'foddingicon fooding-fax-icon2',type:'fax',num:30},
                                                {classn:'foddingicon fooding-qq-icon2',type:'QQ',num:40},
                                                {classn:'foddingicon fooding-facebook',type:'site',num:50},
                                                {classn:'foddingicon fooding-weibo',type:'site',num:60},
                                                {classn:'foddingicon fooding-weite',type:'site',num:70},
                                                {classn:'foddingicon fooding-email_32',type:'email',num:80},
                                                {classn:'foddingicon fooding-nation_icon',type:'email',num:90},
                                                {classn:'foddingicon fooding-phone_icon2',type:'mobilephone',num:100},
                                                {classn:'foddingicon fooding-skype-icon2',type:'skype',num:110},
                                                {classn:'foddingicon fooding-whatsapp',type:'site',num:130},
                                                    {classn:'foddingicon fooding-weixin',type:'site',num:140}];

                                            for(let i = 0; i < iconArray.length; i++){
                                                if(iconArray[i].num == (data&&data.id?data.id:data)){
                                                    classN = iconArray[i].classn;
                                                    break;
                                                }
                                            }
                                            return (<i style={{fontSize:'16px'}} className={classN}></i>)
                                        }
                                    },
                                    {
                                        title : I18n.t(100245/*联系方式*/),
                                        dataIndex : 'name',
                                        key : "name",
                                        width:'70%',
                                        render(data,row,index){
                                            if(row.linkTyId == 80){

                                                return <a  onClick={that.writeHandle.bind(that,data,row)} className='link-color'>{data}</a>;
                                            }else{
                                                return (<div title={data} className={'text-ellipsis'}>{data}</div>);
                                            }
                                        }
                                    },{
                                        title : I18n.t(100464/*接受报价*/),
                                        dataIndex : "isOfferRec",
                                        key : "isOfferRec",
                                        width : "40%",
                                        render(data,row,index){
                                            return <i>{row['linkTyId'] == 80 ? (data ? (I18n.t(100464/*接受报价*/) + ':'+I18n.t(100141/*是*/)):(I18n.t(100464/*接受报价*/) + ':'+I18n.t(100142/*否*/))):''}</i>;
                                        }
                                    },{
                                        title : I18n.t(100123/*默认*/),
                                        dataIndex : "dfutMrk",
                                        key : "dfutMrk",
                                        width : "10%",
                                        render(data,row,index){
                                            return <i style = {{display: 'block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                        }
                                    }
                                   ]
                                }
                        data={contactList}
                    />
                       </div>
                   </div>
                    <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                        {commonForm}
                    </Dialog>
               </div>
            );
    }

}
export default ProviderDetail;
