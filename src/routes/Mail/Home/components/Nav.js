import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';

import {createForm,FormWrapper} from '../../../../components/Form';
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_DS, API_FOODING_MAIL, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import Calendar from  '../../../../components/Calendar/Calendar';
import Table from '../../../../components/Table';//Table表格
import Page from '../../../../components/Page';//分页
import Select, { Option } from '../../../../components/Select';

import { Menu, Dropdown, Button, Icon, Input, Radio  } from 'antd';
import 'antd/dist/antd.css';

import {ButtonDIV,commonRow,commonOnlyRow} from "./Common.js"; // 公共库



// 高级搜索 页面
class SearchDIV extends Component {

    constructor(props) {
        super(props);

        this.state = {
            beginData: null, // 开始时间
            button:false
        }
    }

    // confirm
    confirmHandle = ()=>{
        let {confirmHandle} = this.props;
		this.props.form.validateFields((errors, value) =>confirmHandle(value));
    }

    // cancel
    cancelHandle = ()=>{
        this.props.cancelHandle();
    }

    // 调整时间 
    changeTime = (t)=> {
        this.setState({beginData: new Date(t)});
        this.props.form.resetFields(['endDate']); // 清除表单
    }

    render(){
		const {getFieldProps,getNFieldProps} = this.props.form;
        let {beginData} = this.state;
        let {searchData,keyvalue} = this.props;
        return <div className="addnormal girdlayout">
            <div className="row">
                <div className="col-md-offset-1 col-md-10">
                    <label className={'col-md-2'}>{i18n.t(100304/*主题*/)}</label>
                    <input type="text"
                        className="col-md-10 text-input-nowidth"
                        
                        {...getFieldProps('subject',{
                            initialValue: searchData['subject'] || ''
                        })}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-offset-1 col-md-10">
                    <label className={'col-md-2'}>{i18n.t(200540/*收件人*/)}</label>
                    <input type="text"
                        className="col-md-10 text-input-nowidth"
                        
                        {...getFieldProps('receiver',{
                            initialValue: searchData['receiver'] || ''
                        })}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-offset-1 col-md-10">
                    <label className={'col-md-2'}>{i18n.t(200539/*发件人*/)}</label>
                    <input type="text"
                        className="col-md-10 text-input-nowidth"
                        {...getFieldProps('sender',{
                            initialValue: searchData['sender'] || ''
                        })}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-offset-1 col-md-10">
                    <label className={'col-md-2'}>{i18n.t(200041/*内容*/)}</label>
                    <input type="text"
                        className="col-md-10 text-input-nowidth"
                       
                        {...getFieldProps('context',{
                            initialValue: searchData['context'] || ''
                        })}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-offset-1 col-md-10">
                    <label className={'col-md-2'}>{i18n.t(700151/*范围*/)}</label>
                    <div className="col-md-10">
						<Calendar
							name={'startDate'}
                            onChangeTime={this.changeTime}
                            showTime={false}
                            width={200}
                            isShowIcon={true}
                            form={this.props.form}
                            padding={"3px 10px 4px"}
                            value={searchData['startDate']}
						/>
						&nbsp;&nbsp;至&nbsp;&nbsp;
						<Calendar
							name={'endDate'}
                            beginData={beginData}
                            showTime={false}
                            width={200}
                            form={this.props.form}
                            isShowIcon={true}
                            padding={"3px 10px 4px"}
                            value={searchData['endDate']}
						/>
                    </div>
                </div>
                {keyvalue==true?
                    <div className="col-md-offset-1 col-md-10">
                        <label  className={'col-md-2'}>{i18n.t(100230/*状态*/)}</label>
                        <Select

                            placeholder=""
                            style={{width:200}}
                            {...getNFieldProps('status', {
                                nitialValue: searchData['status'] || undefined
                            })}
                            name="region"
                            allowClear
                            className="col-md-10 text-input-nowidth"
                            prefixCls="rc-select-filter-header"
                        >
                            <Option objValue = {{s_label:i18n.t(500344/*未发送*/),status:'unSent'}} key={'unSent'}>{i18n.t(500344/*未发送*/)}</Option>
                            <Option objValue = {{s_label:i18n.t(500345/*发送成功*/),status:'sentOk'}} key={'sentOk'}>{i18n.t(500345/*发送成功*/)}</Option>
                            <Option objValue = {{s_label:i18n.t(500346/*发送失败*/),status:'sentFail'}} key={'sentFail'}>{i18n.t(500346/*发送失败*/)}</Option>
                            <Option objValue = {{s_label:i18n.t(500347/*已查看*/),status:'isRead'}} key={'isRead'}>{i18n.t(500347/*已查看*/)}</Option>
                        </Select>
                    </div>:''
                }
                <div className="row">
                    <div className="col-md-offset-1 col-md-10">
                        <label className={'col-md-2'}>{i18n.t(600238/*邮件归档*/)}</label>
						<Select
							{...getNFieldProps('containBill',{
								initialValue: ''								
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
						>
							<Option key={0} value={''} title={i18n.t(500301/*全部*/)}>{i18n.t(500301/*全部*/)}</Option>						
							<Option key={0} value={true} title={i18n.t(500290/*已归档*/)}>{i18n.t(500290/*已归档*/)}</Option>
							<Option key={0} value={false} title={i18n.t(600239/*未归档*/)}>{i18n.t(600239/*未归档*/)}</Option>
						</Select>	                        
                    </div>
                </div>  
            </div>
            <br/>
            <ButtonDIV confirmHandle={this.confirmHandle} cancelHandle={this.cancelHandle} />
        </div>
    }
}

// 搜索
let SearchDivForm = createForm()(SearchDIV);
class Search extends Component {

    constructor(props) {
        super(props);

        // state init
        this.state = {
            showDialog: false,  // show dialog
        }
    }

    // 常规 搜索
    searchKey = (e)=>{
        let v = e.target.value.trim();

        //if(!v) return;
        this.props.getPage({key:v});//默认从第一页开始
    }

    // 高级 搜索
    searchHandle = ()=>{
        this.setState({showDialog: true});
    }

    // confirm
    confirmHandle = (form)=>{
        this.setState({ userName: ''},function(){
            this.props.getPage(Object.assign(form)); // 刷新页面
            this.cancelHandle();
        });
    }

    // cancel
    cancelHandle = ()=>{
        this.setState({showDialog: false});
    }

    // 清空 
    emptyHandle = ()=>{
        this.setState({ userName: ''},function(){
            this.props.getPage({}); // 刷新页面
        });
    }

    // emitEmpty = () => {
    //   this.userNameInput.focus();
    //   this.setState({ userName: '' });
    // }

    onChangeUserName = (e) => {
       this.setState({ userName: e.target.value });
    }
    render(){
        let {showDialog,userName} = this.state;
        let {searchData,searchScope=i18n.t(700150/*邮箱、正文、主题*/),searchOFF,keyvalue} = this.props;
        const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        
        return <div className="serch">
            <Input
                placeholder={searchScope}
                addonAfter={
                    searchOFF ?
                        <span><i onClick={this.emptyHandle} className="empty-close foddingicon fooding-menu_delete_32" title={i18n.t(700024/*清空*/)}></i></span>
                        :
                        <span><i onClick={this.emptyHandle} className="empty-close foddingicon fooding-menu_delete_32" title={i18n.t(700024/*清空*/)}></i><Icon onClick={this.searchHandle} type="setting" title={i18n.t(700149/*高级搜索*/)} /></span>
                    }
                onPressEnter={this.searchKey}
                //suffix={suffix}
                value={userName}
                onChange={this.onChangeUserName}
                //ref={node => this.userNameInput = node}
                //ref={node => this.userNameInput = node}
            />
            <Dialog width={700}  visible={showDialog} title={i18n.t(700149/*高级搜索*/)}>
                <SearchDivForm searchData={searchData} getForm={this.getForm} confirmHandle={this.confirmHandle} cancelHandle={this.cancelHandle} keyvalue={keyvalue}/>
            </Dialog>
        </div>
    }
}


// 共享 搜索
class ShareHead extends Component {

    constructor(props) {
        super(props);
    }

    // confirm
    confirmHandle = ()=>{
        let {confirmHandle} = this.props;
		this.props.form.validateFields((errors, value) =>confirmHandle(value));
    }

    // cancel
    cancelHandle = ()=>{
        this.props.cancelHandle();
    }

    // search
    searchHandle = ()=>this.props.form.validateFields((errors, value) =>this.props.getPage(Object.assign({},value,{currentPage:1})));

    // clear
    clearHandle = ()=>{
        this.props.form.resetFields(); // 清除表单
        this.props.form.validateFields((errors, value) =>this.props.getPage(value));
    }

    render(){
		const {getFieldProps} = this.props.form;

        return <div className="addnormal girdlayout">
            <div className="row">
                <div className="col-md-5">
                    <label className={'col-md-2'}>{i18n.t(100231/*姓名*/)}</label>
                    <input type="text"
                        className="col-md-9 text-input-nowidth"
                        {...getFieldProps('staffName',{
                            initialValue: ''
                        })}
                    />
                </div>
                <div className="col-md-5">
                    <label className={'col-md-2'}>{i18n.t(100229/*邮箱*/)}</label>
                    <input type="text"
                        className="col-md-9 text-input-nowidth"
                        {...getFieldProps('name',{
                            initialValue: ''
                        })}
                    />
                </div>
                <div className="col-md-2">
                    <span onClick={this.searchHandle} className="label label-info pointer"><i className="foddingicon fooding-search_icon"></i></span>
                    &nbsp;&nbsp;&nbsp;
                    <span onClick={this.clearHandle} className="label label-info pointer"><i className="foddingicon fooding-clean_icon"></i></span>
                </div>
            </div>
        </div>
    }
}
let ShareHeadForm = createForm()(ShareHead);

// 共享
class ShareDIV extends Component {

    constructor(props) {
        super(props);
        let that = this;

        // init state
        this.state = {
            currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条

            record: [], // tabel list
            shareData: [], // 共享的人
        }

        // table list
		this.columns = [{
			title : i18n.t(100231/*姓名*/),
			dataIndex : 'code',
			key : "code",
			width : '16%',
			render(data,row,index){
				return (<div className="text-ellipsis">{row.staff ? row.staff['localName'] : ''}</div>);
			}
		},{
			title : i18n.t(100227/*职务*/),
			dataIndex : "position",
			key : "position",
			width : "16%",
			render(data,row,index){
				return (<div className="text-ellipsis">{row.staff ? (row.staff.positn ? row.staff.positn['localName'] : '') : ''}</div>);
			}
		},{
			title : i18n.t(100229/*邮箱*/),
			dataIndex : "localName",
			key : "localName",
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis"><a onClick={that.shareHandle.bind(that,row)} href="javascript:;">{i18n.t(700101/*共享*/)}</a></div>);
			}
		}];
    }

	componentDidMount(){
		this.getPage();
    };

    // 新增共享
    shareHandle = (row)=>{
        let {shareData} = this.state;
        if( shareData.filter((o)=>o['id']==row['id']).length ) return;

        // TODO
        shareData.push(row);
        this.setState({ shareData: shareData })
    }

    // 取消分享
    closeHandle = (row)=>{
        let {shareData} = this.state;
        this.setState({shareData: shareData.filter((o)=>o['id'] != row['id'])});
    }

    // confirm
    confirmHandle = ()=>{
        let that = this;
        let {shareData} = this.state;
        let {rowData} = this.props;
        if(!shareData['length']){
            ServiceTips({text:i18n.t(700102/*请点击共享*/),type:'info'});
            return;
        }

        // TODO
        apiPost(API_FOODING_MAIL,'/box/assign',{collectionName:rowData[0]['collectName'],mailId:rowData[0]['id'],toAddressList:shareData.map(o=>o['localName'])},
            (response)=>{
                ServiceTips({text:response.message,type:'success'});
                that.cancelHandle();
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
    }

    // cancel
    cancelHandle = ()=>{
        this.props.cancelHandle();
    }

    // getPage
	getPage = (search)=>{
        let that = this;
        let {searchHeader} = this.state;
        this.setState({searchHeader: search || searchHeader},function(){
            apiGet(API_FOODING_DS,'/staff/mail/getPage',Object.assign({pageSize: that.state.pageSize,currentPage: that.state.currentPage},that.state.searchHeader),
                (response)=>{
                    that.setState({
                        record: response.data || [],
                        totalPages: response.totalPages,
                        currentPage: response.currentPage
                    });
                },(errors)=>{
                    ServiceTips({text:errors.message,type:'error'});
            });
        });
	}

    render(){
        let that = this;
        let {record, shareData} = this.state;
        let {showDialog,searchData} = this.props;


        return  <div>
                <ShareHeadForm searchData={searchData} getPage={this.getPage}/>
                <Table
                    columns={this.columns}
                    data={record}
                    checkboxConfig={{show:false}}
                    scroll={{x:true,y:130}}
                />
                <div className="sharePagination">
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
                </div>
                { shareData['length'] ?
                    <p className="shareAffix">
                            {shareData.map((o,i)=><span key={i} className="font-hide" title={o['localName']}>{o['localName']}<i onClick={this.closeHandle.bind(this,o)} className="glyphicon glyphicon-remove"></i></span>) }
                    </p>
                    :
                    ''
                }
                <ButtonDIV confirmHandle={this.confirmHandle} cancelHandle={this.cancelHandle}/>
        </div>
    }
}


export default class Nav extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
            showDialog: false,
            rowData: {}, // 行数据
            recordFolder: [], // 文件夹 列表

            shareBtn: this.props.shareToggle || 'get', // 共享按钮
        }
    }


	componentDidMount(){
    };

    // cancelHandle
    cancelHandle = ()=>{
        this.setState({showDialog: false});
    }

    // 全部回复
    replyAllHandle = ()=>{
        let row = commonOnlyRow(this.props.replyAllHandle())[0];
        row && window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,{type:'replyall',collectionName:row['collectName'],mailId:row['id']},{refresh: true});
    }

