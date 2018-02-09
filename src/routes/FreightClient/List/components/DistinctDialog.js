import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
//引入滚动条
//引入分页
import Page from "../../../../components/Page";
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../../services/apiCall';
//引入Table
const {Table} = require("../../../../components/Table");

/**
 * 客户查重
 */
class CommonForm extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    initialState = ()=> ({
        pageSize:pageSize,
        currentPage:1,
        data : [],
        totalRecords:0,
        filter:null
        
    });

    static PropTypes = {
        data: PropTypes.object,
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func
    };

    static defaultProps = {
        columns_distinct: [{
            title: i18n.t(100354/*客户代码*/),
            dataIndex: "code",
            key: "code",
            width: "10%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(100355/*客户名称*/),
            dataIndex: 'name',
            key: "name",
            width: '30%',
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(100087/*国家*/),
            dataIndex: "country",
            key: "country",
            width: "20%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(200444/*网址*/),
            dataIndex: "defaultWeb",
            key: "defaultWeb",
            width: "30%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(100361/*分管人*/),
            dataIndex: "staff",
            key: "staff",
            width: "10%",
            render(data, row, index){
                return data&&data[0]?data[0]:"";
            }
        }],
        onSaveAndClose(){
        },
        onCancel(){
        }
    };

    componentDidMount() {
    }


    queryCustomerList (currentPage,objValue,filter) {
        let that = this;
        filter=filter || this.state.filter;
        var sID = sID || '';
        let currentP = !isNaN(currentPage)?currentPage:1;
        let params = Object.assign({}, {pageSize: that.state.pageSize, currentPage: currentP},filter);
        apiGet(API_FOODING_DS,'/customer/repeat/getPage',params,
                (response)=>{   
                    that.setState({ 
                        data: response.data.data,
                        totalPages: response.data.totalPages,
                        totalRecords:response.data.totalRecords,
                        currentPage: response.data.currentPage,
                        filter:filter  
                    });
                },(errors)=>{
        });
    }

    searchCustomer = ()=> {
        let {form} = this.props;
        let that = this;
        let param = form.getFieldsValue();
        // console.log(param);
        if(param.name.trim() !== '' || param.email.trim() !== '' || param.web.trim() !== ''){
            this.queryCustomerList(1, that.state.pageSize, param);
        }

    };

    onSaveAndClose() {
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if (null == errors) {
                if (onSaveAndClose) {
                    onSaveAndClose(form.getFieldsValue());
                }
            }
        })
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel()
        }
    }

    render(){
        let {page,currentPage} =this.state;
        const {getFieldProps, getFieldError} = this.props.form;
        return (<FormWrapper showFooter={true} onCancel={this.onCancel} showSaveClose={false}>
            <div className="common-distinct">
                <div className="row">
                    <div className="col-xs-3">
                        <label className="distinct-label">{i18n.t(100355/*客户名称*/)}</label>
                        <input type="text" placeholder="" className="text-input"
                               {...getFieldProps('name', {
                                   initialValue: ''
                               })}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.searchCustomer();}
                               }}
                        />
                    </div>
                    <div className="col-xs-3">
                        <label className="distinct-label">{i18n.t(100229/*邮箱*/)}</label>
                        <input type="text" placeholder="" className="text-input"
                               {...getFieldProps('email', {
                                   initialValue: ''
                               })}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.searchCustomer();}
                               }}
                        />
                    </div>
                    <div className="col-xs-3">
                        <label className="distinct-label">{i18n.t(200444/*网址*/)}</label>
                        <input type="text" placeholder="" className="text-input"
                               {...getFieldProps('web', {
                                   initialValue: ''
                               })}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.searchCustomer();}
                               }}
                        />
                    </div>
                     <div className="filter-header-key">
                        <span className="search" onClick={this.searchCustomer} style={{textAlign:'center'}} title={i18n.t(100477/*请搜索*/)}><i className="foddingicon fooding-search_icon"/></span>
                    </div>
                </div>
                <div className="common-distinct-table">
                    <Table
                        columns={this.props.columns_distinct}
                        data={this.state.data}
                        checkboxConfig={{show: false}}
                        colorFilterConfig={{show: false}}
                        followConfig={{show: false}}
                        prefixCls={"rc-confirm-table"}
                        scroll={{x: false, y: 220}}
                        style={{width:'100%'}}
                    />
                </div>
                <div className="common-distinct-page">
                    <Page 
                            currentPage={this.state.currentPage}
                            totalPages={this.state.totalPages} 
                            totalRecords={this.state.totalRecords}
                            sizeList={sizeList}
                            currentSize={this.state.pageSize}
                            pageSizeChange={(num)=>{
                                this.setState({ pageSize: Number.parseInt(num) },()=>this.queryCustomerList(currentPage, num));
                            }} 
                            backClick={(num)=>{
                                this.setState({ currentPage: Number.parseInt(num) },()=>this.queryCustomerList(num));
                            }} 
                            nextClick={(num)=>{
                                this.setState({ currentPage: Number.parseInt(num) },()=>this.queryCustomerList(num));                                     
                            }}
                            goChange={(num)=>{
                                this.setState({ currentPage: Number.parseInt(num) },()=>this.queryCustomerList(num));                                                                             
                            }}                              
                        />
                </div>
            </div>
        </FormWrapper>)
    }
}

CommonForm = createForm()(CommonForm)

export default CommonForm;
