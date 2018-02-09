import React ,{Component,PropTypes} from 'react';
import Tooltip from '../Tip'; 
import Select, { Option } from 'rc-select';
const style = {
	error:{
		    position: 'absolute',
    		top: '34%',
    		right: '11px',
    		fontSize: '16px',
   			color: 'red',
   			zIndex:  3
	}
};

const vaildTip = {
	"name is required" : "请输入用户名",
	"password is required" : "请输入密码"
};

export class  FormValidating extends Component{
	toNumber(v) {
	  if (v === undefined) {
	    return v;
	  }
	  if (v === '') {
	    return undefined;
	  }
	  if (v && v.trim() === '') {
	    return NaN;
	  }
	  return Number(v);
	}
	render(){
		  const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
		  let {obj} = this.props;
		  let name = obj.name;
		  const errors = getFieldError(name);
		  let common =<div></div> ;
		  if(getFieldError(name)){
		  	 common = <div style={{lineHeight:'32px',paddingLeft:5,paddingRight:5}}>
			        	{localStorage.getItem('CONST_LANGUAGE') == 'zh-cn' ? vaildTip[getFieldError(name)[0]] : getFieldError(name)}
			      	</div>
		  }
		  let classN=obj.classn+ ' '+ 'error-border';
		  if(obj.type=='select'){
		  	 return (
			  	<Select
					animation='slide-up'
					placeholder='请选择所属系统'
				    className={getFieldError(name) ?classN : obj.classn}
					choiceTransitionName="rc-select-selection__choice-zoom"
					onChange={obj.onChange ? obj.onChange:undefined}
					optionLabelProp="children"
					{...getFieldProps(obj.name,{
						validateFirst: true,
						rules: [{required:true}],
						initialValue:obj.initialValue ? obj.initialValue:''
					})}
				>
					{
						obj.moduleIdArray.map((e,i)=>{
						    return <Option key={i} value={e.id+''} title={e.name}>{e.name}</Option>
						})
					}
				</Select>
		  	)
		  }else{
		  	 return (<div 
		  	 	style={{display:'inline-block',position:'relative',textIndent:0,border:'none',width:obj.width?obj.width:''}}
		  	  className={obj.classn +' '+'padd'}>
		  		  <input type= {obj.type}
		  		  		className={getFieldError(name) ?classN : obj.classn}
						style={{width:obj.width?obj.width:'100%'}}
                         onKeyUp={this.props.onKeyUp}
						{...getFieldProps(name,{
								rules: [{
									required: true,
									message:''
								}],
                            validatorTrigger: true,
                            onChange:obj.onChange ? obj.onChange:undefined,
                            initialValue:obj.initialValue ? obj.initialValue:''
							})
						}
				/>
		         <Tooltip

		        placement={'bottom'}
		        overlay={common}
		        prefixCls ={'black rc-tooltip'}
		        arrowContent={<div></div>}
		      ><i className={getFieldError(name) ? 'foddingicon fooding-error':'none'} style={style.error}></i></Tooltip>
		 	 </div>);
		  }
		 
		 
	}

}
export default FormValidating;
