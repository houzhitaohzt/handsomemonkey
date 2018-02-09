import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';

import Dialog from '../../../../components/Dialog/Dialog';//弹层
import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_MAIL, API_FOODING_ERP, language, pageSize, sizeList} from '../../../../services/apiCall';
import Calendar from  '../../../../components/Calendar/Calendar';

import ServiceTips from '../../../../components/ServiceTips';
import Table from '../../../../components/Table';//Table表格
import Page from '../../../../components/Page';//分页
import Select, {ConstVirtualSelect,Option } from '../../../../components/Select'; // 下拉
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {createForm,FormWrapper} from '../../../../components/Form';
import { Menu, Dropdown, Button, Icon, Input  } from 'antd';
import {ButtonDIV} from "./Common.js"; // 公共库
/**
 * 邮件归档ERP连接
 */
var signsUrl={
		323: {
		    name: i18n.t(200685/*市场活动详情*/),
            url: 'marke/detail?id='
        },
		301: {
		    name: i18n.t(200250/*商机详情*/),
            url: 'businessOpportunity/detail?id=' //有问题的
        },
		307: {
		    name: i18n.t(201019/*销售报价详情*/),
            url: 'quotation/detail?id='
        },
		939: {
		    name: i18n.t(200170/*销售样品单详情*/),
            url: 'samporder/detail?id='
        },
		318: {
		    name: i18n.t(200962/*销售订单详情*/),
            url: 'salesorder/detail?id='
        },
		350: {
		    name: i18n.t(200370/*物流订单详情*/),
            url: 'booking/detail?id='
        },
		338: {
		    name: i18n.t(200990/*采购订单详情*/),
		    url: "pruchaseorder/detail?id="
        }
};

// 查找 页面
class SearchDIV extends Component {

    constructor(props) {
        super(props);

        // state init 
        this.state = {
          
        };
    }

    // confirm
    searchHandle = ()=>{
        this.props.form.validateFields((errors, value) =>this.props.getPage({active:this.props.active,searchData:value}));
    }

    // 清空
    resetHandle = ()=>{
        this.props.form.resetFields(); // 清除表单
        this.props.getPage({active:this.props.active});
    }


