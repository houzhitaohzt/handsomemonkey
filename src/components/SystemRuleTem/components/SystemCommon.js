import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
const {Table} = require("../../Table");
// import '../../../routes/Client/Detail/Content/assets/_contactDialog.less';
// import "../assets/_systemDetaill.less";
import MeasureCommonDialog from './SystemCommonDialog';
import RightKey from '../../RightKey/RightKey';
import Morekeys from "./Morekeys";
import {permissionsBtn,apiPost, API_FOODING_DS, API_FOODING_ES, apiGet} from '../../../services/apiCall';

export class SystemCommon extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.addClick = this.addClick.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.state = this.initState();
    }

    initState() {
        this.datat = [];
        return {
            checkedRows: [],
            selectArr: [],
            choised: false,
            data: []
        }
    }

    onRowClick(record, index, checked) {

    }

    //新增初始化数据并且保存
    initAjax(data, error, sourceData) {
        console.log(data, error, sourceData)
        if (error) {
            ServiceTips({text: error, type: 'error'})
        } else {
            if (this.props.AjaxInit) {
                if (this.props.isPost || false) {
                    /*
                     AjaxInit 是否进行初始化，一般有用于编辑和少部分新增
                     数据开始进行初始化
                     params 请求传到参数 是一个对象
                     API_FOODING 传的是API_FOODING_DS,或者API_FOODING_ES
                     portname 请求网址 eg:'/address/getInit'
                     */
                    let params = Object.assign({}, {id: ''}, this.props.params);
                    apiPost(this.props.API_FOODING, this.props.portname, params, (response) => {
                        let initData = response.data;
                        let DialogTempalte = this.props.DialogTempalte;
                        let element = React.createElement(DialogTempalte,
                            {
                                onSaveAndClose: this.props.onSaveAndClose,
                                onSaveAdd: this.props.onSaveAdd,
                                onCancel: this.props.onCancel,
                                data: data,
                                id: this.props.id,
                                otherData: this.props.otherData,
                                initData: initData,
                                API_FOODING: this.props.API_FOODING
                            });
                        if (this.props.DialogTempalte) {
                            this.props.openDialog(null, data, element);
                        } else {
                            this.props.openDialog(null, data, <MeasureCommonDialog
                                onSaveAndClose={this.props.onSaveAndClose}
                                onCancel={this.props.onCancel}
                                onSaveAdd={this.props.onSaveAdd}
                                data={data} id={data.id} otherData={this.props.otherData} initData={initData}/>);
                        }
                    }, (error) => {
                        return false;
                    })
                } else if (this.props.addNoInit) {
                    /*
                     addNoInit 对于一些新增页面，不用初始化
                     */
                    let DialogTempalte = this.props.DialogTempalte;
                    let element = React.createElement(DialogTempalte,
                        {
                            onSaveAndClose: this.props.onSaveAndClose, onSaveAdd: this.props.onSaveAdd, onCancel: this.props.onCancel,
                            data: data, id: this.props.id, otherData: this.props.otherData, API_FOODING: this.props.API_FOODING
                        });
                    if (this.props.DialogTempalte) {
                        this.props.openDialog(null, data, element);
                    } else {
                        this.props.openDialog(null, data, <MeasureCommonDialog
                            onSaveAndClose={this.props.onSaveAndClose}
                            onCancel={this.props.onCancel}
                            onSaveAdd={this.props.onSaveAdd}
                            data={data} id={data.id} otherData={this.props.otherData}/>);
                    }
                } else {
                    /*
                     AjaxInit 是否进行初始化，一般有用于编辑和少部分新增
                     数据开始进行初始化
                     params 请求传到参数 是一个对象
                     API_FOODING 传的是API_FOODING_DS,或者API_FOODING_ES
                     portname 请求网址 eg:'/address/getInit'
                     */

                    let params = Object.assign({}, {id: ''}, this.props.params);
                    apiGet(this.props.API_FOODING, this.props.portname, params, (response) => {
                        let initData = response.data;
                        let DialogTempalte = this.props.DialogTempalte;
                        let element = React.createElement(DialogTempalte,
                            {
                                onSaveAndClose: this.props.onSaveAndClose,
                                onSaveAdd: this.props.onSaveAdd,
                                onCancel: this.props.onCancel,
                                data: data,
                                id: this.props.id,
                                otherData: this.props.otherData,
                                initData: initData,
                                API_FOODING: this.props.API_FOODING
                            });
                        if (this.props.DialogTempalte) {
                            this.props.openDialog(null, data, element);
                        } else {
                            this.props.openDialog(null, data, <MeasureCommonDialog
                                onSaveAndClose={this.props.onSaveAndClose}
                                onCancel={this.props.onCancel}
                                onSaveAdd={this.props.onSaveAdd}
                                data={data} id={data.id} otherData={this.props.otherData} initData={initData}/>);
                        }
                    }, (error) => {
                        return false;
                    })
                }
            } else {
                let DialogTempalte = this.props.DialogTempalte;
                let element = React.createElement(DialogTempalte,
                    {
                        onSaveAndClose: this.props.onSaveAndClose, onSaveAdd: this.props.onSaveAdd, onCancel: this.props.onCancel,
                        data: data, id: this.props.id, otherData: this.props.otherData, API_FOODING: this.props.API_FOODING
                    });
                if (this.props.DialogTempalte) {
                    this.props.openDialog(null, data, element);
                } else {
                    this.props.openDialog(null, data, <MeasureCommonDialog
                        onSaveAndClose={this.props.onSaveAndClose}
                        onCancel={this.props.onCancel}
                        onSaveAdd={this.props.onSaveAdd}
                        data={data} id={data.id} otherData={this.props.otherData}/>);
                }
            }
        }
    }

    /*
     新增页面, addBeforeSaveClick,
     addBeforeSaveClick 表明点击之前需要保存
     一般用于新增 比如 产品新增
     */
    addClick(data) {
        if (this.props.addBeforeSaveClick) {
            this.props.addBeforeSaveClick(this.initAjax.bind(this, data));
        } else {
            this.initAjax(data, null)
        }

    }

    handleClick(e, data, target) {
        this.datat = this.refs["mainTable" + this.props.id].getSelectArr();
        //data.number == 2表示删除，就不用走init的ajax请求
        if (data.number == 2) {
            data = Object.assign({}, data, {selectArr: this.datat});
            this.props.openDialog(e, data, <MeasureCommonDialog
                onSaveAndClose={this.props.onSaveAndClose}
                onCancel={this.props.onCancel}
                onSaveAdd={this.props.onSaveAdd}
                data={data} id={this.props.id}/>)
        } else {
            if (this.props.AjaxInit) {
                if (this.props.isPost || false) {
                    /*
                     数据开始进行初始化
                     params 请求传到参数 是一个对象
                     API_FOODING 传的是API_FOODING_DS,或者API_FOODING_ES
                     portname 请求网址 eg:'/address/getInit'
                     */

                    let params = Object.assign({}, this.props.params);
                    apiPost(this.props.API_FOODING, this.props.portname, params, (response) => {
                        let initData = response.data;
                        let DialogTempalte = this.props.DialogTempalte;
                        if (DialogTempalte) {
                            let element = React.createElement(DialogTempalte,
                                {
                                    onSaveAndClose: this.props.onSaveAndClose,
                                    onSaveAdd: this.props.onSaveAdd,
                                    onCancel: this.props.onCancel,
                                    data: data,
                                    id: this.props.id,
                                    otherData: this.props.otherData,
                                    initData: initData,
                                    API_FOODING: this.props.API_FOODING
                                });
                            this.props.openDialog(e, data, element);
                        } else {
                            this.props.openDialog(e, data, <MeasureCommonDialog
                                onSaveAndClose={this.props.onSaveAndClose}
                                onCancel={this.props.onCancel}
                                onSaveAdd={this.props.onSaveAdd}
                                data={data} id={this.props.id} otherData={this.props.otherData} initData={initData}/>);
                        }
                    }, (error) => {
                        //如果初始化数据每次成功，就组织默认事件
                        return false;
                    })
                } else if (this.props.addNoInit && data.number == 1) {
                    /*
                     data.number == 1 表示为新增
                     addNoInit 为true 表示在新增时不用进行ajax请求
                     数据不用进行初始化
                     */
                    let DialogTempalte = this.props.DialogTempalte;
                    if (DialogTempalte) {
                        let element = React.createElement(DialogTempalte,
                            {
                                onSaveAndClose: this.props.onSaveAndClose, onSaveAdd: this.props.onSaveAdd, onCancel: this.props.onCancel,
                                data: data, id: this.props.id, otherData: this.props.otherData, API_FOODING: this.props.API_FOODING
                            });
                        this.props.openDialog(e, data, element);
                    } else {
                        this.props.openDialog(e, data, <MeasureCommonDialog
                            onSaveAndClose={this.props.onSaveAndClose}
                            onCancel={this.props.onCancel}
                            onSaveAdd={this.props.onSaveAdd}
                            data={data} id={this.props.id} otherData={this.props.otherData}/>);
                    }
                } else {
                    /*
                     数据开始进行初始化
                     params 请求传到参数 是一个对象
                     API_FOODING 传的是API_FOODING_DS,或者API_FOODING_ES
                     portname 请求网址 eg:'/address/getInit'
                     只有编辑时才传id即需判断data.number == 0
                     */

                    let id;
                    if ((data.record && ('id' in data.record) ) && data.number == 0) {
                        id = data.record.id;
                    }
                    let params = Object.assign({}, {id: id}, this.props.params);
                    apiGet(this.props.API_FOODING, this.props.portname, params, (response) => {
                        let initData = response.data;
                        let DialogTempalte = this.props.DialogTempalte;
                        if (DialogTempalte) {
                            let element = React.createElement(DialogTempalte,
                                {
                                    onSaveAndClose: this.props.onSaveAndClose,
                                    onSaveAdd: this.props.onSaveAdd,
                                    onCancel: this.props.onCancel,
                                    data: data,
                                    id: this.props.id,
                                    otherData: this.props.otherData,
                                    initData: initData,
                                    API_FOODING: this.props.API_FOODING
                                });
                            this.props.openDialog(e, data, element);
                        } else {
                            this.props.openDialog(e, data, <MeasureCommonDialog
                                onSaveAndClose={this.props.onSaveAndClose}
                                onCancel={this.props.onCancel}
                                onSaveAdd={this.props.onSaveAdd}
                                data={data} id={this.props.id} otherData={this.props.otherData} initData={initData}/>);
                        }
                    }, (error) => {
                        //如果初始化数据每次不成功，就阻止默认事件
                        return false;
                    })
                }
            } else {
                let DialogTempalte = this.props.DialogTempalte;
                if (DialogTempalte) {
                    let element = React.createElement(DialogTempalte,
                        {
                            onSaveAndClose: this.props.onSaveAndClose, onSaveAdd: this.props.onSaveAdd, onCancel: this.props.onCancel,
                            data: data, id: this.props.id, otherData: this.props.otherData, API_FOODING: this.props.API_FOODING
                        });
                    this.props.openDialog(e, data, element);
                } else {
                    this.props.openDialog(e, data, <MeasureCommonDialog
                        onSaveAndClose={this.props.onSaveAndClose}
                        onCancel={this.props.onCancel}
                        onSaveAdd={this.props.onSaveAdd}
                        data={data} id={this.props.id} otherData={this.props.otherData}/>);
                }
            }
        }
    }

    render() {
        let {array, title} = this.props;
        let arrayRightkey = [
            {permissions:'party.add',type: i18n.t(100392/*新增*/), child: <div><i className='foddingicon fooding-add-icon3'></i>{i18n.t(100392/*新增*/)}</div>}
        ];
        let iconArray = [
            {
                permissions:'party.edit',
                action: i18n.t(100439/*编辑*/),
                classn: 'foddingicon fooding-alter_icon2',
                title: i18n.t(100439/*编辑*/),
                data: {action: i18n.t(100439/*编辑*/), number: 0, name: {title: this.props.title}, id: this.props.id}
            },
            {
                permissions:'party.add',
                action:i18n.t(100392/*新增*/),
                classn: 'foddingicon fooding-add-icon3',
                title: i18n.t(100392/*新增*/),
                data: {action: i18n.t(100392/*新增*/), number: 1, name: {title: this.props.title}, id: this.props.id}
            },
            {
                permissions:'party.del',
                action: i18n.t(100437/*删除*/),
                classn: 'foddingicon fooding-delete-icon3',
                title: i18n.t(100437/*删除*/),
                data: {action: i18n.t(100437/*删除*/), number: 2, name: {title: this.props.title}, id: this.props.id}
            },
            // {action:i18n.t(100441/*失效*/),classn:'foddingicon fooding-sx-icon2',title:i18n.t(100441/*失效*/),data:{action:i18n.t(100441/*失效*/),number:3,name:{title:this.props.title},id:this.props.id}}
        ];
        if (!this.props.data || this.props.data.length == 0) {
            return (
                <RightKey array={arrayRightkey.filter(o=>o['permissions'] ? permissionsBtn(o['permissions']) : 1 )} handleClick={this.addClick.bind(this, {
                    action: i18n.t(100392/*新增*/),
                    name: {title: this.props.title},
                    id: this.props.id,
                    number: 1,
                    otherData: this.props.otherData
                })} isShowMenu={true} id={this.props.id + 'MeasureCommon'}>
                    <div style={{
                        width: '100%', overflow: 'hidden', backgroundColor: '#fff', borderRadius: '6px',
                        marginBottom: 10, border: '1px solid #eeeeee'
                    }} className='systemdetail-measurement'>
                        <div>
                            <div className='item-title-one'><span className='title'>{title}</span>
                                { permissionsBtn('party.add') ? 
                                        <span className='icon'>
                                            <i
                                                className={'foddingicon fooding-add-icon3'} onClick={this.addClick.bind(this, {
                                                action: i18n.t(100392/*新增*/),
                                                name: {title: this.props.title},
                                                id: this.props.id,
                                                number: 1,
                                                otherData: this.props.otherData
                                            })}>
                                            </i>
                                        </span>
                                        :
                                        ''
                                }
                            </div>
                        </div>
                    </div>
                </RightKey>)
        } else {
            return (
                <div style={{
                    width: '100%', backgroundColor: '#fff', borderRadius: '6px', zIndex: this.props.Zindex,
                    border: '1px solid #eeeeee', marginBottom: 10, position: "relative"
                }} className='systemdetail-measurement'>
                    <div style={{bordeBottom: '1px solid #eeeeee'}}>
                        <div className='item-title-one'>
                            <span className='title'>{title}</span>
                        </div>
                    </div>
                    <Table
                        ref={"mainTable" + this.props.id}
                        showHeader={this.props.showHeader}
                        columns={this.props.columns}
                        data={this.props.data}
                        checkboxConfig={{
                            show: true, checkedAll: this.state.choised,
                            checkedRows: this.state.checkedRows, position: 'last'
                        }}
                        colorFilterConfig={{show: false}}
                        followConfig={{show: false}}
                        scroll={{x: true, y: 0}}
                        onHeaderCellClick={this.onHeaderCellClick}
                        onRowClick={this.onRowClick}
                        onRowDoubleClick={this.props.onRowDoubleClick}
                        contextMenuConfig={{
                            enable: true,
                            contextMenuId: 'SystemCommon' + this.props.id,
                            menuItems: this.props.menuItems || [{
                                permissions:'party.edit',                                
                                onClick: this.handleClick,
                                content: <div><i className={'foddingicon fooding-alter_icon2'}></i><span>{i18n.t(100439/*编辑*/)}</span></div>,
                                data: {
                                    action: i18n.t(100439/*编辑*/),
                                    number: 0,
                                    name: {title: this.props.title},
                                    id: this.props.id,
                                    otherData: this.props.otherData
                                }
                            },
                                {
                                    permissions:'party.add',                                    
                                    onClick: this.handleClick,
                                    content: <div><i className={'foddingicon fooding-add-icon3'}></i><span>添加</span></div>,
                                    data: {
                                        action: '添加',
                                        number: 1,
                                        name: {title: this.props.title},
                                        id: this.props.id,
                                        otherData: this.props.otherData
                                    }
                                },
                                {
                                    permissions:'party.del',
                                    onClick: this.handleClick,
                                    content: <div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
                                    data: {action: i18n.t(100437/*删除*/), number: 2, name: {title: this.props.title}, id: this.props.id}
                                },
                                // {
                                // 	onClick:this.handleClick,
                                // 	content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{i18n.t(100441/*失效*/)}</div>,
                                // 	data:{action:{i18n.t(100441/*失效*/)},number:3,name:{title:this.props.title},id:this.props.id}
                                // }
                            ]
                        }}
                    />
                    <Morekeys iconArray={iconArray.filter(o=>o['permissions'] ? permissionsBtn(o['permissions']) : 1 )} id={this.props.id} datat={() => this.refs["mainTable" + this.props.id].getSelectArr()}
                              handleClick={this.handleClick}/>
                </div>
            )
        }
    }
}

export default SystemCommon;
