import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';
import Page from '../../../../components/Page';//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层

import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_MAIL,API_FOODING_MAIL_SERVER,API_FOODING_DS, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {FormWrapper} from '../../../../components/Form';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层


import {themeAbb,availHeight,commonRow,commonAjax,NavBtnFunc} from "./Common.js"; // 公共库
import Nav from "./Nav.js"; // nav 导航

import { Menu, Dropdown, Button, Icon, Input, Radio  } from 'antd';


class TagDIV extends Component {

    constructor(props) {
        super(props);
        let that = this;

        // init state
        this.state = {
        }
    }

	componentDidMount(){
    }

	componentWillUnmount() {
	}

    // delete 
    deleteHandle = (mail,address)=>commonAjax({url:'/blacklist/remove',data:{mail:mail,address:address},message:i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/),callBack:this.props.getPage,success:true});

    render(){
        let {data} = this.props;



        return <ul>
            { data['length'] ? '':
                <p>{i18n.t(600051/*无记录！*/)}</p>
            }
            { data.map((o,i)=>
                <li key={i}>
                    <span className="font-hide" title={o['addressSet']}>{o['addressSet']}</span>
                    <i onClick={this.deleteHandle.bind(this,o['email'],o['addressSet'])} className="foddingicon foddingicon fooding-delete_icon2" title={i18n.t(100437/*删除*/)}></i>
                </li>
            )}
        </ul>
    }
}


export default class PageNow extends Component {

    constructor(props) {
        super(props);
        let that = this;

        // init state
        this.state = {
            searchData: {}, // 搜索数据
            currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			color: '',	// 颜色过滤
			followMark: false, // 过滤收藏
            record: [], // table data

            scroll: availHeight-100,    // table 高度
            rodalShow:false,

        }

    }


	componentDidMount(){
		this.getPage();
    };
	componentWillUnmount() {
	}

	// 页面 刷新
	getPage = (search)=>{
        let that = this;
        let {searchData,pageSize, currentPage} = this.state;
        let {loginMessageNow} = this.props;

        function Ajax(data={}){
            apiGet(API_FOODING_MAIL,'/blacklist/getList',Object.assign({email:loginMessageNow['email'],pageSize:pageSize,currentPage:currentPage},that.state.searchData,data),
                (response)=>{
                    that.setState({
                        record: []
                    },function(){
                        that.setState({
                            record: response.data.data || [],
                            totalPages: response.data.totalPages,
                            currentPage: response.data.currentPage
                        });
                    });
                },(errors)=>{
                    ServiceTips({text:errors.message,type:'error'});
            });            
        }

        if(search){
            this.setState({searchData:search},function(){
                Ajax({currentPage:1});
            });
        } else{
            Ajax();          
        }        

	}   




    render(){
        let that = this;
        let {searchData,record,scroll,rowData} = this.state;
        let {loginMessageNow} = this.props;

        return <div className="mail-list">
            <Nav
                searchOFF={true} // 关闭高级搜索
                searchScope={i18n.t(100229/*邮箱*/)} // define 提示信息
                searchData={searchData}
                loginMessageNow={loginMessageNow}
                getPage={this.getPage}
                //recoverHandle={this.recoverHandle} // 重新发送
            />
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
            <div className="blacklist scroll" style={{overflowY:'auto',height:scroll+35}}>
                <TagDIV data={record} getPage={this.getPage}/>
            </div>
            <Dialog visible={this.state.rodalShow} title={i18n.t(200087/*预览*/)} width={'80%'}>

            </Dialog>
        </div>
    }
}
