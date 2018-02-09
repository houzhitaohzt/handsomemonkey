import React, {Component} from "react";
import LanguageMore from "./LanguageMore";
import {API_FOODING_DS, apiGet} from '../../../services/apiCall';

import {Icon, Menu} from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import i18n, {I18n} from "../../../lib/i18n";
import {Link,browserHistory} from 'react-router';

import Dropdown from 'rc-dropdown';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initList: [], //初始化数据
            inputValue: "",  //输入框的值
            searchList: [], //过虑出来的数据
            visible:false
        }
    }

    //初始化数据
    initList = () => {
        let that = this;
        apiGet(API_FOODING_DS, '/fc/portal/dataMulDiv2/getAllDataTree', {}, response => {
            let initList = response.data || [];
            that.setState({initList});
        })
    };
    //搜索框的改变
    oninputChange = e => {
        let that = this;
        let value = e.target.value;
        if (value.trim() == "") {
            this.setState({searchList: [], inputValue: ""})
            return false;
        }
        this.setState({inputValue: value});
        apiGet(API_FOODING_DS, '/fc/portal/mtlType/getMtlTypeList', {keyWord: value}, response => {
            let searchList = response.data || [];
            that.setState({searchList})
        }, error => console.log(error.message))
    };
    //选中某个
    onSelectClick = (data, e) => {
        let that = this;
        e.stopPropagation && e.stopPropagation();
        this.setState({inputValue: data.localName}, () => {
            window.open(window.location.origin + "/user/loginlist?id=" + data.id + "&name=" + data.localName + "&inputvalue=" + data.localName);
        });
        apiGet(API_FOODING_DS, '/fc/portal/mtlType/getMtlTypeList', {keyWord: data.localName}, response => {
            let searchList = response.data || [];
            that.setState({searchList})
        }, error => console.log(error.message))
    };
    //输入框的搜索的点击事件
    onSearchClick = () => {
        let {inputValue} = this.state;
        if (!inputValue.length) return false;
        window.open(window.location.origin + "/user/loginlist?name=" + inputValue +  "&inputvalue=" + inputValue );
    };

    componentDidMount() {
        this.initList();
    }

    componentDidUpdate() {

    }
    //点击跳转页面
    onMenuClick = (item) => {
        this.setState({selectedKeys: []}, () => {
            if (item.key.indexOf('ALLCATEGORES') !== -1) {
                //表示是点击的ALLCategories
                window.open(window.location.origin + "/user/loginonestep?id=57737953a672301cb5de734b")
            } else if (item.key.indexOf('ALLTWOSTEPCATEGORES') !== -1) {
                let idTwoAll = item.key.substring(23);
                let name = item.item.props.obj.localName;
                window.open(window.location.origin + "/user/logintwostep?id=" + idTwoAll + '&name=' + name)
            } else {
                let id = item.key;
                let name = item.item.props.children;
                window.open(window.location.origin + "/user/logintwostep?id=" + id + "&name=" + name )
            }
        })
    };

    onSubLevelClick = (item, {key, domEvent}) => {
        domEvent.stopPropagation && domEvent.stopPropagation();
        window.open(window.location.origin + "/user/logintwostep?id=" + key + "&name=" + item.localName )
    };

    render() {
        let that = this;
        let {initList, inputValue, searchList} = that.state;
        return (<div className="login-head-head">
            <img src={require('../assets/ewm.png')} style={{height: '90px',position: 'fixed', zIndex: '10',right: '20px',top: '10px'}}/>
            <span style={{position: 'fixed',right: '44px', top: '100px'}}>App下载</span>
            <div className={'loginadvice-index-header'}>
                <div className="loginadvice-index-header-top">
                    <span className="loginadvice-index-header-top-vpn">Noohle</span>
                    <LanguageMore/>
                </div>
                <div className="loginadvice-index-header-bottom">
                    <div className={"loginadvice-index-header-bottom-categery"}>
                        <Menu style={{width: 180, fontSize: "14px", fontFamily: "Helvetica Nena"}} mode="vertical"
                              onClick={this.onMenuClick} selectedKeys={this.state.selectedKeys || []}>
                            <SubMenu key={"ALLCATEGORES"}
                                     title={<span style={{fontSize: '16px', color: 'black'}}
                                                  className="titletitle"><Icon
                                         type="menu-unfold"/>{i18n.t(200172/*产品分类*/)}</span>}
                            >
                                {
                                    initList && initList.map((e, i) => {
                                        if (e.children && e.children.length !== 0) {
                                            return (<SubMenu key={e.id} title={e.localName} onTitleClick={that.onSubLevelClick.bind(that, e)}>
                                                {
                                                    e.children.map((da, di) => {
                                                        return di < 10 ? (<Menu.Item key={da.id}
                                                                                     obj={da}>{da.localName}</Menu.Item>) : "";
                                                    })
                                                }
                                                {
                                                    e.children && e.children.length > 10 ?
                                                        <Menu.Item key={"ALLTWOSTEPCATEGORES----" + e.id}
                                                                   obj={e}>{I18n.t(200634/*更多*/)}...</Menu.Item> : ""
                                                }
                                            </SubMenu>)
                                        }
                                    })
                                }
                                <Menu.Item key={"ALLCATEGORES"}>{I18n.t(300079/*所有分类*/)}</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </div>
                    <div className="loginadvice-index-header-bottom-search">
                        <Dropdown
                            trigger={['click']}
                            visible={this.state.visible}
                            onVisibleChange={(visible)=>{
                                this.setState({visible:visible})
                            }}
                            overlay={<ul className={"loginadvice-index-header-bottom-search-more"} id="show">
                                {
                                    searchList.map((se, si) => {
                                        return (<li className="loginadvice-index-header-bottom-search-more-single" key={si}
                                                    onClick={this.onSelectClick.bind(that, se)}>{se.localName}</li>)
                                    })
                                }
                            </ul>}
                            animation="slide-up"
                        >
                        <input type="text" className="loginadvice-index-header-bottom-search-input"
                               onChange={that.oninputChange} value={inputValue} onClick={()=>{
                                setTimeout(()=>{
                                    that.setState({visible:true})
                                },500)
                        }}
                               placeholder={I18n.t(300076/*你在找什么 …*/)}/>
                        </Dropdown>
                        <span className="loginadvice-index-header-bottom-search-show">{I18n.t(300077/*产品*/)}</span>
                        <button className="loginadvice-index-header-bottom-search-button" onClick={this.onSearchClick}>
                            <i className={'foddingicon fooding-search'}
                               style={{fontSize: "20px", verticalAlign: "middle"}}></i>{I18n.t(300078/*搜索*/)}
                        </button>
                    </div>
                    <div className="loginadvice-index-header-bottom-kong">
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default Header;