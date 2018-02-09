import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';

export class CommonForm extends Component{
    constructor(props){
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);  
    }

    static propTypes={
        data: PropTypes.object,
        form: PropTypes.object,    
        onSaveAndClose:PropTypes.func,
        onCancel:PropTypes.func    
    }

    static defaultProps={
        data:{category:'',level:'',trade:'',duty:''},
        onSaveAndClose(){},
        onCancel(){}
    }
    componentDidMount(){
        /*
        let data =this.props.data;  
        if(Object.getOwnPropertyNames(data).length <= 0){
            data=CommonForm.defaultProps.data;
        }   
        this.props.form.setFieldsValue(data);
        */
    }
    onSaveAndClose(){
        const {form,onSaveAndClose}=this.props;
        form.validateFields((errors, value) => {
           if(null==errors){
               if(onSaveAndClose){
                    onSaveAndClose(form.getFieldsValue());
                }
           }
    });   
    form.resetFields();   
    }
    onCancel(){    
        const {onCancel}=this.props;
        if(onCancel){
            onCancel();
        }
    this.props.form.resetFields();
    }
      
    render(){        
        let { form,data } = this.props;
        if(Object.getOwnPropertyNames(data).length <= 0){
            data=this.constructor.defaultProps.data;
        } 
        const { getFieldProps, getFieldError } = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>       
        <div className={'row'}>
            <div className={'col-xs-6'}>
            <div className="input-group">
                
                <input type='hidden' {...getFieldProps('category', 
                            {
                                validateFirst: true,
                                rules: [
                                    {
                                    required: true,
                                    }            
                                ],          
                                validateTrigger: 'onBlur',
                                initialValue:data.category
                            })}
                        />
            </div>
            </div>
            <div className={'col-xs-6'}>
            <div className="input-group">
                <input type='hidden' {...getFieldProps('level', 
            {
                validateFirst: true,
                rules: [
                    {
                    required: true,
                    }            
                ],          
                validateTrigger: 'onBlur',
                initialValue:data.level
            })}
        />
            </div>
            </div>
        </div>
            

 <div className={'row'}>
            <div className={'col-xs-6'}>
            <div className="input-group">
                <input type='hidden' {...getFieldProps('trade', 
            {
                validateFirst: true,
                rules: [
                    {
                    required: true,
                    }            
                ],          
                validateTrigger: 'onBlur',
                initialValue:data.trade
            })}
        />
            </div>
            </div>
            <div className={'col-xs-6'}>
            <div className="input-group">
                 <input type='hidden' {...getFieldProps('duty', 
            {
                validateFirst: true,
                rules: [
                    {
                    required: true,
                    }            
                ],          
                validateTrigger: 'onBlur',
                initialValue:data.duty
            })}
        />      
            </div>
            </div>
        </div>
        </FormWrapper>);
    }
}

const CommonFields =createForm()(CommonForm);

export default CommonFields;

/*
export class CommonDialog extends Component{
    constructor(props){
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);  
    }

    static propTypes={
        visible:PropTypes.bool,
        onSaveAndClose:PropTypes.func,
        onCancel:PropTypes.func,
        title:PropTypes.string
    }

    static defaultProps={
        visible:false,
        onSaveAndClose(){},
        onCancel(){},
        title:'',
    }

    onSaveAndClose(values){
        const {onSaveAndClose} =this.props;
        if(onSaveAndClose){
            onSaveAndClose(values);
        }
    }
    onCancel(){
        const {onCancel}=this.props;
        if(onCancel){
            onCancel();
        }
    }

    render(){
        const {visible} =this.props;

        return(        
         <Dialog visible={visible} titleLeft={this.props.title}>
            <CommonForm onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} title={this.props.title} data={{category:i18n.t(200429*//*终端客户*//*),
            level:'AAAA',
            trade:'FCB',
            duty:'3210012000000'}} />
         </Dialog>
        )
    };
}

export default CommonDialog;
*/
