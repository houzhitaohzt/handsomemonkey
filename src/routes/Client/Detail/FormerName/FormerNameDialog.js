import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {API_FOODING_DS, apiGet} from "../../../../services/apiCall";

// import FreeScrollBar from "../../List/components/FreeScrollBar";

export class  FormerNameDailog extends Component{
	constructor(props){
		super(props);
        this.state = {
            formerList:[]
        }
	}
    initList = () => {
        apiGet(API_FOODING_DS,"/bizExtName/getList",{sourceId:this.props.sourceId},response => {
            let formerList = response.data || [];
            this.setState({formerList})
        },error => console.log(error.message))
    }
	componentDidMount(){
        this.initList();
	}
	componentWillReceiveProps(nextProps){
        this.initList();
        // if(this.props.sourceId !== nextProps.sourceId){
        //     this.initList();
        // }
	}
	render(){
        let dom;
        if(!this.state.formerList.length ){
            dom = (<div className={'former-name-single'}>No   Data</div>)
        }else {
            dom  = this.state.formerList.map((e,i) => {
                return (<div className={'former-name-single'} key={i}>{e.extName}</div>)
            })
        }
		return(
            <div className={'former-name scroll'}>
                <div className={'former-name-title'}>{i18n.t(200435/*曾用名*/)}</div>
                {dom}
            </div>
			);
	}
}
FormerNameDailog.propTypes ={
    onCancel:PropTypes.func
}
FormerNameDailog.defaultProps ={
    onCancel(){}
}
export default FormerNameDailog;

/*<FreeScrollBar style={{maxHeight:"144px"}} className="scroll-style">
     {dom} 
<FreeScrollBar>*/

