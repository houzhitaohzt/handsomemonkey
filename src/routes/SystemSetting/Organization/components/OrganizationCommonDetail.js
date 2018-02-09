import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import SystemRuleTem from  '../../../../components/SystemRuleTem';
/*import MeasureCommon from  '../../../../components/RuleTemplate';*/
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import xt from '../../../../common/xt';
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips'; // 提示
import {apiPost, API_FOODING_DS, API_FOODING_ES, apiGet, apiForm} from '../../../../services/apiCall';
import {I18n} from "../../../../lib/i18n";

export class OrganizationCommonDetail extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
    }

    handleClick = (e, data, Template) => {
        if (data.number == 2) {
            let ids = data.selectArr.map(ar => ar.id);
            let msg = i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            Confirm(ids.length > 1 ? `已选中${ids.length}条数据，${msg}`: msg, {
                done: () => {
                    let uri = '', host = API_FOODING_ES;
                    if (data.id === 'client-detail-02' || data.id === 'client-detail-01') {
                        uri = '/address/delete';
                    } else if (data.id === 'client-detail-03') {
                        uri = '/contact/delete';
                    } else if (data.id === 'client-detail-10') {
                        uri = '/bankacct/delete';
                        host = API_FOODING_DS;
                    } else if (data.id === 'client-detail-04') {
                        uri = '/ipAddress/delete';
                    } else if(data.id === "servbe-detail-associated"){
                      uri = "/partner/delete"
                    }else if(data.id === "default-server-table"){
                        uri = "/defaultServBe/delete"
                    }else if(data.id === "provider-detail-tradrulepayterm"){
                        uri = "/tradrulePayterm/delete"
                    }else if(data.id === "provider-detail-bestatn"){
                        uri = "/beStatn/delete"
                    }

                    if (!uri) return;
                    if(data.id == "servbe-detail-associated"){
                      apiForm(API_FOODING_DS,uri,{
                        id:data.selectArr.map(ar => ar.id)
                      },response => {
                        successTips("删除成功!");
                        this.initAssociatData();
                      },error =>{
                        errorTips("删除失败!");
                      })
                    }else if(data.id == "default-server-table"){
                        apiForm(API_FOODING_DS,uri,{
                            id:data.selectArr.map(ar => ar.id)
                        },response => {
                            successTips("删除成功!");
                            this.initOrgServer();
                        },error =>{
                            errorTips("删除失败!");
                        })
                    }else if(data.id == "provider-detail-tradrulepayterm"){//支付条款
                        // id = "provider-detail-tradrulepayterm" 为支付条款
                        apiForm(API_FOODING_DS,'/tradrulePayterm/delete',{id:data.selectArr.map(ar => ar.id)},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            this.onTradrultPaytermInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "provider-detail-bestatn"){//交货港
                        apiForm(API_FOODING_DS,'/beStatn/delete',{id:data.selectArr.map(ar => ar.id)},(response)=>{
                            ServiceTips({text:response.message,type:'success'});
                            this.onBestatnListInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else{
                      apiForm(host, uri, {
                        id: ids
                      }, response => {
                          successTips("删除成功!");
                          this.props.onRefreshPanel && this.props.onRefreshPanel(this.props.partyId);
                      }, error => {
                          errorTips("删除失败!");
                      })
                    }


                }
            });
        } else {
            let dialogTitle = data.action + data.name.title;
            this.setState({
                visible: true,
                dialogTitle: dialogTitle,
                dilogTelmp: Template
            });
        }
    };

    onSaveAndClose(values) {
        this.setState({visible: false});
        this.props.onRefreshPanel && this.props.onRefreshPanel(this.props.partyId);
    }

    onCancel() {
        this.setState({visible: false});
    }

    //地址列表 保存并关闭
    onAddressListSaveAndClose = (value, data) => {
        this.setState({visible:false},() => this.props.onRefreshPanel && this.props.onRefreshPanel(this.props.partyId))
    };

    //初始化 关联企业数据
    initAssociatData = () => {
      let params=Object.assign({},{currentPage:1,pageSize:1000,dataTyId:60,column:'id',order:'desc',sourceId:this.props.data.party.id})
      apiGet(API_FOODING_DS,'/partner/getPage',params,(response)=>{
        this.setState({
          partnerList:response.data.data,
        })
      },(error)=>{
        ServiceTips({text:error.message,type:'error'});
      });
    };

    //关联企业 保存并关闭
    onAssociatedListSaveAndClose = (value, data) => {//关联企业的新增和编辑
        value = Object.assign({},value,{sourceId:this.props.data.party.id,dataTyId:60});
        //data为空对象，表示是新增,否则表示是编辑
        if(JSON.stringify(data) !== "{}"){
            value = Object.assign({},value,{id:data.id,optlock:data.optlock})
        }
        apiPost(API_FOODING_DS,'/partner/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            this.initAssociatData();
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    };

    //关联企业 保存并新增
     onAssociatedListSaveAdd = (value, data) => {//关联企业保存并新增
        let valueone = Object.assign({},{sourceId:this.props.data.party.id,dataTyId:60},value);
        apiPost(API_FOODING_DS,'/partner/save',valueone,(response) => {
            ServiceTips({text:response.message,type:'success'});
            this.initAssociatData();
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }

    //联系方式 保存并关闭
    onContactSaveAndClose = (value, data) => {
        let that = this;
        //cntryId:data.cntryId  国家ID 是否必要，要的话就要到customer
        value = Object.assign({}, {beId: this.props.data.party.id, dataTyId:60}, value);
        if (JSON.stringify(data) !== "{}") {//表明是编辑
            value = Object.assign({}, value, {id: data.id, optlock: data.optlock});
        }
        apiPost(API_FOODING_ES, '/contact/save', value, (response) => {
            successTips(response.message);
            this.props.onRefreshPanel && this.props.onRefreshPanel(this.props.partyId);
        }, (error) => {
            errorTips(error.message);
        });
        this.setState({visible: false});
    };

    //联系方式，保存并新增
    onContactSaveAdd = (value,data) => {
       value = Object.assign({},{beId:this.props.data.party.id,dataTyId:60},value);
        apiPost(API_FOODING_ES,'/contact/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            this.props.onRefreshPanel && this.props.onRefreshPanel(this.props.partyId);
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }

    //银行账号 保存并关闭
    onBankListSaveAndClose = (value, data) => {
        let that = this;
        value = Object.assign({}, {sourceId: this.props.data.party.id, dataTyId:60}, value);
        if (JSON.stringify(data) !== "{}") {//表明是编辑
            value = Object.assign({}, value, {id: data.id, optlock: data.optlock});
        }
        apiPost(API_FOODING_DS, '/bankacct/save', value, (response) => {
            successTips(response.message);
            this.props.onRefreshPanel && this.props.onRefreshPanel(this.props.partyId);
        }, (error) => {
            errorTips(error.message);
        });
        this.setState({visible: false});
    };

    //银行账号 保存并关闭
    onIPListSaveAndClose = (value, data) => {
        let that = this;
        value = Object.assign({}, {ccId: this.props.data.party.id, dataTyId:60}, value);
        if (JSON.stringify(data) !== "{}") {//表明是编辑
            value = Object.assign({}, value, {id: data.id, optlock: data.optlock});
        }
        apiPost(API_FOODING_ES, '/ipAddress/save', value, (response) => {
            successTips(response.message);
            this.props.onRefreshPanel && this.props.onRefreshPanel(this.props.partyId);
        }, (error) => {
            errorTips(error.message);
        });
        this.setState({visible: false});
    };

    //默认服务机构 初始化数据
    initOrgServer = () => {
        apiGet(API_FOODING_DS,'/defaultServBe/getList',{sourceId:this.props.data.party.id},(response)=>{
            this.setState({
                defaultServbeList:response.data || [],
            })
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        });
    };

    //默认服务机构
    onOrgServerSaveAndClose = () => {
        this.setState({visible:false},() => this.initOrgServer())
    };

    //默认新增地址 保存并新增
    onOrgServerSaveAdd = () => {
        this.initOrgServer();
    };

    //交货港 拉取数据
    onBestatnListInitData = () => {
        let that = this;
        apiGet(API_FOODING_DS,'/beStatn/getList',{sourceId:this.props.data.party.id}, response => {
            that.setState({
                beStatnList:response.data
            })
        }, error => console.log(error.message))
    }

    //交货港 保存并关闭
    onBestatnListSaveAndClose = (value,data) => {
        let that = this;
        value = Object.assign({},{sourceId:this.props.data.party.id,dataTyId:60},value);
        if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/beStatn/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onBestatnListInitData();
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //交货港 保存并新增
    onBestatnListSaveAdd = (value,data) => {
        let that = this;
        value = Object.assign({},{sourceId:this.props.data.party.id,dataTyId:60},value);
        apiPost(API_FOODING_DS,'/beStatn/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onBestatnListInitData();
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }

    //支付条款 保存并关闭
    onTradrulePaytermListSaveAndClose = (value,data) =>{
        let that = this;
        value = Object.assign({},{sourceId:this.props.data.party.id,dataTyId:60},value);
        if(JSON.stringify(data) !== "{}"){//表明是编辑
            value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        }
        apiPost(API_FOODING_DS,'/tradrulePayterm/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradrultPaytermInitData();
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    //支付条款 保存并新增
    onTradrulePaytermListSaveAdd = (value,data) => {
        let that = this;
        value = Object.assign({},{sourceId:this.props.data.party.id,dataTyId:60},value);
        //  if(JSON.stringify(data) !== "{}"){//表明是编辑
        //     value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        // }
        apiPost(API_FOODING_DS,'/tradrulePayterm/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.onTradrultPaytermInitData();
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    }
    //支付条款 数据拉取
    onTradrultPaytermInitData = () => {
        let that = this;
        apiGet(API_FOODING_DS,'/tradrulePayterm/getList', {sourceId:this.props.data.party.id}, response => {
            that.setState({
                tradrulePaytermList:response.data
            })
        }, error => console.log(error.message))
    }

    initState() {
        return {
            addressList: [],
            visible: false,
            dialogTitle: '',
            dilogTelmp: <div></div>,
            partnerList:[],
            defaultServbeList:[],
            beStatnList:[], //交货港
            tradrulePaytermList:[]

        }
    }

    componentDidMount(){
      this.initAssociatData();
      this.initOrgServer();
      this.onBestatnListInitData();
      this.onTradrultPaytermInitData();
    }

    render() {
        const commonForm = this.state.dilogTelmp;
        let {data} = this.props;
        return (
            <div>
                <div>
                    <div className='col'>
                        <Template1
                            menuList={[
                                {permissions:'party.edit',type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                            ]}
                            onCancel={this.onCancel}
                                   width={107}
                                   DialogTempalte={require('./OrganizationCommonDetailNormalDialog').default}
                                   isShowMenu={true}
                                   openDialog={this.handleClick}
                                   onSaveAndClose={this.onSaveAndClose}
                                   perfixCel={'template-system'}
                                   responseData={data}
                                   id={'product-detail-00'} title={i18n.t(100138/*常规*/)} tempArray={[
                            {key: i18n.t(100001/*名称*/), value: data.party.name ? data.party.name : ''},
                            {key: i18n.t(100226/*英文名称*/), value: data.party.enName ? data.party.enName : ''},
                            {key: i18n.t(100087/*国家*/), value: xt.getItemValue(data, 'party.country.localName', '')},
                            {key: i18n.t(100358/*税号*/), value: data.party.enterpriseTaxId?data.party.enterpriseTaxId:''},
                            {key: i18n.t(200783/*经营模式*/), value: xt.getItemValue(data, 'party.business.name', '')},
                            {key: i18n.t(100564/*注册资本*/), value: <b>{data.party.registeredCapital}{data.party.curren&&data.party.curren.localName}</b>},
                            {key: i18n.t(100561/*法人代表*/), value: data.party.leglpsn?data.party.leglpsn:''},
                            {key: i18n.t(200080/*类型*/), value: xt.getItemValue(data, 'party.partyType.name', '')},
                            {key: i18n.t(100281/*汇率类型*/), value: xt.getItemValue(data, 'party.exRateType.name', '')},
                            {key: i18n.t(201201/*默认仓库*/), value: xt.getItemValue(data, 'party.warehouse.localName', '')}
                        ]}/>
                        <SystemRuleTem onCancel={this.onCancel} title={i18n.t(100246/*地址列表*/)}
                                       Zindex={4}
                                       openDialog={this.handleClick}
                                       DialogTempalte={require('../../../Client/Detail/Content/components/AddressPurposeDialog').default}
                                       showHeader={false}
                                       checkedRowsArray={[]}
                                       onSaveAndClose={this.onAddressListSaveAndClose}
                                       id={'client-detail-01'}
                                       AjaxInit={true}
                                       API_FOODING={API_FOODING_ES}
                                       portname={'/address/getInit'}
                                       params={{beId: data.party.id,dataTyId:60}}
                                       otherData={{beId: data.party.id,dataTyId:60}}
                                       columns={
                                            [{
                                                title : i18n.t(100087/*国家*/),
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
                                                title : i18n.t(100247/*省*/),
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
                                                title : i18n.t(100248/*市*/),
                                                dataIndex : 'city',
                                                key : "city",
                                                width : '14%',
                                                render(data,row,index){
                                                    if(data&&data.localName){
                                                        return (<div title={data.localName}>{data.localName}</div>)
                                                    }
                                                    return;
                                                }
                                            },
                                            {
                                                title : i18n.t(100249/*区县*/),
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
                                                title : i18n.t(100250/*详细地址*/),
                                                dataIndex : 'name',
                                                key : "name",
                                                width : '24%',
                                                render(data,row,index){
                                                    return (<div title={data}>{data}</div>)
                                                }
                                            },
                                            {
                                                title : i18n.t(100251/*邮编*/),
                                                dataIndex : "zip",
                                                key : "zip",
                                                width : "10%",
                                                render(data,row,index){
                                                    return data;
                                                }
                                            },{
                                                title : i18n.t(100547/*地址类型*/),
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
                                                title : i18n.t(100123/*默认*/),
                                                dataIndex : "dfutMrk",
                                                key : "dfutMrk",
                                                width : "8%",
                                                render(data,row,index){
                                                    return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                                }
                                            }]
                                       }
                                       data={data.addressNoType ? data.addressNoType : []}
                        />
                         <SystemRuleTem onCancel ={this.onCancel} title ={i18n.t(100526/*关联企业*/)}
                                        Zindex={3}
                                         openDialog={this.handleClick}
                                         DialogTempalte ={require('./OrgAssocaitedDialog').default}
                                         showHeader ={true}
                                         checkedRowsArray={[]}
                                         id={'servbe-detail-associated'}
                                         onSaveAndClose={this.onAssociatedListSaveAndClose}
                                         onSaveAdd={this.onAssociatedListSaveAdd}
                                         AjaxInit={true}
                                         API_FOODING={API_FOODING_DS}
                                         portname={'/partner/getInit'}
                                         params={{dataTyId:60,sourceId:data.party.id}}
                                         columns ={
                                            [{
                                                title : i18n.t(100527/*合伙功能*/),
                                                dataIndex : 'prtnType',
                                                key : "prtnType",
                                                width : "40%",
                                                render(data,row,index){
                                                    return <div>{data}</div>
                                                }
                                             },{
                                                title : i18n.t(100528/*公司名称*/),
                                                dataIndex : 'name',
                                                key : "name",
                                                width : "40%",
                                                render(data,row,index){
                                                    return (<div title={data} className={'text-ellipsis'}>{data}</div>)
                                                }
                                            },{
                                                title : i18n.t(100123/*默认*/),
                                                dataIndex : "dfutMrk",
                                                key : "dfutMrk",
                                                width : "10%",
                                                render(data,row,index){
                                                    return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                                   // return data?i18n.t(100141/*是*/):i18n.t(100142/*否*/);
                                                }
                                            }
                                           ]
                                        }
                                            data={this.state.partnerList || []}
                                />
                        <SystemRuleTem onCancel ={this.onCancel} title ={ i18n.t(100123/*默认*/) + i18n.t(100313/*服务机构*/)}
                                       Zindex={2}
                                       openDialog={this.handleClick}
                                       DialogTempalte ={require('./OrgServerDialog').default}
                                       showHeader ={true}
                                       checkedRowsArray={[]}
                                       id={'default-server-table'}
                                       onSaveAndClose={this.onOrgServerSaveAndClose}
                                       onSaveAdd={this.onOrgServerSaveAdd}
                                       AjaxInit={true}
                                       API_FOODING={API_FOODING_DS}
                                       portname={'/defaultServBe/getOne'}
                                       params={{}}
                                       addNoInit={true}
                                       otherData={{sourceId:data.party.id}}
                                       columns ={
                                           [{
                                               title : I18n.t(100530/*行业细分*/),
                                               dataIndex : 'beDataMulDiv',
                                               key : "beDataMulDiv",
                                               width:'50%',
                                               render(data,row,index){
                                                   return data && data.name ? data.name : "";
                                               }
                                           },{
                                               title : I18n.t(400274/*机构名称*/),
                                               dataIndex : 'servBe',
                                               key : "servBe",
                                               width : "40%",
                                               render(data,row,index){
                                                   return data && data.localName ? data.localName : "";
                                               }
                                           }]
                                       }
                                       data={this.state.defaultServbeList || []}
                        />
                        <SystemRuleTem
                            // menuList={[
                            //     {type:'add',permissions:'provider.dtl.add'},
                            //     {type:'delete',permissions:'provider.dtl.del'},
                            //     {type:'edit',permissions:'provider.edit'}
                            // ]}
                            onCancel ={this.onCancel} title ={i18n.t(200969/*交货港*/)}
                            Zindex ={4}
                            openDialog={this.handleClick}
                            DialogTempalte ={
                                require('../../../Provider/Detail/Content/components/DeliveryDialog').default
                            }
                            showHeader ={false}
                            checkedRowsArray={[]}
                            id={'provider-detail-bestatn'}
                            onSaveAndClose={this.onBestatnListSaveAndClose}
                            onSaveAdd={this.onBestatnListSaveAdd}
                            AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/beStatn/getInit'}
                            params={{}}
                            columns ={
                                [{title : i18n.t(100156/*港口类型*/),
                                    dataIndex : 'statnType',
                                    width:'30%',
                                    key : "statnType",
                                    render(data,row,index){
                                        data = data !== null?data:"";
                                        if(typeof data == "object" && ('localName' in data)){
                                            return data.localName;
                                        }
                                        return (<div title={data}>{data}</div>)
                                    }
                                },
                                    {
                                        title : i18n.t(100155/*港口*/),
                                        dataIndex : 'statn',
                                        width:'30%',
                                        key : "statn",
                                        render(data,row,index){
                                            data = data !== null?data:"";
                                            if(typeof data == "object" && ('localName' in data)){
                                                return data.localName;
                                            }
                                            return (<div title={data}>{data}</div>)
                                        }
                                    },
                                    {
                                        title : i18n.t(200466/*加收费用*/),
                                        dataIndex : 'extCharge',
                                        width:'30%',
                                        key : "extCharge",
                                        render(data,row,index){
                                            return <div>{data}&nbsp;&nbsp;{row.curren}/{row.unitofmea}</div>
                                        }
                                    }]}
                            data={this.state.beStatnList || []}
                        />
                        <SystemRuleTem
                            // menuList={[
                            //     {type:'add',permissions:'provider.dtl.add'},
                            //     {type:'delete',permissions:'provider.dtl.del'},
                            //     {type:'edit',permissions:'provider.edit'}
                            // ]}
                            onCancel ={this.onCancel} title ={i18n.t(400273/*可接受支付条款*/)}
                            Zindex={2}
                            openDialog={this.handleClick}
                            DialogTempalte ={require('./TradrulePaytermListDialog').default}
                            showHeader ={false}
                            checkedRowsArray={[]}
                            id={'provider-detail-tradrulepayterm'}
                            onSaveAdd={this.onTradrulePaytermListSaveAdd}
                            onSaveAndClose={this.onTradrulePaytermListSaveAndClose}
                            AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/tradrulePayterm/getInit'}
                            params={{dataTyId:60,sourceId:this.state.id}}
                            columns ={
                                [{
                                    title : i18n.t(100133/*支付条款*/),
                                    dataIndex : 'payTrm',
                                    key : "payTrm",
                                    width:'80%',
                                    render(data,row,index){
                                        data = data !== null?data:"";
                                        if(typeof data == "object" && ('localName' in data)){
                                            return <div className={'text-ellipsis'}>{data.localName}</div>
                                        }
                                        return <div className={'text-ellipsis'}>{data}</div>
                                    }
                                },{
                                    title : i18n.t(100123/*默认*/),
                                    dataIndex : "dfutMrk",
                                    key : "dfutMrk",
                                    width : "10%",
                                    render(data,row,index){
                                        return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                    }
                                }
                                ]
                            }
                            data={this.state.tradrulePaytermList || []}
                        />
                    </div>
                    <div className='col' style={{paddingLeft: 0}}>
                        <SystemRuleTem onCancel={this.onCancel} title={i18n.t(100245/*联系方式*/)}
                                       Zindex={4}
                                       openDialog={this.handleClick}
                                       DialogTempalte={require('../../../Client/Detail/Content/components/ContactDialog').default}
                                       showHeader={false}
                                       checkedRowsArray={[]}
                                       id={'client-detail-03'}
                                       onSaveAndClose={this.onContactSaveAndClose}
                                       onSaveAdd={this.onContactSaveAdd}
                                       AjaxInit={true}
                                       API_FOODING={API_FOODING_ES}
                                       portname={'/contact/getInit'}
                                       params={{sourceId: data.party.id, dataTyId:60}}
                                       columns={
                                           [{
                                               title: "linkType",
                                               dataIndex: 'linkType',
                                               key: "linkType",
                                               width: '16%',
                                               render(data, row, index){
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
                                                   title: i18n.t(100245/*联系方式*/),
                                                   dataIndex: 'name',
                                                   key: "name",
                                                   width: '70%',
                                                   render(data, row, index){
                                                       if (data) {
                                                           return (<div title={data}>{data}</div>)
                                                       }
                                                       return;
                                                   }
                                               }, {
                                               title: i18n.t(100123/*默认*/),
                                               dataIndex: "dfutMrk",
                                               key: "dfutMrk",
                                               width: "10%",
                                               render(data, row, index){
                                                   return <i style={{display: 'block', textAlign: 'center'}}
                                                             className={data ? 'foddingicon fooding-dui-icon2' : ''}></i>;
                                               }
                                           }
                                           ]
                                       }
                                       data={data.contactList ? data.contactList : []}
                        />
                        <SystemRuleTem onCancel={this.onCancel} title={i18n.t(201202/*银行账户*/)}
                                       Zindex={'auto'}
                                       openDialog={this.handleClick}
                                       DialogTempalte={require('../../../Client/Detail/Content/components/BankTemplateDialog').default}
                                       showHeader={false}
                                       checkedRowsArray={[]}
                                       id={'client-detail-10'}
                                       onSaveAndClose={this.onBankListSaveAndClose}
                                       AjaxInit={true}
                                       API_FOODING={API_FOODING_DS}
                                       portname={'/bankacct/getInit'}
                                       params={{dataTyId:60, sourceId: data.party.id}}
                                       columns ={
                                    [{
                                        title : I18n.t(100501/*账户名称*/),
                                        dataIndex : 'name',
                                        key : "name",
                                        width : '18%',
                                        render(data,row,index){
                                            return <div className={'text-ellipsis'} title={data}>{data}</div>
                                        }
                                    },
                                    {
                                        title : I18n.t(100500/*银行账号*/),
                                        dataIndex : 'bacctCode',
                                        key : "bacctCode",
                                        width : '20%',
                                        render(data,row,index){
                                            return <div className={'text-ellipsis'} title={data}>{data}</div>
                                        }
                                    },{
                                        title : I18n.t(100507/*开户行*/),
                                        dataIndex : 'bankName',
                                        key : "bankName",
                                        width : '35%',
                                        render(data,row,index){
                                            return <div className={'text-ellipsis'} title={data}>{data}</div>
                                        }
                                    },{
                                        title : I18n.t(100504/*收款人*/),
                                        dataIndex : 'actStaff',
                                        key : "actStaff",
                                        width : '10%',
                                        render(data,row,index){
                                            return <div className={'text-ellipsis'} title={data}>{data}</div>
                                        }
                                    },
                                    {
                                        title : I18n.t(100284/*币种*/),
                                        dataIndex : 'curren',
                                        key : "curren",
                                        width:'10%',
                                        render(data,row,index){
                                            data = data !== null?data:"";
                                            if(typeof data == "object" && ('localName' in data)){
                                                    return data.localName;
                                                }
                                            return (<div title={data}>{data}</div>)
                                        }
                                    },{
                                        title : I18n.t(100123/*默认*/),
                                        dataIndex : "dfutMrk",
                                        key : "dfutMrk",
                                        width : "12%",
                                        render(data,row,index){
                                            return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                        }
                                    }
                                   ]
                            }
                                       data={data.bankAcctList || []}
                        />
                        <SystemRuleTem onCancel={this.onCancel} title={i18n.t(201203/*允许访问IP列表*/)}
                                       Zindex={'auto'}
                                       openDialog={this.handleClick}
                                       DialogTempalte={require('./IPEditDialog').default}
                                       showHeader={false}
                                       onSaveAndClose={this.onIPListSaveAndClose}
                                       checkedRowsArray={[]}
                                       id={'client-detail-04'}
                                       AjaxInit={false}
                                       params={{dataTyId:60, sourceId: data.party.id}}
                                       columns={
                                           [{
                                               title: "localName",
                                               dataIndex: 'localName',
                                               key: "localName",
                                               render(data, row, index){
                                                   return <div>{data}</div>
                                               }
                                           },
                                           {
                                               title: i18n.t(201200/*黑名单*/),
                                               dataIndex: 'blackMark',
                                               key: "blackMark",
                                               render(data, row, index){
                                                   return <i style={{display: 'block', textAlign: 'center'}}
                                                             className={data ? 'foddingicon fooding-dui-icon2' : ''}></i>;
                                               }
                                           }]
                                       }
                                       data={data.ipAddressList || []}
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
export default OrganizationCommonDetail;

