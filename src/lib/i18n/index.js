
const CONST_LANGUAGE = 'CONST_LANGUAGE';
function getLanguage(){
    if(!localStorage.getItem(CONST_LANGUAGE)){
        localStorage.setItem(CONST_LANGUAGE, 'zh-cn');
    }
    return localStorage.getItem(CONST_LANGUAGE);
}

function string(msg, ...args) {
    for (let i = 0; i < args.length; i++) {
        msg = msg.replace(/(%s)|(%d)/, args[i]);
    }
    return msg;
}

/**
 * 多语言
 */
class I18nManager {
    trans = {};
    _lang = null;
    _isLoading = false;
    _listener = [];

    constructor (){
        this.create();
    }

    loadStop (){
        this._isLoading = true;
        this._listener.forEach(listener => listener());
        // this._listener = [];
    }

    isLoading (){
        return this._isLoading;
    }

    on (callback){
        if(this._isLoading){
            callback();
        } else {

        }
        this._listener.push(callback);
    }

    off (callback){
        let index = this._listener.indexOf(callback);
        if(index !== -1) this._listener.splice(index, 1);
    }

    createZHCN (){
        let that = this;
        require.ensure([], function () {
            that.trans = require('../../locale/zh-cn');
            that.loadStop();
        });
    }

    createZHTW (){
        let that = this;
        require.ensure([], function () {
            that.trans = require('../../locale/zh-tw');
            that.loadStop();
        });
    }

    createAR (){
        let that = this;
        require.ensure([], function () {
            that.trans = require('../../locale/ar');
            that.loadStop();
        });
    }

    createDE (){
        let that = this;
        require.ensure([], function () {
            that.trans = require('../../locale/de.js');
            that.loadStop();
        });
    }

    createFR (){
        let that = this;
        require.ensure([], function () {
            that.trans = require('../../locale/fr');
            that.loadStop();
        });
    }

    createJA (){
        let that = this;
        require.ensure([], function () {
            that.trans = require('../../locale/ja');
            that.loadStop();
        });
    }

    createPT (){
        let that = this;
        require.ensure([], function () {
            that.trans = require('../../locale/pt');
            that.loadStop();
        });
    }

    createRU (){
        let that = this;
        require.ensure([], function () {
            that.trans = require('../../locale/ru');
            that.loadStop();
        });
    }

    createEN (){
        let that = this;
        require.ensure([], function () {
            that.trans = require('../../locale/en');
            that.loadStop();
        });
    }

    create (language = getLanguage()){
        if(this._lang === language) return;
        localStorage.setItem(CONST_LANGUAGE, language);

        this._isLoading = false;
        this._lang = language;
        switch (language) {
            case 'zh-cn':
                this.createZHCN(); break;
            case 'zh-tw':
                this.createZHTW(); break;
            case 'ar':
                this.createAR(); break;
            case 'de':
                this.createDE(); break;
            case 'fr':
                this.createFR(); break;
            case 'ja':
                this.createJA(); break;
            case 'pt':
                this.createPT(); break;
            case 'ru':
                this.createRU(); break;
            case 'en':
            default:
                this.createEN();
                break;
        }
    }

    getLang (){
        return this._lang;
    }

    t (key, ...args) {
        let lang = this.trans[key] || String(key);
        return string(lang, ...args);
    }
}

export const I18n = new I18nManager();
export default I18n;
