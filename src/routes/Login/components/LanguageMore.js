import i18n from './../../../lib/i18n';
import React ,{Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import { loadTranslations, setLocale, syncTranslationWithStore, i18nReducer } from '../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
const mapStateToProps=(state)=>{
    const {locale}=state;
    return {locale};
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: {
            setLocale: (lang) => {
            }
        }
    }
}

class LanguageMore extends Component{
	constructor(props){
		super(props)
		this.state = this.initState();
		this.Language.bind(this);

	}
	initState(){
		return {
			inputValue:i18n.t(200664/*简体中文*/),
			visbled:false,
			currentLang:'cn',
			isFocuClass:'language-more',
			languageList:[]
		}
	}
	onFocus(){
		this.setState({
			visbled:!this.state.visbled,
			isFocuClass:'language-more focus'
		},() => {
			document.getElementById('ul').focus();
		})
	}
	Language(){
	}
	onBlur(){
		this.setState({
			visbled:false,
			isFocuClass:'language-more'
		})
	}
	componentDidMount(){
		// var that =this;
		// apiGet(API_FOODING_ES,'/fc/language/getList',{},(response)=>{
		// 	for(var i=0;i<response.data.length;i++){
		// 		if(response.data[i].id == that.state.xianshi){
		// 			that.setState({
		// 				xianshi:response.data[i].name
		// 			});
		// 			break;
		// 		}
		// 	}
		// 	that.setState({
		// 			languageList:response.data
		// 	});
		// },(error)=>{
        //
		// })
		// this.Language();
	}
	onLanguageChange(current){
	    let lang = current.id;
	    switch(current.id){
            case 'zh-cn':
                lang = 'zh_CN';break;
            case 'zh-tw':
                lang = 'zh_TW';break;
            default: break;
        }
		apiForm(API_FOODING_ES,'/fc/changeLanguage',{language:lang},(response)=>{
			// localStorage.setItem("LANGUAGE",current.id);
			// this.props.onLanguageChange(current.id);
			i18n.create(current.id);
			// location.reload()
			// this.props.actions.setLocale(current.id);
			// this.setState({
			// 	currentLang:current.id,
			// 	visbled:false,
			// 	xianshi:current.name
			// });
		},(error)=>{

		});
	}

	render(){
		let liDom;
		let arrLan = [{id:"zh-cn",name:'简体中文'},{id:"en",name:"English"}];
		liDom = arrLan.map((e,i) => {
			return (<li key = {i} value={e.id} style={{cursor:'pointer'}}
				onClick={this.onLanguageChange.bind(this,e)}
				>{e.name}
				</li>)
		});
		return(<div className={this.state.isFocuClass}
		onBlur={this.onBlur.bind(this)}
		tabIndex="-1" id={'ul'}
		style={this.props.styleObj?this.props.styleObj:{}}>
			<div className={'language-tip'} onClick={this.onFocus.bind(this)}>
				<span>{arrLan.find(da => da.id === i18n.getLang()).name}</span><i className={'foddingicon fooding-pull_down_icon'}></i>
			</div>
			<ul className={this.state.visbled ?"content scroll" :"content none"}>
				{liDom}
			</ul>
		</div>)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(LanguageMore);
