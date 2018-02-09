import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Tree, {TreeNode} from '../../../components/Tree';
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import Dialog from '../../../components/Dialog/Dialog';
import ServiceTips from '../../../components/ServiceTips';
import RightFuncKeys from "./RightFuncKeys";
import MenuSetView from "./MenuSettingView";
import MenuSettingOperate from "./MenuSettingOperate";
import MenuSettingBI from "./MenuSettingBI";

import CustomDrag from "../../../components/CustomDrag";


import {
    permissionsBtn,
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ES,
    API_FOODING_DS,
    getQueryString
} from '../../../services/apiCall';

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
            BIData: [], // BI list
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
            apiPost(API_FOODING_ES, '/permission/save', value, (response) => {
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
            apiPost(API_FOODING_ES, '/permission/save', value, (response) => {
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
        apiPost(API_FOODING_ES, '/menu/save', value, (response) => {
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
                    apiForm(API_FOODING_ES, '/menu/delete', {id: this.state.rightKeyinfo.node.props.eventKey}, (response) => {
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
            document.getElementById('rightfunckeymenu').focus();
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
        apiGet(API_FOODING_ES, '/permission/getPermissionByMenuId', {menuId: id}, (response) => {
            that.setState({
                tableDate: response.data ||[]
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
        }, function () {
            this.getBIList();
        });

        this.getMenuById(key[0]);
        this.getPermissionByMenuId(key[0]);

    }

    // BI list
    getBIList = () => {
        let {menuId} = this.state;

        if (!menuId) return;
        apiGet(API_FOODING_ES, '/menu/getMenuByMainId', {mainId: menuId},
            (response) => {
                this.setState({BIData: response['data'] || []});
            }, (message) => {
                console.log(message);
            });
    }

    // BI add detel
    // handleMenuBIClick = (e, data, dialogContent, selectArray, target) => {
    //
    //
    //     var that = this;
    //     let {menuId, BIData} = this.state;
    //
    //     if (data.number == 2) {
    //
    //         console.log(data);
    //
    //         Confirm((target === null ) ? "确认删除所有数据？" : i18n.t(500174/*确认删除已选中的数据？*/), {
    //             done: () => {
    //                 apiPost(API_FOODING_ES, '/menu/deleteMenuByMainIdAndMenuId', Object.assign({}, {
    //                         menuId: menuId,
    //                         menuIds: (target === null ) ? BIData.map(o => o['id']) : Array.of(data.record['id'])
    //                     }),
    //                     (response) => {
    //                         ServiceTips({text: response.message, type: 'success'});
    //                         that.getBIList(); // 刷新列表
    //                     }, (errors) => {
    //                         ServiceTips({text: errors.message, type: 'error'});
    //                     });
    //             }
    //         });
    //     } else {
    //         let dialogTitle;
    //         if (!data.action) {
    //             dialogTitle = i18n.t(100439/*编辑*/);
    //         } else {
    //             dialogTitle = data.action + data.name.title;
    //         }
    //         this.setState({
    //             showDilaog: true,
    //             title: dialogTitle,
    //             dialogContent: dialogContent
    //         });
    //     }
    // }

    // BI 保存
    onSaveAndCloseBI = () => {
        this.getBIList();
        this.onCancel();
    };

    // BI 新增
    onBIAddClick = () => {
        let content = React.createElement(require('./AddBI').default,{
            onSaveAndClose:this.onSaveAndCloseBI,
            onCancel:this.onCancel,
            data:{number:1},
            moduleIdArray:this.state.BIData,
            menusetView:this.state.menusetView
        });
        this.setState({
            showDilaog: true,
            title: i18n.t(100392/*新增*/) + i18n.t(600236/*报表名称*/),
            dialogContent: content
        });
    };

    // BI 编辑
    onBIEditClick = (data,row) => {
        let content = React.createElement(require('./AddBI').default,{
            onSaveAndClose:this.onSaveAndCloseBI,
            onCancel:this.onCancel,
            data:{number:0},
            moduleIdArray:this.state.BIData,
            menusetView:this.state.menusetView
        });
        this.setState({
            showDilaog: true,
            title: i18n.t(100439/*编辑*/) + i18n.t(600236/*报表名称*/),
            dialogContent: content
        });
    };

    // BI 删除
    onBIDelClick = (data,row) => {
        let that = this;
        Confirm(i18n.t(500174/*确认删除已选中的数据？*/), {
            done: () => {
                apiPost(API_FOODING_ES, '/menu/deleteMenuByMainIdAndMenuId', Object.assign({}, {
                        menuId: this.state.menuId,
                        menuIds: Array.of(row['id'])
                    }),
                    (response) => {
                        ServiceTips({text: response.message, type: 'success'});
                        that.getBIList(); // 刷新列表
                    }, (errors) => {
                        ServiceTips({text: errors.message, type: 'error'});
                    });
            }
        });
    };

    //BI 滑动数组
    onBIMoveEnd = (list, current) => {
        let that = this,time;
        let targetList = list.map((e,i) => ({id:e.id,weight:i}));
        apiPost(API_FOODING_ES,"/menu/moveCorrelationMenu",{beanArray:targetList,mainId:this.state.menuId},response => {
            ServiceTips({text:response.message,type:'success'});
            clearTimeout(time);
            time = setTimeout(() => {that.getBIList();},400)
        },error => ServiceTips({text:error.message,type:'error'}))
    };

    getMenuById(id) {
        if (!id) return this.setState({
            visible: false,
            tempArray: [],
            menusetView: undefined
        });
        apiGet(API_FOODING_ES, '/menu/getMenuById', {id: id}, (response) => {
            if (response.data) {
                let array = [
                    {key: i18n.t(100001/*名称*/), value: response.data.localName, id: response.data.id},
                    {key: i18n.t(200745/*标识*/), value: response.data.identity, id: response.data.id},
                    {key: 'URL', value: response.data.url, id: response.data.id},
                    {key: '权限控制', value: response.data.ruleScope['name'], id: response.data.id},
                    {
                        key: i18n.t(600236/*报表名称*/),
                        action: response.data.bi,
                        value: response.data.bi ? `${i18n.t(100141/*是*/)}` : `${i18n.t(100142/*否*/)}`,
                        id: response.data.id
                    }

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
                    apiForm(API_FOODING_ES, '/permission/delete', {id: id}, (response) => {
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
    };

    //界面操作 新增按钮
    onTableAddClick = () => {
        let content = React.createElement(require('./MenuSettingOperateAddandEditDialog').default,{
            onSaveAndClose:this.onSaveAndClose,
            onCancel:this.onCancel,
            upload:this.upload,
            data:{number:1},
            moduleIdArray:this.state.moduleIdArray,
            menusetView:this.state.menusetView
        });
        this.setState({
            showDilaog: true,
            title: i18n.t(100392/*新增*/) + i18n.t(600236/*报表名称*/),
            dialogContent: content
        });
    };

    //界面操作 编辑按钮ßßßß
    onTableEditClick = (data,row) => {
        let obj = Object.assign({},{number:0,record:row});
        let content = React.createElement(require('./MenuSettingOperateAddandEditDialog').default,{
            onSaveAndClose:this.onSaveAndClose,
            onCancel:this.onCancel,
            upload:this.upload,
            data:obj,
            moduleIdArray:this.state.moduleIdArray,
            menusetView:this.state.menusetView
        });
        this.setState({
            showDilaog: true,
            title: i18n.t(100439/*编辑*/) + i18n.t(600236/*报表名称*/),
            dialogContent: content
        });
    };

    //界面操作 删除按钮
    onTableDelClick = (data,row) => {
        Confirm('是否删除该界面操作？', {
            done: () => {
                let id = [row['id']];
                apiForm(API_FOODING_ES, '/permission/delete', {id: id}, (response) => {
                    ServiceTips({text: response.message, type: 'sucess'});
                    this.getPermissionByMenuId(this.state.menuId);
                }, (error) => {
                    ServiceTips({text: error.message, type: 'error'});
                })
            }
        });
    };

    //界面操作 滑动数组
    onTableMoveEnd = (list,current) => {
        let that = this,time;
        let targetList = list.map((e,i) => ({id:e.id,weight:i}));
        apiPost(API_FOODING_ES,"/permission/move",{beanArray:targetList},response => {
            ServiceTips({text:response.message,type:'success'});
            clearTimeout(time);
            time = setTimeout(() => {that.getPermissionByMenuId(this.state.menuId);},400)
        },error => ServiceTips({text:error.message,type:'error'}))
    };

    handleResize(height) {
        let sch = document.body.offsetHeight - 100 - height;
        let scroll = sch - 20;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px'});
    }

    menuSave(value, data) {
        //菜单保存
        var that = this;
        value = Object.assign({}, data, value);
        apiPost(API_FOODING_ES, '/menu/save', value, (response) => {
            ServiceTips({text: response.message, type: 'sucess'});
            that.setState({showDilaog: false, menusetView: value});
            that.getMenuById(this.state.menuId);
            that.getTree();
        }, (error) => {
            ServiceTips({text: error.message, type: 'error'});
        })
    }

    upload(menuId, aaa) {

        let that = this;
        that.getMenuById(menuId);
        that.getTree();

        console.log(menuId);
        console.log(aaa);

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
        console.log(info.node.props.title, info);
        apiForm(API_FOODING_ES, '/menu/move', {
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
        apiGet(API_FOODING_ES, '/menu/getTree', null, (response) => {
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
        let that = this;
        const {menusetView, BIData, rightFuncShow, iconArray,tableDate} = this.state;
        // const TreeNode=Tree.TreeNode;
        // const loop = data => {
        //      return data.map((item) => {
        //        if (item.children && item.children.length) {
        //          return <TreeNode key={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
        //        }
        //        return <TreeNode key={item.id} title={item.name}/>;
        //      });
        //    };
        // <Tree
        // 				onRightClick={this.onRightClick}
        // 				onSelect={this.onSelect}
        //         				defaultSelectedKeys={['0']}
        //         				showIcon={false}
        //         				selectable={true}
        //         				checkable={false}
        //         				defaultExpandedKeys={true}
        //         				defaultExpandedKeys={['menu']}
        //         			>
        // 				{loop(this.state.gData)}
        // 			</Tree>
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
                    <div style={{width: '100%', borderRadius: '6px', zIndex: 4, position: "relative"}}
                         className='menuset-measurement'>
                        <div style={{borderBottom: '1px solid #eeeeee'}}>
                            <div className='item-title-one'>
                                <span className='title'>{i18n.t(200746/*界面操作*/)}</span>
                                {permissionsBtn('menuset.add')?
                                    <span className='icon' onClick={this.onTableAddClick}><i className={'foddingicon fooding-add-icon3'}></i></span> : ''
                                }
                            </div>
                        </div>
                        {
                            tableDate && tableDate.length ? <CustomDrag
                                onMoveEnd={this.onTableMoveEnd}
                                data={this.state.tableDate || []}
                                columns={
                                    [{
                                        title: i18n.t(100001/*名称*/),
                                        dataIndex: 'name',
                                        key: "name",
                                        width: '15%',
                                        render(data, row, index) {
                                            return data;
                                        }
                                    },
                                    {
                                        title: i18n.t(200745/*标识*/),
                                        dataIndex: 'identity',
                                        key: "identity",
                                        width: '15%',
                                        render(data, row, index) {
                                            return data;
                                        }
                                    },
                                    {
                                        title: "URL",
                                        dataIndex: 'url',
                                        key: "url",
                                        width: '40%',
                                        render(data, row, index) {
                                            return data;
                                        }
                                    },
                                    {
                                        title: i18n.t(200747/*所属系统*/),
                                        dataIndex: 'module',
                                        key: "module",
                                        width: '15%',
                                        render(data, row, index) {
                                            return data && data.name ? data.name : "";
                                        }
                                    },{
                                    title: i18n.t(200098/*操作*/),
                                    dataIndex: 'opeate',
                                    key: "opeate",
                                    width: '8%',
                                    render(data, row, index) {
                                        return (<div>
                                            {permissionsBtn('menuset.edit') ?
                                                <i className='foddingicon fooding-alter_icon2' onClick={that.onTableEditClick.bind(that,data,row)} style={{cursor:'pointer'}}></i> : ""}&nbsp;&nbsp;&nbsp;&nbsp;
                                            {permissionsBtn('menuset.del') ?
                                                <i className='foddingicon fooding-delete-icon3' onClick={that.onTableDelClick.bind(that,data,row)} style={{cursor:'pointer'}}></i> : ""}</div>);
                                    }
                                    }]
                                }
                            />:""
                        }

                    </div>
                    {
                        (menusetView && menusetView['bi']) ?
                            <div style={{width: '100%', borderRadius: '6px', zIndex: 4, position: "relative"}}
                                 className='menuset-measurement'>
                                <div style={{borderBottom: '1px solid #eeeeee'}}>
                                    <div className='item-title-one'>
                                        <span className='title'>{i18n.t(600236/*报表名称*/)}</span>
                                        {permissionsBtn('menuset.add') && BIData && BIData.length == 0 ?
                                            <span className='icon' onClick={this.onBIAddClick}><i className={'foddingicon fooding-add-icon3'}></i></span> : ''
                                        }
                                    </div>
                                </div>
                                {
                                    BIData && BIData.length ? <CustomDrag
                                        onMoveEnd={this.onBIMoveEnd}
                                        data={BIData || []}
                                        columns={
                                            [{
                                                title: i18n.t(600236/*报表名称*/),
                                                dataIndex: 'name',
                                                key: "name",
                                                width: '80%',
                                                render(data, row, index) {
                                                    return data;
                                                }
                                            }, {
                                                title: i18n.t(200098/*操作*/),
                                                dataIndex: 'opeate',
                                                key: "opeate",
                                                width: '10%',
                                                render(data, row, index) {
                                                    return (<div>
                                                        {permissionsBtn('menuset.edit') ?
                                                            <i className='foddingicon fooding-alter_icon2' onClick={that.onBIEditClick.bind(that,data,row)} style={{cursor:'pointer'}}></i> : ""}&nbsp;&nbsp;&nbsp;&nbsp;
                                                        {permissionsBtn('menuset.del') ?
                                                            <i className='foddingicon fooding-delete-icon3' onClick={that.onBIDelClick.bind(that,data,row)} style={{cursor:'pointer'}}></i> : ""}</div>);
                                                }
                                            }]
                                        }
                                    />:""
                                }

                            </div> : ""
                    }
                </div>
            </div>
            <Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
                {this.state.dialogContent}
            </Dialog>
        </div>)
    }
}

export default MenuSetting;


// { (menusetView && menusetView['bi']) ?
{/*<MenuSettingBI*/
}
// title ={i18n.t(600236/*报表名称*/)}
// onCancel ={this.onCancel}
// Zindex ={4}
// moduleIdArray={BIData}
// openDialog={this.handleMenuBIClick}
// onSaveAndClose={this.onSaveAndCloseBI}
// DialogTempalte ={require('./AddBI').default}
// showHeader ={true}
// checkedRowsArray={[]}
// id={'menu-operate-00'}
// menusetView	={this.state.menusetView}
// columns ={
//    [{
//        title : i18n.t(600236/*报表名称*/),
//        dataIndex : 'name',
//        key : "name",
//width : '15%',
// render(data,row,index){
//     return (<div title={data}>{data}</div>)
// }
// }]
// }
// data={BIData}
// />
// :''
// }



//<MenuSettingOperate onCancel={this.onCancel} title={i18n.t(200746/*界面操作*/)}
//    Zindex={4}
//    moduleIdArray={this.state.moduleIdArray}
 //   openDialog={this.handleMenuClick}
//    onSaveAndClose={this.onSaveAndClose}
//    DialogTempalte={require('./MenuSettingOperateAddandEditDialog').default}
//    showHeader={true}
//    checkedRowsArray={[]}
//    id={'menu-operate-BI'}
//    upload={this.upload}
//    menusetView={this.state.menusetView}
//    columns={
//        [{
//            title: i18n.t(100001/*名称*/),
//            dataIndex: 'name',
//            key: "name",
//            width: '15%',
//            render(data, row, index) {
//                return (<div title={data}>{data}</div>)
//            }
//        },
//            {
//                title: i18n.t(200745/*标识*/),
//                dataIndex: 'identity',
//                key: "identity",
//                width: '15%',
//                render(data, row, index) {
//                    return (<div title={data}>{data}</div>)
 //               }
//            },
//            {
//                title: "URL",
//                dataIndex: 'url',
//                key: "url",
//                width: '40%',
//                render(data, row, index) {
//                    return (<div title={data}>{data}</div>)
//                }
//            },
//            {
//                title: i18n.t(200747/*所属系统*/),
//                dataIndex: 'module',
//                key: "module",
//                width: '15%',
//                render(data, row, index) {
//                    return (<div title={data}>{data ? data.name : ''}</div>)
//                }
//            }]
//    }
//    data={this.state.tableDate}
// />
