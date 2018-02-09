import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';



class MailCard extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
	}
	initState(){
		return {
			showIconArray : [],
			listSource : {link:"Mariano Rajoy",site:"Fooding Group Limted",country:"Spannch",email:"mariano@chinafooding.com",dollar:"chinafooding401",mobilephone:13777888822,QQ:234567856,phone:'021-51069122',fax:'021-12345678'},
		}
	}

	showList(){
		let iconArray = [
		{classn:'foddingicon fooding-user_icon',type:'link'},
		{classn:'foddingicon fooding-company_icon',type:'site'},
		{classn:'foddingicon fooding-nation_icon',type:'country'},
		{classn:'foddingicon fooding-email_32',type:'email'},
		{classn:'foddingicon fooding-skype-icon3',type:'dollar'},
		{classn:'foddingicon fooding-phone_icon2',type:'mobilephone'},
		{classn:'foddingicon fooding-qq-icon2',type:'QQ'},
		{classn:'foddingicon fooding-tel_icon2',type:'phone'},
		{classn:'foddingicon fooding-fax-icon2',type:'fax'}];

		this.showIconArray = [];
		for(let key in this.state.listSource){
			for(let obj in iconArray){
				if(iconArray[obj].type==key){
					this.showIconArray.push({icon : iconArray[obj].classn,content : this.state.listSource[key]})
				}
			}
		}
	}
	render(){
		this.showList();
		let lis = this.showIconArray.map((value,index) => {
			return (<li key={index} className={"mail-card-content-list-single"}>
					<a href="javascript:;"><i className={value.icon}></i></a>
					<span>{value.content}</span>
				</li>)
		})
		return (<div className={'mail-card'}>
			<div className={"mail-card-header"}>
				<div className={"mail-card-header-head"}>

				</div>
				<div className={"mail-card-header-details"}>
					<h2>MarianoRajoy</h2>
					<p><span>{i18n.t(200251/*采购部*/)}</span><span>{i18n.t(200398/*经理*/)}</span></p>
					<div className={"mail-card-header-details-icons"}>
						<a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-zdbj-icon3"}></i></a>
						<a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-user_icon"}></i></a>
						<a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-business_icon"}></i></a>
						<a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-contact"}></i></a>
						<a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-yuehui"}></i></a>
						<a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-calendar"}></i></a>
						<a className={"mail-card-header-details-icons-single"}><i className={"foddingicon fooding-email_32"}></i></a>
						<a className={"mail-card-header-details-icons-single-down"}><i className={"foddingicon fooding-pull_down_icon"}></i></a>
					</div>
				</div>
			</div>
			<div className={"mail-card-content"}>
				<ul className={"mail-card-content-list"}>
					{lis}
				</ul>
			</div>
			<div className={"mail-card-footer"}>
				{i18n.t(700086/*邮件往来*/)}
			</div>
		</div>)
	}

}

export default MailCard;
