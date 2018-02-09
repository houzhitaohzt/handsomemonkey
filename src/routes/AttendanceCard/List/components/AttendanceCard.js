import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import PayTrmPlug from './PayTrmPlug';
import {
    apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, pageSize, sizeList,
    API_FOODING_ERP,API_FOODING_HR} from '../../../../services/apiCall';
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
        this.columns = [{
            title :'职员工号',
            dataIndex : 'employeeId',
            key : "employeeId",
            width : '20%',
            render(data,row,index){
                return data;
            }
        },{
            title :'职员名称',
            dataIndex : "employeeName",
            key : "employeeName",
            width : "10%",
            render(data,row,index){
                return <div>{data}</div>;
            }
        },{
            title :'所属部门',
            dataIndex : "depmnt",
            key : "depmnt ",
            width : "10%",
            render(data,row,index){
                return <div>{data?data.localName:''}</div>
            },
        },{
            title :'职位',
            dataIndex : "positionName",
            key : "positionName",
            width : "20%",
            render(data,row,index){
                return <div>{data}</div>;
            }
        },{
            title :'在职状态',
            dataIndex : "workingStateName",
            key : "workingStateName",
            width : "10%",
            render(data,row,index){
                return <div>{data}</div>;
            }
        },{
            title :'考勤卡号',
            dataIndex : "cardNo",
            key : "cardNo",
            width : "20%",
            render(data,row,index){
                return <div>{data}</div>;
            }
        },{
            title :'考勤方式',
            dataIndex : "attendType",
            key : "attendType",
            width : "10%",
            render(data,row,index){
                return <div>{data}</div>;
            }
        },{
            title : '生效日期',
            dataIndex : "effectDate",
            key : "effectDate",
            width : "10%",
            sort:'effectDate',
            render(data,row,index){
                if(data){
                    return new Date(data).Format('yyyy-MM-dd')
                }
                return null;
            }
        },{
            title :'状态',
            dataIndex : "statusName",
            key : "statusName",
            width : "10%",
            sort:'statusName',
            render(data,row,index){
                return data;
            }
        }
        ];
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
        navAddTab({id:13,name:'考勤发卡新增',component:'考勤发卡新增',url:'/attendancecard/add'});
        this.props.router.push('/attendancecard/add');
    }
    editClick(record){
        let {navAddTab} =this.props;
        navAddTab({id:13,name:'考勤发卡编辑',component:'考勤发卡编辑',url:'/attendancecard/add'});
        this.props.router.push({pathname:'/attendancecard/add',query:{id:record.record.id}});
    }
    deleteClick(data){
        let numArr = this.refs.frexrat.getSelectArr();
        let value=[];
        var that = this;
        if(numArr.length > 0){
            for (var i = 0; i < numArr.length; i++) {
                value.push(numArr[i].id);
            }
            Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    apiForm(API_FOODING_HR,'/attendCard/del',{ids:value},(response)=>{
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
            ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
        }

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
        navAddTab({id:6,name:'考勤发卡详情',component:'考勤发卡详情',url:'/attendancecard/detail'});
        this.props.router.push({pathname:'/attendancecard/detail',query:{id:record.id}});
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
                    apiForm(API_FOODING_HR,'/attendCard/status',{id:data.record.id,status:20},(response)=>{
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

                    apiForm(API_FOODING_HR,'/attendCard/status',{id:data.record.id,status:10},(response)=>{
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
        //this.columnSort = order = order || this.columnSort;

        let currentP =!isNaN(currentPage)?currentPage:1;
        let object=Object.assign({},{ pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
        apiGet(API_FOODING_HR,'/attendCard/getPage',object,
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
                            <FunctionKeys addClick={this.addClick}  deleteClick={this.deleteClick}  />
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
                            scroll={{x:true,y:this.state.scroll}}
                            onHeaderCellClick={this.onHeaderCellClick}
                            onRowClick={this.onRowClick}
                            onRowDoubleClick={this.onRowDoubleClick}
                            contextMenuConfig={{
                                enable:true,
                                contextMenuId:'SIMPLE_TABLE_MENU',
                                menuItems:[{
                                    onClick:this.handleClick,
                                    condition: [{key: 'status', value: [5], exp: '==='}],
                                    content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
                                    data:{type:1,title:I18n.t(100437/*删除*/)}
                                },{
                                    onClick:this.handleClick,
                                    content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{I18n.t(100439/*编辑*/)}</div>,
                                    data:{type:2,title:I18n.t(100439/*编辑*/)}
                                },{

                                    onClick:this.handleClick,
                                    condition: [{key: 'status', value: [10], exp: '==='}],
                                    content:<div><i className={'foddingicon fooding-sx-icon2'}></i><span>{I18n.t(100441/*失效*/)}</span></div>,
                                    data:{title:I18n.t(100441/*失效*/),type:3}
                                },{

                                    onClick:this.handleClick,
                                    condition: [{key: 'status', value: [5, 20], exp: '==='}],
                                    content:<div><i className={'foddingicon fooding-jh-icon2'}></i><span>{I18n.t(100442/*激活*/)}</span></div>,
                                    data:{title:I18n.t(100442/*激活*/),type:4}
                                }]
                            }}
                        />
                        <Dialog width={926} visible={this.state.rodalShow} title={this.state.title}>
                            {/*<PayTrmPlug DialogContent={this.state.DialogContent}
                                        checkedData = {this.state.checkedData}
                                        info={this.state.info}
                                        showSaveAdd ={this.state.showSaveAdd}
                                        showSaveClose={this.state.showSaveClose}
                                        buttonLeft = {this.state.buttonLeft}
                                        onSaveAndClose ={this.onSaveAndClose}
                                        contentDate = {this.state.contentDate}
                                        upload ={this.getPage}
                                        onCancel = {this.onCancel}/>*/}
                            {this.state.dialogContent}
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>)
    }
}
export default NavConnect(Forwarderlist);
