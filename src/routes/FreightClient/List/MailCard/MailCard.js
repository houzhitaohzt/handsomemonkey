import React, {Component} from 'react';
import xt from '../../../../common/xt';
import {API_FOODING_DS, apiGet} from "../../../../services/apiCall";
import {errorTips} from "../../../../components/ServiceTips"; //提示框
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

class MailCard extends Component {
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

    getOne = () => {
        if(!this.props.data.id) return false;
        apiGet(API_FOODING_DS, '/staff/getDirectoryById', {id: this.props.data.id},
            response => {
                this.setState({oneData: response.data || {}});
            }, error => {
                errorTips(error.message);
            })
    };

    componentDidMount() {
        this.getOne();
    }

    componentWillReceiveProps(props) {
        if(props.data !== this.props.data){
            this.getOne();
        }
    }

    showList() {
        let {oneData} = this.state;
        let iconArray = [
            {classn: 'foddingicon fooding-company_icon', type: 'entpris'},
            {classn: 'foddingicon fooding-nation_icon', type: 'country'},
            {classn: 'foddingicon fooding-email_32', type: 'email'},
            {classn: 'foddingicon fooding-skype-icon3', type: 'skype'},
            {classn: 'foddingicon fooding-phone_icon2', type: 'mobile'},
            {classn: 'foddingicon fooding-qq-icon2', type: 'qq'},
            {classn: 'foddingicon fooding-tel_icon2', type: 'phone'},
            {classn: 'foddingicon fooding-fax-icon2', type: 'fax'}
            ];

        this.showIconArray = [];
        iconArray.forEach(da => {
            this.showIconArray.push({icon: da.classn, content: xt.getItemValue(oneData, da.type)})
        });
    }

   /* onMailClick = data => {
        console.log(data);
    }*/
    render() {
        let {oneData} = this.state;
        this.showList();
        let lis = this.showIconArray.map((value, index) => {
            return (<li key={index} className={"mail-card-content-list-single"}>
                <a href="javascript:void(0);"><i className={value.icon}/></a>
                <span title={value.content}>{value.content}</span>
            </li>)
        });
        return (<div className={'mail-card'}>
            <div className={"mail-card-header"} style={{position:"relative"}}>
                <div className={"mail-card-header-head"}>

                </div>
                <div className={"mail-card-header-details"}>
                    <h2>{oneData.name}</h2>
                    <p><span>{oneData.depmnt || ""}</span><span>{oneData.positn || ""}</span></p>
                    <div className={"mail-card-header-details-icons"}>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-email_32"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-zdbj-icon3"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-user_icon"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-business_icon"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-contact"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-yuehui"}/></a>
                        <a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-calendar"}/></a>
                        <a className={"mail-card-header-details-icons-single-down"}><i
                            className={"foddingicon fooding-pull_down_icon"}/></a>
                    </div>
                </div>
            </div>
            <div className={"mail-card-content"}>
                <ul className={"mail-card-content-list"}>
                    {lis}
                </ul>
            </div>
        </div>)
    }

}

export default NavConnect(MailCard);
