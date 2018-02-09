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
    API_FOODING_ERP, API_FOODING_HR
} from '../../../../services/apiCall';
import ServiceTips from "../../../../components/ServiceTips";//提示框
import {I18n} from "../../../../lib/i18n";
class Overtimeregisterlist extends Component{
    constructor(props){
        super(props)
        this.handleResize = this.handleResize.bind(this);
        this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
        this.addClick=this.addClick.bind(this);
        this.deleteClick=this.deleteClick.bind(this);
        var that = this;
        this.getPage =this.getPage.bind(this);
        this.columns = [{
            title :I18n.t(400048/*单据编号*/),
            dataIndex : 'no',
            key : "no",
            width : '10%',
            render(data,row,index){
                return (<div title={data}>{data?data:''}</div>)
            }
        },{
            title :i18n.t(700076/*日期*/),
            dataIndex : "billDate",
            key : "billDate",
            width : "8%",
            render(data,row,index){
                return new Date(data).Format('yyyy-MM-dd');
            }
        },{
            title :i18n.t(100244/*企业*/),
            dataIndex : "ccLcName",
            key : "ccLcName",
            width : "10%",
            render(data,row,index){
                return <div>{data?data:''}</div>
            }
        },{
            title :i18n.t(100238/*部门*/),
            dataIndex : "depmntLcName",
            key : "depmntLcName",
            width : "8%",
            render(data,row,index){
                return <div>{data}</div>;
            }
        },{
            title: I18n.t(500358/*登记人*/),
            dataIndex: "registerLcName",
            key: "registerLcName",
            width: "8%",
            render(data, row, index) {
                return <div>{data?data : ''}</div>
            }
        },{
            title :I18n.t(500359/*补偿方式*/),
            dataIndex : "compensateType",
            key : "compensateType",
            width : "8%",
            render(data,row,index){
                return <div>{data?data.name:''}</div>
            }
        },{
            title: I18n.t(500360/*事由*/),
            dataIndex: "reason",
            key: "reason",
            width: "15%",
            render(data, row, index) {
                return <div>{data?data: ''}</div>
            }
        },{
            title :I18n.t(100305/*开始时间*/),
            dataIndex : "startDate",
            key : "startDate",
            width : "8%",
            render(data,row,index){
                return new Date(data).Format("yyyy-MM-dd");

            }
        },{
            title :I18n.t(100306/*结束时间*/),
            dataIndex : "endDate",
            key : "endDate",
            width : "8%",
            render(data,row,index){
                return new Date(data).Format("yyyy-MM-dd");

            }
        },{
            title :I18n.t(500361/*加班时长*/),
            dataIndex : "overTime",
            key : "overTime",
            width : "8%",
            render(data,row,index){
                return <div>{data?data:''}</div>

            }

        },{
            title :i18n.t(700074/*状态*/),
            dataIndex : "statusName",
            key : "statusName",
            width : "8%",
            render(data,row,index){
                return <div>{data?data:''}</div>
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
        navAddTab({id:13,name:i18n.t(500362/*加班单新增*/),component:i18n.t(500362/*加班单新增*/),url:'/overtimeregister/add'});
        this.props.router.push('/overtimeregister/add');
    }
    deleteClick(data){
        let numArr = this.refs.frexrat.getSelectArr();
        let value=[];
        var that = this;
        if(numArr.length > 0){
            for (var i = 0; i < numArr.length; i++) {
                value.push(numArr[i].billId);
            }
            if(numArr[0].status==1){
                Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                    done: () => {
                        apiForm(API_FOODING_HR,'/workregister/delete',{billId:value},(response)=>{
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
    onRowDoubleClick(record,index,checked){
       let {navAddTab} =this.props;
        navAddTab({id:6,name:i18n.t(500364/*加班单详情*/),component:i18n.t(500364/*加班单详情*/),url:'/overtimeregister/detail'});
        this.props.router.push({pathname:'/overtimeregister/detail',query:{id:record.billId}});
    }
    //请求列表  list
    getPage(currentPage,objValue){
        let that = this;
        var sID = sID || '';
        let currentP =!isNaN(currentPage)?currentPage:1;
        let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
        apiGet(API_FOODING_HR,'/workregister/getPage',object,
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
                            <FunctionKeys addClick={this.addClick}  deleteClick={this.deleteClick}/>
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
                            singleSelect={true}
                            checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                            colorFilterConfig={{show : false,dataIndex:'colorType'}}
                            followConfig={{show:false}}
                            scroll={{x:true,y:this.state.scroll}}
                            onHeaderCellClick={this.onHeaderCellClick}
                            onRowClick={this.onRowClick}
                            onRowDoubleClick={this.onRowDoubleClick}

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
export default NavConnect(Overtimeregisterlist);
