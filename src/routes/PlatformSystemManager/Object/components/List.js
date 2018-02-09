import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FunctionKeys from "./FuncKeys";
import FilterHeader from "./FilterHeader";
import NumberSPlug from './Edit';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS,pageSize,sizeList} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
class PlatformSMObjectList extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.addClick = this.addClick.bind(this);
        this.editClick = this.editClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.copyClick = this.copyClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getPage = this.getPage.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.lose = this.lose.bind(this);
        this.columns = [{
            title: i18n.t(100001/*名称*/),
            dataIndex: "localName",
            key: "localName",
            width: "50%",
            render(data, row, index){
                return data;
            }
        }, {
            title: "className",
            dataIndex: "className",
            key: "className",
            width: "50%",
            render(data, row, index){
                return (<div title={data} className={'text-ellipsis'}>{data}</div>)
            }
        }];

        this.state = {
            scrollHeight: 0,
            filter: null,
            selectArr: [],
            checkedRows: [],
            choised: false,
            MeunState: true,
            rodalShow: false,
            showSaveAdd: false,
            showSaveClose: true,
            buttonLeft: i18n.t(100429/*保存并关闭*/),
            contentTemplate: <div></div>,
            checkedData: '',
            data: [],
            pageSize:pageSize,
            currentPage:1
        }
    }

    addClick() {
        this.setState({
            rodalShow: true,
            showHeader: true,
            DialogContent: 1,
            showSaveAdd: true,
            showSaveClose: true,
            title: i18n.t(200893/*对象新增*/)
        })
    }

    editClick(record) {
        var that = this;
        apiGet(API_FOODING_ES,'/object/getOne',{id:record.record.id},(response)=>{
            that.setState({
                DialogContent:3,
                rodalShow : true,
                showHeader:true,
                title: i18n.t(200894/*对象编辑*/),
                showSaveAdd:false,
                showSaveClose:true,
                checkedData:response.data
            })
        },(error)=>{

        })
    }

    deleteClick(data) {
        let numArr = this.refs.frexrat.getSelectArr();
        let tempString = "";
        let value = [];
        var that = this;
        if (numArr.length === 0) {
            if (data.record) {
                tempString = i18n.t(201288/*已选择1条数据，您确定删除吗*/);
                value.push(data.record.id);
            } else {
                tempString = i18n.t(200328/*请选择一条数据进行操作*/);
            }

        } else {
            if (data.record) {
                tempString = i18n.t(201288/*已选择1条数据，您确定删除吗*/);
                value.push(data.record.id);
            } else {
                for (let i = 0; i < numArr.length; i++) {
                    value.push(numArr[i].id);
                }
                tempString = i18n.t(100395/*已选中*/) + numArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }

        }
        if( !value.length) return errorTips(i18n.t(200328/*请选择一条数据进行操作*/));
        Confirm(tempString, {
            done: () => {
                apiForm(API_FOODING_ES, '/object/delete', {id: value}, (response) => {
                    that.getPage();
                    successTips(response.message)
                }, (errors) => {
                    errorTips(errors.message)
                });
            },
            close: () => {}
        });
    }

    lose(data) {
        //暂时不要失效
        /*Confirm("您确定要失效这条数据吗？", {
            done: () => {
                apiForm(API_FOODING_ES, '/billNoTarget/delete', {id: value}, (response) => {
                    that.getPage();
                    ServiceTips({text: response.message, type: 'success'});

                }, (errors) => {
                    ServiceTips({text: errors.message, type: 'error'});
                });
            },
            close: () => {
            }
        });*/
    }

    copyClick() {
        console.log('copyClick')
    }

    onSaveAndClose(value, data, isAdd) {
        let that = this;
        value = Object.assign({}, data, value);
        apiPost(API_FOODING_ES, '/object/save', value, (response) => {
            that.setState({
                rodalShow: !!isAdd
            });
            successTips(response.message);
            this.getPage();
        }, (errors) => {
            errorTips(errors.message);
            that.setState({
                rodalShow: !!isAdd
            })
        })
    }

    onCancel(that) {
        this.setState({rodalShow: false});
    }

    handleClick(e, data) {
        //右键处理
        if (data.type == 1) {
            this.deleteClick(data);
        } else if (data.type == 2) {
            this.editClick(data);
        } else if (data.type == 3) {
            this.lose(data);
        }
    }

    onRowDoubleClick(record, index, checked) {
        this.setState({
            rodalShow: true,
            showHeader: true,
            showSaveAdd: false,
            showSaveClose: false,
            DialogContent: 5,
            title: i18n.t(200895/*对象详情*/),
            checkedData: {record: record}
        })
    }
     getPage(currentPage,objValue){
        let that = this;
        var sID = sID || '';
        let currentP = !isNaN(currentPage)?currentPage:1;
        let object=Object.assign({},{isPlatform:true, pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
        apiGet(API_FOODING_ES, '/object/getPage',object,
                (response)=>{   
                    that.setState({ 
                        data: response.data.data,
                        totalPages: response.data.totalPages,
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

    render() {
         let {page,currentPage} =this.state;
        return (<div>
                <FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage} expandFilter= {this.handleResize}/>
                <div className={'client-body'} style={{height: this.state.scrollHeight}}>
                    <div className={'client-body-single'}>
                       <div className="action-buttons">
                        <div className={'key-page'}>
                            <FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick} copyClick={this.copyClick}/>
                           <Page 
                            currentPage={this.state.currentPage}
                            totalPages={this.state.totalPages} 
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
                                ref="frexrat"
                                columns={this.columns}
                                data={this.state.data}
                                checkboxConfig={{
                                    show: true,
                                    position: 'first'
                                }}
                                colorFilterConfig={{show: false}}
                                followConfig={{show: false}}
                                onRowDoubleClick={this.onRowDoubleClick}
                                scroll={{x: true, y: this.state.scroll}}
                                onHeaderCellClick={this.onHeaderCellClick}
                                contextMenuConfig={{
                                    enable: true,
                                    contextMenuId: 'SIMPLE_TABLE_MENU',
                                    menuItems: [{
                                        permissions:'object.del',
                                        onClick: this.handleClick,
                                        content: <div><i className={'foddingicon fooding-delete-icon4'}/>{i18n.t(100437/*删除*/)}</div>,
                                        data: {type: 1, title: i18n.t(100437/*删除*/)}
                                    }, {
                                        permissions:'object.edit',
                                        onClick: this.handleClick,
                                        content: <div><i className={'foddingicon fooding-alter_icon2'}/>{i18n.t(100439/*编辑*/)}</div>,
                                        data: {type: 2, title: i18n.t(100439/*编辑*/)}
                                    }]
                                }}
                            />
                            <Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader={this.state.showHeader}>
                                <NumberSPlug DialogContent={this.state.DialogContent}
                                             checkedData={this.state.checkedData}
                                             showSaveAdd={this.state.showSaveAdd}
                                             showSaveClose={this.state.showSaveClose}
                                             buttonLeft={this.state.buttonLeft}
                                             onSaveAndClose={this.onSaveAndClose}
                                             contentDate={this.state.contentDate}
                                             upload ={this.getPage}
                                             onCancel={this.onCancel}/>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default NavConnect(PlatformSMObjectList);

