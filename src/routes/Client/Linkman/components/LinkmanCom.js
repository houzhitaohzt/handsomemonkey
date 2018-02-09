import i18n from '../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page"
//引入按钮键
import  Confirm from  '../../../../components/button/confirm'
import  DeleteDialog from '../../../../components/Dialog/Confirm'
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
import ContactDialog from './LinkmanDialog'
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList,getQueryString,getUser} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export class Clentlist extends Component{
    constructor(props){
        super(props);
        props.linkman && props.linkman(this);
        this.addClick = this.addClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        var that = this;
        this.columns = [{
            title : i18n.t(100231/*姓名*/),
            dataIndex : 'localName',
            key : "localName",
            width : '15%',
            render(data,row,index){
                return (<div title={data}>{data}</div>)
            }
        },{
            title : i18n.t(100238/*部门*/),
            dataIndex : "depmnt",
            key : "depmnt",
            width : "11%",
            render(data,row,index){
                return <div>{data?data.localName:''}</div>
            }
        },{
            title : i18n.t(100227/*职务*/),
            dataIndex : "positn",
            key : "positn",
            width : "9%",
            render(data,row,index){
                return <div>{data?data.localName:''}</div>
            }
        },{
            title : i18n.t(200644/*电子邮箱*/),
            dataIndex : "defaultEmail",
            key : "defaultEmail",
            width : "23%",
            render(data,row,index){
                return (<a  onClick={that.writeHandle.bind(that,data,row)} className='link-color'>{data? data.localName:''}</a>);
            }
        },{
            title : i18n.t(300009/*手机*/),
            dataIndex : 'defaultMobile',
            key : "defaultMobile",
            width : "16%",
            render(data,row ,index){
                return <div>{data? data.localName:''}</div>;
            }
        },{
            title : i18n.t(100478/*电话*/),
            dataIndex : "defaultPhone",
            key : "defaultPhone",
            width : "13%",
            render(data,row,index){
                return (<div>{data? data.localName:''}</div>);
            }
        },{
            title : i18n.t(100479/*传真*/),
            dataIndex : "defaultFax",
            key : "defaultFax",
            width : "23%",
            render(data,row,index){
                return (<div>{data? data.localName:''}</div>);
            }
        },{
            title : i18n.t(100372/*主联系人*/),
            dataIndex : 'dfutMark',
            key : "dfutMark",
            width : "12%",
            render(data,row,index){
                return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                //return data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)
            }
        }];
        this.state = {
            rodalShow:false ,
            title:'',
            scroll:0,
            paddingTop:0,
            selectArr:[],
            checkedRows:[],
            contentTemplate:<div></div>,
            currentPage:1,
            data : [],
            info:{},
            id:getQueryString("id"),
            dataTyId:this.props.dataTyId

        }

    }
    addClick(e){
        var that = this;
        let {pageIdent} = this.props;
        let country=this.props.commoncustomer || {};
        this.setState({
            rodalShow : true,
            title:i18n.t(200482/*新增联系人*/),
            title_1:'',
            contentTemplate:<ContactDialog pageIdent={pageIdent} data ={{record:{country},type:2}}
                                           onSaveAndClose={that.onSaveAndClose}  dataTyId={this.state.dataTyId} id={this.state.id}
                                           onCancel = {this.onCancel}/>
        })
    }
    deleteClick(e){
        var that = this;
        let array = this.refs.linkman.getSelectArr();
        if(array.length==0){
            ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
        }else{
            DeleteDialog(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    let id=[];
                    array.map((e)=>{id.push(e.id)});
                    apiForm(API_FOODING_DS,'/entContact/delete',{id:id},(response)=>{
                        ServiceTips({text:response.message,type:'sucess'});
                        that.getPage();
                    },(error)=>{
                        ServiceTips({text:error.message,type:'error'});
                    })
                }
            });
        }

    }
    // 写邮件
    writeHandle = (toAddress) => {
        let login = getUser(); // 登录信息
        window.navTabs.open(i18n.t(700006/*写邮件*/), `/email/write`, Object.assign({}, {
            type: 'compose',
            collectionName: login['defaultEmail'],
            toAddress: toAddress.name
        }), {refresh: true});
    };
    onSaveAndClose(value,data){
        var that = this;
        this.onCancel();
        this.getPage();
        this.props.getDetailData()
    }
    onCancel(that){
        this.setState({
            rodalShow:false
        });
    }
    handleClick(e,data,target){
        var that = this;
        let tit= data.title;
        if(data.type == 7){
            this.deleteClick();
        }else if(data.type ==8){
            this.addClick();
        }
        else if(data.type ==2){
            let str ='/entContact/getOne';
            let {pageIdent} = this.props;
            apiGet(API_FOODING_DS,str,{id:data.record.id,sourceId:getQueryString("id")},(response)=>{
                that.setState({
                    rodalShow:true,
                    title:tit,
                    title_1:'',
                    contentTemplate:<ContactDialog pageIdent={pageIdent} data ={{record:response.data,type:5}}  id={this.state.id}
                                                   onSaveAndClose={that.onSaveAndClose} info = {response.data} dataTyId={this.state.dataTyId}
                                                   onCancel = {this.onCancel}/>
                })
            },(error)=>{

            })
        }
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
        let scroll = sch-135;

        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    getPage(sID,objValue){
        let that = this;
        var sID = sID || '';
        if(objValue){
            this.setState({
                obj:objValue
            },function() {
                // body...
                let object=Object.assign({},{isPlatform:true,beId:getQueryString("id"),dataTyId:this.props.dataTyId,
                    pageSize: this.state.pageSize, currentPage: this.state.currentPage, mtltyId: sID },this.state.obj);
                apiGet(API_FOODING_DS,'/entContact/getPage',object,
                    (response)=>{
                        that.setState({
                            data: response.data.data,
                            totalPages: response.data.totalPages,
                            currentPage: response.data.currentPage
                        });
                    },(errors)=>{
                    });
            })
        }else {
            let object=Object.assign({},{isPlatform:true,beId:getQueryString("id"),dataTyId:this.props.dataTyId,
                pageSize: this.state.pageSize, currentPage: this.state.currentPage, mtltyId: sID },this.state.obj);
            apiGet(API_FOODING_DS,'/entContact/getPage',object,
                (response)=>{
                    that.setState({
                        data: response.data.data,
                        totalPages: response.data.totalPages,
                        currentPage: response.data.currentPage
                    });
                },(errors)=>{
                });
        }

    }
    componentDidMount(){
        this.handleResize(0);
        // this.getPage();
        window.addEventListener('resize', this.handleResize(0));
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
    onRowDoubleClick(record,index,checked){
        let {navAddTab} =this.props;
        if(this.state.dataTyId == 100){
            navAddTab({id:'clientcontact-detail',name:i18n.t(300008/*客户联系人详情*/),component:i18n.t(300008/*客户联系人详情*/),url:'/clientcontact/detail'});
            this.props.router.push({pathname:'/clientcontact/detail',query:{id:record.id,sourceId:getQueryString("id"),isLink:true}});
        }else if (this.state.dataTyId == 120 ) {
            navAddTab({id:'providercontact-detail',name:i18n.t(300021/*供应商联系人详情*/),component:i18n.t(300021/*供应商联系人详情*/),url:'/providercontact/detail'});
            this.props.router.push({pathname:'/providercontact/detail',query:{id:record.id,sourceId:getQueryString("id"),isLink:true}});
        }else if (this.state.dataTyId == 130) {
            navAddTab({id:'providercontact-detail',name:i18n.t(300020/*货代联系人详情*/),component:i18n.t(300020/*货代联系人详情*/),url:'/forwardercontact/detail'});
            this.props.router.push({pathname:'/forwardercontact/detail',query:{id:record.id,sourceId:getQueryString("id"),isLink:true}});
        }else if (this.state.dataTyId == 140) {
            navAddTab({id:'providercontact-detail',name:i18n.t(300022/*服务机构联系人详情*/),component:i18n.t(300022/*服务机构联系人详情*/),url:'/servcon/detail'});
            this.props.router.push({pathname:'/servcon/detail',query:{id:record.id,sourceId:getQueryString("id"),isLink:true}});
        }
    }
    render(){
        var that = this;
        let {pageIdent} = this.props;
        var  iconArray = [{type:'add',onClick:this.addClick,permissions:'clien.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'clien.dtl.del'}];
        var	menuItems = [{
            permissions:'clien.edit',
            onClick:this.handleClick,
            content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
            data:{title:i18n.t(300006/*编辑联系人*/),type:2}
        },{
            permissions:'clien.dtl.del',
            onClick:this.handleClick,
            content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
            data:{title:i18n.t(200089/*删除联系人*/),type:7}
        }
        ];
        // 权限按钮
        switch(pageIdent){
            case 'client' :  // 客户
                var  iconArray = [{type:'add',onClick:this.addClick,permissions:'clien.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'clien.dtl.del'}];
                var	menuItems = [{
                    permissions:'clien.edit',
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
                    data:{title:i18n.t(300006/*编辑联系人*/),type:2}
                },{
                    permissions:'clien.dtl.del',
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
                    data:{title:i18n.t(200089/*删除联系人*/),type:7}
                }
                ];
                break;
            case 'provider' :  // 供应商
                var  iconArray = [{type:'add',onClick:this.addClick,permissions:'provider.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'provider.dtl.del'}];
                var	menuItems = [{
                    permissions:'provider.semail',
                    onClick:this.handleClick,
                    content:<div><i className="foddingicon fooding-send-email"></i>{i18n.t(200256/*发邮件*/)}</div>,
                    data:{title:i18n.t(200645/*选择收件人邮箱*/),type:1}
                },{
                    permissions:'provider.edit',
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
                    data:{title:i18n.t(300006/*编辑联系人*/),type:2}
                },{
                    permissions:'provider.dtl.del',
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
                    data:{title:i18n.t(200089/*删除联系人*/),type:7}
                },{
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-zdbj-icon3'}></i>{i18n.t(100398/*自动报价*/)}</div>,
                    data:{title:i18n.t(100398/*自动报价*/),type:3}
                },{
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-send'}></i>{i18n.t(200427/*发送*/)}</div>,
                    isSubMenu:true,
                    children:[{
                        onClick:this.handleClick,
                        content:<div>{i18n.t(100324/*订单*/)}</div>,
                        data:{title:i18n.t(200646/*发送订单*/),type:4}
                    },{
                        onClick:this.handleClick,
                        content:<div>{i18n.t(100583/*报价单*/)}</div>,
                        data:{title:i18n.t(200424/*发送报价单*/),type:6}
                    }]
                },{
                    permissions:'provider.dtl.Invalid',
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{i18n.t(100441/*失效*/)}</div>,
                    data:{title:i18n.t(100441/*失效*/),type:5}
                }
                ];
                break;
            case 'forwarder' :  // 货代公司
                var  iconArray = [{type:'add',onClick:this.addClick,permissions:'forwarder.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'forwarder.dtl.del'}];
                var	menuItems = [{
                    permissions:'forwarder.semail',
                    onClick:this.handleClick,
                    content:<div><i className="foddingicon fooding-send-email"></i>{i18n.t(200256/*发邮件*/)}</div>,
                    data:{title:i18n.t(200645/*选择收件人邮箱*/),type:1}
                },{
                    permissions:'forwarder.edit',
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
                    data:{title:i18n.t(300006/*编辑联系人*/),type:2}
                },{
                    permissions:'forwarder.dtl.del',
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
                    data:{title:i18n.t(200089/*删除联系人*/),type:7}
                },{
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-zdbj-icon3'}></i>{i18n.t(100398/*自动报价*/)}</div>,
                    data:{title:i18n.t(100398/*自动报价*/),type:3}
                },{
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-send'}></i>{i18n.t(200427/*发送*/)}</div>,
                    isSubMenu:true,
                    children:[{
                        onClick:this.handleClick,
                        content:<div>{i18n.t(100324/*订单*/)}</div>,
                        data:{title:i18n.t(200646/*发送订单*/),type:4}
                    },{
                        onClick:this.handleClick,
                        content:<div>{i18n.t(100583/*报价单*/)}</div>,
                        data:{title:i18n.t(200424/*发送报价单*/),type:6}
                    }]
                },{
                    permissions:'forwarder.dtl.Invalid',
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{i18n.t(100441/*失效*/)}</div>,
                    data:{title:i18n.t(100441/*失效*/),type:5}
                }
                ];
                break;
            case 'server' :  // 服务机构
                var  iconArray = [{type:'add',onClick:this.addClick,permissions:'servbe.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'servbe.dtl.del'}];
                var	menuItems = [{
                    permissions:'servbe.semail',
                    onClick:this.handleClick,
                    content:<div><i className="foddingicon fooding-send-email"></i>{i18n.t(200256/*发邮件*/)}</div>,
                    data:{title:i18n.t(200645/*选择收件人邮箱*/),type:1}
                },{
                    permissions:'servbe.edit',
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
                    data:{title:i18n.t(300006/*编辑联系人*/),type:2}
                },{
                    permissions:'servbe.dtl.del',
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
                    data:{title:i18n.t(200089/*删除联系人*/),type:7}
                },{
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-zdbj-icon3'}></i>{i18n.t(100398/*自动报价*/)}</div>,
                    data:{title:i18n.t(100398/*自动报价*/),type:3}
                },{
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-send'}></i>{i18n.t(200427/*发送*/)}</div>,
                    isSubMenu:true,
                    children:[{
                        onClick:this.handleClick,
                        content:<div>{i18n.t(100324/*订单*/)}</div>,
                        data:{title:i18n.t(200646/*发送订单*/),type:4}
                    },{
                        onClick:this.handleClick,
                        content:<div>{i18n.t(100583/*报价单*/)}</div>,
                        data:{title:i18n.t(200424/*发送报价单*/),type:6}
                    }]
                },{
                    permissions:'servbe.dtl.Invalid',
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{i18n.t(100441/*失效*/)}</div>,
                    data:{title:i18n.t(100441/*失效*/),type:5}
                }
                ];
                break;
            default:
                var  iconArray = [{type:'add',onClick:this.addClick},{type:'delete',onClick:this.deleteClick}];
                var	menuItems = [{
                    onClick:this.handleClick,
                    content:<div><i className="foddingicon fooding-send-email"></i>{i18n.t(200256/*发邮件*/)}</div>,
                    data:{title:i18n.t(200645/*选择收件人邮箱*/),type:1}
                },{
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
                    data:{title:i18n.t(300006/*编辑联系人*/),type:2}
                },{
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
                    data:{title:i18n.t(200089/*删除联系人*/),type:7}
                },{
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-zdbj-icon3'}></i>{i18n.t(100398/*自动报价*/)}</div>,
                    data:{title:i18n.t(100398/*自动报价*/),type:3}
                },{
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-send'}></i>{i18n.t(200427/*发送*/)}</div>,
                    isSubMenu:true,
                    children:[{
                        onClick:this.handleClick,
                        content:<div>{i18n.t(100324/*订单*/)}</div>,
                        data:{title:i18n.t(200646/*发送订单*/),type:4}
                    },{
                        onClick:this.handleClick,
                        content:<div>{i18n.t(100583/*报价单*/)}</div>,
                        data:{title:i18n.t(200424/*发送报价单*/),type:6}
                    }]
                },{
                    onClick:this.handleClick,
                    content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{i18n.t(100441/*失效*/)}</div>,
                    data:{title:i18n.t(100441/*失效*/),type:5}
                }
                ];
        }


        let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
        // console.log(this.state.scroll);
        return (
            <div className="contact-fluid">
                <div className='content-margin'></div>
                <div className="contact-body" style = {{height:this.state.scrollHeight}}>
                    <Confirm iconArray ={iconArray}/>
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
                    <div className="action-normal-buttons">
                        <Table  ref = "linkman"
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
                                    menuItems:menuItems,
                                }}
                        />
                        <Dialog visible={this.state.rodalShow} title={title} width={926}>
                            {this.state.contentTemplate}
                        </Dialog>
                    </div>
                </div>

            </div>
        )
    }
}

export default NavConnect(Clentlist);
