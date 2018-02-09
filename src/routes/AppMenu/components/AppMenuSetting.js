import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Tree, {TreeNode} from '../../../components/Tree';
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import Dialog from '../../../components/Dialog/Dialog';
import ServiceTips from '../../../components/ServiceTips';
import RightFuncKeys from "./RightFuncKeys";
import MenuSetView from "./MenuSettingView";
import MenuSettingOperate from "./MenuSettingOperate";
import {permissionsBtn, apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../services/apiCall';

class MenuSetting extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.onRightClick = this.onRightClick.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.handClick = this.handClick.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.menuSave = this.menuSave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.RightKeyonsave = this.RightKeyonsave.bind(this);
        this.state = {
            gData: [],
            scroll: 0,
            scrollHeight: 0,
            rightFuncShow: false,//控制右键是否出来
            x: 0,
            y: 0,
            showDilaog: false,//控制弹出层是否出来
            content: '',
            dialogContent: '<div></div>',
            visible: false,
            tempArray: [],
            tableDate: [],
            moduleIdArray: [],
            menuId: null,
            showLoading: true,
            showTip: false,
            nodeParent: '',
            iconArray: [{
                permissions: 'menuset.add', action: i18n.t(200558/*新增节点*/),
                classn: 'foddingicon fooding-add-icon3', title: i18n.t(200558/*新增节点*/)
            },
                {
                    permissions: 'menuset.del',
                    action: i18n.t(200559/*删除节点*/),
                    classn: 'foddingicon fooding-delete-icon3',
                    title: i18n.t(200559/*删除节点*/)
                }]

        }
        this.upload = this.upload.bind(this);
    }

    onSaveAndClose(value, data) {
        var that = this;
        let id;
        if (data.number == 0) {
            //编辑界面操作
            id = data.record.id;
            value = Object.assign({}, {id: id}, {menuId: this.state.menuId}, value);
            apiPost(API_FOODING_ES, '/appPermission/save', value, (response) => {
                ServiceTips({text: response.message, type: 'sucess'});
                this.getPermissionByMenuId(this.state.menuId);
                this.setState({
                    showDilaog: false
                })
            }, (error) => {
                ServiceTips({text: error.message, type: 'error'});
            })

        } else if (data.number == 1) {
            value = Object.assign({}, {menuId: this.state.menuId}, value);
            apiPost(API_FOODING_ES, '/appPermission/save', value, (response) => {
                ServiceTips({text: response.message, type: 'sucess'});
                this.getPermissionByMenuId(this.state.menuId);
                this.setState({
                    showDilaog: !this.state.showDilaog
                })
            }, (error) => {
                ServiceTips({text: error.message, type: 'error'});
            })

        }
    }

    onCancel() {
        this.setState({
            showDilaog: false
        })
    }

    RightKeyonsave(value) {
        //右键新增数节点
        var that = this;
        let a = this.state.rightKeyinfo;
        value = Object.assign({}, {parentId: this.state.rightKeyinfo.node.props.eventKey}, value);
        apiPost(API_FOODING_ES, '/appMenu/save', value, (response) => {
            ServiceTips({text: response.message, type: 'sucess'});
            that.setState({
                showDilaog: false
            });
            that.getMenuById(this.state.menuId);
            that.getTree();
        }, (error) => {

            ServiceTips({text: error.message, type: 'error'});
        })
    }

    handClick(type, e) {
        var that = this;
        if (type == i18n.t(200558/*新增节点*/)) {
            let content = require('./MenuSettingAddDialog').default;
            let element = React.createElement(content,
                {
                    onSaveAndClose: this.RightKeyonsave, onCancel: this.onCancel,
                    upload: this.upload,
                    menusetView: this.state.menusetView,
                    moduleIdArray: this.state.moduleIdArray
                })
            this.setState({
                showDilaog: true,
                title: i18n.t(100392/*新增*/),
                dialogContent: element
            })
        } else if (type == i18n.t(200559/*删除节点*/)) {
            Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    apiForm(API_FOODING_ES, '/appMenu/delete', {id: this.state.rightKeyinfo.node.props.eventKey}, (response) => {
                        ServiceTips({text: response.message, type: 'sucess'});
                        that.setState({
                            showDilaog: false
                        });
                        that.getMenuById(this.state.menuId);
                        that.getTree();
                    }, (error) => {
                        ServiceTips({text: error.message, type: 'error'});
                    })
                },
                close: () => {

                }
            });
        }
    }

    onRightClick(info) {//节点右键事件
        let rightFunc = true;
        let xP, yP;
        xP = info.event.clientX;
        yP = info.event.clientY;
        let array = [{
            permissions: 'menuset.add', action: i18n.t(200558/*新增节点*/),
            classn: 'foddingicon fooding-add-icon3', title: i18n.t(200558/*新增节点*/)
        }]
        if (info.node.props.eventKey == this.state.nodeParent) {
            this.setState({
                iconArray: [{
                    permissions: 'menuset.add', action: i18n.t(200558/*新增节点*/),
                    classn: 'foddingicon fooding-add-icon3', title: i18n.t(200558/*新增节点*/)
                }]
            });
        } else {
            this.setState({
                iconArray: [{
                    permissions: 'menuset.add', action: i18n.t(200558/*新增节点*/),
                    classn: 'foddingicon fooding-add-icon3', title: i18n.t(200558/*新增节点*/)
                },
                    {
                        permissions: 'menuset.del',
                        action: i18n.t(200559/*删除节点*/),
                        classn: 'foddingicon fooding-delete-icon3',
                        title: i18n.t(200559/*删除节点*/)
                    }]
            })
        }
        this.setState({
            rightKeyinfo: info,
            rightFuncShow: rightFunc,
            x: xP,
            y: yP
        }, () => {
            document.getElementById('rightfunckeyappmenu').focus();
        })
    }

    onBlur() {//节点右键失焦事件
        let rightFunc = false;
        this.setState({
            rightFuncShow: rightFunc,
        })
    }

    getPermissionByMenuId(id) {
        var that = this;
        if (!id) return that.setState({
            tableDate: []
        });
        apiGet(API_FOODING_ES, '/appPermission/getPermissionByMenuId', {menuId: id}, (response) => {
            that.setState({
                tableDate: response.data
            });
        }, (message) => {
            console.log(message);
        });
    }

    onSelect(key, obj) {
        //因为可以在选中时有值，而没选中时没有，所以不能用来判断length长度
        this.setState({
            visible: true,
            menuId: key[0]
        });
        this.getMenuById(key[0]);
        this.getPermissionByMenuId(key[0]);

    }

    getMenuById(id) {
        if (!id) return this.setState({
            visible: false,
            tempArray: [],
            menusetView: undefined
        });
        apiGet(API_FOODING_ES, '/appMenu/getMenuById', {id: id}, (response) => {
            if (response.data) {
                let array = [
                    {key: i18n.t(100001/*名称*/), value: response.data.localName, id: response.data.id},
                    {key: i18n.t(200745/*标识*/), value: response.data.identity, id: response.data.id},
                    {key: 'URL', value: response.data.url, id: response.data.id}
                ];
                this.setState({
                    tempArray: array,
                    menusetView: response.data
                });
            }
        }, (message) => {
            console.log(message);
        });
    }

    handleMenuClick = (e, data, dialogContent, selectArray) => {
        var that = this;
        if (data.number == 2) {
            Confirm('是否删除该界面操作？', {
                done: () => {
                    let id = [];
                    if (selectArray.length > 0) {
                        for (var i = 0, length = selectArray.length; i < length; i++) {
                            id.push(selectArray[i].id);
                        }
                    } else {
                        id.push(data.record.id);
                    }
                    apiForm(API_FOODING_ES, '/appPermission/delete', {id: id}, (response) => {
                        ServiceTips({text: response.message, type: 'sucess'});
                        this.getPermissionByMenuId(this.state.menuId);
                    }, (error) => {
                        ServiceTips({text: error.message, type: 'error'});
                    })
                }
            });
        } else {
            let dialogTitle;
            if (!data.action) {
                dialogTitle = i18n.t(100439/*编辑*/);
            } else {
                dialogTitle = data.action + data.name.title;
            }
            this.setState({
                showDilaog: true,
                title: dialogTitle,
                dialogContent: dialogContent
            });
        }
    }

    handleResize(height) {
        let sch = document.body.offsetHeight - 100 - height;
        let scroll = sch - 20;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px'});
    }

    menuSave(value, data) {
        //菜单保存
        var that = this;
        value = Object.assign({}, data, value);
        apiPost(API_FOODING_ES, '/appMenu/save', value, (response) => {
            ServiceTips({text: response.message, type: 'sucess'});
            that.setState({showDilaog: false, menusetView: value});
            that.getMenuById(this.state.menuId);
            that.getTree();
        }, (error) => {
            ServiceTips({text: error.message, type: 'error'});
        })
    }

    upload(menuId) {

        let that = this;
        that.getMenuById(menuId);
        that.getTree();
    }

    onDrop(info, data) {
        var that = this;
        let type;
        if (info.node.props.dragOverGapTop) {
            type = 'before';
        } else if (info.node.props.dragOverGapBottom) {
            type = 'after';
        } else if (info.node.props.dragOver) {
            type = 'children';
        }
        apiForm(API_FOODING_ES, '/appMenu/move', {
            id: info.dragNodesKeys[0],
            targetId: info.node.props.eventKey, type: type
        }, (response) => {
            window.Tip.successTips(response.message);
            this.getTree();
        }, (error) => {
            window.Tip.errorTips(error.message);
        })
    }

    getTree() {
        var that = this;
        apiGet(API_FOODING_ES, '/appMenu/getTree', null, (response) => {
            let array = [];
            array.push(response.data);
            that.setState({
                gData: array,
                nodeParent: response.data.id
            });
        }, (message) => {
            console.log(message);
        });
    }

    componentDidMount() {
        var that = this;
        this.getTree();
        // apiPost(API_FOODING_DS,'/object/getList',{obj:'com.fooding.fc.enumeration.Module'},
        // 			(response)=>{
        // 				that.setState({
        // 					moduleIdArray:response.data
        // 				})
        // 			},(errors)=>{
        //
        // });
        window.addEventListener('resize', this.handleResize(0));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    render() {
        const {rightFuncShow, iconArray} = this.state;
        let rightDom;
        if (rightFuncShow) {
            rightDom = (<RightFuncKeys
                iconArray={iconArray.filter(o => o['permissions'] ? permissionsBtn(o['permissions']) : 1)}
                x={this.state.x} y={this.state.y} onBlur={this.onBlur}
                data
                handClick={this.handClick}/>);
        } else {
            rightDom = (<span></span>);
        }

        return (<div className={'menuset-content'}>
            <div className={'menuset-content-all'} style={{height: this.state.scrollHeight}}>
                <div className={'menuset-content-all-tree scroll'} style={{height: this.state.scroll}}>
                    <Tree
                        onRightClick={this.onRightClick}
                        onSelect={this.onSelect}
                        defaultSelectedKeys={['0']}
                        onDrop={this.onDrop}
                        showIcon={false}
                        selectable={true}
                        draggable={true}
                        checkable={false}
                        defaultExpandedKeys={['menu']}
                        gData={this.state.gData}
                    />
                    {rightDom}
                </div>
                <div className={this.state.visible ? 'menuset-content-all-show scroll' : 'none'}
                     style={{height: this.state.scroll}}>
                    <MenuSetView
                        DialogTempalte={require('./MenuSettingAddDialog').default}
                        tempArray={this.state.tempArray}
                        menusetView={this.state.menusetView}
                        upload={this.upload}
                        isShowMenu={true}
                        openDialog={this.handleMenuClick}
                        onSaveAndClose={this.menuSave}
                        onCancel={this.onCancel}
                        id={'menu-view-00'} title={i18n.t(200560/*查看*/)}
                    />
                    <MenuSettingOperate onCancel={this.onCancel} title={i18n.t(200746/*界面操作*/)}
                                        Zindex={4}
                                        moduleIdArray={this.state.moduleIdArray}
                                        openDialog={this.handleMenuClick}
                                        onSaveAndClose={this.onSaveAndClose}
                                        DialogTempalte={require('./MenuSettingOperateAddandEditDialog').default}
                                        showHeader={true}
                                        checkedRowsArray={[]}
                                        id={'menu-operate-00'}
                                        upload={this.upload}
                                        columns={
                                            [{
                                                title: i18n.t(100001/*名称*/),
                                                dataIndex: 'name',
                                                key: "name",
                                                width: '15%',
                                                render(data, row, index) {
                                                    return (<div title={data}>{data}</div>)
                                                }
                                            },
                                                {
                                                    title: i18n.t(200745/*标识*/),
                                                    dataIndex: 'identity',
                                                    key: "identity",
                                                    width: '15%',
                                                    render(data, row, index) {
                                                        return (<div title={data}>{data}</div>)
                                                    }
                                                },
                                                {
                                                    title: "URL",
                                                    dataIndex: 'url',
                                                    key: "url",
                                                    width: '40%',
                                                    render(data, row, index) {
                                                        return (<div title={data}>{data}</div>)
                                                    }
                                                },
                                                {
                                                    title: i18n.t(200747/*所属系统*/),
                                                    dataIndex: 'moduleId',
                                                    key: "moduleId",
                                                    width: '15%',
                                                    render(data, row, index) {
                                                        return (<div title={data}>{data}</div>)
                                                    }
                                                }]
                                        }
                                        data={this.state.tableDate}
                    />
                </div>
            </div>
            <Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
                {this.state.dialogContent}
            </Dialog>
        </div>)
    }
}

export default MenuSetting;
