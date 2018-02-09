import i18n from '../../../../lib/i18n';

import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class Check extends Component{
    constructor(props){
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.state=this.initState();
        this.addClick=this.addClick.bind(this);
        this.onClickLink=this.onClickLink.bind(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
        this.getPage = this.getPage.bind(this);
        let that = this;
        this.columns = [{
            title : '年度',
            dataIndex : "auditType",
            key : "auditType",
            width : "5%",
            render(data,row,index){
                return (<div>{data['name']}</div>);
            }
        },{
            title :'月份',
            dataIndex : 'enterpriseName',
            key : "enterpriseName",
            width : "4%",
            render(data,row,index){
                return (<div>{data}</div>);
            }
        },{
            title :'应出勤工时',
            dataIndex : 'enterpriseTaxId',
            key : 'enterpriseTaxId',
            width : "10%",
            render(data,row,index){
                return (<div title={data} className={'text-ellipsis'}>{data}</div>);
            }
        },{
            title : '出勤工时',
            dataIndex : 'enterpriseEmail',
            key : "enterpriseEmail",
            width : "10%",
            render(data,row,index){
                return (<div title={data} className={'text-ellipsis'}>{data}</div>);
            }
        }/*,{
            title : '请假(次)',
            dataIndex : 'partyTel',
            key : "partyTel",
            width : "8%",
            render(data,row,index){
                return (<div>{data}</div>);
            }
        },{
            title : '请假(天)',
            dataIndex : 'partyTel',
            key : "partyTel",
            width : "8%",
            render(data,row,index){
                return (<div>{data}</div>);
            }
        },{
            title : '请假(小时)',
            dataIndex : 'partyTel',
            key : "partyTel",
            width : "8%",
            render(data,row,index){
                return (<div>{data}</div>);
            }
        },{
            title : '迟到(次)',
            dataIndex : 'partyTel',
            key : "partyTel",
            width : "8%",
            render(data,row,index){
                return (<div>{data}</div>);
            }
        }, {
            title :'迟到(分钟)',
            dataIndex : 'createDate',
            key : 'createDate',
            width : "8%",
            render(data,row,index){
                return (<div>{data}</div>);
            }
        }*/,{
            title : '早退(次)',
            dataIndex : 'partyTel',
            key : "partyTel",
            width : "8%",
            render(data,row,index){
                return <div onClick={that.onClickLink.bind(that, row)} className='link-color'>{data}</div>;
            }
        },/* {
            title: '早退(分钟)',
            dataIndex: 'partyTel',
            key: "partyTel",
            width: "8%",
            render(data, row, index) {
                return (<div>{data}</div>);
            }
        },*/{
            title :'缺卡',
            dataIndex : 'auditDate',
            key : 'auditDate',
            width : "10%",
            render(data,row,index){
                return (<div>{data}</div>);
            }
        }];
    }

    initState(){
        return {
            scrollHeight:0,
            selectArr:[],
            checkedRows:[],
            choised:false,
            data:[],
            obj:{},
            pageSize:pageSize,
            currentPage:1
        }
    }
    addClick(){

    }

    onSaveAndClose(){
        this.setState({
            showDilaog:!this.state.showDilaog
        })
    }
    onCancel(){
        this.setState({
            showDilaog:false
        })
    }
    handleClick(e,data){
    }
    onClickLink(record,index,checked) {
        let {router,navAddTab} =this.props;
        navAddTab({id: 7, name:'考勤列表', component: '考勤列表', url:'/MyAttendance/detail'});
        router.push({ pathname: '/MyAttendance/detail',query:{id:record.id}});
    }
    onRowDoubleClick(record,index,checked){
      /*  let {router,navAddTab} =this.props;
        navAddTab({name:'考勤列表',component:'考勤列表',url:'/MyAttendance/detail'});
        router.push({ pathname: '/MyAttendance/detail',query:{id:record.id}});*/

    }
    handleResize(height){
        let sch=document.body.offsetHeight-70-height;
        let scroll = sch-140;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
        console.log(scroll);
    }
    //请求列表  list
    getPage(sID,objValue){
        let that = this;
        var sID = sID || '';
        let object=Object.assign({},{isPlatform:true, pageSize: this.state.pageSize, currentPage: this.state.currentPage},that.normalRef.getForm());
        apiGet(API_FOODING_ES,'/audit/getPage',object,
            (response)=>{
                that.setState({
                    data: response.data,
                    totalPages: response.totalPages,
                    currentPage: response.currentPage
                });
            },(errors)=>{
            });


    }
    componentDidMount(){
        this.getPage();
        window.addEventListener('resize', this.handleResize(65));
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize( 65));
    }

    render(){
        const data = this.state.data || [];
        let {page} =this.state;
        return(<div>
            <FilterHeader getPage ={this.getPage}  normalRef={no => this.normalRef = no} />
            <div className={'client-body'} style={{height:this.state.scrollHeight}}>
                <div className={'client-body-single'}>
                    <div className='action-buttons'>
                        <div className={'key-page'}>
                            <FunctionKeys addClick={this.addClick} />
                            <Page
                                currentPage={this.state.currentPage}
                                totalPages={this.state.totalPages}
                                sizeList={sizeList}
                                currentSize={this.state.pageSize}
                                pageSizeChange={(num)=>{
                                    this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage());
                                }}
                                backClick={(num)=>{
                                    this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage());
                                }}
                                nextClick={(num)=>{
                                    this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage());
                                }}
                                goChange={(num)=>{
                                    this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage());
                                }}
                            />
                        </div>
                        <Table
                            ref = "product"
                            columns={this.columns}
                            data={data}
                            checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                            colorFilterConfig={{show : false,dataIndex:'colorType'}}
                            followConfig={{show:false}}
                            scroll={{x:true,y:this.state.scroll}}
                            //onRowDoubleClick={this.onRowDoubleClick}

                        />
                        <Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
                            {this.state.dialogContent}
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>)
    }
}
export default NavConnect(Check);

