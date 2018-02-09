import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
import '../assets/custom.css';
import '../assets/jquery.jOrgChart.css';

var jOrgChart = require('../../../Client/Organizational/components/jquery.jOrgChart');

import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_DS,
    language,
    pageSize,
    sizeList,
    API_FOODING_ERP
} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Dialog from "../../../../components/Dialog/Dialog";
import Confirm from "../../../../components/Dialog/Confirm";
//右键
import RightFuncKeys from "../../../ProductCategory/components/RightFuncKeys";
import xt from '../../../../common/xt';

import NavConnect from "../../../../components/NavigateTabs/containers/AddContainer";

export class FreightClientOrganizational extends Component {
    constructor(props) {
        super(props);
        props.organizational && props.organizational(this);
        this.handleResize = this.handleResize.bind(this);
        this.state = {
            scrollHeight: 0,
            treeData: {},
            showDilaog: false,
            DialogTemplate: <div></div>,
            rightObj: {}, //右键每一个节点拿到的数据
            rightFuncShow: false,//控制右键是否显示
            id: this.props.location.query && this.props.location.query.id ? this.props.location.query.id : ""
        };
        this.getChild = this.getChild.bind(this);
        this.handClick = this.handClick.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.showall = this.showall.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
    }

    //点击弹窗跳转
    handClick = (data, type, e) => {
        let that = this;
        let {rightObj} = this.state;
        if (data == i18n.t(100437/*删除*/)) {
            if (rightObj.children && rightObj.children.length) {
                ServiceTips({text: "请先删除子公司节点", type: "error"});
                return false;
            }
            Confirm("删除节点后将无法恢复,您确定要删除吗?", {
                done: () => {
                    apiForm(API_FOODING_DS, '/enterpriseOrg/delete', {id: rightObj.orgCompanyId}, (response) => {
                        ServiceTips({text: response.message, type: 'success'});
                        $("#FreightClientjOrgChart" + this.state.id).html("");
                        that.getChild();
                    }, (error) => {
                        ServiceTips({text: error.message, type: 'error'});
                    })
                },
                close: () => {
                }
            })
        } else if (data == i18n.t(100439/*编辑*/)) {
            let content = require('../../../Client/Organizational/components/OrganizationalEditDialog').default;
            let ele = React.createElement(content, {
                onCancel: this.onCancel,
                onSaveAndClose: this.onSaveAndClose,
                menuData: rightObj,
                dataTyId: 30
            });
            this.setState({
                DialogTemplate: ele,
                showDilaog: true
            });
        } else {
            let content = require('../../../Client/Organizational/components/OrganizationalDialog').default;
            let ele = React.createElement(content, {
                onCancel: this.onCancel,
                onSaveAndClose: this.onSaveAndClose,
                menuData: rightObj,
                type: type,
                relationship: data,
                dataTyId: 30
            });
            this.setState({
                DialogTemplate: ele,
                showDilaog: true
            });
        }
    };

    //弹窗点击取消
    onCancel() {
        this.setState({showDilaog: false});
    }

    //点击创建 创建节点 刷新页面
    onSaveAndClose = () => {
        this.setState({showDilaog: false}, () => {
            $("#FreightClientjOrgChart" + this.state.id).html("");
            this.getChild();
        })
    };

    //初始化数据
    getChild = () => {
        let that = this;
        apiGet(API_FOODING_DS, '/enterpriseOrg/getTreeById', {
            dataTyId: 30,
            id: this.state.id
        }, (response) => {
            that.setState({treeData: response.data}, () => {
                var showlist = $("<ul style='display:none'></ul>");
                showlist.attr('id', 'org2' + this.state.id);
                this.showall(response.data, showlist);
                $("#FreightClientjOrgChart" + this.state.id).append(showlist);
                $("#org2" + this.state.id).jOrgChart({
                    chartElement: '#FreightClientjOrgChart' + this.state.id,//指定在某个dom生成jorgchart
                    dragAndDrop: false //设置是否可拖动
                }, this.getXY);
            });
        }, (error) => {
        }, {isLoading: false});
    };

