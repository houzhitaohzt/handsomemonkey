import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
//引入弹层
import Dialog from "../../../../components/Dialog/Dialog";
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import ServiceTips from '../../../../components/ServiceTips';
import Page from "../../../../components/Page";
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import {apiGet,apiPost,apiForm,API_FOODING_MassMailServer,API_FOODING_MAIL_SERVER, API_FOODING_ERP,language,pageSize,sizeList} from "../../../../services/apiCall";
const {Table} = require("../../../../components/Table");
class MailBox extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addClick = this.addClick.bind(this);
        this.getPage = this.getPage.bind(this);    
        this.deleteClick = this.deleteClick.bind(this);        
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);

        // this state
        this.state = {
            scrollHeight: 0,
            record: [],
            showDilaog: false,
            dialogContent:'',
            title:'',
            
        }        


        this.columns = [{
            title: i18n.t(100244/*企业*/),
            dataIndex: 'ccName',
            key: "ccName",
            width: '35%',
            render(data, row, index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        }, {
            title: i18n.t(200678/*邮件活动类型*/),
            dataIndex: "type",
            key: "type",
            width: "20%",
            render(data, row, index){
                if(data == 'OFFER'){
                    return i18n.t(100451/*推广报价*/);
                }else if(data == 'COMMON'){
                    return i18n.t(200768/*普通*/);
                }else{
                    return i18n.t(200679/*展会*/);
                }
            }
        }, {
            title: i18n.t(600153/*活动*/)+"ID",
            dataIndex: "campaignId",
            key: "campaignId",
            width: "10%",
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(200680/*已使用数*/),
            dataIndex: "mailCount",
            key: "mailCount",
            width: "15%",
            render(data, row, index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        }];

    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        this.getPage();
    };

    componentWillUnmount() {
       window.removeEventListener('resize', this.handleResize);
    }

	// 删除
	deleteClick(react,row){

		let that = this;
		let select = this.refs.product.getSelectArr();

		// 删除 条件判断
        if( select.length == 0 ){
            ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'error'});
           
        } else if( select.length > 1 ){
           ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
           
        }else{
            Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
    			done: () => {
                    apiForm(API_FOODING_MassMailServer,'/campaign/delete',{id: select[0].id}, 
                        (response)=>{	
                            ServiceTips({text:response.message,type:'success'});
                            that.getPage();
                        },(errors)=>{
                            ServiceTips({text:errors.message,type:'error'});
                    });	
    			}
    		});	
        }  
	}



	// 页面 刷新
	getPage(sData=null){
        console.log(sData);
		let that = this;
		if(sData){
			this.setState({sData:sData,currentPage:1},function(){
				ajax();
			});
		} else{
			ajax();		
		}
        
		// 保存 请求
		function ajax(){
            
			apiGet(API_FOODING_MassMailServer,'/campaign/getList',that.state.sData,
				(response)=>{				
					that.setState({	
						record: response.data || [],	
					});
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});	
		}
	}



    onSaveAndClose() {
        this.setState({
            showDilaog: !this.state.showDilaog
        });

    }

    onCancel() {
        this.setState({
            showDilaog: false
        })
    }

    addClick() {
   
		let that = this;
		let content=require('./Add').default;
		let element=React.createElement(content,{getOne:{},onCancel:that.onCancel,onSaveAndClose:that.onSaveAndClose,getPage:that.getPage});
		that.setState({
			showDilaog: true,
			title: i18n.t(100392/*新增*/),
			dialogContent: element
		}) 

         
    }

    handleClick(e, data) {

    }

    onRowDoubleClick(record, index, checked) {

    }

    handleResize(height) {
        let sch = document.body.offsetHeight - 162 - 68;
        let scroll = sch - 80;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
        console.log(scroll);
    }



    render() {
        let {record, page,showDilaog} = this.state;
        let that = this;
 
        return (<div className={'system-mailserver'}>
            <FilterHeader getPage={this.getPage} searchCustomer={ this.searchCustomer} formCall={form => this.searchForm = form}/>
            <div className="content-margin"></div>
            <div className='content-margin'>
                <div className={'system-mailserver-content'}>
                    <div className={'system-mailserver-content-main'} style={{height: this.state.scrollHeight}}>
                        <div className={'keys-pages'}>
                            <FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
                        </div>
                        <Table
                            ref = "product"
                            singleSelect ={true}
                            columns={this.columns}
                            data={record}
                            checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                            scroll={{x:true,y:this.state.scroll}}
                            onHeaderCellClick={this.onHeaderCellClick}
                            onRowClick={this.onRowClick}
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
export default MailBox;
