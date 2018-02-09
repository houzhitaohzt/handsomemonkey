/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';
import xt from '../../../../common/xt'

let defaultAvatar = require('../../assets/default.png');

import {API_FOODING_ES, API_FOODING_DS, API_FOODING_MESSAGE,apiGet, apiPost} from "../../../../services/apiCall";
import ServiceTips, {errorTips} from "../../../../components/ServiceTips";

import TipCard from "./TipCard";


export default class extends React.PureComponent {

    constructor (props) {
        super(props);

        this.state = {
            navAry: [ ],
            dataList : [ ]
        }
    }

    //拉取部门
    getContant = parentId => {
        apiGet(API_FOODING_ES,'/party/getChildren',{parentId:parentId},response => {
            let dataList = response.data || [];
            this.setState({dataList})
        },error => {})
    };

    //点击一次请求数据
    onSelectClick = (item, navAry) => {
        let that = this;
        if(!item.id) return false;
        apiGet(API_FOODING_ES,"/staff/getStaffsMsgList",{partyId:item.id},response => {
            let dataList= response.data || [];
            that.setState({dataList,navAry});
        },error => ServiceTips({text:error.message,type:'error'}))
    };

    componentWillReceiveProps(props) {
        let {item} = props;
        let thItem = this.props.item || {};
        if(!item) return;
        if(item.type == 1 && item.type !== thItem.type){//表示点击的是集团
            this.setState({ navAry: [{localName:item.localName}]});
        }else if(item.type.length >= 3 && item.type !== thItem.type){//表示点击的集团下公司
            this.setState({ navAry: [{localName:item.parent.localName,id:item.id,level:"second"}]},this.getContant(item.id));
        }else if(item.type == 12 && item.type !== thItem.type){//表示点击的是最近连续人
            this.setState({navAry:[{localName:item.localName}],dataList:[]})
        }else if(item.type == 13 && item.type !== thItem.type){//表示点击的是 我的群组
            this.setState({navAry:[{localName:item.localName}],dataList:[]})
        }
    }

    renderTitle = ()=> {
        let { item } = this.props;
        item = item.parent || item;
        return (
            <div className='im-concat-container-title' >
                <div><span className='noLineFeed'>{item.localName}</span></div>
            </div>
        )
    };

    renderNav = ()=> {
        let { navAry } = this.state;
        let navLen = navAry.length;
        return (
            <div className='im-concat-container-nav'>
                {
                    navAry.map((da, index) =>
                        <span key={index} className={index < navLen - 1?'active': ''} onClick={this.onNavClick.bind(this, da, index)}>
                            {da.localName || da}{ navLen > 1 && index < navLen -1? <span>{'>'}</span>: ''}
                        </span>
                    )
                }
            </div>
        );
    };

    //导航栏的点击事件
    onNavClick = (data, index)=> {
        //总是点击最后一级, 不用请求数据
        if(data.id == this.state.navAry[this.state.navAry.length - 1].id) return false;

        if(data.level && data.level == "second"){
            let navAry = this.state.navAry.splice(0, index + 1);
            this.setState({navAry},() => this.getContant(data.id))
        }else{
            return false;  //点击最后一层的时候,不用请求数据
            //this.onSelectClick(data,navAry);
        }
    };

    onItemClick = (item)=> {
        if(JSON.stringify(Object.assign({},item.entity)) !== '{}'){//最后一级
            return false;
            this.props.openMessage(item.entity || {});
        } else  {
            let navAry = Array.from(this.state.navAry);
            navAry.push(item);
            this.onSelectClick(item,navAry);
        }
    };

    //mailComeTo点击发消息
    mailComeTo = item => {
        this.props.openMessage(item || {});
    };

    renderItem = (item, index)=> {
        if(item.children && item.children.length ){
            return (<div key={index} className='im-concat-container-item' onClick={this.onItemClick.bind(this, item)}>
                { this.renderCompany(item) }
            </div>)
        }else if( !(item.children && item.children.length) && JSON.stringify(Object.assign({},item.entity)) === '{}') {
            return (<div key={index} className='im-concat-container-item' onClick={this.onItemClick.bind(this, item)}>
                { this.renderSection(item) }
            </div>)
        }else if(!(item.children && item.children.length) && JSON.stringify(Object.assign({},item.entity)) !== '{}'){
            return <TipCard data={item.entity} mailComeTo={this.mailComeTo} key={index}/>;
        }
    };

    renderCompany = (item) => {
        return (
            <div className='im-concat-container-item-s'>
                <span className='noLineFeed'>{item.localName}</span>
            </div>
        );
    };

    renderSection = ( item )=> {
        return (
            <div className='im-concat-container-item-s'>
                <span className='noLineFeed'>{item.localName}</span>
                {/*<span className='noLineFeed'>44人</span>*/}
            </div>
        );
    };

    renderConcat = ( item )=> {
        return (<TipCard data={item.entity || {} } mailComeTo={this.mailComeTo}/>)
        /*return (
            <div className='im-concat-container-item-c'>
                <img className='im-avatar' src={defaultAvatar}/>
                <span className='noLineFeed'>{item.entity && item.entity.localName?item.entity.localName:""}</span>
            </div>
        )*/
    };

    render() {
        let { item } = this.props;
        if( !item ) return null;
        item = item.parent || item;
        return (
            <div className='im-concat-container'>
                { this.renderTitle() }
                { item.type === 1 && this.renderNav() }
                <div className='scroll im-concat-container-list'>
                    {
                        this.state.dataList.map(this.renderItem)
                    }
                </div>
            </div>
        );
    }
}
