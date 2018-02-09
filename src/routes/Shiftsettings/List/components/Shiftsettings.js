import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import {
    apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, pageSize, sizeList,
    API_FOODING_ERP,API_FOODING_HR
} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import ServiceTips from "../../../../components/ServiceTips";//提示框
import {I18n} from "../../../../lib/i18n";
class Forwarderlist extends Component{
    constructor(props){
        super(props)
        this.handleResize = this.handleResize.bind(this);
        this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
        this.handleClick=this.handleClick.bind(this);
        this.addClick=this.addClick.bind(this);
        this.deleteClick=this.deleteClick.bind(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        var that = this;
        this.getPage =this.getPage.bind(this);
        this.editClick=this.editClick.bind(this);
        this.copyClick = this.copyClick.bind(this);
        this.columns = [{
            title : i18n.t(500395/*排班编号*/),
            dataIndex : 'code',
            key : "code",
            width : '20%',
            render(data,row,index){
                return (<div  title={data}>{data?data:''}</div>)
            }
        },{
            title : i18n.t(500396/*排班名称*/),
            dataIndex : "name",
            key : "name",
            width : "60%",
            render(data,row,index){
                return <div>{data}</div>;
            }
        },{
            title :i18n.t(100002/*描述*/),
            dataIndex : "remark",
            key : "remark",
            width : "20%",
            render(data,row,index){
                return <div>{data?data:''}</div>
            }
        },{
            title :i18n.t(100230/*状态*/),
            dataIndex : "irowSts",
            key : "irowSts",
            width : "20%",
            render(data,row,index){
                return <div>{data?data.name:''}</div>
            }
        }];
        this.state = {
            scrollHeight:0,
            filter:null,
            selectArr:[],
            checkedRows:[],
            choised:false,
            MeunState:true,
            rodalShow:false,
            showSaveAdd:false,
            showSaveClose:true,
            buttonLeft:I18n.t(100429/*保存并关闭*/),
            contentTemplate:<div></div>,
            checkedData:'',
            data : [],
            pageSize:pageSize,
            currentPage:1
        }

    }
    addClick(){
        let {navAddTab} =this.props;
        navAddTab({id:13,name:i18n.t(500403/*排班设置新增*/),component:i18n.t(500403/*排班设置新增*/),url:'/shiftsettings/add'});
        this.props.router.push('/shiftsettings/add');
    }
    editClick(record){
        let {navAddTab} =this.props;
        navAddTab({id:13,name:i18n.t(500402/*排班设置编辑*/),component:i18n.t(500402/*排班设置编辑*/),url:'/shiftsettings/add'});
        this.props.router.push({pathname:'/shiftsettings/add',query:{id:record.record.id}});
    }
    deleteClick(data){
        let numArr = this.refs.frexrat.getSelectArr();
        let value=[];
        var that = this;
        if(numArr.length > 0){
            for (var i = 0; i < numArr.length; i++) {
                value.push(numArr[i].id);
            }
            if(numArr[0].rowSts==5){
                Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                    done: () => {
                        apiForm(API_FOODING_HR,'/scheduleSet/delete',{id:value},(response)=>{
                            that.getPage();
                            ServiceTips({text:response.message,type:'success'});

                        },(errors)=>{
                            ServiceTips({text:errors.message,type:'error'});
                        });
                    },
                    close:() => {
                    }
                });
            }else{
                ServiceTips({text:'此状态不能删除',type:'error'});
            }

        }else{
            ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
        }

    }
    copyClick(data){
        let that = this;
        let {getOne} = this.props;
        Confirm("您确定执行订单复制？", {
            done: () => {
                apiGet(API_FOODING_ERP,"/saleorder/copy",{billId:this.props.id},response => {
                    let {navAddTab, navRemoveTab,navReplaceTab} = this.props;
                    navAddTab({id:7,name:i18n.t(201054/*销售订单新增*/),component:i18n.t(201054/*销售订单新增*/),url:'/salesorder/addEidt'});
                    this.props.router.push({pathname:'/salesorder/addEidt',query:{id:response.data}});
                    ServiceTips({text:response.message,type:"success"})
                },error => {
                    ServiceTips({text:error.message,type:'error'})
                })
            },
            close:() => {
                console.log('no, close')
            }
        });
    }
    onSaveAndClose(value,data,isAdd){
        var that = this;
        value=Object.assign({},data,value);
        apiPost(API_FOODING_DS,'/payTrm/save',value,(response)=>{
            that.setState({
                rodalShow:!!isAdd
            })
            ServiceTips({text:response.message,type:'success'});
            this.getPage();
        },(errors)=>{
            ServiceTips({text:errors.message,type:'error'});
            that.setState({
                rodalShow:!!isAdd
            })
        })
    }
    onCancel(that){
        this.setState({
            rodalShow:false
        })
    }
    onRowDoubleClick(record,index,checked){
       let {navAddTab} =this.props;
        navAddTab({id:6,name:i18n.t(500404/*排班设置详情*/),component:i18n.t(500404/*排班设置详情*/),url:'/shiftsettings/detail'});
        this.props.router.push({pathname:'/shiftsettings/detail',query:{id:record.id}});
    }
    handleClick(e,data){
        //右键处理
        if(data.type == 1){
            this.deleteClick(data);
        }else if(data.type ==2){
            this.editClick(data);
        }else if(data.type ==3){//失效
            Confirm(I18n.t(100435/*是否对该条数据失效？*/), {
                done: () => {
                    //表示是失效
                    apiForm(API_FOODING_HR,'/scheduleSet/modifyScheduleSetState',{id:data.record.id,state:false},(response)=>{
                        ServiceTips({text:response.message,type:'sucess'})
                        this.getPage();
                    },(error)=>{
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                }
            });
        }else if(data.type ==4){//激活
            Confirm(I18n.t(100436/*是否对该条数据激活？*/), {
                done: () => {
                    //表示是激活
                    apiForm(API_FOODING_HR,'/scheduleSet/modifyScheduleSetState',{id:data.record.id,state:true},(response)=>{
                        ServiceTips({text:response.message,type:'sucess'})
                        this.getPage();
                    },(error)=>{
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                }
            });
        }
    }
    //请求列表  list
    getPage(currentPage,objValue){
        let that = this;
        var sID = sID || '';
        let currentP =!isNaN(currentPage)?currentPage:1;
        let object=Object.assign({},{isPlatform:true, pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
        apiGet(API_FOODING_HR,'/scheduleSet/getPage',object,
            (response)=>{
                that.setState({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    totalRecords:response.data.totalRecords,
                    currentPage: response.data.currentPage
                });
            },(errors)=>{
            });
    }
    handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }
    componentDidMount(){
        var that = this;
        this.getPage();
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    render(){
        let {page,currentPage} =this.state;
        return(<div>
            <FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage} info={this.state.info} expandFilter= {this.handleResize}/>
            <div className={'client-body'} style={{height:this.state.scrollHeight}}>
                <div className={'client-body-single'}>
                    <div className="action-buttons">
                        <div className={'key-page'}>
                            <FunctionKeys addClick={this.addClick}  deleteClick={this.deleteClick} copyClick={this.copyClick} />
                            <Page
                                currentPage={this.state.currentPage}
                                totalPages={this.state.totalPages}
                                totalRecords={this.state.totalRecords}
                                sizeList={sizeList}
                                currentSize={this.state.pageSize}
                                pageSizeChange={(num)=>{
                                    this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(currentPage, num));
                                }}
                                backClick={(num)=>{
                                    this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
                                }}
                                nextClick={(num)=>{
                                    this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
                                }}
                                goChange={(num)=>{
                                    this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
                                }}
                            />
                        </div>
                        <Table
                            ref ="frexrat"
                            columns={this.columns}
                            data={this.state.data}
                            checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                            colorFilterConfig={{show : false,dataIndex:'colorType'}}
                            followConfig={{show:false}}
                            singleSelect={true}
                            scroll={{x:true,y:this.state.scroll}}
                            onHeaderCellClick={this.onHeaderCellClick}
                            onRowClick={this.onRowClick}
                            onRowDoubleClick={this.onRowDoubleClick}
                            contextMenuConfig={{
                                enable:true,
                                contextMenuId:'SIMPLE_TABLE_MENU',
                                menuItems:[{
                                    onClick:this.handleClick,
                                    permissions:'shiftsettings.del',
                                    condition: [{key: 'rowSts', value: [5], exp: '==='}],
                                    content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
                                    data:{type:1,title:I18n.t(100437/*删除*/)}
                                },{
                                    onClick:this.handleClick,
                                    permissions:'shiftsettings.edit',
                                    content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{I18n.t(100439/*编辑*/)}</div>,
                                    data:{type:2,title:I18n.t(100439/*编辑*/)}
                                },{

                                    onClick:this.handleClick,
                                    permissions:'shiftsettings.invalid',
                                    condition: [{key: 'rowSts', value: [10], exp: '==='}],
                                    content:<div><i className={'foddingicon fooding-sx-icon2'}></i><span>{I18n.t(100441/*失效*/)}</span></div>,
                                    data:{title:I18n.t(100441/*失效*/),type:3}
                                },{

                                    onClick:this.handleClick,
                                    permissions:'shiftsettings.activation',
                                    condition: [{key: 'rowSts', value: [5, 20], exp: '==='}],
                                    content:<div><i className={'foddingicon fooding-jh-icon2'}></i><span>{I18n.t(100442/*激活*/)}</span></div>,
                                    data:{title:I18n.t(100442/*激活*/),type:4}
                                }]
                            }}
                        />
                        <Dialog width={926} visible={this.state.rodalShow} title={this.state.title}>
                            {this.state.dialogContent}
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>)
    }
}
export default NavConnect(Forwarderlist);
