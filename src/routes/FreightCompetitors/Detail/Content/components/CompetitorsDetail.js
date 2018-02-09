import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';

import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';

import {I18n} from '../../../../../lib/i18n';

export class CompetitorsDetail extends Component{
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
        //地址用途
        //this.onAddressUserSaveAndClose=this.onAddressUserSaveAndClose.bind(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.onAddressListInitData();
        this.onContactInitData();
    }
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id,

            addressList: [], //地址列表
            contactList: [], //联系方式列表
            functnList:[], //功能地址列表
        }
    }
    handleClick = (e, data, Template) => {
        let that = this;
        if(data.number ==2){
            let id = [],tempString = I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = I18n.t(100395/*已选中*/) + data.selectArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
             Confirm(tempString, {
                  done: () => {
                    if(data.id == "competitors-detail-addressList"){//地址列表
                        //id = "provider-detail-addressList"  表示是地址列表 此处id和传过去的id一样
                         apiForm(API_FOODING_DS,'/address/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.onAddressListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "competitors-detail-contact"){//联系方式
                        //id = "provider-detail-contact" 表示是联系方式
                        apiForm(API_FOODING_DS,'/contact/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onContactInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "competitors-detail-addressUser"){//功能地址
                        //id = "provider-detail-tradruleCertfct" 表示功能地址
                        apiForm(API_FOODING_DS,'/address/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            //that.onAddressUserInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }
                }
            });
        }else if(data.number == 3){
            //没有看到失效，所有失效先不做，留给后续再做
            return false;
        }else{
            let dialogTitle= data.action+data.name.title;
             this.setState({
                visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
            });
        }
    }
    onSaveAndClose(value,data){
        //表示编辑竞争对手常规
        value = Object.assign({},value,{id:this.state.id,optlock:data.optlock});
        apiPost(API_FOODING_DS,'/rival/save',value, response => {
            ServiceTips({text:response.message,type:'success'})
            this.props.getDetailData();
        }, error => {
            ServiceTips({text:error.message,type:'error'})
        })
        this.setState({visible:false});
    }
    onCancel(){
        this.setState({visible:false});
    }
         //地址列表 保存并关闭
    onAddressListSaveAndClose(value,data){
        /*let that = this;
        value = Object.assign({},{beId:this.state.id,dfutMrk:false,dataTyId:200},value);
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
     //地址用途 保存并关闭
    // onAddressUserSaveAndClose(){
    //     this.setState({visible:false});
    //     this.onAddressUserInitData();//更新数据
    // }
    //联系方式 保存并关闭
    onContactSaveAndClose(value,data){
        let that = this;
        //cntryId:data.cntryId  国家ID 是否必要，要的话就要到customer
        value = Object.assign({},{beId:this.state.id,dataTyId:200},value);
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
       value = Object.assign({},{beId:this.state.id,dataTyId:200},value);
        apiPost(API_FOODING_DS,'/contact/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});  
            that.onContactInitData()     
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
     //地址列表的数据拉取
    onAddressListInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/address/address/getList',{beId:this.state.id}, response => {
            that.setState({
                addressList:response.data
            })
        }, error => console.log(error.message))
    }
    //联系方式 数据拉取
    onContactInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/contact/getList',{sourceId:this.state.id}, response => {
            that.setState({
                contactList:response.data
            })
        }, error => console.log(error.message))
    }
    //地址用途 拉取数据
    // onAddressUserInitData(){
    //     let that = this;
    //     apiGet(API_FOODING_DS,'/address/funct/getList',{beId:this.state.id}, response => {
    //         that.setState({
    //             functnList:response.data
    //         })
    //     }, error => console.log(error.message))
    // }

    componentDidMount(){
        if(!this.props.isDetail){
            this.getPage();
        }
        //this.onAddressUserInitData();
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let padding = 225;
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
    render(){
        const commonForm = this.state.dilogTelmp;   
         const {addressList,contactList,functnList} = this.state;
         let {competitor = {}} = this.props;
        return (
              <div> 
                   <div className='scroll' style={{backgroundColor:'#f0f4f8',
                   height:this.state.scrollHeight,overflow:'auto'}}>             
                       <div className = 'col'>
                            <Template1 
                                menuList={[
                                    {permissions:'competitors.edit',type:I18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
                                ]}                            
                                onCancel ={this.onCancel} 
                            width={107}
                            DialogTempalte={require('./NormalDialog').default}
                            isShowMenu={true} 
                            openDialog={this.handleClick}
                            onSaveAndClose={this.onSaveAndClose}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/rival/getInit'}
                             params={{id:this.state.id}} 
                            id={'competitor-detail-normal'} title={I18n.t(100138/*常规*/)} tempArray={[
                                {key:I18n.t(100345/*纳税人识别号*/),value:competitor.taxIdenSN || ""},
                                {key:I18n.t(100561/*法人代表*/),value:competitor.leglpsn || ""},
                                //{key:I18n.t(100358/*税号*/),value:competitor.registCode ||""},
                                {key:I18n.t(100346/*优势*/),value:competitor.strength || ""},
                                {key:I18n.t(100347/*劣势*/),value:competitor.weakness ||""},
                                {key:I18n.t(100348/*威胁*/),value:competitor.threat ||""},
                                {key:I18n.t(100002/*描述*/),value:competitor.description ||""}
                            ]}/>
                            <Template1 title={I18n.t(100194/*系统信息*/)} id ={'31'} isShowIcon={false}  DialogTempalte={require('./NormalDialog').default}
                            tempArray={[{key:I18n.t(100194/*系统信息*/),value:competitor.createUserName},{key:I18n.t(100144/*修改人*/),value:competitor.updateUserName},
                            {key:I18n.t(100145/*创建时间*/),value:new Date(competitor.createDate ).Format('yyyy-MM-dd hh:mm:ss')},{key:I18n.t(100146/*修改时间*/),value:new Date(competitor.updateDate ).Format('yyyy-MM-dd hh:mm:ss')}]}/>
                       </div>
                       <div className = 'col' style={{paddingLeft:0}}>
                            <MeasureCommon 
                                menuList={[
                                    {type:'add',permissions:'competitors.dtl.add'},
                                    {type:'delete',permissions:'competitors.dtl.del'},
                                    {type:'edit',permissions:'competitors.edit'}                           
                                ]}                                 
                                onCancel ={this.onCancel} title ={I18n.t(100481/*地址*/)}
                                Zindex ={9}
                                openDialog={this.handleClick}
                                onSaveAndClose={this.onAddressListSaveAndClose}
                                 DialogTempalte ={require('../../../../Client/Detail/Content/components/AddressPurposeDialog').default}
                                 showHeader ={false}
                                 checkedRowsArray={[]}
                                 id={'competitors-detail-addressList'}
                                 AjaxInit={true}
                                 API_FOODING={API_FOODING_DS}
                                 portname={'/address/getInit'}
                                 params={{beId:this.state.id,dataTyId:200}}
                                 otherData={{beId:this.state.id,dataTyId:200}}
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
                                        title : I18n.t(100535/*省/州*/),
                                        dataIndex : 'province',
                                        key : "province",
                                        width : '14%',
                                        render(data,row,index){
                                            if(data&&data.localName){
                                                return (<div title={data.localName}>{data.localName}</div>)
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
                                            if(data&&data.name){
                                                return (<div title={data.localName}>{data.localName}</div>)
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
                                                return (<div title={data.localName}>{data.localName}</div>)
                                            }
                                            return;
                                        }
                                    },
                                    {
                                        title :I18n.t(100250/*详细地址*/),
                                        dataIndex : 'name',
                                        key : "name",
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
                                        title : I18n.t(100547/*地址类型*/),
                                        dataIndex : 'bizFuncType',
                                        key : "bizFuncType",
                                        width : '14%',
                                        render(data,row,index){
                                            data = data !== null?data:"";
                                            if(typeof data == "object" && ('name' in data)){
                                                    return data.name;
                                                }
                                            return (<div title={data}>{data}</div>)
                                        }
                                    },{
                                        title : I18n.t(100123/*默认*/),
                                        dataIndex : "dfutMrk",
                                        key : "dfutMrk",
                                        width : "8%",
                                        render(data,row,index){
                                            return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                        }
                                    }]
                                }
                                data={addressList || []}
                            />
                            <MeasureCommon 
                                menuList={[
                                    {type:'add',permissions:'competitors.dtl.add'},
                                    {type:'delete',permissions:'competitors.dtl.del'},
                                    {type:'edit',permissions:'competitors.edit'}                                        
                                ]}                             
                                onCancel ={this.onCancel} title ={I18n.t(100245/*联系方式*/)}
                                Zindex={7}
                                openDialog={this.handleClick}
                                 DialogTempalte ={require('../../../../Client/Detail/Content/components/ContactDialog').default}
                                 showHeader ={false}
                                 checkedRowsArray={[]}
                                 id={'competitors-detail-contact'}
                                 onSaveAndClose={this.onContactSaveAndClose}
                                 onSaveAdd={this.onContactSaveAdd}
                                 AjaxInit={true}
                                 API_FOODING={API_FOODING_DS}
                                 portname={'/contact/getInit'}
                                 params={{sourceId:this.state.id,dataTyId:200}}
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
                                                    if(data){
                                                        return (<div title={data}>{data}</div>)
                                                    } 
                                                    return ;                                           
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
                                data={contactList || []}
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
export default CompetitorsDetail;


