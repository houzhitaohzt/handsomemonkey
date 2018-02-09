import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import Dialog from '../../../../components/Dialog';
import FilterHead from './Filter';
import Table  from '../../../../components/Table';
import Page from "../../../../components/Page";
import Tabs from "../../Tabs";
import {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import {permissionsBtn,apiGet, apiPost, apiForm, API_FOODING_ES} from '../../../../services/apiCall';
import Detail from './detail';
import Message from '../../../../lib/message';
import {emitter} from '../../../../common/EventEmitter';
import {ClipTip} from '../../../../components/Tip';

export default class extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.columns = [{
			title : i18n.t(200754/*发信人*/),
			dataIndex : 'sentStaffName',
			key : "sentStaffName",
			width : '15%',
			render(data,row,index){
				return (<div title={data}>{data}</div>)
			}
		},{
			title : i18n.t(200041/*内容*/),
			dataIndex : "text",
			key : "text",
			width : "40%",
			render(data,row,index){
			    let title = <div dangerouslySetInnerHTML={{__html: data}} onClick={that.readerMessage.bind(that, row)}/>;
			    // return title;
                return <ClipTip placement="topLeft" title={title} mouseEnterDelay={0.4}>{title}</ClipTip>;
			}
		},{
			title : i18n.t(200753/*重要级别*/),
			dataIndex : "level",
			key : "level",
			width : "11%",
			render(data,row,index){
				return String(data) === '1'? i18n.t(200768/*普通*/): "重要";
			}
		},{
            title : i18n.t(100230/*状态*/),
            dataIndex : "messageStatus.name",
            key : "messageStatus.name",
            width : "10%",
            ignore_equals: true,
            render(data,row,index){
                return data;
            }
        },{
			title : i18n.t(200756/*日期*/),
			dataIndex : "scheduleSendTime",
			key : "scheduleSendTime",
			width : "16%",
			render(data,row,index){
				return (<div>{new Date(data).Format('yyyy-MM-dd hh:mm:ss')}</div>)
			}
		}];
        this.filterData = {};
		this.state ={
            dialogContext: null,
            visible: false,
            title: '',
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
			data:[]
		};
	}

    getPages = (currentPage, size, filter, order) => {
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let status = this.props.params.type === "1"? 2: 3;
        let params = Object.assign({status}, {currentPage: currentPage, pageSize: size}, filter, this.filterData);
        apiGet("/fooding-message", '/message/all/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                data: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, error => {
            errorTips(error.message)
        });
    };

    searchCustomer = () => {
        this.getPages();
    };

    componentDidMount() {
        this.getPages();
        // emitter.on("fetchMessageCountStream", ()=>this.getPages());
    }

    componentWillUnmount() {
        // emitter.off('fetchMessageCountStream');
    }

    componentWillReceiveProps(props, state) {
        if(props.router.location.pathname !== props.location.pathname){
            this.getPages();
        }
    }

    onRowDoubleClick = (record, index, checked) => {
        //this.readerMessage(record);
        // this.setState({
        //     dialogContext: <Detail onCancel={this.onCancel} record={record}/>,
        //     title: i18n.t(200770/*消息详情*/),
        //     visible: true
        // });

    };

    readerMessage = (record)=>{
        if(this.props.params.type === '1'){
            Message.markMessageReaded(record.id);
            record.messageStatus = {
                id: 3, name: i18n.t(200769/*已读*/)
            }
        }
    };

    onCancel = ()=>{
        this.setState({visible: false});
    };

    render(){
        let {page} = this.state;
		return (<div className='message' style={{paddingRight:0}}>
			  <Tabs />
			  <div style={{flex:1}}>
                  <FilterHead searchCustomer={ this.searchCustomer} formCall={form => this.searchForm = form}/>
			 	<div className="contact-body" style = {{height:document.body.offsetHeight - 155}}>
                    <Page totalPages={page.totalPages}
                          currentPage={page.currentPage}
                          totalRecords={page.totalRecords}
                          sizeList={[20, 50, 200]}
                          currentSize={page.size}
                          pageSizeChange={(value) => {
                              let {page} = this.state;
                              if (page.size == value) {
                                  return;
                              }
                              this.getPages(1, value);
                          }} backClick={(v) => {
                        let {page} = this.state;
                        if (page.currentPage == v) {
                            return;
                        }
                        this.getPages(v);
                    }} nextClick={(v) => {
                        let {page} = this.state;
                        if (page.currentPage == v) {
                            return;
                        }
                        this.getPages(v);
                    }}
                          goChange={(v) => {
                              let {page} = this.state;
                              if (page.currentPage == v) {
                                  return;
                              }
                              this.getPages(v);
                          }}
                    />
				<div className="action-contact-buttons">
					<Table
							columns={this.columns}
							scroll={{x:true,y:document.body.offsetHeight - 200}}
							data={this.state.data}
							checkboxConfig={{show:false}}
							colorFilterConfig={{show : false}}
							followConfig={{show:false}}
							style={{width:'100%'}}
                            onRowDoubleClick={this.onRowDoubleClick}
					/>
				</div>
				</div>
			 </div>
            <Dialog width={926} visible={this.state.visible} title={this.state.title}>
                {this.state.dialogContext}
            </Dialog>
		</div>)
	}

}
