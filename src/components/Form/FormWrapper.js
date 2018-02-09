import i18n from './../../lib/i18n';
import React,{PropTypes,Component} from 'react';
import createForm from './createForm';
export default class FormWrapper extends Component{
    constructor(props){
        super(props);
        this.onSaveClick=this.onSaveClick.bind(this);
        this.onCancelClick=this.onCancelClick.bind(this);

    }
    static propTypes={
        // showFooter:PropTypes.bool,
        // onSaveAndClose:PropTypes.func,//保存方法，接收已经修改过的值
        // onCancel:PropTypes.func,//取消方法
    }
    static defaultProps={
        showFooter:true,
        showSaveAdd:false,
        showSaveClose:true,
        onSaveAndClose(){},
        onCancel(){},
        onSaveAdd(){},
        onSaveCloseBoolean:false //判断保存按钮能不能点击
    }
    onSaveClick(e){
        const {onSaveAndClose}=this.props;
        if(onSaveAndClose){
            onSaveAndClose();
        }

    }
    onSaveAdd(e){
        const {onSaveAdd}=this.props;
        if(onSaveAdd){
            onSaveAdd();
        }

    }
    onCancelClick(e){
        const {onCancel}=this.props;
        if(onCancel){
            onCancel();
        }
    }
    render(){
        const props=this.props;
        const{children}=props;
        let   leftButn ;
        let   saveAdd;
        if(this.props.saveAdd){
            saveAdd= this.props.saveAdd;
        }else {
            saveAdd = "保存并新增";
        }
        if(this.props.buttonLeft){
            leftButn = this.props.buttonLeft;
        }else{
            leftButn=i18n.t(100429/*保存并关闭*/);
        }
        let com;
        let cotent;
        if(this.props.showSaveAdd){
            com = <button type="button" className="btn btn-default btn-add" onClick={(e)=>this.onSaveAdd(e)}>
                            <span>
                                {saveAdd}
                            </span>
                  </button>
        }
        if(this.props.showSaveClose){
           cotent =<button type="button" disabled={this.props.onSaveCloseBoolean} className={this.props.onSaveCloseBoolean?"btn btn-default btn-disabled":"btn btn-default btn-ok"} onClick={(e)=>this.onSaveClick(e)}>
                            <span>
                                {leftButn}
                            </span>
                        </button>;
        }
        let footer=props.showFooter?(<div className={'form-wrapper-footer'} >
                        {com}
                        {cotent}
                        <button type="button" className="btn btn-default btn-cancel" onClick={(e)=>this.onCancelClick(e)}>
                            <span>
                                取消
                            </span>
                        </button>
                    </div>):null;
        return(
            <div className={'form-wrapper'}>
                {children}
                {footer}
            </div>
        );
    }
}
