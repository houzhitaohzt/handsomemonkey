import React, { Component } from 'react';
import './assets/css/timePicker.less'; // import styles

import { TimePicker } from 'antd';
import moment from 'moment';

export class TimePickerN extends Component {

    constructor(props){
        super(props);

        this.state = {
            value:undefined, // value
        }

    }

	componentWillReceiveProps(){

    }

  

    // 初始化  
    initHandle = ()=> {
        //let {form,name,defaultValue=undefined,rules=false} = this.props;
        //form.getFieldProps(name,{rules: [{required:rules,}],initialValue:defaultValue});
 
    }

    // change date
    onChange = (moment,str)=> this.setState({value:str || undefined });

    render() {
        let {value} = this.state;
        let {name,form,rules=false,defaultValue=undefined,format='HH:mm'} = this.props; 
        let rulesClass = form.getFieldError(name) ? 'rules':''; // 验证


        // 参数
        let param = Object.assign({},this.props,{
            format:format,
            value: ( value || defaultValue) ? moment((value || defaultValue),format) :undefined,
            placeholder:'',
            onChange: this.onChange
        });
        

        // 表单 
        form.getFieldProps(name,{rules: [{required:rules,}],initialValue: (value || defaultValue) })
        

        return <TimePicker 
            className={`ant-noohle-timePicker ${rulesClass}`}
            {...param}
        />
    }
}

//export default TimePickerDIV;
