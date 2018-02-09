import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
import {I18n} from "../../../../../lib/i18n";
export class ProviderDetail extends Component{
	constructor(props) {
        super(props);
        props.detail && props.detail(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.onAddressListInitData=this.onAddressListInitData.bind(this);
         this.onContactInitData=this.onContactInitData.bind(this);
        this.onAddressListSaveAndClose=this.onAddressListSaveAndClose.bind(this);
        this.onContactSaveAndClose=this.onContactSaveAndClose.bind(this);
        this.state = {
            paddingTop:false,
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id, //列表頁传过来的id
            addressNoType:[],  //地址用途
            contactList:[] //联系方式
        }
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.onContactInitData();
        this.onAddressListInitData();
    }
    handleClick = (e, data, Template) => {
         let that = this;
        if(data.number ==2){            
            let id = [];
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(data.name&&data.name.title == i18n.t(100246/*地址列表*/)){
                Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/),{
                    done: () => {
                        apiForm(API_FOODING_ES,'/address/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onAddressListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    },
                    close: () => {
                        console.log('no ')
                    }
                });
            }else if(data.name&&data.name.title == i18n.t(100245/*联系方式*/)){
                Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/),{
                    done: () => {
                        apiForm(API_FOODING_ES,'/contact/delete',{id:id},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            that.onContactInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    },
                    close: () => {
                        console.log('no ')
                    }
                });
            }
        }else if(data.number == 3){
            //没有看到失效，所以让失效先不走，留给后续再做
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
    //地址列表的数据拉取
    onAddressListInitData(){
        let that = this;
        apiGet(API_FOODING_ES,'/address/address/getList',{beId:this.state.id}, response => {
            that.setState({
                addressNoType:response.data
            })
        }, error => console.log(error.message))
    }
    //联系方式 数据拉取
    onContactInitData(){
        let that = this;
        apiGet(API_FOODING_ES,'/contact/getContactByBeId',{beId:this.state.id}, response => {
            that.setState({
                contactList:response.data
            })
        }, error => console.log(error.message))
    }
    onSaveAndClose(value,data){
        if(data.title == "staffer-detail-normal"){//表示编辑职员常规
            //表示编辑职员常规
            apiPost(API_FOODING_ES,'/staff/save',value, response => {
                ServiceTips({text:i18n.t(200979/*编辑成功*/),type:'success'})
                this.props.getDetailData();
            }, error => {
                ServiceTips({text:i18n.t(200980/*编辑失败*/),type:'error'})
            })
        }else if(data.title == "orginzation"){//职员组织
            value = Object.assign({},data,{ccId:value.ccId,clusId:value.clusId,id:this.state.id});
            apiForm(API_FOODING_ES,'/staff/updateStaffParty',value,(response) => {
                ServiceTips({text:response.message,type:'success'});
                this.props.getDetailData();
            },(error) => {
                ServiceTips({text:error.message,type:'error'});
            })
        }
        this.setState({visible:false});
    }
    //地址列表 保存并关闭
    onAddressListSaveAndClose(value,data){//地址列表都新增和编辑
        let that = this;
        value = Object.assign({},{beId:this.state.id,dfutMrk:false,dataTyId:160},value);
        if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_ES,'/address/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'}); 
            that.onAddressListInitData()       
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});

    }
    //联系方式 保存并关闭
    onContactSaveAndClose(value,data){//联系方式的新增和编辑
        let that = this;    
        value = Object.assign({},{beId:this.state.id,dataTyId:160},value);
        if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_ES,'/contact/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onContactInitData();   
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //联系方式，保存并新增
    onContactSaveAdd = (value,data) => {
       let that = this;
       value = Object.assign({},{beId:this.state.id,dataTyId:160},value);
        apiPost(API_FOODING_ES,'/contact/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});  
            that.onContactInitData()   
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
        if(!this.props.isDetail){
            this.onContactInitData();
            this.onAddressListInitData();
        }
        window.addEventListener('resize', this.handleResize(20));
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
	render(){
		const commonForm = this.state.dilogTelmp;
        const {addressNoType,contactList} = this.state;
        let staff = this.props.staff;
        let data=this.props.data;
		return (
			  <div>
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',
	               height:this.state.scrollHeight}}>
		               <div className = 'col'>
		               		<Template1 
                            upload ={ this.props.getDetailData}
                            menuList={[
                                {permissions:'staff.edit',type:I18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
                            ]}                               
                            onCancel ={this.onCancel}
		               		width={107}
                            DialogTempalte={require('./NormalDialog').default}
		               		isShowMenu={true}
		               		openDialog={this.handleClick}
                             AjaxInit={true}
                             API_FOODING={API_FOODING_ES}
		               		onSaveAndClose={this.onSaveAndClose}
                            portname={'/staff/getOneById'}
                            params={{id:this.state.id}}
		                    id={'staffer-detail-normal'} title={I18n.t(100138/*常规*/)} tempArray={[
		                    	{key:I18n.t(100231/*姓名*/),value:staff?staff.name:''},
		                    	{key:I18n.t(100237/*职员类型*/),value:staff.stfType?staff.stfType.name:''},
		                    	{key:I18n.t(100239/*性别*/),value:staff.sex?staff.sex.name:''},
                                {key:I18n.t(100241/*身份证号*/),value:staff?staff.idcardSN:''},
                                {key:I18n.t(100240/*学历*/),value:staff.eduDegr?staff.eduDegr.localName:''},
                                {key:I18n.t(500413/*入职日期*/),value:staff.entryDate? new Date(staff["entryDate"]).Format("yyyy-MM-dd"):''},
                                {key:I18n.t(500414/*入职时工龄*/),value:staff.entryWorkAge?staff.entryWorkAge:''},
                                {key:I18n.t(100242/*兴趣爱好*/),value:staff?staff.hobbys:''},


		                    ]}/>
                             <Template1 
                                menuList={[
                                    {permissions:'staff.edit',type:I18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
                                ]}                                
                                title={I18n.t(100140/*组织*/)} id ={'33'}  DialogTempalte={require('./NormalDialog').default}
                                isShowMenu={true} 
                                openDialog={this.handleClick}
                                onSaveAndClose={this.onSaveAndClose}
                                onCancel = {this.onCancel}
                                allData={{key:'staff'}}
                                AjaxInit={true}
                                API_FOODING={API_FOODING_ES}
                                portname={'/staff/getStaffParty'}
                                params={{id:this.state.id}}
                            tempArray={[{key:I18n.t(100243/*集团*/),value:staff.cluster.localName},{key:I18n.t(100244/*企业*/),value:staff.company.localName}]}/>
                           <Template1 onCancel ={this.onCancel}  
                                    title={I18n.t(100194/*系统信息*/)} 
                                    id={'5'}  
                                    allData={{key:'serbBe'}}
                                AjaxInit={true}
                                API_FOODING={API_FOODING_ES}
                                portname={'/staff/getSystemInfo'}
                                params={{id:this.state.id}}
                                isShowIcon={false}
                           tempArray={[
                                {key:I18n.t(100143/*创建人*/),value:staff.createName},
                                {key:I18n.t(100144/*修改人*/),value:staff.updateName},
                                {key:I18n.t(100145/*创建时间*/),value:new Date(staff.createDate).Format('yyyy-MM-dd hh:mm:ss')},
                                {key:I18n.t(100146/*修改时间*/),value:new Date(staff.updateDate).Format('yyyy-MM-dd hh:mm:ss')}
                            ]}
                    />
		               </div>
		               <div className = 'col' style={{paddingLeft:0}}>
                           <MeasureCommon 
                                menuList={[
                                    {type:'add',permissions:'staff.dtl.add'},
                                    {type:'delete',permissions:'staff.dtl.del'},
                                    {type:'edit',permissions:'staff.edit'}                                        
                                ]}                           
                                onCancel ={this.onCancel} title ={i18n.t(100245/*联系方式*/)}
                                Zindex={9}
                                openDialog={this.handleClick}
                                 DialogTempalte ={require('../../../../Client/Detail/Content/components/ContactDialog').default}
                                 showHeader ={false}
                                 checkedRowsArray={[]}
                                 onSaveAndClose={this.onContactSaveAndClose}
                                 onSaveAdd={this.onContactSaveAdd}
                                 id={'servble-detail-03'}
                                 AjaxInit={true}
                                 API_FOODING={API_FOODING_ES}
                                 portname={'/contact/getInit'}
                                 params={{sourceId:this.state.id,dataTyId:160}}
                                 columns ={
                                    [{
                                        title : I18n.t(100245/*联系方式*/),
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
                                                },{
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
                                data={contactList}
                            />
		                    <MeasureCommon 
                                 menuList={[
                                    {type:'add',permissions:'staff.dtl.add'},
                                    {type:'delete',permissions:'staff.dtl.del'},
                                    {type:'edit',permissions:'staff.edit'}                                        
                                ]}                            
                                onCancel ={this.onCancel} title ={i18n.t(100246/*地址列表*/)} 
                                Zindex ={8}
                                openDialog={this.handleClick}
                                         DialogTempalte ={require('../../../../Client/Detail/Content/components/AddressListDialog').default}
                                         showHeader ={false}
                                         onSaveAndClose={this.onAddressListSaveAndClose}
                                         checkedRowsArray={[]}
                                         id={'client-detail-addressList'}
                                         AjaxInit={true}
                                         API_FOODING={API_FOODING_ES}
                                         portname={'/address/getInit'}
                                         params={{beId:this.state.id,dataTyId:160}}
                                         otherData={{beId:this.state.id,dataTyId:160}}
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
                            },{
                                title :  I18n.t(100247/*省*/),
                                dataIndex : 'province',
                                key : "province",
                                width : '14%',
                                render(data,row,index){
                                    if(data&&data.localName){
                                        return (<div title={data.localName}>{data.localName}</div>)
                                    }
                                    return;
                                }
                            },{
                                title :  I18n.t(100248/*市*/),
                                dataIndex : 'city',
                                key : "city",
                                width : '14%',
                                render(data,row,index){
                                    if(data&&data.localName){
                                        return (<div title={data.localName}>{data.localName}</div>)
                                    }
                                    return;
                                }
                            },{
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
                            },{
                                title : I18n.t(100250/*详细地址*/),
                                dataIndex : 'name',
                                key : "name",
                                width : '24%',
                                render(data,row,index){
                                    return (<div title={data}>{data}</div>)
                                }
                            },{
                                title : I18n.t(100251/*邮编*/),
                                dataIndex : "zip",
                                key : "zip",
                                width : "10%",
                                render(data,row,index){
                                    return data;
                                }
                            }]
                        }
                        data={addressNoType}
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
