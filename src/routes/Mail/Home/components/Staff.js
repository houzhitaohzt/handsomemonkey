import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';
import NavConnect from "../../../../components/NavigateTabs/containers/AddContainer";

import {createForm,FormWrapper} from '../../../../components/Form';
import Dialog from '../../../../components/Dialog/Dialog'; //弹层
import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_MAIL, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import Table from '../../../../components/Table';//Table表格
import Page from '../../../../components/Page';//分页
import Select, { ConstVirtualSelect,Option } from '../../../../components/Select'; // 下拉




import {ButtonDIV} from "./Common.js"; // 公共库





// heard 头部
class Head extends Component {
    constructor(props) {
        super(props);

        // init state
        this.state = {
            departmentID:'', // 部门ID
        }
    }

	componentDidMount(){
    };

    // search
    searchHandle = ()=>this.props.form.validateFields((errors, value) =>this.props.getPage(value));

    // clear
    clearHandle = ()=>{
        this.props.form.resetFields(); // 清除表单
        this.props.form.validateFields((errors, value) =>this.props.getPage(value));
    }

    // 部门 切换  
    departmentHandle = (data)=> this.setState({departmentID: data ? data['organizationId']  : ''});

    // 点击部门 
    positionHandle = ()=> !this.props.form.getFieldsValue()['organizationId'] && ServiceTips({text:i18n.t(200994/*请选择*/)+i18n.t(100238/*部门*/),type:'info'});

    render(){
        let {departmentID} = this.state;
        let {form} = this.props;
		const {getFieldProps} = this.props.form;
		let formData = form.getFieldsValue();

        return <div className="addnormal girdlayout">
            <div className="row">
                <div className="col-md-4">
                    <label className={'col-md-2'}>{i18n.t(100238/*部门*/)}</label>
                    <ConstVirtualSelect
                        form={this.props.form}
                        apiType={apiPost}
                        fieldName='organizationId'
                        apiParams={{obj:'com.fooding.fc.ds.entity.Depmnt'}}
                        className="col-md-10"
                        onChange={this.departmentHandle}
                        valueKeys={ da => ({
                            organizationId: da.id,
                            basSpeci: da.specTxt,
                            s_label: da.localName
                        })}
                    />
                </div>
                <div className="col-md-4" onClick={this.positionHandle}>
                    <label className={'col-md-2'}>{i18n.t(100227/*职务*/)}</label>
                    <ConstVirtualSelect
                        form={this.props.form}
                        apiType={apiGet}
                        refreshMark={formData['organizationId']}
                        fieldName='positnId'
                        apiUri={`/positn/getPositnsByDepmntId?depmntId=${departmentID}`}
                        className="col-md-10"
                        valueKeys={ da => ({
                            positnId: da.id,
                            basSpeci: da.specTxt,
                            s_label: da.localName
                        })}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <label className={'col-md-2'}>{i18n.t(100231/*姓名*/)}</label>
                    <input type="text"
                        className="col-md-10 text-input-nowidth"
                        
                        {...getFieldProps('name',{
                            initialValue: ''
                        })}
                    />
                </div>
                <div className="col-md-4">
                    <label className={'col-md-2'}>{i18n.t(100229/*邮箱*/)}</label>
                    <input type="text"
                        className="col-md-10 text-input-nowidth"
                       
                        {...getFieldProps('email',{
                            initialValue: ''
                        })}
                    />
                </div>
                <div className="col-md-offset-1 col-md-2">
                    <span onClick={this.searchHandle} className="label label-info pointer"><i className="foddingicon fooding-search_icon"></i></span>
                    &nbsp;&nbsp;&nbsp;
                    <span onClick={this.clearHandle} className="label label-info pointer"><i className="foddingicon fooding-clean_icon"></i></span>
                </div>
            </div>
        </div>
    }
}


let HeadForm = createForm()(Head);

export class Nav extends Component {

    constructor(props) {
        super(props);
        let that = this;

        // init state
        this.state = {
            showDialog: true,
            searchHeader: {}, // head 过滤

            currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
            record: [], // table data
            scroll:120, // table 高度

        }


        // table list
		this.columns = [
        {
			title : i18n.t(100238/*部门*/),
			dataIndex : 'organization',
			key : "organization",
			width : '7%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data?data.localName:''}</div>);
			}
		},
        {
			title : '职位',
			dataIndex : 'positn',
			key : "positn",
			width : '9%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data ? data['localName'] : ''}</div>);
			}
		},
        {
			title : i18n.t(100231/*姓名*/),
			dataIndex : 'localName',
			key : "localName",
			width : '9%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},
        {
			title : i18n.t(100229/*邮箱*/),
			dataIndex : 'emailAddress',
			key : "emailAddress",
			width : '15%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		}];

    }

	componentDidMount(){
        this.getPage();
    };


    // confirmHandle
    confirmHandle = ()=>{
        let row = this.refs.product.getSelectArr()[0];
        if(!row){
            ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'info'});
            return;
        }

        // let {staffRefresh} = this.props;
        // staffRefresh({id:row['id'],name:row['localName'],position:row.positn ? row.positn['localName'] : '',email:row['emailAddress']});
        // this.cancelHandle();

        window.navTabs.open(`${i18n.t(100586/*邮件*/)}(${row['localName']})`,`/mail/${row['id']}`,Object.assign({},{id:row['id'],name:row['localName'],position:row.positn ? row.positn['localName'] : '',email:row['emailAddress']}),{refresh: true});
    }

    // cancelHandle
    cancelHandle = ()=>{
        this.setState({showDialog: false});
        this.props.staffHandle(true);
    }

    // getPage
    getPage = (search)=>{
        let that = this;
        let {searchHeader} = this.state;
        this.setState({searchHeader: search || searchHeader},function(){
            apiGet(API_FOODING_ES,'/staff/getUnderlingsEmail',Object.assign({pageSize: that.state.pageSize,currentPage: that.state.currentPage},that.state.searchHeader),
                (response)=>{
                    if(response.data){
                      that.setState({
                          record: response.data.data || [],
                          totalPages: response.data.totalPages,
                          currentPage: response.data.currentPage
                      });
                    }
                },(errors)=>{
                    ServiceTips({text:errors.message,type:'error'});
            });
        })
    }

    render(){
        let that = this;
        let {showDialog,record,scroll} = this.state;

        return   <Dialog width={900}  visible={showDialog} title={i18n.t(700153/*职员选择*/)}>
            <HeadForm getPage={this.getPage}/>
            <div>
                <Table
                    ref = "product"
                    columns={this.columns}
                    data={record}
                    singleSelect ={true}
                    checkboxConfig={{show:true,position:'first'}}
                    scroll={{x:true,y:scroll}}
                />
            </div>
            <div className={'keys-page'} style={{paddingTop:'6px'}}>
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
            </div>
            <div className="row">
                <br/>
                <ButtonDIV confirmHandle={this.confirmHandle} cancelHandle={this.cancelHandle}/>
            </div>
        </Dialog>
    }
}

export default NavConnect(Nav);