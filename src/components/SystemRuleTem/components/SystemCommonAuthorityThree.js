import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
const {Table} = require("../../Table");
// import '../../../routes/Client/Detail/Content/assets/_contactDialog.less';
import "../assets/_systemDetaill.less";
import MeasureCommonDialog from './SystemCommonDialog';
import RightKey from '../../RightKey/RightKey';

export class SystemAuthorityCommon extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.addClick = this.addClick.bind(this);
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

    addClick(data) {
        let DialogTempalte = this.props.DialogTempalte;
        let element = React.createElement(DialogTempalte,
            {
                onSaveAndClose: this.props.onSaveAndClose, onCancel: this.props.onCancel,
                data: data, id: this.props.id
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
                onSaveAndClose: this.props.onSaveAndClose, onCancel: this.props.onCancel, menuId:this.props.menuId,
                data: data, id: this.props.id, initData: this.props.initData, partyId: this.props.partyId, authorityData: this.props.data
            });
        if (DialogTempalte) {
            this.props.openDialog(e, data, element);
        } else {
            this.props.openDialog(e, data, <MeasureCommonDialog
                onSaveAndClose={this.props.onSaveAndClose}
                onCancel={this.props.onCancel}
                data={data} id={this.props.id}/>);
        }

    }

    render() {
        let {array, title, rightFuncShow} = this.props;
        let tabMenu = [];
        if(rightFuncShow){
            tabMenu.push(
                {
                    permissions:'authority.add',
                    onClick: this.handleClick,
                    content: <div><i className={'foddingicon fooding-add-icon3'}></i><span>{i18n.t(100392/*新增*/)}</span></div>,
                    data: {action: i18n.t(100392/*新增*/), number: 0, name: {title: this.props.title}, id: this.props.id}
                }, {
                    permissions:'authority.edit',
                    onClick: this.handleClick,
                    content: <div><i className={'foddingicon fooding-alter_icon2'}></i><span>{i18n.t(100439/*编辑*/)}</span></div>,
                    data: {action: i18n.t(100439/*编辑*/), number: 1, name: {title: this.props.title}, id: this.props.id}
                }
            );
        }
        tabMenu.push(
            {
                permissions:'authority.del',
                onClick: this.handleClick,
                content: <div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
                data: {action: i18n.t(100437/*删除*/), number: 2, name: {title: this.props.title}, id: this.props.id}
            }
        );

        return (
            <div style={{
                width: '100%', zIndex: this.props.zIndex,
                marginBottom: 10, position: "relative"
            }} className='systemdetail-measurement'>
                <div>
                    <div className='item-title'>
                        <span className='title'>{title}</span>
                    </div>
                </div>
                <Table showHeader={this.props.showHeader}
                       columns={this.props.columns}
                       data={this.props.data}
                       checkboxConfig={{show: false}}
                       colorFilterConfig={{show: false}}
                       followConfig={{show: false}}
                       scroll={{x: true, y: 300}}
                       prefixCls={'rc-confirm-table'}
                       headerMenuConfig = {{
                           enable: rightFuncShow,
                           contextMenuId: 'SystemAuthorityCommon2' + this.props.id,
                           menuItems: [{
                               permissions:'authority.add',
                               onClick: this.handleClick,
                               content: <div><i className={'foddingicon fooding-add-icon3'}></i><span>{i18n.t(100392/*新增*/)}</span></div>,
                               data: {action: i18n.t(100392/*新增*/), number: 0, name: {title: this.props.title}, id: this.props.id}
                           }]
                       } }
                       contextMenuConfig={{
                           enable: true,
                           contextMenuId: 'SystemAuthorityCommon' + this.props.id,
                           menuItems: tabMenu
                       }}
                />
            </div>
        )
    }
}

export default SystemAuthorityCommon;
