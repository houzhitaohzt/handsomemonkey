import React from 'react';
import './confirm.less';

import xt from '../../common/xt';
import {permissionsBtn} from "../../services/apiCall";

import {I18n} from '../../lib/i18n';

class ButtonArray extends React.Component {
    constructor(props) {
        super(props);
        this.array =[];
        this.state = { visible: false };
    }

    show() {
        this.setState({ visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }
    isShow(){

        let icon =  [
        {classn:'foddingicon fooding-share-mail-new',type:'forward',title:I18n.t(300042/*转发*/)},
        {classn:'foddingicon fooding-getClient',type:'getClient',title:I18n.t(600288/*领取客户*/)},
        {classn:'foddingicon fooding-commonClient',type:'commonClient',title:I18n.t(600287/*公共客户池*/)},
        {classn:'foddingicon fooding-seal',type:'seal',title:I18n.t(600245/*封存*/)},
        {classn:'foddingicon fooding-unlock',type:'unlock',title:I18n.t(600246/*启封*/)},
        {classn:'foddingicon fooding-import',type:'import',title:I18n.t(500252/*导入*/)},
        {classn:'foddingicon fooding-Export',type:'daochu',title:I18n.t(201308/*导出*/)},
        {classn:'foddingicon fooding-lead',type:'lead',title:I18n.t(600213/*通知上级*/)},
        {classn:'foddingicon fooding-affirm-I',type:'affirmI',title:I18n.t(600184/*销售确认*/)},
        {classn:'foddingicon fooding-affirm-II',type:'affirmII',title:I18n.t(600185/*经理确认*/)},
        {classn:'foddingicon fooding-affirm-III',type:'affirmIII',title:I18n.t(600186/*主管确认*/)},
        {classn:'foddingicon fooding-add-icon3',type:'add',title:I18n.t(100392/*新增*/)},
        {classn:'foddingicon fooding-shixiao',type:'lose',title:I18n.t(100441/*失效*/)},
        {classn:'foddingicon fooding-alter_icon2',type:'edit',title:I18n.t(100439/*编辑*/)},
        {classn:'foddingicon fooding-terrace',type:'party',title :I18n.t(100393/*平台引入*/)},
        {classn:'foddingicon fooding-delete-icon4',type:'delete',title :I18n.t(100437/*删除*/)},
        {classn:'foddingicon fooding-merge_icon',type:'merge',title :I18n.t(100445/*合并*/)},
        {classn:'foddingicon fooding-allot',type:'allot',title :I18n.t(100446/*分配*/)},
        {classn:'foddingicon fooding-de-weight_icon',type:'distinct',title :I18n.t(100447/*去重*/)},
        {classn:'foddingicon fooding-jingzheng',type:'compete',title :I18n.t(100449/*竞争对手*/)},
        {classn:'foddingicon fooding-Fill-1',type:'updatePrice',title :I18n.t(100450/*更新价格*/)},
        {classn:'foddingicon fooding-zdbj-icon2',type:'price',title :I18n.t(100451/*推广报价*/)},
        {classn:'foddingicon fooding-copy',type:'copy',title :I18n.t(100452/*复制*/)},
        {classn:'foddingicon fooding-start',type:'start',title :I18n.t(100453/*启用*/)},
        {classn:'foddingicon fooding-send-price',type:'sendprice',title :I18n.t(100454/*发送报价*/)},
        {classn:'foddingicon fooding-spearte',type:'spearte',title :I18n.t(100455/*合单*/)},
        {classn:'foddingicon fooding-separte',type:'separte',title :I18n.t(100456/*拆单*/)},
        {classn:'foddingicon fooding-place',type:'place',title :I18n.t(100457/*下单*/)},
        {classn:'foddingicon fooding-assign',type:'assign',title :I18n.t(100458/*指派物流员*/)},
        {classn:'foddingicon fooding-anmout',type:'anmout',title :I18n.t(100459/*数量调整*/)},
        {classn:'foddingicon fooding-confirm',type:'confirm',title :I18n.t(100460/*确认*/)},
        {classn:'foddingicon fooding-relese',type:'relese',title :I18n.t(100462/*发布*/)},
        {classn:'foddingicon fooding-delay-quote',type:'delay',title :I18n.t(100463/*待付*/)},
        {classn:'foddingicon fooding-jieshou',type:'receive',title :I18n.t(100464/*接受报价*/)},
        {classn:'foddingicon fooding-payment-apply',type:'payment',title :I18n.t(500189/*费用*/)},
        {classn:'foddingicon fooding-tiaozheng',type:'tiaozheng',title :I18n.t(100466/*调整*/)},
        {classn:'foddingicon fooding-suoku',type:'suoku',title :I18n.t(100467/*锁库*/)},
        {classn:'foddingicon fooding-put',type:'put',title :I18n.t(400041/*入库通知单*/)},
        {classn:'foddingicon fooding-order',type:'order',title :I18n.t(100469/*订单调整*/)},
        {classn:'foddingicon fooding-approve',type:'approve',title :I18n.t(100470/*查看审批*/)},
        {classn:'foddingicon fooding-cancal',type:'cancal',title :I18n.t(100471/*作废*/)},
        {classn:'foddingicon fooding-update-date',type:'update',title :I18n.t(100450/*更新价格*/)},
        {classn:'foddingicon fooding-submit',type:'submit',title:I18n.t(100472/*提交*/)},
        {classn:'foddingicon fooding-zdbj-icon3',type:'autoprice',title:I18n.t(100398/*自动报价*/)},
        {classn:'foddingicon fooding-baoxiao',type:'baoxiao',title:I18n.t(100448/*报销*/)},
        {classn:'foddingicon fooding-kucun',type:'inventoryAdj',title:I18n.t(100473/*库存调整*/)},
        {classn:'foddingicon fooding-payment-apply',type:'fkapplay',title:I18n.t(400040/*付款申请*/)},
        {classn:'foddingicon fooding-ckjk',type:'salesPriceAdj',title:I18n.t(100474/*调整销售价*/)},
        {classn:'foddingicon fooding-mass-mail-new',type:'qunfa',title:I18n.t(300081/*群发邮件*/)},
        {classn:'foddingicon fooding-import',type:'daoru',title:I18n.t(500252/*导入*/)},
        {classn:'foddingicon fooding-Export',type:'daochu',title:I18n.t(500253/*导出*/)},
        {classn:'foddingicon fooding-release',type:'fabu',title:I18n.t(500257/*发布*/)},
        {classn:'foddingicon fooding-All-released',type:'allfabu',title:I18n.t(500254/*全部发布*/)},
        {classn:'foddingicon fooding-ivoid',type:'zuofei',title :I18n.t(100471/*作废*/)},
        {classn:'foddingicon fooding-All-collections',type:'allshoucang',title:I18n.t(500255/*全部收藏*/)},
        {classn:'foddingicon fooding-All-collections',type:'batchAdd',title:I18n.t(600318/*批量添加*/)},        
        {classn:'foddingicon fooding-Collection',type:'shoucang',title:I18n.t(200543/*收藏*/)},
        {classn:'foddingicon fooding-jiesuo',type:'jiesuo',title:I18n.t(500256/*解锁*/)},
        {classn:'foddingicon fooding-reveser-cancal',type:'tuihui',title:I18n.t(500323/*费用退回*/)},
        {classn:'foddingicon fooding-quxiaoshoucang',type:'quxiaoshoucang',title:I18n.t(500258/*取消收藏*/)},
        {classn:'foddingicon fooding-Salesleave',type:'xiaojia',title:I18n.t(500425/*销假*/)},
        {classn:'foddingicon fooding-calendar',type:'calendar',title:I18n.t(400141/*日程*/)},
        

        ];


        this.array =[];
        var obj ;
        this.props.iconArray.map((value,i)=>{
            if( value['permissions'] && !(permissionsBtn(value['permissions'])) ) return;  // 控制按钮 权限
            
            for(obj in icon){                
                if(icon[obj].type == value.type){
                    this.array.push({icon:icon[obj].classn,permissions:value['permissions'],onClick:value.onClick,title:value.title?value.title:icon[obj].title});
                }
            }
        });
    }

    // shouldComponentUpdate(props, state){
    //     return state.visible !== this.state.visible;
    // }

    render() {
        let {iconArray,that} = this.props;
        this.isShow();


        let buttons = this.array.map((icon,i)=>{
            return (<a className='btn-group' data-permissions={icon['permissions']} title={icon.title} key={i}>
                <i onClick={icon.onClick.bind(this,that)} className = {icon.icon}></i>
                </a>)
        })
        return (
            <div className="oprate-btn">
                {buttons}
            </div>
        )
    }
}
ButtonArray.defaultProps ={
    data:[]
}
export default  ButtonArray;

