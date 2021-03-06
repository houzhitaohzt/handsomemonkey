import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Tree from '../../../../components/Tree';
import {gData} from './util';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import Dialog from '../../../../components/Dialog/Dialog';
import RightFuncKeys from "../../Organization/components/RightFuncKeys";
import CheckBox from "../../../../components/CheckBox";
//引入select插件
import Select, {Option} from '../../../../components/Select';
//引入table
const {Table} = require("../../../../components/Table");
import AuthorityConfigDialog from './AuthorityConfigDialog';

import SystemCommonAuthorityThree from "../../../../components/SystemRuleTem/components/SystemCommonAuthorityThree";
import {permissionsBtn,apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../../services/apiCall';
import {errorTips, successTips} from '../../../../components/ServiceTips';

class Authority extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.firstonSelect = this.firstonSelect.bind(this);
        this.onSecondSelect = this.onSecondSelect.bind(this);
        this.secondonCheck = this.secondonCheck.bind(this);
        this.onSaveAndEdit = this.onSaveAndEdit.bind(this);
        this.onSaveAndEditOperate = this.onSaveAndEditOperate.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.handleClickTable = this.handleClickTable.bind(this);
        this.state = {
            gData: [],
            nodeData: {},
            gDataTree: [],
            authorityData: [],//数据权限列表
            scroll: 0,
            scroll2: 0,
            scrollHeight: 0,
            rightFuncShow: false,//控制右键是否出来
            x: 0,
            y: 0,
            treeChecked: false,
            operateChecked: false,
            showRightSecurity: false,
            showDilaog: false,//控制弹出层是否出来
            content: '',
            classN: 'foddingicon fooding-alter_icon2',//控制当树展开时就可以显示icon,
            dialogContent: '<div></div>',
            partyId: '',
            menuId: '',
            checkedAll: false,
            anthorityData: [],//操作权限
            anthorityCkData: [],
            anthorityBCkData: [],
            checkedKeys: [],
            selectedKeys: [],
            securitySelect: [],
            securitySelectDef: undefined,
            initData: {},

        }
    }

    onSaveAndClose() {
        this.setState({showDilaog: false})
    }

    onDataAuthoritySaveAndClose = () => {
        this.requestListByPartyIdAndMenuId({partyId: this.state.partyId[0], menuId: this.state.menuId[0]});
        this.onSaveAndClose();
    };

    onCancel() {
        this.setState({
            showDilaog: false
        })
    }

    getLoginClusters() {
        let that = this;
        apiGet(API_FOODING_ES, '/party/getPartySyncTreeByLoginUser2', {}, (response) => {
            that.setState({gData: response.data || [] });
        }, (error) => {

        })
    }

    /**
     * 保存菜单权限
     * @returns {*}
     */
    saveSecurityMenu() {
        let that = this;
        // if (!this.state.checkedKeys.length) return that.firstonRequest(that.state.partyId);
        Confirm("是否保存修改?", {
            done: ()=>{
                apiForm(API_FOODING_ES, '/partyMenuPermission/menu/save', {
                    partyId: that.state.partyId[0],
                    menuId: that.state.checkedKeys
                }, response => {
                    that.firstonRequest(that.state.partyId);
                }, error => errorTips(error.message));
            },
            close: ()=>{
                that.firstonRequest(that.state.partyId);
            }
        });

    }

    saveSecurityMenuPermission() {
        // if (!this.state.anthorityCkData.length) return;
        Confirm("是否保存修改?", {
            done: ()=>{
                apiPost(API_FOODING_ES, '/partyMenuPermission/permission/save', {
                    partyId: this.state.partyId[0],
                    menuId: this.state.menuId[0],
                    permissionIds: this.state.anthorityCkData
                }, response => {
                    this.setState({anthorityBCkData: this.state.anthorityCkData});
                    successTips('保存成功!');
                }, error => errorTips(error.message));
            },
            close: ()=>{
                let checkedAll = this.state.anthorityBCkData.length === this.state.anthorityData.length;
                this.setState({anthorityCkData: this.state.anthorityBCkData, checkedAll});
            }
        });
    }

    handleClickTable = (e, data, dialogContent) => {
        if (data.number == 2) {
            Confirm('是否要删除该数据权限？', {
                done: () => {
                    apiForm(API_FOODING_ES, '/objectParty/delete', {id: data.record.id},
                        response => {
                            successTips("删除成功!");
                            this.requestListByPartyIdAndMenuId({partyId: this.state.partyId[0], menuId: this.state.menuId[0]});
                        }, error => {
                            errorTips(error.message);
                        });
                }
            });
        } else {
            let dialogTitle = data.action + data.name.title;
            this.setState({
                showDilaog: true,
                title: dialogTitle,
                dialogContent: dialogContent
            });
        }
    };

    firstonSelect(key, obj) {
        //左边树的点击事件
        let that = this;
        that.cancelEditMenu(key);
        that.firstonRequest(key);
    }

    firstonRequest(key) {
        if(key[0] == 10) return false;  // 平台跳过点击

        let that = this;
        if( !key.length) return this.setState({gDataTree: [], partyId: []});
        apiGet(API_FOODING_ES, '/partyMenuPermission/menu/getTree2ByPartyId',
            {partyId: key[0]}, (response) => {
                let array = [];
                array.push(response.data);
                that.setState({
                    gDataTree: array,
                    partyId: key
                });
            }, (error) => {

            })
    }

    cancelEditMenu() {
        let className = 'foddingicon fooding-alter_icon2';
        let treeChecked = false;
        this.setState({classN: className, treeChecked, showRightSecurity: false, selectedKeys: []});
    }

    getEditMenuTree() {
        //左边树的点击事件
        let that = this;
        let params = {partyId: this.state.partyId[0]};
        let response1, response2;
        let success = () => {
            if (response1 && response2) {
                that.setState({gDataTree: [response1.data], checkedKeys: response2.data || [], treeChecked: true});
            }
        };
        apiGet(API_FOODING_ES, '/partyMenuPermission/menu/getTree1ByPartyId', params,
            (response) => {
                response1 = response;
                success();
            }, (error) => console.error(error));

        apiGet(API_FOODING_ES, '/partyMenuPermission/menu/getIdListByPartyId', params,
            (response) => {

                response2 = response;
                success();
            },
            (error) => console.error(error));
    }

    /**
     * 根据tree所选的key获取数据结构中的对象数据
     * @param treeData tree data
     * @param key treeNode key
     * @returns {*}
     */
    getSelectByKey(treeData, key) {
        for (let i = 0, j = treeData.length; i < j; i++) {
            let data = treeData[i];
            if (data.id === key) {
                return data;
            } else if (data.children && data.children.length) {
                data = this.getSelectByKey(data.children, key);
                if (data) return data;
            }
        }
        return null;
    }

    onSecondSelect(key, obj) {
        if (!key.length) return this.setState({selectedKeys: key, showRightSecurity: false});
        //中间的树的点击事件
        let params = {partyId: this.state.partyId[0], menuId: key[0]};
        let rep1, rep2, nodeData = this.getSelectByKey(this.state.gDataTree, params.menuId);
        this.setState({
            nodeData,
            securitySelect: [], securitySelectDef: undefined,
            showRightSecurity: nodeData.url !== '', selectedKeys: key, menuId: key, rightFuncShow: false,
            operateChecked: false, anthorityCkData: [], anthorityBCkData: [], anthorityData: [], authorityData: [], checkedAll: false
        });

        let success = () => {
            if (rep1 && rep2) {
                let anthorityCkData = rep2.data.map(rp => rp.id);
                let checkedAll = rep1.data.length === anthorityCkData.length;
                this.setState({anthorityData: rep1.data, anthorityCkData, checkedAll, anthorityBCkData: anthorityCkData});
            }
        };
        apiGet(API_FOODING_ES, "/partyMenuPermission/permission/getList1ByPartyIdAndMenuId", params,
            (response) => {
                rep1 = response;
                success();
            }, (error) => {
                console.log(error);
            });
        apiGet(API_FOODING_ES, "/partyMenuPermission/permission/getList2ByPartyIdAndMenuId", params,
            (response) => {
                rep2 = response;
                success();
            }, (error) => {
                console.log(error);
            });
        this.requestListByPartyIdAndMenuId(params);
        apiGet(API_FOODING_ES, "/objectParty/getInit", {menuId: key[0]},
            (response) => {
                // console.log(response, "init");
                this.setState({rightFuncShow: true, initData: response.data});
            }, (error) => {
                // this.setState({rightFuncShow: false, initData: {}});
                // console.log(error);
            });
        apiGet(API_FOODING_ES, "/acl/getAclListByMenuId", params,
            ({data}) => {
                data && this.setState({securitySelectDef: data.aclId ? String(data.aclId) : undefined, securitySelect: data.aclList});
            }, error => console.log(error));

    }

    requestListByPartyIdAndMenuId(params) {
        apiGet(API_FOODING_ES, "/objectParty/getListByPartyIdAndMenuId", params,
            (response) => {
                this.setState({authorityData: response.data});
            }, (error) => {
                console.log(error);
            });
    }

    secondonCheck(keys, {checkedNodes}) {
        let checkedKeys = [];
        checkedNodes.forEach(node => {
            ('children' in node.props && node.props.children.length) || checkedKeys.push(node.key);
        });
        this.setState({checkedKeys});
    }

    onFormAutChange = ids => {
        this.setState({securitySelectDef: ids});
        if (parseInt(ids) !== 3){
            this.onAuthConfigEdit(ids);
        }
    };

    onFormAutSelect = ids => {
        if (parseInt(ids) === 3) {
            let dialogContent = <AuthorityConfigDialog onSaveAndClose={this.onAuthConfigEdit} menuId={this.state.menuId[0]}
                                                       onCancel={this.onCancel} partyId={this.state.partyId[0]}/>;
            this.setState({
                showDilaog: true,
                title: i18n.t(201128/*配置表单权限*/),
                dialogContent: dialogContent
            });
        }
    };

    onAuthConfigEdit = (aclId, checkedKeys = []) => {
        apiPost(API_FOODING_ES, '/acl/distributeDefinationForm', {
            aclPartyIds: checkedKeys,
            partyId: this.state.partyId[0],
            menuId: this.state.menuId[0],
            aclId: aclId
        }, response => {
            successTips("保存成功!");
            this.onSaveAndClose();
        }, error => {
            errorTips(error.message);
        })
    };

    onSaveAndEdit() {//icon的保存和编辑按钮
        if ( !this.state.gDataTree.length) return errorTips('没有数据可编辑!');
        let className, treeChecked = this.state.treeChecked;
        if (this.state.classN === 'foddingicon fooding-save bg') {
            className = 'foddingicon fooding-alter_icon2';
            treeChecked = false;
            this.saveSecurityMenu();
        } else {
            this.getEditMenuTree();
            className = 'foddingicon fooding-save bg';
        }
        this.setState({classN: className, treeChecked})
    }

    onSaveAndEditOperate() {//操作中的icon保存和编辑
        let operateChecked = !this.state.operateChecked;
        if (!operateChecked) {
            this.saveSecurityMenuPermission();
        }
        this.setState({operateChecked})
    }

    handleChangeAll(e) {//权限操作的全选和全不选
        if (!this.state.operateChecked) return;
        let checkedAll = !this.state.checkedAll;
        let array = [];
        if (checkedAll) {
            array = this.state.anthorityData.map(da => da.id);
        }
        this.setState({checkedAll, anthorityCkData: array});
    }

    handleChange(e) {//选择与不选择
        let value = e.target.value;
        let {operateChecked, anthorityCkData, anthorityData, checkedAll} = this.state;
        if (!operateChecked) return;
        let array = Array.from(anthorityCkData);
        if (array.indexOf(value) !== -1) array.remove(value);
        else array.push(value);

        checkedAll = array.length === anthorityData.length;
        this.setState({anthorityCkData: array, checkedAll});
    }

    handleResize() {
        let sch = document.body.offsetHeight - 82 - 86;
        let scroll = sch - 20;
        let scroll2 = scroll - 55;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px', scroll2: scroll2 + 'px'});
    }

    componentDidMount() {
        this.handleResize();
        this.getLoginClusters();
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

    renderRightSecurity() {
        const {rightFuncShow, content, available, add, del, query, clear, nodeData} = this.state;
        let columns = [{
            title: i18n.t(200896/*属性*/),
            dataIndex: 'attributeName',
            key: "attributeName",
            width: '35%',
            render(data, row, index){
                return (<div title={data}>{data}</div>)
            }
        },
            {
                title: i18n.t(201129/*表达式*/),
                dataIndex: 'expression',
                key: "expression",
                width: '15%',
                render(data, row, index){
                    return (<div title={data}>{data}</div>)
                }
            },
            {
                title: i18n.t(201130/*属性值*/),
                dataIndex: 'attrValueNames',
                key: "attrValueNames",
                width: '50%',
                render(data, row, index){
                    return (<div title={data}>{(data || []).join(',')}</div>)
                }
            }];
        console.log(nodeData.ruleScopeType)
        return (
            <div className={'authority-content-all-show scroll'} style={{height: this.state.scroll}}>
               {/* 判断如果是0则全部不显示,如果是1则数据权限显示,如果是2则表单权限显示;*/}
                    {
                        nodeData.ruleScopeType === 1?<div className={'data-authority'}><SystemCommonAuthorityThree onCancel={this.onCancel} title={i18n.t(201131/*数据权限*/)}
                                                                                   zIndex={4}
                                                                                   rightFuncShow={this.state.rightFuncShow}
                                                                                   openDialog={this.handleClickTable}
                                                                                   DialogTempalte={require('./DataAuthorityEditDialog').default}
                                                                                   showHeader={true}
                                                                                   onSaveAndClose={this.onDataAuthoritySaveAndClose}
                                                                                   checkedRowsArray={[]}
                                                                                   id={'system-authority-01'}
                                                                                   columns={columns}
                                                                                   partyId={this.state.partyId[0]}
                                                                                   menuId={this.state.menuId[0]}
                                                                                   initData={this.state.initData}
                                                                                   data={this.state.authorityData}
                        /></div>:null
                    }
                {
                    nodeData.ruleScopeType === 2?<div className={'form-authority'}>
                        <div className={'form-authority-title'}>{i18n.t(201132/*表单权限*/)}</div>
                        <div style={{padding: '10px 0'}}>
                            <Select
                                animation='slide-up'
                                placeholder=''
                                className='currency-btn select-from-currency'
                                choiceTransitionName="rc-select-selection__choice-zoom"
                                optionLabelProp="children"
                                style={{width: 320}}
                                allowClear={false}
                                value={this.state.securitySelectDef}
                                onChange={this.onFormAutChange}
                                onSelect={this.onFormAutSelect}
                            >
                                {this.state.securitySelect.map((op, index) => <Option value={String(op.id)} key={index}>{op.name}</Option>)}
                            </Select>
                        </div>
                    </div>:null
                }


                <div className={'operate-authority'}>
                    <div className={'operate-authority-icon'}>
                        <span>{i18n.t(201133/*操作权限*/)}</span>
                        { permissionsBtn('authority.edit') ?
                        <i className={this.state.operateChecked ? "foddingicon fooding-save bg" : "foddingicon fooding-alter_icon2"}
                           onClick={this.onSaveAndEditOperate}/>
                        :
                        ''
                        }
                    </div>
                    <ul className={'operate-authority-select'}>
                        <li>
                            <span>{i18n.t(201134/*权限名称*/)}</span>
                            <span>
                                <CheckBox value={'0'} onChange={this.handleChangeAll.bind(this)} checked={this.state.checkedAll}/>可用
                            </span>
                        </li>
                        {
                            this.state.anthorityData.map((e, i) => {
                                return (<li key={i}><span>{e.localName}</span>
                                    <span>
                                        <CheckBox value={e.id} onChange={this.handleChange.bind(this)}
                                                  checked={this.state.anthorityCkData.indexOf(e.id) !== -1}/>
                                    </span>
                                </li>)
                            })
                        }

                    </ul>

                </div>
            </div>
        );
    }

    render() {
        const {rightFuncShow, content, available, add, del, query, clear} = this.state;

        return (<div className={'authority-content'}>
            <div className={'authority-content-all'} style={{height: this.state.scrollHeight}}>
                <div className={'authority-content-all-tree scroll'} style={{height: this.state.scroll}}>
                    <Tree
                        onSelect={this.firstonSelect}
                        defaultSelectedKeys={['0']}
                        showIcon={true}
                        selectable={true}
                        checkable={false}
                        gData={this.state.gData}
                        obtainIcon={this.obtainIcon}
                    >
                    </Tree>

                </div>
                <div className={'authority-content-all-tree scroll'} style={{height: this.state.scroll}}>
                    <div className={'authority-content-all-tree-opeat'}>
                        { permissionsBtn('authority.edit') ?
                            <i className={this.state.classN} onClick={this.onSaveAndEdit}/>
                            :
                            ''
                        }
                    </div>
                    <div className={'authority-content-all-tree-next scroll'} style={{height: this.state.scroll2}}>
                        <Tree
                            onSelect={this.onSecondSelect}
                            onCheck={this.secondonCheck}
                            showIcon={false}
                            selectable={true}
                            checkable={this.state.treeChecked}
                            gData={this.state.gDataTree}
                            checkedKeys={this.state.checkedKeys}
                            selectedKeys={this.state.selectedKeys}
                        >
                        </Tree>
                    </div>
                </div>
                {this.state.showRightSecurity && this.renderRightSecurity()}
            </div>
            <Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
                {this.state.dialogContent}
            </Dialog>
        </div>)
    }
}
export default Authority;