    //显示更多
    showall = (menu_list, parent) => {
        let obj = menu_list;
        if (obj.children && obj.children.length > 0) {
            var li = $("<li></li>");
            li.append("<a single=" + encodeURIComponent(JSON.stringify(obj)) + " style=" + (obj.current ? "'color:#666;'" : "''") + ">" + obj.name + "</a>").append("<ul></ul>").appendTo(parent);
            //递归显示
            for (var i = 0; i < obj.children.length; i++) {
                this.showall(obj.children[i], $(li).children().eq(1));
            }
        } else {
            $("<li></li>").append("<a single=" + encodeURIComponent(JSON.stringify(obj)) + " style=" + (obj.current ? "'color:#666;'" : "''") + ">" + obj.name + "</a>").appendTo(parent);
        }
    };

    //获取右键时候的高度和宽度
    getXY = (obj, type) => {
        if (type === 'onclick') {//点击
            if(obj.data.orgCompanyId == this.state.id) return false;
            let {navAddTab} = this.props;
            let name = i18n.t(100311/*客户*/) + `(${obj.data.name})`;
            navAddTab({id: 3, name: name, component: name, url: '/freightClient/detail/' + obj.data.orgCompanyId});
            this.props.router.push({pathname:'/freightClient/detail/' + obj.data.orgCompanyId,query:{id:obj.data.orgCompanyId}, state: {refresh: true}});
        } else if (type === "contextmenu") {//右键
            let iconArray = [{
                action: i18n.t(500266/*母公司*/),
                classn: 'foddingicon fooding-add-icon3',
                title: i18n.t(500266/*母公司*/),
                type: 0
            },
                {
                    action: i18n.t(500267/*兄弟公司*/),
                    classn: 'foddingicon fooding-add-icon3',
                    title: i18n.t(500267/*兄弟公司*/),
                    type: 1
                },
                {
                    action: i18n.t(500268/*子公司*/),
                    classn: 'foddingicon fooding-add-icon3',
                    title: i18n.t(500268/*子公司*/),
                    type: 2
                },
                {
                    action: i18n.t(100439/*编辑*/),
                    classn: 'foddingicon fooding-alter_icon2',
                    title: i18n.t(100439/*编辑*/),
                    type: 3
                },
                {
                    action: i18n.t(100437/*删除*/),
                    classn: 'foddingicon fooding-delete-icon3',
                    title: i18n.t(100437/*删除*/),
                    type: 4
                }];
            if (!obj.data.parent) {
                iconArray = iconArray.filter(e => e.type !== 1)
            }
            if (!obj.data.unknown) {
                iconArray = iconArray.filter(e => e.type !== 3)
            }
            if (obj.data.unknown) {
                iconArray = iconArray.filter(e => e.type !== 0)
            }
            if (obj.data.children && obj.data.children.length) {
                iconArray = iconArray.filter(e => e.type !== 4)
            }
            this.setState({
                rightFuncShow: true,
                x: obj.x,
                y: obj.y,
                iconArray: iconArray,
                rightObj: obj.data || {}
            }, () => {
                document.getElementById('FreightClientOrganizational' + this.state.id).focus();
            })
        }
    };

    //右键失去焦点事件
    onBlur = () => {
        this.setState({rightFuncShow: false});
    };


    handleResize(height) {
        let sch = document.body.offsetHeight - 72 - height;
        let scroll = sch - 350;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize(47));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(47));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return xt.equalsObject(nextProps, this.props) || xt.equalsObject(nextState, this.state);
    };

    componentWillReceiveProps(nextProps) {
        let nextid = nextProps.location.query && nextProps.location.query.id ? nextProps.location.query.id : "";
        if (nextid !== this.props.location.query.id) {
            this.setState({id: nextid})
        }
    }

    render() {
        let {rightFuncShow, iconArray, x, y} = this.state;

        return (<div className={'client-body scroll'}
                     style={{height: document.body.offsetHeight - 244, marginTop: 10, overflowY: "auto"}}>
            <ul id={'FreightClientjOrgChart' + this.state.id}>

            </ul>
            {rightFuncShow ?
                <RightFuncKeys iconArray={iconArray} x={x} y={y} onBlur={this.onBlur} handClick={this.handClick}
                               id={"FreightClientOrganizational" + this.state.id}/> : null}
            <Dialog visible={this.state.showDilaog} title={this.state.title} width={this.state.dialogWidth}>
                {this.state.DialogTemplate}
            </Dialog>
        </div>);
    }
}

export default NavConnect(FreightClientOrganizational);

