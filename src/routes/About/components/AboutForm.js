import i18n from './../../../lib/i18n';
import React, { PropTypes,Component } from 'react';
//import FormWrapper from '../../../components/Form/FormWrapper';
import {createForm,FormWrapper} from '../../../components/Form';

export class AboutForm extends Component{
    constructor(props){
        super(props);    
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);  
        this.checkSpecial=this.checkSpecial.bind(this);  
    }
    static propTypes={
        initialValue: PropTypes.object,
        form: PropTypes.object,    
        onSaveAndClose:PropTypes.func,
        onCancel:PropTypes.func    
    }
    componentWillUnmount() {
        //this.props.onDestroy(this.props.form.getFieldsValue());
    }
    componentDidMount() {          
        setTimeout(() => {
        this.props.form.setFieldsValue({
            email: 'xx@gmail.com',
        });        
        }, 1000);
    }
    onSaveAndClose(){
        const {form,onSaveAndClose}=this.props;

        form.validateFields((errors, value) => {
           if(null==errors){
               if(onSaveAndClose){
                    onSaveAndClose(form.getFieldsValue());
                }
           }
    });/*{
            //添加处理
            setTimeout(()=>{
                if(onSaveAndClose){
                    onSaveAndClose(values);
                }
            },1000)
        }))*/
        
        
    }
    onCancel(){
        const {onCancel}=this.props;
        if(onCancel){
            onCancel();
        }
    }
    checkSpecial(rule,value,callback){
                setTimeout(() => {
                    if (value === 'yiminghe@gmail.com') {
                        callback('can not be!');
                    } else {
                        callback();
                    }
                    }, 1000);
            }
    render(){
        const { form } = this.props;
        const { getFieldProps, getFieldError } = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        return(<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            <input type='email' {...getFieldProps('email', {
          validateFirst: true,
          rules: [
            {
              required: true,
            },
            {
              type: 'email',
              message: i18n.t(200262/*错误的 email 格式*/),
            },            
            this.checkSpecial,
          ],
          initialValue:'',
          validateTrigger: 'onBlur',
        })}
        />
        </FormWrapper>);
    }

}
export default createForm()(AboutForm);
