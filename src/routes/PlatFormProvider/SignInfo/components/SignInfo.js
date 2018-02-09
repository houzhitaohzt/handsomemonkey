import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import Measurement from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import '../../../../components/RuleTemplate/assets/_productDetail.less';

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import xt from "../../../../common/xt";

import {I18n} from '../../../../lib/i18n';

export class SignInfo extends Component{
	constructor(props) {
        super(props);
        this.state=this.initState();
    }
    initState(){
        return {
            visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:""
        }
	}
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(30));
    }
    componentWillReceiveProps(nextProps){
    	this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));  
    }
    handleResize(height){
        let padding = 262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
	render(){
        let {valueone = {} } = this.props;
		return (
			  <div> 
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',
	               height:this.state.scrollHeight,overflow:'auto'}}>             
		               <div className = 'col'>
		               	<Template1 						   
							Zindex={6}
		               		width={107}
		               		isShowMenu={true} 
		                    id={'platform-provider-1'} 
		                    title={i18n.t(100139/*注册信息*/)} 
		                    tempArray={[ 
                                {key:i18n.t(100358/*税号*/),value:valueone.enterpriseTaxId ||""},
		                        {key:i18n.t(100561/*法人代表*/),value: valueone.leglpsn ||""},
                                {key:i18n.t(100563/*成立日期*/),value:valueone.createDate?new Date(valueone.createDate).Format('yyyy-MM-dd hh:mm:ss'): ""},
                                {key:i18n.t(100564/*注册资本*/),value:<b>{valueone.registeredCapital ||""}{valueone.registeredCapital&&valueone.curren&&valueone.localName?valueone.localName:""}</b>}
		                    ]} />
		               </div>
	               </div>
               </div>
			);
	}

}
export default SignInfo;
