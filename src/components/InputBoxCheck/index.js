import React, {Component} from "react";
import ReactDOM from "react-dom";
import "./_inputbox.less";
import xt from '../../common/xt';
import {I18n} from '../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../services/apiCall';

class InputBoxCheck extends Component{
    constructor(props){
        super(props);
        this.lastValue = '';
        this.isChinese = false;
        this.state = {
            showChecked:false,  //显示数据查重样式
            checkList:[]    //查重出来的数组
        }
    }
    static PropTypes = {
        rules:React.PropTypes.bool,
        fieldName:React.PropTypes.string, //参数名
        form:React.PropTypes.object,
        initialValue:React.PropTypes.string,
        apiUri:React.PropTypes.string, //请求地址
        className:React.PropTypes.string,
        placeholder:React.PropTypes.string,
        isEnName:React.PropTypes.bool,
        tips:React.PropTypes.string, //小提示
        style:React.PropTypes.object
    };

    static defaultProps = {
        rules:false, //是否必填
        apiHost:API_FOODING_DS, 
        apiType:apiGet, //请求类型
        apiParams:{}, //传参数
        className: "",
        initialValue:"",
        placeholder:I18n.t(201264/*输入后,显示重复客户信息!*/),
        isEnName:false, //判断是不是英文名称 要是因为名称,就只能输入因为,并且首字母大小写
        style:{} //默认样式为空
    };
    //判断本地输入法是中文还是英文
    compositionChange = e => {
        if(e.type === "compositionstart"){//表示输入法是中文的
            this.isChinese = true;
        }else if(e.type === "compositionend"){//表示输入法不是中文
            this.isChinese = false;
        }
    }
    //将全角转化为半角
    /*fullChar2halfChar = str => {
        let result = "";
        for(let i = 0; i < str.length; i++){
            //获取当前字符的unicode编码
            var code = str.charCodeAt(i);
            if(code >= 65281 && code <= 65373){//把全角字符的unicode编码转换为对应半角字符的unicode码
                result += String.fromCharCode(str.charCodeAt(i) - 65248);
            }else if(code == 12288){//空格
                result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32);
            }else{
                result += str.charAt(i);
            }
        }
        return result;
    }*/
    //判断输入是否有全角
    isFullChar = str => {
        let bol = false;
        for(let j = 0; j < str.length; j++){
            var code = str.charCodeAt(j);
           if(code > 65248 || code == 12288){
               bol = true;
               break;
           }
        }
        return bol;
    }
    //首字母变成大写
    replaceStr = str => { // 正则法
		str = str.toLowerCase();
		//  \b判断边界\s判断空格 // 以及保留一位空格
		return str.replace(/\b(\w)|\s(\w)/g, m => m.toUpperCase()).replace(/\s+/g, " ");
	};

    //输入英文名称验证
	onEnChange = (value,prevValue,allValues) => {
	    let that = this;
        let inputValue = value;
        let isFullBol = that.isFullChar(inputValue);
        if(inputValue.trim() == ""){
            that.setState({checkList:[]});
            return inputValue.replace(/^\s/, '');
        }else if(!!isFullBol){
            return prevValue.replace(/^\s/, '');
        }else{
            if(this.props.isEnName){//有英文名称时
                //let reg = /^((\s+)?[a-zA-Z](\s+)?)+$/gim;
                 let reg = /[\u4e00-\u9fa5]+/gim;
                inputValue = prevValue;
                //英文名称验证成功
                if (!reg.test(value)){ 
                    //去掉首空格,
                    inputValue = this.replaceStr(value).replace(/^\s/, '');
                }else{
                    return inputValue.replace(/^\s/, '');
                }
            }else{//不是英文名称
                if(!this.isChinese){
                    let newZhong = /(\s+)[a-zA-Z]+(\s+)/gim;   
                    let newFirst = /^[a-zA-Z]+(\s+)?/gim;///^([a-zA-Z]{2,})+(\s+)?/gim;
                    let newLast = /(\s+)[a-zA-Z]+$/gim; 
                    let firstValue,secondValue,thirdValue;
                    firstValue =  inputValue.replace(newFirst,function(m){
                        return that.replaceStr(m);
                    })
                    secondValue =  firstValue.replace(newZhong,function(m){
                            return that.replaceStr(m);
                    })
                    thirdValue =  secondValue.replace(newLast,function(m){
                            return that.replaceStr(m);
                    })
                    inputValue = thirdValue.replace(/^\s/, '').replace(/\s+/gim," ");
                }                
                // let newR = /(^[a-zA-Z]+(\s+))|(\s+)[a-zA-Z]+(\s+)|((\s+)[a-zA-Z]+$)/gim; 
            }            
        }
        this.searchChecked(inputValue);
        return inputValue;
	}
    //查重数据
    searchChecked = inputValue => {
        let that = this;
        if(inputValue.trim() === this.lastValue) return;
        this.lastValue = inputValue;
        let {apiType,apiParams,apiUri,apiHost} = this.props;
        let value = Object.assign({},apiParams,{keyword:inputValue});
        apiType(apiHost,apiUri,value,response => {
            let data = response.data;
            this.setState({
                checkList:data
            })
        })
    }
    /*
        输入框的聚焦
    */
    onFocus = () => {
        this.setState({
            showChecked:true
        })
    }
    /*
        输入框失去焦点
    */
    onBlur = () => {
        this.setState({
            showChecked:false
        })
    }
    /**
     * 获取验证规则
     * @param props
     * @returns {*}
     */
    getValidateRules = (props) =>{
        let validate = props.rules;
        return validate && xt.isObject(this.props.initialValue) ?
            (rule, value, callback, source, options)=>{
                let errors = [];
                if( xt.isEmpty(value)){
                    errors.push(rule.field + " is required");
                } else if(xt.isObject(value)){
                    if(xt.isEmpty(value.s_label)){
                        errors.push(rule.field + ".s_label is required");
                    }
                }
                callback(errors);
            }: {required: validate}
    };
    render(){
        const  { form,fieldName,rules,initialValue, placeholder, className } = this.props;
        const { getFieldError,getFieldProps } = form;
        let validateType = getFieldProps([fieldName],{
                validateFirst:true,
                rules:[this.getValidateRules(this.props)],
                initialValue:initialValue,
                //onChange:this.onChange,
                normalize: (value, prevValue, allValues) => {
                    
                        if (value === prevValue ) {
                            return value;
                        }
                        
                        return this.onEnChange(value,prevValue,allValues);
                    }
            })
        let tips = this.props.tips|| I18n.t(400171/*以下显示重复客户信息*/);
        return (<div className={ getFieldError(fieldName) ?className +' inputbox-check error-border':className + ' inputbox-check'} style={{...this.props.style}}>
            <input 
                type="text" 
                {...validateType}
                className ={'text-input-nowidth'}
                placeholder={placeholder}
                value={validateType.value || ""}
                style={{width:"100%"}}
                id="checkedInput"
                onFocus = {this.onFocus}
                onBlur = {this.onBlur}
                onCompositionStart={this.compositionChange}
                onCompositionEnd={this.compositionChange}
            />
            <ul className={this.state.showChecked?"inputbox-check-ul":"none"}>
                 <li style={{color:"#cccccc"}}>{tips}</li>
               {
                   this.state.checkList.map((e,i) => {
                       return (<li key={i}>{e.localName || e.name || ""}</li>)
                   })
               }
            </ul>
    </div>)
    }
}
export default InputBoxCheck;