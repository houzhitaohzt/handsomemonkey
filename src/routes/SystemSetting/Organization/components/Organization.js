import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import Dialog from '../../../../components/Dialog/Dialog';
import Demo from '../../../../components/Tree';
import RightFuncKeys from "./RightFuncKeys";
import OrganizationCommonDetail from "./OrganizationCommonDetail";//所有都有的时候
import OrganizationOnlyNormal from "./OrganizationOnlyNormal";//只有常规的时候
import OrganizatiionNormalAndStaff from "./OrganizatiionNormalAndStaff";//有常规和员工的时候
import Loading from '../../../../components/Loading';
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips';
import {permissionsBtn, apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../../services/apiCall';
import xt from '../../../../common/xt';

class Organization extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.onRightClick = this.onRightClick.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.handClick = this.handClick.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.getLoginClusters = this.getLoginClusters.bind(this);
        this.saveMemu = this.saveMemu.bind(this);//保存菜单
        this.permission = this.permission.bind(this);//权限保存
        this.state = {
            scroll: 0,
            scrollHeight: 0,
            rightFuncShow: false,//控制右键是否出来
            x: 0,
            y: 0,
            showDilaog: false,//控制弹出层是否出来
            content: '',
            showLoading: true,
            gData: [],
            autoExpandParent: true,
            selectKey: {},
            typeArray: [],
            menuRightKeyItem: null,
            parentId: ''
        }
    }

    getLoginClusters() {
        var that = this;
        apiGet(API_FOODING_ES, '/party/getPartySyncTreeByLoginUser', {}, (response) => {
            that.setState({
                gData: response.data || []
            });
        }, (error) => {})
    }

    onDrop(info) {
        let that = this;
        if (info.node.props.parent.id !== info.dragNode.props.parent.id) return errorTips("父节点必须一样!");
        let index = info.dropPosition - info.node.props.subIndex;
        let type = 'before';
        if (index >= 0) type = 'after';

        // console.log(info.dragNode.props.title, info.node.props.title, type);
        apiForm(API_FOODING_ES, '/party/move', {
            targetTypeId: info.node.props.label.typeId, targetPartyId: info.node.props.eventKey,
            partyId: info.dragNodesKeys[0], typeId: info.dragNode.props.label.typeId, type
        }, (response) => {
            successTips(response.message);
            this.onRefreshPanel();
        }, (error) => {
            errorTips(error.message)
        });
        return false;
    }

    onRefreshPanel = (partyId) => {
        this.requestPanelData(partyId);
        this.getLoginClusters();
    };

    onSaveAndClose() {
        this.setState({
            showDilaog: false
        })
    }

    onCancel() {
        this.setState({
            showDilaog: false
        })
    }

    saveMemu(value) {
        var that = this;
        value = Object.assign({}, value, {parentId: this.state.menuRightKeyItem});
        apiPost(API_FOODING_ES, '/party/save', value, (response) => {
            that.setState({
                showDilaog: false
            });
            ServiceTips({text: response.message, type: 'success'});
            this.getLoginClusters();
        }, (error) => {
            ServiceTips({text: error.message, type: 'error'});
        })
    }

    permission(value) {
        var that = this;
        value = Object.assign({}, value, {id: this.state.menuRightKeyItem});
        apiGet(API_FOODING_ES, '/party/copyPermission', value, (response) => {
            that.setState({
                showDilaog: false
            });
            ServiceTips({text: response.message, type: 'success'});
            this.getLoginClusters();
        }, (error) => {
            ServiceTips({text: error.message, type: 'error'});
        })
    }

    handClick(type, e) {
        var that = this;
        if (type == i18n.t(200558/*新增节点*/)) {
            apiGet(API_FOODING_ES, '/party/getPartyTypes', {parentId: this.state.menuRightKeyItem},
                (response) => {

                    let content = require('./NewNodeAdd').default;
                    let element = React.createElement(content, {
                        typeArray: response.data,
                        onSaveAndClose: this.saveMemu,
                        parentId: this.state.menuRightKeyItem,
                        onCancel: this.onCancel
                    });
                    this.setState({
                        showDilaog: true,
                        title: i18n.t(200558/*新增节点*/),
                        typeArray: response.data,
                        dialogContent: element
                    });
                }, (errors) => {
                    errorTips(i18n.t(500225/*节点数据请求失败, 请稍后重试!*/));
                });

        } else if (type == i18n.t(200559/*删除节点*/)) {
            Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    apiForm(API_FOODING_ES, '/party/delete', {id: this.state.menuRightKeyItem}, (response) => {
                        ServiceTips({text: response.message, type: 'success'});
                        that.getLoginClusters();
                    }, (error) => {
                        ServiceTips({text: error.message, type: 'error'});
                    })
                },
                close: () => {
                    console.log('no, close')
                }
            });
        } else {
            apiGet(API_FOODING_ES, '/party/getInfo', {partyId: this.state.menuRightKeyItem}, (response) => {

                this.setState({
                    parentId: response.data.party.parentId

                });
                apiGet(API_FOODING_ES, '/party/getChildren', {
                        parentId: this.state.parentId,
                        noInId: this.state.menuRightKeyItem
                    },
                    (response) => {
                        let content = require('./Copypermission').default;
                        let element = React.createElement(content, {
                            typeArray: response.data,
                            onSaveAndClose: this.permission,
                            parentId: this.state.parentId,
                            noInId: this.state.menuRightKeyItem,
                            onCancel: this.onCancel
                        });
                        this.setState({
                            showDilaog: true,
                            title: i18n.t(500222/*复制权限*/),
                            typeArray: response.data,
                            dialogContent: element
                        });
                    }, (errors) => {
                        errorTips(i18n.t(500224/*复制权限失败, 请稍后重试!*/));
                    });
            }, (errors) => {
                errorTips(i18n.t(500225/*节点数据请求失败, 请稍后重试!*/));
            })
            // apiGet(API_FOODING_ES, '/party/getChildren', {parentId: this.state.content.props.data.party.parentId,noInId:this.state.menuRightKeyItem},
            //     (response) => {
            //         let content = require('./NewNodeAdd').default;
            //         let element = React.createElement(content, {
            //             typeArray: response.data,
            //             onSaveAndClose: this.saveMemu,
            //             parentId: this.state.content.props.data.party.parentId,
            //             noInId: this.state.menuRightKeyItem,
            //             onCancel: this.onCancel
            //         });
            //         this.setState({
            //             showDilaog: true,
            //             title: i18n.t(500212/*销售记录*/),
            //             typeArray: response.data,
            //             dialogContent: element
            //         });
            //     }, (errors) => {
            //         errorTips("节点数据请求失败, 请稍后重试!");
            //     });
        }
    }

    onRightClick(info) {//节点右键事件
        let rightFunc = true;
        let xP, yP;
        xP = info.event.clientX;
        yP = info.event.clientY;
        this.setState({
            rightFuncShow: rightFunc,
            x: xP,
            y: yP,
            menuRightKeyItem: info.node.props.eventKey
        }, () => {
            document.getElementById('rightfunckey').focus();
        })
    }

    onBlur() {//节点右键失焦事件
        let rightFunc = false;
        this.setState({
            rightFuncShow: rightFunc,
        })
    }

    onSelect(key, obj) {
        //因为可以在选中时有值，而没选中时没有，所以不能用来判断length长度
        var that = this;
        // console.log(obj)
        that.requestPanelData(key[0]);
    }

    requestPanelData(partyId) {
        let that = this;
        if (!partyId) return this.setState({content: null});
        let detailDom;
        apiGet(API_FOODING_ES, '/party/getInfo', {partyId: partyId}, (response) => {
            let id = xt.getItemValue(response, 'data.party.partyType.id');
            if (id == 20 || id == 10) {
                detailDom = (<OrganizationOnlyNormal data={response.data} onRefreshPanel={this.onRefreshPanel}
                                                     partyId={partyId}/>)
            } else if (id == 30) {
                detailDom = (<OrganizationCommonDetail data={response.data} onRefreshPanel={this.onRefreshPanel}
                                                       partyId={partyId}/>)
            } else {
                detailDom = (<OrganizatiionNormalAndStaff data={response.data} onRefreshPanel={this.onRefreshPanel}
                                                          partyId={partyId}/>)
            }
            that.setState({content: ''}, function () {
                that.setState({content: detailDom});
            })
        }, (error) => {
            errorTips("请求数据出错, 请稍后再试!");
        })
    }

    handleResize() {
        let sch = document.body.offsetHeight - 82 - 86;
        let scroll = sch - 20;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px'});
    }

    componentDidMount() {
        this.handleResize();
        this.getLoginClusters();
        var that = this;
        // apiPost(API_FOODING_DS, '/object/getMiniList', {obj: 'com.fooding.fc.enumeration.PartyType'},
        //     (response) => {
        //         that.setState({
        //             typeArray: response.data
        //         })
        //     }, (errors) => {
        //
        //     });
        window.addEventListener('resize', this.handleResize);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    /**
     * 给组织树添加icon
     * */
    obtainIcon = ({label, title}) => {
        if(label.typeId == 10) return (<i className='foddingicon fooding-home_16' title={label.partyType && label.partyType.name ? label.partyType.name : "" }></i>);
        if(label.typeId == 20) return (<img src={require("../../../../styles/images/fd_clur.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 30) return (<img src={require("../../../../styles/images/fd_cp.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 40) return (<img src={require("../../../../styles/images/fd_party.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 50) return (<img src={require("../../../../styles/images/fd_jobs.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 60) return (<img src={require("../../../../styles/images/fd_role.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 70) return (<img src={require("../../../../styles/images/fd_role.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
    };

    render() {
        const {rightFuncShow, content} = this.state;
        let iconArray = [{
            permissions: 'party.add',
            action: i18n.t(200558/*新增节点*/),
            classn: 'foddingicon fooding-add-icon3',
            title: i18n.t(200558/*新增节点*/)
        },
            {
                permissions: 'party.del',
                action: i18n.t(200559/*删除节点*/),
                classn: 'foddingicon fooding-delete-icon3',
                title: i18n.t(200559/*删除节点*/)
            },
            {
                permissions: 'party.copy',
                action: i18n.t(500222/*复制权限*/),
                classn: 'foddingicon fooding-copy',
                title: i18n.t(500222/*复制权限*/)
            }
        ];
        let rightDom;
        if (rightFuncShow) {
            rightDom = (
                <RightFuncKeys
                    iconArray={iconArray.filter(o => o['permissions'] ? permissionsBtn(o['permissions']) : 1)}
                    x={this.state.x} y={this.state.y} onBlur={this.onBlur} handClick={this.handClick}/>);
        } else {
            rightDom = (<span></span>);
        }

        return (<div className={'system-content'}>
            <div className={'system-content-all'} style={{height: this.state.scrollHeight}}>
                <div className={'system-content-all-tree scroll'} style={{height: this.state.scroll}}>
                    {rightDom}
                    <Demo gData={this.state.gData} onRightClick={this.onRightClick} draggable={true}
                          onDrop={this.onDrop} onSelect={this.onSelect} showIcon={true} obtainIcon={this.obtainIcon}/>
                </div>
                <div className={'system-content-all-show scroll'} style={{height: this.state.scroll}}>
                    {content}
                </div>
            </div>
            <Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
                {this.state.dialogContent}
            </Dialog>
        </div>)
    }
}

export default Organization;