    render(){
        let {active} = this.props;
		let {getFieldProps,getFieldValue,getFieldError} = this.props.form;


        return <div className="col-md-10">
            { (active == 'business') || (active == 'offer') || (active == 'market') ? // 商机|报价单|销售订单
                <div className="col-md-3">
                    <label className="col-md-4">{i18n.t(100311/*客户*/)}</label>
                    <ConstVirtualSelect 
                        style={{width:"160px"}}
                        fieldName="salBeId"
                        form={this.props.form} 
                        apiType={apiGet}
                        apiUri={`/customer/search`} 
                        async={true}
                        apiParams='keyword'                            
                        valueKeys={ da => ({
                            salBeId: da.id,
                            basSpeci: da.specTxt,
                            s_label: da.localName
                        })}
                    />
                </div>
                :'' 
            }

            { active == 'shipping' ? // 订舱单
                <div className="col-md-3">
                    <label className="col-md-4">{i18n.t(100299/*货代公司*/)}</label>
                        <ConstVirtualSelect 
                            style={{width:"160px"}}                            
                            fieldName="forwarderBeId" 
                            form={this.props.form} 
                            apiParams={{obj:'com.fooding.fc.ds.entity.AgnShipBe'}}
                            apiType={apiPost} 
                            valueKeys={da => ({
                                forwarderBeId: da.id,
                                basSpeci: da.specTxt,
                                s_label: da.localName
                            })}
                        />                    
                </div>
                :'' 
            }           
            
            { active == 'purchase' ? // 供应商 
                <div className="col-md-3">
                    <label className="col-md-4">{i18n.t(100312/*供应商*/)}</label>
                    <ConstVirtualSelect 
                        style={{width:"160px"}}                        
                        fieldName="vndBeId" 
                        form={this.props.form} 
                        apiType={apiPost}
                        apiUri={`/enterprise/search?dataTyId=40`} 
                        async={true}
                        apiParams='keyword'                            
                        valueKeys={ da => ({
                            vndBeId: da.id,
                            basSpeci: da.specTxt,
                            s_label: da.localName
                        })}
                    />                                      
                </div>
                :'' 
            } 
            { active == 'business' ? 
                <div className="col-md-2">
                    <label>{i18n.t(100304/*主题*/)}&nbsp;&nbsp;</label>
                    <input 
                        style={{width:'120px',marginTop:"-8px"}}
                        className={'text-input-filter-header'}
                        {...getFieldProps('theme', {
                            initialValue:''
                        })} 
                    />
                </div>:''             
            }
            { active == 'business' ? 
                <div className="col-md-2">
                    <label>{i18n.t(400049/*业务状态*/)}&nbsp;&nbsp;</label>
                    <ConstVirtualSelect
                        form={this.props.form}
                        style={{width:100,marginTop:"-8px"}}
                        isRequest={false}
                        fieldName="status"
                        initValueOptions={[
                            {id: '5', name: i18n.t(200258/*已提交*/)},
                            {id: '15', name: i18n.t(200259/*开启*/)},
                            {id: '20', name: i18n.t(100432/*关闭*/)}
                        ]}
                    />
                </div>:''             
            }
            <div className="col-md-5">
                <label className={'col-md-2'}>{i18n.t(100323/*业务日期*/)}</label>
                <div className="col-md-10">
                    <Calendar
                        showTime={false}
                        width={130}
                        isShowIcon={true}
                        form={this.props.form}
                        padding={"3px 10px 4px"}
                        name={'startDate'}
                    />
                    &nbsp;-&nbsp;
                    <Calendar
                        showTime={false}
                        width={130}
                        form={this.props.form}
                        isShowIcon={true}
                        padding={"3px 10px 4px"}
                        name={'endDate'}
                    />
                    <i onClick={this.searchHandle} style={{position:'relative',top:'4px',padding:'3px 10px',fontSize:'15px',cursor:'pointer'}} className="foddingicon fooding-search_icon" title={i18n.t(700023/*查找*/)}></i>
                    <i onClick={this.resetHandle} style={{position:'relative',top:'4px',padding:'3px 10px',fontSize:'15px',cursor:'pointer'}} className="foddingicon fooding-clean_icon" title={i18n.t(700024/*清空*/)}></i>
                </div>
            </div>
        </div>
    }
}
let SearchDivForm = createForm()(SearchDIV);













// 归档
class ArchiveDIV extends Component {

    constructor(props) {
        super(props);
        let that = this;

        // init state
        this.state = {
            currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
            searchData:{}, // 搜索条件

            record: [], // tabel list
            shareData: [], // 归档的人
            tablechange: 'business', // change table
            search:{active:'business'}
        }

        // table 商机 list
		this.businessColumns = [{
			title : i18n.t(700025/*编号*/),
			dataIndex : 'no',
			key : "no",
			width : '8%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100304/*主题*/),
			dataIndex : "theme",
			key : "theme",
			width : "16%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100311/*客户*/),
			dataIndex : "salBe"+language,
			key : "salBe"+language,
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : "status",
			key : "status",
			width : "7%",
			render(data,row,index){
				return (<div className="text-ellipsis">{row['statusName']}</div>);
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "7%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis"><a onClick={that.shareHandle.bind(that,that.state.tablechange,row)} href="javascript:;">{i18n.t(700071/*归档*/)}</a></div>);
			}
		}];

