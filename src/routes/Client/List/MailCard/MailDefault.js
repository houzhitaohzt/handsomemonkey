import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import {API_FOODING_DS, apiGet} from "../../../../services/apiCall";
import {errorTips} from "../../../../components/ServiceTips"; //提示框
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

const typeLink = {
    'client':"/clientcontact/detail",
    'provider':"/providercontact/detail",
    'forwarder':"/forwardercontact/detail",
    'servbe':"/servcon/detail"
}
const typeComponent = {
    'client':i18n.t(300008/*客户联系人详情*/),
    'provider':i18n.t(300021/*供应商联系人详情*/),
    'forwarder':i18n.t(300020/*货代联系人详情*/),
    'servbe':i18n.t(300022/*服务机构联系人详情*/)
}

class MailDefault extends Component {
    constructor(props) {
        super(props)
        this.state = this.initState();
    }

    initState() {
        return {
            oneData: {},
            showIconArray: [],
            listSource: {
                link: "Mariano Rajoy", site: "Fooding Group Limted",
                country: "Spannch", email: "mariano@chinafooding.com", dollar: "chinafooding401",
                mobilephone: 13777888822, QQ: 234567856, phone: '021-51069122', fax: '021-12345678'
            },
        }
    }

    getOne = data => {
        if(!data.id) return false;
        apiGet(API_FOODING_DS, '/entContact/getDirectory', {id: data.id},
            response => {
                this.setState({oneData: response.data || {}});
            }, error => {
                errorTips(error.message);
            })
    };

    componentDidMount() {
        this.getOne(this.props.data);
    }

    componentWillReceiveProps(props) {
        if(props.data !== this.props.data){
            this.getOne(props.data);
        }
    }

    // showList() {
    //     let {oneData} = this.state;
    //     let iconArray = [
    //         {classn: 'foddingicon fooding-company_icon', type: 'entpris'},
    //         {classn: 'foddingicon fooding-nation_icon', type: 'country'},
    //         {classn: 'foddingicon fooding-email_32', type: 'email'},
    //         {classn: 'foddingicon fooding-skype-icon3', type: 'skype'},
    //         {classn: 'foddingicon fooding-phone_icon2', type: 'mobile'},
    //         {classn: 'foddingicon fooding-qq-icon2', type: 'qq'},
    //         {classn: 'foddingicon fooding-tel_icon2', type: 'phone'},
    //         {classn: 'foddingicon fooding-fax-icon2', type: 'fax'}
    //         ];

    //     this.showIconArray = [];
    //     iconArray.forEach(da => {
    //         this.showIconArray.push({icon: da.classn, content: xt.getItemValue(oneData, da.type)})
    //     });
    // }

    //点击往来邮件，跳转到相应的联系详情的邮件
    onMailClick = data => {
        let {navAddTab,navRemoveTab} =this.props;
        navRemoveTab({name:typeComponent[this.props.type],component:typeComponent[this.props.type],url:typeLink[this.props.type]});
        navAddTab({name:typeComponent[this.props.type],component:typeComponent[this.props.type],url:typeLink[this.props.type]});
        this.props.router.push({pathname:typeLink[this.props.type],query:{index:'email',id:data.id}});
    }
    //点击邮件，跳转到写邮件页面
    onEmailClick = (data,e) => {
        if(!data.email) return false;
        let uri = encodeURIComponent(data.email);
        let {navAddTab,navRemoveTab} =this.props;
        navRemoveTab({name:i18n.t(100586/*邮件*/),component:i18n.t(100586/*邮件*/),url:'/email/write/compose'});
        navAddTab({name:i18n.t(100586/*邮件*/),component:i18n.t(100586/*邮件*/),url:'/email/write/compose'});
        this.props.router.push({pathname:'/email/write/compose',query:{uri:uri}});
    }
    render() {
        let {oneData} = this.state;
        // this.showList();
        // let lis = this.showIconArray.map((value, index) => {
        //     return (<li key={index} className={"mail-card-content-list-single"}>
        //         <a href="javascript:void(0);"><i className={value.icon}/></a>
        //         <span title={value.content}>{value.content}</span>
        //     </li>)
        // });
        return (<div className={'mail-card'}>
            <div className={"mail-card-header"} style={{position:"relative"}}>
                <div className={"mail-card-header-head"}>

                </div>
                <div className={"mail-card-header-details"}>
                    <h2>{oneData.name}</h2>
                    <p><span>{oneData.depmnt || ""}</span><span>{oneData.positn || ""}</span></p>
                    <div className={"mail-card-header-details-icons"}>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-zdbj-icon3"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-user_icon"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-business_icon"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-contact"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-yuehui"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-calendar"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-email_32"}/></a>
                        <a className={"mail-card-header-details-icons-single-down"}><i
                            className={"foddingicon fooding-pull_down_icon"}/></a>
                    </div>
                </div>
                <i className={'foddingicon fooding-Sign-out'} style={{position:'absolute',top:'20px',right:"20px",cursor:"pointer"}} onClick={this.props.onCancel}></i>
            </div>
            <div className={"mail-card-content"}>
                <ul className={"mail-card-content-list"}>
                    <li className={"mail-card-content-list-single"}>
                        <a href="javascript:void(0);"><i className={'foddingicon fooding-company_icon'}/></a>
                        <span title={oneData.entpris || ""}>{oneData.entpris || ""}</span>
                    </li>
                    <li className={"mail-card-content-list-single"}>
                        <a href="javascript:void(0);"><i className={'foddingicon fooding-nation_icon'}/></a>
                        <span title={oneData.country || ""}>{oneData.country || ""}</span>
                    </li>
                    <li className={"mail-card-content-list-single"}>
                        <a href="javascript:void(0);"><i className={'foddingicon foddingicon fooding-email_32'}/></a>
                        <span title={oneData.email || ""} onClick={this.onEmailClick.bind(this,oneData)} style={{color:"#0066cc",cursor:"pointer"}}>{oneData.email || ""}</span>
                    </li>
                    <li className={"mail-card-content-list-single"}>
                        <a href="javascript:void(0);"><i className={'foddingicon fooding-skype-icon3'}/></a>
                        <span title={oneData.skype || ""}>{oneData.skype || ""}</span>
                    </li>
                    <li className={"mail-card-content-list-single"}>
                        <a href="javascript:void(0);"><i className={'foddingicon fooding-phone_icon2'}/></a>
                        <span title={oneData.mobile || ""}>{oneData.mobile || ""}</span>
                    </li>
                    <li className={"mail-card-content-list-single"}>
                        <a href="javascript:void(0);"><i className={'foddingicon fooding-qq-icon2'}/></a>
                        <span title={oneData.qq || ""}>{oneData.qq || ""}</span>
                    </li>
                    <li className={"mail-card-content-list-single"}>
                        <a href="javascript:void(0);"><i className={'foddingicon fooding-tel_icon2'}/></a>
                        <span title={oneData.phone || ""}>{oneData.phone || ""}</span>
                    </li>
                    <li className={"mail-card-content-list-single"}>
                        <a href="javascript:void(0);"><i className={'foddingicon fooding-fax-icon2'}/></a>
                        <span title={oneData.fax || ""}>{oneData.fax || ""}</span>
                    </li>
                </ul>
            </div>
            <div className={"mail-card-footer"} onClick={this.onMailClick.bind(this,oneData)}>
                {i18n.t(700086/*邮件往来*/)}
            </div>
        </div>)
    }

}

export default NavConnect(MailDefault);
