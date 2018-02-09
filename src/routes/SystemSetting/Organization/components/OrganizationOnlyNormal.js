import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import SystemRuleTem from  '../../../../components/SystemRuleTem';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';

import xt from '../../../../common/xt';
export class OrganizationOnlyNormal extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
    }

    handleClick = (e, data, Template) => {
        if (data.number == 2) {
            Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    console.log('ok, got it');
                }
            });
        } else {
            let dialogTitle = data.action + data.name.title;
            this.setState({
                visible: true,
                dialogTitle: dialogTitle,
                dilogTelmp: Template
            });
        }
    }

    onSaveAndClose(values) {
        this.setState({visible: false});
        this.props.onRefreshPanel && this.props.onRefreshPanel(this.props.partyId);
    }

    onCancel() {
        this.setState({visible: false});
    }

    initState() {
        return {
            visible: false,
            dialogTitle: '',
            dilogTelmp: <div></div>
        }
    }

    render() {
        const commonForm = this.state.dilogTelmp;
        let data = this.props.data;
        let tempArray = [
            {key: i18n.t(100001/*名称*/), value: xt.getItemValue(data, 'party.localName')},
            {key: i18n.t(200080/*类型*/), value: xt.getItemValue(data, 'party.partyType.name')},
            {key: i18n.t(100226/*英文名称*/), value: xt.getItemValue(data, 'party.enName')},
        ];
        if(xt.getItemValue(data, 'party.typeId')  == 50){
            tempArray.push({key: i18n.t(400269/*岗位属性*/), value: xt.getItemValue(data, 'party.positn.localName')})
        }
        if(xt.getItemValue(data, 'party.typeId')  == 40){
            tempArray.push({key: i18n.t(400270/*部门属性*/), value: xt.getItemValue(data, 'party.depmnt.localName')})
        }
        return (
            <div>
                <div>
                    <div className='col'>
                        <Template1 
                            menuList={[
                                {permissions:'party.edit',type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                            ]}                        
                            onCancel={this.onCancel}
                                   width={107}
                                   DialogTempalte={require('./OrganizationOnlyNormalDialog').default}
                                   isShowMenu={!!data.party.parentId}
                                   openDialog={this.handleClick}
                                   onSaveAndClose={this.onSaveAndClose}
                                   perfixCel={'template-system'}
                                   responseData={data}
                                   id={'product-detail-00'} title={i18n.t(100138/*常规*/)} tempArray={tempArray}/>
                    </div>
                </div>
                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                    {commonForm}
                </Dialog>
            </div>
        );
    }
}
export default OrganizationOnlyNormal;