    // 回复
    replyHandle = ()=>{
        let row = commonOnlyRow(this.props.replyHandle())[0];
        row && window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,{type:'reply',collectionName:row['collectName'],mailId:row['id']},{refresh: true});
    }

    // 转发
    forwardMailHandle = ()=>{
        let row = commonOnlyRow(this.props.forwardMailHandle())[0];
        row && window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,{type:'forward',collectionName:row['collectName'],mailId:row['id']},{refresh: true});
    }

    // 群发邮件  转发
    forwardMailMassHandle = ()=>{
        let row = commonOnlyRow(this.props.forwardMailMassHandle())[0];
        let {loginMessageNow} = this.props;
        row && window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,{type:'masscopy',collectionName:loginMessageNow['email'],mailId:row['id']},{refresh: true});
    }
    

    // 重新发送
    resendHandle = ()=>{
        let row = commonOnlyRow(this.props.resendHandle())[0];
        row && window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,{type:'resend',collectionName:row['collectName'],mailId:row['id']},{refresh: true});
    }

    // 重新编辑
    editHandle = ()=>{
        let row = commonOnlyRow(this.props.editHandle())[0];
        row && window.navTabs.open(i18n.t(700006/*写邮件*/),`/email/write`,{type:'rewrite',collectionName:row['collectName'],mailId:row['id']},{refresh: true});
    }

    // 删除
    deleteHandle = ()=>this.props.deleteHandle();

    // 共享
    shareHandle = ()=>{
        let row = this.props.shareHandle();
        if(!commonOnlyRow(row)) return;

        // TODO
        this.setState({showDialog: true, rowData: row});
    }

    // 彻底删除
    destroyHandle = ()=>this.props.destroyHandle();

    // 恢复
    recoverHandle = ()=>this.props.recoverHandle();

    // 移动到收件箱
    moveInboxHandle = ()=>this.props.moveInboxHandle();

    // 标记
    signHandle = (e)=>this.props.signHandle(e['key']);

    // 文件夹移动
    moveHandle = (e)=>this.props.moveHandle(e['key']);

    // 切换 共享记录
    shareRecordHandle = (e)=>{
        this.setState({shareBtn:e.target['value']});
        this.props.shareRecordHandle(e.target['value'])
    }

    // 写群邮件
    batchMailHandle = (row)=>{
        window.navTabs.open(i18n.t(700103/*写群邮件*/),`/email/masswrite`,{},{refresh: true});
    }

    // 展开文件夹
    folderHandle = (result)=>{
        if(!result) return;

        let that = this;
        let {loginMessageNow} = this.props;
        apiGet(API_FOODING_MAIL,'/getFolders',{email: loginMessageNow['email']},
            (response)=>{
                that.setState({
                    recordFolder: response.data || [],
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
    }


    render(){
        let {shareBtn,showDialog,rowData,recordFolder} = this.state;
        let {searchOFF,searchData,searchScope,Nosearch,getPage,batchMailHandle, shareRecordHandle, moveInboxHandle, recoverHandle, destroyHandle, replyAllHandle,
            replyHandle, deleteHandle, forwardMailHandle, forwardMailMassHandle, shareHandle, signHandle, moveHandle, resendHandle, editHandle,keyvalue} = this.props;
        // 标记 下拉
        const menuSign = (
            <Menu onClick={this.signHandle}>
                <Menu.Item key="read">{i18n.t(700104/*已读邮件*/)}</Menu.Item>
                <Menu.Item key="unread">{i18n.t(700105/*未读邮件*/)}</Menu.Item>
            </Menu>
        );

        const menuMove = (
            <Menu onClick={this.moveHandle}>
                {
                    this.props.caogao?<Menu.Item key={"TRASH"}>{i18n.t(700011/*垃圾箱*/)}</Menu.Item>:''
                }
                <Menu.Item key={this.props.isLishi ? null:"TRASH"}>{this.props.isLishi?i18n.t(700012/*历史邮件*/):i18n.t(700011/*垃圾箱*/)}</Menu.Item>
                <Menu.Divider />
                { recordFolder.map((o,i)=><Menu.Item key={o['id']} className={'font-hide'}>{o['name']}</Menu.Item>) }
            </Menu>
        );
        
        return <nav>
            { editHandle ? <Button onClick={this.editHandle} style={{ marginRight: 8 }} >{i18n.t(700106/*重新编辑*/)}</Button> :''}
            { replyAllHandle ? <Button onClick={this.replyAllHandle} style={{ marginRight: 8 }} >{i18n.t(700107/*全部回复*/)}</Button> :''}
            { replyHandle ? <Button onClick={this.replyHandle} style={{ marginRight: 8 }}>{i18n.t(300057/*回复*/)}</Button> :''}
            { deleteHandle ? <Button onClick={this.deleteHandle} style={{ marginRight: 8 }}>{i18n.t(100437/*删除*/)}</Button> :''}
            { forwardMailHandle ? <Button onClick={this.forwardMailHandle} style={{ marginRight: 8 }}>{i18n.t(300042/*转发*/)}</Button> :''}
            { shareHandle ? <Button ref='share' onClick={this.shareHandle} style={{ marginRight: 8 }}>{i18n.t(700101/*共享*/)}</Button> :''}
            { resendHandle ? <Button onClick={this.resendHandle} style={{ marginRight: 8 }}>{i18n.t(700108/*重发*/)}</Button> :''}
            { destroyHandle ? <Button onClick={this.destroyHandle} style={{ marginRight: 8 }}>{i18n.t(700093/*彻底删除*/)}</Button> :''}
            { recoverHandle ? <Button onClick={this.recoverHandle} style={{ marginRight: 8 }}>{i18n.t(700092/*恢复*/)}</Button> :''}
            { moveInboxHandle ? <Button onClick={this.moveInboxHandle} style={{ marginRight: 8 }}>{i18n.t(700109/*移动到收件箱*/)}</Button> :''}

            { batchMailHandle ? <Button onClick={this.batchMailHandle} style={{ marginRight: 8 }}>{i18n.t(700103/*写群邮件*/)}</Button> :''}
            { this.props.resendClick ? <Button onClick={this.props.resendClick} style={{ marginRight: 8 }}>{i18n.t(200538/*重新发送*/)}</Button> :''}
            { forwardMailMassHandle ? <Button onClick={this.forwardMailMassHandle} style={{ marginRight: 8 }}>{i18n.t(300042/*转发*/)}</Button> :''}



            { shareRecordHandle ?
                <Radio.Group  value={shareBtn} onChange={this.shareRecordHandle}>
                    <Radio.Button value="get">{i18n.t(700110/*共享给我的*/)}</Radio.Button>
                    <Radio.Button value="out">{i18n.t(700111/*我的共享*/)}</Radio.Button>
                </Radio.Group>
                :''
            }


            { signHandle ?
                <Dropdown overlay={menuSign} trigger={['click']}>
                    <Button style={{ marginRight: 8 }}>{i18n.t(700112/*标记为*/)+'...'}<Icon type="down" /></Button>
                </Dropdown>
                :''
            }

            { moveHandle ?
                <Dropdown overlay={menuMove} trigger={['click']} onVisibleChange={this.folderHandle}>
                    <Button style={{ marginRight: 8 }}>{i18n.t(700098/*移动至*/)+'...'}<Icon type="down" /></Button>
                </Dropdown>
                :''
            }
            { !Nosearch ? <Search searchOFF={searchOFF} searchScope={searchScope} searchData={searchData} getPage={getPage} keyvalue={keyvalue}/> : ''}
            <Dialog width={900}  visible={showDialog} title={i18n.t(700101/*共享*/)}>
                <ShareDIV rowData={rowData} getPage={getPage} cancelHandle={this.cancelHandle} />
            </Dialog>
        </nav>
    }
}
