import React, {Component} from "react";
import {I18n} from "../../../lib/i18n";
import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ES,
    API_FOODING_DS,
    API_FOODING_OA,
    pageSize,
    sizeList
} from '../../../services/apiCall';
import {Link, browserHistory} from 'react-router';
import Confirm from "../../../components/Dialog/Confirm";
import NoImg from "../../LoginNew/assets/detailNo.png";
import WebData from "../../../common/WebData";

import ServiceTips, {errorTips, successTips} from "../../../components/ServiceTips";//提示框

class Normal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList: [],
            index: 0 //图片下标
        }
    }

    initList = id => {
        if (!id) return false;
        apiGet(API_FOODING_OA, '/fc/fastdfs/getList', {
            businessId: id,
            businessType: "platformMaterial--picture"
        }, response => {
            let fileList = response.data || [];
            this.setState({fileList})
        }, error => console.log(error.message))
    }
    onLeftClick = () => {
        let {index, fileList} = this.state;
        let len = fileList.length;
        index--;
        if (index < 0) {
            index = len - 1;
        }
        this.setState({index})
    }
    onRightClick = () => {
        let {index, fileList} = this.state;
        let len = fileList.length;
        index++;
        if (index >= len) {
            index = 0;
        }
        this.setState({index})
    }

    //点击更多和 查看价格 提示他们跳转到登录页面
    onLinkClick = () => {
        //跳转出来一个登录界面
        if(!WebData.user){
            this.props.onLinkClick && this.props.onLinkClick();
            return false;
        }
        let { material = {}} = this.props;
        apiForm(API_FOODING_DS, "/material/leadIn", {
            id:[material.id]
        }, response => {
            ServiceTips({text: response.message, type: "success",top:1});
        }, error => ServiceTips({text: error.message, type: "error",top:1}))
    };

    componentDidMount() {
        let {material = {}} = this.props;
        this.initList(material.id)
    }

    componentWillReceiveProps(nextProps) {
        let nowmaterial = this.props.material || {};
        let nextMaterial = nextProps.material || {};
        if (nextMaterial.id) {
            this.initList(nextMaterial.id)
        }
    }

    render() {
        let {material = {}} = this.props;
        let {index} = this.state;
        return (<ul className={'login-detail-normal'}>
            {
                this.state.fileList.length == 0 ? <li className={'login-detail-normal-left'}><img src={NoImg} style={{
                    display: 'inline-block',
                    width: "100%"
                }}/></li> : <li className={'login-detail-normal-left'}>
                    <div className={'login-detail-normal-left-dev'} style={{left: "-" + index * 232 + 'px'}}>
                        {
                            this.state.fileList.map((e, i) => {
                                return (<img src={decodeURIComponent(e.fullPath)}
                                             className={'login-detail-normal-left-dev-img'} onDragStart={() => {
                                    return false;
                                }} key={i}/>)
                            })
                        }
                    </div>
                    {
                        this.state.fileList.length > 1 ? <span className={'login-detail-normal-left-upbutton'}
                                                               onClick={this.onLeftClick}>&lt;</span> : ""
                    }
                    {
                        this.state.fileList.length > 1 ? <span className={'login-detail-normal-left-nextbutton'}
                                                               onClick={this.onRightClick}>&gt;</span> : ""
                    }


                </li>
            }
            <li className={'login-detail-normal-right'}>
                <div className="login-detail-normal-right-top">
                    <h2 className="login-detail-normal-right-top-code">{material.code || ""}</h2>
                    <h2 className="login-detail-normal-right-top-localname">{material.localName || ""}</h2>
                    <h2 className="login-detail-normal-right-top-enname">{material.enName || ""}</h2>
                </div>
                <p className="login-detail-normal-right-middle">
                  <span className="login-detail-normal-right-middle-single">
                      <span className="login-detail-normal-right-middle-single-key">{I18n.t(100403/*产品类型*/)}</span>
                      {material.mtlType && material.mtlType.localName ? material.mtlType.localName : ""}
                  </span>
                    <span className="login-detail-normal-right-middle-single">
                      <span className="login-detail-normal-right-middle-single-key">CAS Number</span>
                        {material.casNumber}
                  </span>
                    <span className="login-detail-normal-right-middle-single">
                      <span className="login-detail-normal-right-middle-single-key">CNS</span>
                        {material.cns}
                  </span>
                    <span className="login-detail-normal-right-middle-single">
                      <span className="login-detail-normal-right-middle-single-key">INS</span>
                        {material.ins}
                  </span>
                    <span className="login-detail-normal-right-middle-single">
                      <span className="login-detail-normal-right-middle-single-key">E Number</span>
                        {material.eNumber}
                  </span>
                    <span className="login-detail-normal-right-middle-single">
                      <span className="login-detail-normal-right-middle-single-key">EC Number</span>
                    {material.ecNumber}
                  </span>
                    <span className="login-detail-normal-right-middle-single">
                      <span className="login-detail-normal-right-middle-single-key">UN Number</span>
                    {material.nuNumber}
                  </span>
                    <span className="login-detail-normal-right-middle-single">
                      <span className="login-detail-normal-right-middle-single-key">{I18n.t(100414/*生产工艺*/)}</span>
                    {material.pProces && material.pProces.localName ? material.pProces.localName : ""}
                  </span>
                </p>
                <p className="login-detail-normal-right-bottom">

                    <button onClick={this.onLinkClick}>{I18n.t(200543/*收藏*/)}</button>
                </p>

            </li>
        </ul>)
    }
}

export default Normal;
// <button onClick={this.onLinkClick}>{I18n.t(400194/*查看报价*/)}</button>