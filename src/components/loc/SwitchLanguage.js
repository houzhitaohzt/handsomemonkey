//import languages from '../../langs/languages';

import React,{Component,PropTypes} from 'react';

export default class SwitchLanguage extends Component{
	constructor(props){
		super(props);	
		this.state= this.initialState();	
	}
	componentWillReceiveProps(nextProps){
		if('locale' in nextProps){
			this.setState({currentLang:nextProps.locale});
		}
	}
	initialState(){
		return {
			currentLang:'cn'
		}
	}
	onLanguageChange(current){
		this.setState({currentLang:current});
		if(this.props.onLanguageChange){
			this.props.onLanguageChange(current);
		}
	}
	render(){
		return (<div>
			<select onChange={(e)=>this.onLanguageChange(e.target.value)} value={this.state.currentLang}>
				<option value='cn'>中文-简体</option>
				<option value='ct'>中文-繁體</option>
				<option value='en'>English</option>
			</select>
		</div>);
	}
 }

SwitchLanguage.PropTypes={
	onLanguageChange:PropTypes.func.isRequired,
	currentLang		:PropTypes.string.isRequired,
}