        // table 报价单 list
		this.offerColumns = [{
			title : i18n.t(700025/*编号*/),
			dataIndex : "no",
			key : "no",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100311/*客户*/),
			dataIndex : "salBe"+language,
			key : "salBe"+language,
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "7%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis"><a onClick={that.shareHandle.bind(that,that.state.tablechange,row)} href="javascript:;">{i18n.t(700071/*归档*/)}</a></div>);
			}
		}];

        // table 销售订单 list
		this.marketColumns = [{
			title : i18n.t(700025/*编号*/),
			dataIndex : "no",
			key : "no",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title :i18n.t(100311/*客户*/),
			dataIndex : "salBe"+language,
			key : "salBe"+language,
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "7%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis"><a onClick={that.shareHandle.bind(that,that.state.tablechange,row)} href="javascript:;">{i18n.t(700071/*归档*/)}</a></div>);
			}
		}];

        // table 订舱单 list
		this.shippingColumns = [{
			title : i18n.t(700025/*编号*/),
			dataIndex : "no",
			key : "no",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100299/*货代公司*/),
			dataIndex : "forwarderBe"+language,
			key : "forwarderBe"+language,
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "7%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis"><a onClick={that.shareHandle.bind(that,that.state.tablechange,row)} href="javascript:;">{i18n.t(700071/*归档*/)}</a></div>);
			}
		}];

        // table 采购订单 list
		this.purchaseColumns = [{
			title : i18n.t(700025/*编号*/),
			dataIndex : "no",
			key : "no",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100312/*供应商*/),
			dataIndex : "vndBe"+language,
			key : "vndBe"+language,
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "7%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis"><a onClick={that.shareHandle.bind(that,that.state.tablechange,row)} href="javascript:;">{i18n.t(700071/*归档*/)}</a></div>);
			}
		}];
		this.changeHandle = this.changeHandle.bind(this);
    }

	componentDidMount(){
        // let {shareData} = this.state;
        let {shareData} = this.props||[];
		this.getPage();

        // if(!row['bills']) return;
        // let list = Object.entries(row.bills).map((o)=>{
        //     let data = o[1];
        //     switch (data['billType']) {
        //         case 301: // 商机
        //             return {active:'business',ident:'BS',value:data['billTitle']};
        //         break;
        //         case 307: // 报价单
        //             return {active:'offer',ident:'OF',value:data['billNo']};
        //         break;
        //         case 318: // 销售订单
        //             return {active:'market',ident:'SC',value:data['billNo']};
        //         break;
        //         case 350: // 订舱单
        //             return {active:'shipping',ident:'LS',value:data['billNo']};
        //         break;
        //         case 338: // 采购订单
        //             return {active:'purchase',ident:'PC',value:data['billNo']};
        //         break;
        //         default:
        //             break;
        //     }
        // });

        this.setState({shareData: shareData});
    };

    // 新增归档
    shareHandle = (active,record,e)=>{
        e.stopPropagation();
        e.preventDefault();

        let {shareData} = this.state;
        let {row} = this.props;
        let that = this;

        switch (active) {
            case 'business': // 商机
                var now = {active:active,ident:'BS',value:record['theme']};
                var data = {billType:301};
            break;
            case 'offer': // 报价单
                var now = {active:active,ident:'OF',value:record['no']};
                var data = {billType:307};
            break;
            case 'market': // 销售订单
                var now = {active:active,ident:'SC',value:record['no']};
                var data = {billType:318};
            break;
            case 'shipping': // 订舱单
                var now = {active:active,ident:'LS',value:record['no']};
                var data = {billType:350};
            break;
            case 'purchase': // 采购订单
                var now = {active:active,ident:'PC',value:record['no']};
                var data = {billType:338};
            break;
            default:
                break;
        }

        // TODO
        apiPost(API_FOODING_MAIL,'/box/bindBill',Object.assign({},{billTitle:record['theme'],billId:record['billId'],billNo:record['no'],mailAddress:row['collectName'],mailId:row['id']},data),
        (response)=>{
            that.setState({shareData: Array.of(...shareData.filter(o=>o['ident']!=now['ident']),now)});
            ServiceTips({text:response.message,type:'success'});
        },(errors)=>{
            ServiceTips({text:errors.message,type:'error'});
        });

    }

    // 取消分享
    closeHandle = (option,e)=>{
        let {shareData} = this.state;
        let {row} = this.props;
        let that = this;

        switch (option['active']) {
            case 'business': // 商机
                var data = {billType:301};
            break;
            case 'offer': // 报价单
                var data = {billType:307};
            break;
            case 'market': // 销售订单
                var data = {billType:318};
            break;
            case 'shipping': // 订舱单
                var data = {billType:350};
            break;
            case 'purchase': // 采购订单
                var data = {billType:338};
            break;
            default:
                break;
        }


        apiPost(API_FOODING_MAIL,'/box/unbindBill',Object.assign({},{mailAddress:row['collectName'],mailId:row['id']},data),
        (response)=>{
            ServiceTips({text:response.message,type:'success'});
            that.setState({shareData: shareData.filter((o)=>o['ident'] != option['ident'])});
            //that.setState({shareData: that.props.getList()});
        },(errors)=>{
            ServiceTips({text:errors.message,type:'error'});
        });

    }

    // changeHandle
    changeHandle(key){
        let that = this;
        let {searchData} = this.state;

        this.setState({searchData:{},search:{active: key}},function(){
            that.getPage({active: key});
        });
    }
    // cancel
    cancelHandle = (e)=>{
        // e.stopPropagation();
        // e.preventDefault();
        this.props.cancelHandle && this.props.cancelHandle();
    }

    // getPage
	getPage = (searc)=>{
        let that = this;
        let {searchData} = this.state;
		let search = searc || this.state.search;
		let currentPage = searc ? 1:that.state.currentPage;

        switch (search['active']) {
            case 'business': // 商机
                var URL = '/business/getPage';
            break;
            case 'offer': // 报价单
                var URL = '/saleoffer/getPage';
            break;
            case 'market': // 销售订单
                var URL = '/saleorder/getPage';
            break;
            case 'shipping': // 订舱单
                var URL = '/shipping/getPage';
                var data = {orderType:20};
            break;
            case 'purchase': // 采购订单
                var URL = '/purorder/getPage';
                var data = {orderType:20};
            break;
            default:
                var URL = '/business/getPage';
                break;
        }

        this.setState({tablechange: search['active'] || 'business',record: [],searchData: searc ? searc['searchData']:searchData},function(){
            apiGet(API_FOODING_ERP,URL,Object.assign({pageSize: that.state.pageSize,currentPage:currentPage},data,that.state.searchData),
                (response)=>{
                    that.setState({
                        record: response.data.data || [],
                        totalPages: response.data.totalPages,
                        currentPage: response.data.currentPage,
                    });
                },(errors)=>{
                    ServiceTips({text:errors.message,type:'error'});
            });
        });

	}

    // stopPropagation
    stopPropagation = (e)=>{
        e.stopPropagation();
        e.preventDefault();
    }

    // 双击  
    doubleHandle = (row)=>{
        let {tablechange} = this.state;
        let ID = row['billId'];

        switch (tablechange) {
            case 'business': // 商机
                window.navTabs.open(i18n.t(200250/*商机详情*/),`/businessOpportunity/detail`,{id:ID},{refresh:true});
            break;
            case 'offer': // 报价单
                window.navTabs.open(i18n.t(201019/*销售报价详情*/),`/quotation/detail`,{id:ID},{refresh:true});                
            break;
            case 'market': // 销售订单
                window.navTabs.open(i18n.t(200962/*销售订单详情*/),`/salesorder/detail`,{id:ID},{refresh:true});            
            break;
            case 'shipping': // 物流订单
                window.navTabs.open(i18n.t(200370/*物流订单详情*/),`/booking/detail`,{id:ID},{refresh:true});            
            break;
            case 'purchase': // 采购订单
                window.navTabs.open(i18n.t(200990/*采购订单详情*/),`/pruchaseorder/detail`,{id:ID},{refresh:true});            
            break;                                            
            default:
                break;
        }
       
    }

    render(){
        let that = this;
        let {search,record,shareData,tablechange} = this.state;
        let {showDialog} = this.props;

        return(<div className={'noohle-email'}>
					<FormWrapper showFooter={true} showSaveClose={false} onCancel={this.cancelHandle}>
						<div className='archive'>
                            <div className="girdlayout">
                                <div className="row">
                                    <div className="col-md-2">
                                        <Select
                                            placeholder={i18n.t(100321/*商机*/)}
                                            optionLabelProp="children"
                                            optionFilterProp="children"
                                            className ={'currency-btn select-from-currency col-md-12'}
                                            showArrow={false}
                                            allowClear={false}
                                            onChange={this.changeHandle}
                                        >
                                            <Option key={0} value={'business'} title={i18n.t(100321/*商机*/)}>{i18n.t(100321/*商机*/)}</Option>
                                            <Option key={1} value={'offer'} title={i18n.t(100583/*报价单*/)}>{i18n.t(100583/*报价单*/)}</Option>
                                            <Option key={2} value={'market'} title={i18n.t(200237/*销售订单*/)}>{i18n.t(200237/*销售订单*/)}</Option>
                                            <Option key={3} value={'shipping'} title={i18n.t(200373/*物流订单*/)}>{i18n.t(200373/*物流订单*/)}</Option>
                                            <Option key={4} value={'purchase'} title={i18n.t(400020/*采购订单*/)}>{i18n.t(400020/*采购订单*/)}</Option>
                                        </Select>
                                    </div>                                    
                                    <SearchDivForm active={search['active']} getPage={this.getPage}/>
                                </div>                                
                            </div>  
                            { shareData.length >0 ?
                                    <div className="heard">
                                    <p className="archiveAffix">
                                        {shareData.map((o,i)=><span key={i} className="font-hide" title={o['value']}><b>{o['ident']}</b>{o['value']}<i onClick={this.closeHandle.bind(this,o)} className="glyphicon glyphicon-remove"></i></span>) }
                                    </p>
                                    </div>
                                    :
                                    ''
                            }                                              
							<Table
									columns={this[tablechange+'Columns']}
									data={record}
									checkboxConfig={{show:false}}
									scroll={{x:true,y:150}}
                                    onRowDoubleClick={(row)=> that.doubleHandle(row)}
                            />
							<div className="archivePagination">
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
                        </div>
                    </FormWrapper>
				</div>)

    }
}

