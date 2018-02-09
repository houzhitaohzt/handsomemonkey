import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import xt from '../../../../common/xt';
import SystemRuleTem from  '../../../../components/SystemRuleTem';
import OnlyreadyRuleTemplate from  '../../../../components/OnlyreadyRuleTemplate';
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips'; // 提示
import {apiPost, API_FOODING_DS, API_FOODING_ES, apiGet, apiForm} from '../../../../services/apiCall';
import {I18n} from "../../../../lib/i18n";

export class OrganizationCommonDetail extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
    }

    handleClick = (e, data, Template) => {
        if (data.number == 2) {
            let ids = data.selectArr.map(ar => ar.id);
            let msg = i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            Confirm(ids.length > 1 ? `已选中${ids.length}条数据，${msg}`: msg, {
                done: () => {
                    let uri = '', host = API_FOODING_ES;
                    if (data.id === 'party-detail-02') {
                        uri = '/reportingLine/delete';
                    }
                    if (!uri) return;
                    if(data.id == "party-detail-02"){
                        apiForm(API_FOODING_ES,uri,{
                            id:data.selectArr.map(ar => ar.id)
                        },response => {
                            successTips("删除成功!");
                            this.getSuperiorList(this.props.partyId);
                            this.getLoweriorList(this.props.partyId);
                        },error =>{
                            errorTips("删除失败!");
                        })
                    }


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
    };

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
            dilogTelmp: <div></div>,
            superiorList: [],  //上级关系列表
            loweriorList: [], //下级关系

        }
    }

    //获取上级汇报关系 /reportingLine/getSuperiorList
    getSuperiorList = partyId => {
        let that = this;
        apiGet(API_FOODING_ES, "/reportingLine/getSuperiorList", {partyId}, response => {
            let superiorList = response.data || [];
            that.setState({superiorList})
        }, error => ServiceTips({text:error.message, type:'error'}))
    };

    //获取下级汇报关系 /reportingLine/getSubordinateList
    getLoweriorList = partyId => {
        let that = this;
        apiGet(API_FOODING_ES, "/reportingLine/getSubordinateList", {partyId}, response => {
            let loweriorList = response.data || [];
            that.setState({loweriorList})
        }, error => ServiceTips({text:error.message, type:'error'}))
    };

    componentDidMount(){
        let { data } = this.props;
        if(xt.getItemValue(data, 'party.typeId')  == 50){
            this.getSuperiorList(this.props.partyId);
            this.getLoweriorList(this.props.partyId);
        }
    }

    onAddressListSaveAndClose = () => {
        this.setState({visible: false}, () => {
            this.getSuperiorList(this.props.partyId);
            this.getLoweriorList(this.props.partyId);
        });
    };

    render() {
        const commonForm = this.state.dilogTelmp;
        let {data} = this.props;
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
                                   Zindex={5}
                                   DialogTempalte={require('./OrganizationNormalAndStaffDialog').default}
                                   isShowMenu={true}
                                   openDialog={this.handleClick}
                                   responseData={data}
                                   onSaveAndClose={this.onSaveAndClose}
                                   perfixCel={'template-system'}
                                   id={'product-detail-00'} title={i18n.t(100138/*常规*/)} tempArray={tempArray}/>
                    </div>
                    {
                        xt.getItemValue(data, 'party.typeId')  == 50 ? <div className={'col'} style={{width:"100%"}}>
                            <SystemRuleTem onCancel={this.onCancel} title={i18n.t(400271/*上级汇报关系*/)}
                                           Zindex={4}
                                           openDialog={this.handleClick}
                                           DialogTempalte={require('./SuperiorReportDialog.js').default}
                                           showHeader={true}
                                           checkedRowsArray={[]}
                                           onSaveAndClose={this.onAddressListSaveAndClose}
                                           id={'party-detail-02'}
                                           AjaxInit={true}
                                           addNoInit={true}
                                           API_FOODING={API_FOODING_ES}
                                           portname={'/reportingLine/getOne'}
                                           params={{sourcePartyId: data.party.id}}
                                           otherData={{sourcePartyId: data.party.id}}
                                           columns={
                                               [{
                                                   title : i18n.t(400267/*汇报类型*/),
                                                   dataIndex : 'reportingType',
                                                   key : "reportingType",
                                                   width : '20%',
                                                   render(data,row,index){
                                                       return data && data.localName ? data.localName : "";
                                                   }
                                               },
                                                   {
                                                       title : i18n.t(400268/*岗位名称*/),
                                                       dataIndex : 'party',
                                                       key : "party",
                                                       width : '20%',
                                                       render(data,row,index){
                                                           return data && data.localName ? data.localName : "";
                                                       }
                                                   },
                                                   {
                                                       title : i18n.t(400145/*职员*/),
                                                       dataIndex : 'users',
                                                       key : "users",
                                                       width : '20%',
                                                       render(data,row,index){
                                                           return String((data || []).map( e => e.staffLocalName));
                                                       }
                                                   },
                                                   {
                                                       title : i18n.t(100002/*描述*/),
                                                       dataIndex : 'description',
                                                       key : "description",
                                                       render(data,row,index){
                                                           return data;
                                                       }
                                                   }]
                                           }
                                           data={this.state.superiorList || []}
                            />
                            <OnlyreadyRuleTemplate onCancel={this.onCancel} title={i18n.t(400272/*下级汇报关系*/)}
                                                   Zindex={3}
                                                   showHeader={true}
                                                   checkedRowsArray={[]}
                                                   id={'party-detail-01'}
                                                   columns={
                                                       [{
                                                           title : i18n.t(400267/*汇报类型*/),
                                                           dataIndex : 'reportingType',
                                                           key : "reportingType",
                                                           width : '20%',
                                                           render(data,row,index){
                                                               return data && data.localName ? data.localName : "";
                                                           }
                                                       },
                                                           {
                                                               title : i18n.t(400268/*岗位名称*/),
                                                               dataIndex : 'sourceParty',
                                                               key : "sourceParty",
                                                               width : '20%',
                                                               render(data,row,index){
                                                                   return data && data.localName ? data.localName : "";
                                                               }
                                                           },
                                                           {
                                                               title : i18n.t(400145/*职员*/),
                                                               dataIndex : 'users',
                                                               key : "users",
                                                               width : '20%',
                                                               render(data,row,index){
                                                                   return String((data || []).map( e => e.staffLocalName));
                                                               }
                                                           },
                                                           {
                                                               title : i18n.t(100002/*描述*/),
                                                               dataIndex : 'description',
                                                               key : "description",
                                                               render(data,row,index){
                                                                   return data;
                                                               }
                                                           }]
                                                   }
                                                   data={this.state.loweriorList || []}
                            />
                        </div>:null
                    }

                </div>
                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                    {commonForm}
                </Dialog>
            </div>
        );
    }

}
export default OrganizationCommonDetail;
