import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadTranslations, setLocale, syncTranslationWithStore, i18nReducer } from '../../lib/i18n';
//import { setTranslations } from '../../actions/loc';
import AwesomeComponent from '../../components/loc/AwesomeComponent';
import SwitchLanguage from '../../components/loc/SwitchLanguage';

const mapStateToProps=(state)=>{  
    //let currentLang window.localStorage.get('currentLang')??window.localStorage.get('currentLang'):'cn'
    const {locale}=state;  
    return {locale};
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: {              
            setLocale: (lang) => {
                // let path='../../locale/string_CN';
                // switch (lang) {
                //     case 'en':
                //         // statements_1
                //         require.ensure(['../../locale/string_en'],(require)=>{                    
                //             let trans=require('../../locale/string_en').default;
                //             let transObj={};
                //             transObj[lang]=trans;
                //             dispatch(loadTranslations(transObj));
                //             dispatch(setLocale(lang));
                //         })
                //         break;
                //     case 'tw':
                //     require.ensure(['../../locale/string_CN'],(require)=>{                    
                //         let trans=require('../../locale/string_CN').default;
                //         let transObj={};
                //         transObj[lang]=trans;
                //         dispatch(loadTranslations(transObj));
                //         dispatch(setLocale(lang));
                //     })
                //         break;
                //     default:
                //     require.ensure(['../../locale/string_CN'],(require)=>{                    
                //         let trans=require('../../locale/string_CN').default;
                //         let transObj={};
                //         transObj[lang]=trans;
                //         dispatch(loadTranslations(transObj));
                //         dispatch(setLocale(lang));
                //     })
                //         break;
                // }             
               
                
                
            }
        }
    }
}

const divStyle={
    color:'black',
    padding:'8px',
}

/*@connect(null, mapDispatchToProps)*/
export class SwitchContainer extends Component {

    render(){
    const { actions,locale } = this.props;
    return ( 
        <div style={divStyle}>
        <SwitchLanguage onLanguageChange = { actions.setLocale } 
        currentLang={locale.locale}></SwitchLanguage>
        <br/>
        <br/>
        <AwesomeComponent />
        </div>
    );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SwitchContainer);