class Archive extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
            showDialog: false,  // show dialog
            showMenu: false, // show Menu
            shareData: [], // 归档 list
            row: {}, // 行数据
        }
    }

	componentDidMount(){
        this.getList();
    };

    // 获取 归档列表
    getList = ()=>{
        let {shareData} = this.state;
        let {row} = this.props;

        if(!row['bills']) return;
        let list = Object.entries(row.bills).map((o)=>{
            let data = o[1];
            switch (data['billType']) {
                case 301: // 商机
                    return {active:'business',ident:'BS',value:data['billTitle'],billType:data.billType,billId:data.billId};
                break;
                case 307: // 报价单
                    return {active:'offer',ident:'OF',value:data['billNo'],billType:data.billType,billId:data.billId};
                break;
                case 318: // 销售订单
                    return {active:'market',ident:'SC',value:data['billNo'],billType:data.billType,billId:data.billId};
                break;
                case 350: // 订舱单
                    return {active:'shipping',ident:'LS',value:data['billNo'],billType:data.billType,billId:data.billId};
                break;
                case 338: // 采购订单
                    return {active:'purchase',ident:'PC',value:data['billNo'],billType:data.billType,billId:data.billId};
                break;
                default:
                    break;
            }
        });

        this.setState({shareData: list || []});
        return list;
    }

    // 菜单点击
    signHandle = (o)=>{
        let url = signsUrl[o.billType].url + o.billId;
        window.top.navTabs.open(signsUrl[o.billType].name, url);
    }
    
    // 添加
    addHandle = (e)=>{
        let that = this;
        let {row} = this.props;
        let shareData = this.state.shareData || [];

        this.props.addHandle(<ArchiveDIV shareData={shareData} getList={this.getList} row={row} cancelHandle={this.cancelHandle} />);
    }

    // cancel
    cancelHandle = (e)=>{
        this.props.onCancel();
        this.props.getPage();
    }

    stopPropagation = (e)=>{
        e.stopPropagation();
        e.preventDefault();
    }

    render(){
        let {showDialog,showMenu,row} = this.state;
        let shareData = this.state.shareData || [];
        let {page} = this.props;
        const menu = (
            <Menu>
                { shareData.map((o,i)=>{
                  if(!o) return ;
                  return <Menu.Item key={i}><div onClick={this.signHandle.bind(this,o)}><b><span className="label bac-theme">{o['ident']}</span>&nbsp;</b><span>{o['value']}</span></div></Menu.Item>
                })}
            </Menu>
        );

        return <div className="archive">
            { !page ?
                <div>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button onClick={this.stopPropagation} style={{ marginRight: 8 }}>
                            <span className="label mark bac-theme">

                                <span className="badge">{ shareData['length'] ? shareData['length'] : 0 }</span>
                            </span>
                        </Button>
                    </Dropdown>
                    {this.props.isAdd ?'':<span onClick={this.addHandle} className="label bac-theme" style={{position:'relative',top:'2px'}}>
                      <i className="glyphicon glyphicon-plus"></i> 
                     </span>
                    }
                </div>
                :
                <span onClick={this.addHandle} style={{cursor:'pointer'}} className="label label-info" title={i18n.t(700071/*归档*/)}>{i18n.t(700072/*需要归档*/)}</span>
            }
        </div>

    }
}
export default  NavConnect(Archive);
