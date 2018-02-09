import React, {Component, PropTypes} from "react";
import i18n, {I18n} from "../../../../lib/i18n";

class ImRadioReply extends Component{
    constructor(props){
        super(props);
        this.state = {
            radioContent:""
        }
    }

    onInputChange = e => {
      this.setState({radioContent:e.target.value})
    };

    /**
     * 点击发送 或者回车事件
     * */
    onSend = () => {
        let radioContent = this.state.radioContent.trim();
        if(!radioContent) return false;
        this.setState({
            radioContent:""
        }, () => {
            this.props.onSend && this.props.onSend(radioContent);
        })
    };

    componentWillReceiveProps(props){
        let { singleItem } = props;
        if(singleItem.id !== this.props.singleItem.id){
            this.setState({radioContent:""})
        }
    }

    render(){
        return (
            <div className="im-menu-drawer-sendradio">
                <div className="im-menu-drawer-sendradio-tools">
                    <i className={"foddingicon fooding-expression"}></i>
                </div>
                <div className="im-menu-drawer-sendradio-con">
                    <input className={'sendradio-input'} placeholder={i18n.t(400266/*输入回复内容*/)} value={this.state.radioContent} onChange={this.onInputChange}
                           onKeyDown={(e)=>{
                               if(e.keyCode == 13){this.onSend()}
                           }}/>
                    <button className={this.state.radioContent.length == 0 ? 'button sendradio-button':"button sendradio-button active"} onClick={this.onSend}>{i18n.t(200427/*发送*/)}</button>
                </div>
            </div>
        )
    }
}
export default ImRadioReply;