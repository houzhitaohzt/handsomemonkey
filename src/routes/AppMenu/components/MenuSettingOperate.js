import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';

const {Table} = require("../../../components/Table");
import MeasureCommonDialog from '../../../components/RuleTemplate/components/MeasureCommonDialog';
import RightKey from '../../../components/RightKey/RightKey';
import Morekeys from "../../../components/SystemRuleTem/components/Morekeys";
import {permissionsBtn} from '../../../services/apiCall';

export class MeasureCommon extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.addClick = this.addClick.bind(this);
        this.onHeaderCellClick = this.onHeaderCellClick.bind(this);
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

    onHeaderCellClick(e, data) {

    }

    onRowClick(record, index, checked) {

    }

    addClick(data) {
        let DialogTempalte = this.props.DialogTempalte;
        let element = React.createElement(DialogTempalte,
            {
                onSaveAndClose: this.props.onSaveAndClose, onCancel: this.props.onCancel,
                data: data, id: this.props.id, moduleIdArray: this.props.moduleIdArray
            });
        if (this.props.DialogTempalte) {
            this.props.openDialog(null, data, element);
        } else {
            this.props.openDialog(null, data, <MeasureCommonDialog
                onSaveAndClose={this.props.onSaveAndClose}
                onCancel={this.props.onCancel}
                data={data} id={data.id}/>);
        }
    }

    handleClick(e, data, target) {
        let DialogTempalte = this.props.DialogTempalte;
        let element = React.createElement(DialogTempalte,
            {
                onSaveAndClose: this.props.onSaveAndClose, onCancel: this.props.onCancel,
                data: data, id: this.props.id, moduleIdArray: this.props.moduleIdArray,
                upload: this.props.upload

            });
        if (DialogTempalte) {
            this.props.openDialog(e, data, element, this.refs["mainTable" + this.props.id].getSelectArr());
        } else {
            this.props.openDialog(e, data, <MeasureCommonDialog
                onSaveAndClose={this.props.onSaveAndClose}
                onCancel={this.props.onCancel}
                data={data} id={this.props.id}/>);
        }
    }

    handleResize(height) {
        let sch = document.body.offsetHeight - 360 - height;
        let scroll = sch - 20;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px'});
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize(0));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    render() {
        let {array, title} = this.props;
        let arrayRightkey = [
            {
                permissions: 'appmenuset.add',
                type: i18n.t(100392/*新增*/),
                child: <div><i className='foddingicon fooding-add-icon3'></i>{i18n.t(100392/*新增*/)}</div>
            }
        ];
        let iconArray = [
            {
                permissions: 'menuset.edit',
                action: i18n.t(100439/*编辑*/),
                classn: 'foddingicon fooding-alter_icon2',
                title: i18n.t(100439/*编辑*/),
                data: {action: i18n.t(100439/*编辑*/), number: 0, name: {title: this.props.title}, id: this.props.id}
            },
            {
                permissions: 'menuset.add',
                action: i18n.t(100392/*新增*/),
                classn: 'foddingicon fooding-add-icon3',
                title: i18n.t(100392/*新增*/),
                data: {action: i18n.t(100392/*新增*/), number: 1, name: {title: this.props.title}, id: this.props.id}
            },
            {
                permissions: 'menuset.del',
                action: i18n.t(100437/*删除*/),
                classn: 'foddingicon fooding-delete-icon3',
                title: i18n.t(100437/*删除*/),
                data: {action: i18n.t(100437/*删除*/), number: 2, name: {title: this.props.title}, id: this.props.id}
            }
        ];
        if (this.props.data.length == 0) {
            return (
                <RightKey array={arrayRightkey.filter(o => o['permissions'] ? permissionsBtn(o['permissions']) : 1)}
                          handleClick={this.addClick.bind(this, {
                              action: i18n.t(100392/*新增*/),
                              name: {title: this.props.title},
                              id: this.props.id,
                              number: 1
                          })} isShowMenu={true} id={this.props.id}>
                    <div style={{width: '100%', overflow: 'hidden', borderRadius: '6px'}}
                         className='menuset-measurement nodata'>
                        <div>
                            <div className='item-title-one'><span className='title'>{title}</span>
                                {permissionsBtn('menuset.add') ?
                                    <span className='icon'><i className={'foddingicon fooding-add-icon3'}
                                                              onClick={this.addClick.bind(this, {
                                                                  action: i18n.t(100392/*新增*/),
                                                                  name: {title: this.props.title},
                                                                  id: this.props.id,
                                                                  number: 1
                                                              })}></i></span>
                                    :
                                    ''
                                }
                            </div>
                        </div>
                    </div>
                </RightKey>)
        } else {
            return (
                <div style={{width: '100%', borderRadius: '6px', zIndex: this.props.Zindex, position: "relative"}}
                     className='menuset-measurement'>
                    <div style={{borderBottom: '1px solid #eeeeee'}}>
                        <div className='item-title-one'>
                            <span className='title'>{title}</span>
                        </div>
                    </div>
                    <Morekeys iconArray={iconArray.filter(o => o['permissions'] ? permissionsBtn(o['permissions']) : 1)}
                              id={this.props.id} datat={() => this.refs["mainTable" + this.props.id].getSelectArr()}
                              handleClick={this.handleClick}/>
                    <Table
                        ref={"mainTable" + this.props.id}
                        showHeader={this.props.showHeader}
                        columns={this.props.columns}
                        data={this.props.data}
                        checkboxConfig={{show: true, position: 'first'}}
                        colorFilterConfig={{show: false}}
                        followConfig={{show: false}}
                        scroll={{x: true, y: this.state.scrollHeight}}
                        onHeaderCellClick={this.onHeaderCellClick}
                        onRowClick={this.onRowClick}
                        onRowDoubleClick={this.onRowDoubleClick}
                        contextMenuConfig={{
                            enable: true,
                            contextMenuId: 'MeasureCommon' + this.props.id,
                            menuItems: [
                                {
                                    permissions: 'menuset.edit',
                                    onClick: this.handleClick,
                                    content: <div><i
                                        className={'foddingicon fooding-alter_icon2'}></i><span>{i18n.t(100439/*编辑*/)}</span>
                                    </div>,
                                    data: {
                                        action: i18n.t(100439/*编辑*/),
                                        number: 0,
                                        name: {title: this.props.title},
                                        id: this.props.id
                                    }
                                }, {
                                    permissions: 'menuset.add',
                                    onClick: this.handleClick,
                                    content: <div><i
                                        className={'foddingicon fooding-add-icon3'}></i><span>{i18n.t(100392/*新增*/)}</span>
                                    </div>,
                                    data: {
                                        action: i18n.t(100392/*新增*/),
                                        number: 1,
                                        name: {title: this.props.title},
                                        id: this.props.id
                                    }
                                },
                                {
                                    permissions: 'menuset.del',
                                    onClick: this.handleClick,
                                    content: <div><i
                                        className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
                                    data: {
                                        action: i18n.t(100437/*删除*/),
                                        number: 2,
                                        name: {title: this.props.title},
                                        id: this.props.id
                                    }
                                }
                            ]
                        }}
                    />
                </div>
            )
        }
    }
}

export default MeasureCommon;
