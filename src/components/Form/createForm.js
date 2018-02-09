import createBaseForm from "./createBaseForm";
import xt, {continueFormKey, continuFormLabel, continueFormIgnore} from "../../common/xt";
import {getParams} from './utils';
export const mixin = {

    getDefaultFieldValue (fieldsValue) {
        return fieldsValue && xt.isObject(fieldsValue) && 'value' in fieldsValue && Object.keys(fieldsValue).length === 1 ? fieldsValue.value: fieldsValue;
    },

    getObjectValue (fields, fieldsValue = {}, defaultValue = {}, ignore = true){
        let fieldsEntries = Object.entries(fields);
        for (let [key, value] of fieldsEntries) {
            if(key === continuFormLabel || key in fieldsValue || (ignore && key.indexOf(continueFormKey) === 0)) continue;
            if( !xt.isEmpty(value)){
                if (xt.isObject(value) && continuFormLabel in value){
                    if('value' in value && Object.keys(value).length === 2 && !xt.isObject(value.value)){
                        fieldsValue[key] = value.value;
                    } else {
                        if('value' in value && value.value[continueFormIgnore] === true){
                            fieldsValue[key] = this.getObjectValue(value, {}, defaultValue, ignore);
                        } else {
                            fieldsValue = this.getObjectValue(value, fieldsValue, defaultValue, ignore);
                        }
                    }
                } else if(Array.isArray(value)){
                    fieldsValue[key] = value.filter(x=>1).map(da => xt.isObject(da) ? this.getDefaultFieldValue(this.getObjectValue(da, undefined, undefined, ignore)): da);
                } else {
                    fieldsValue[key] = xt.isEmpty(value)? defaultValue[key] : value;
                }
            } else {
                fieldsValue[key] = defaultValue[key];
            }
        }
        return fieldsValue;
    },

    getObjectFieldValue (name, defaultValue, ignore) {
        let fieldsValue = this.fieldsStore.getFieldValue(name);
        if (xt.isObject(fieldsValue)) {
            return this.getDefaultFieldValue(this.getObjectValue(fieldsValue, {}, defaultValue, ignore));
        } else if (Array.isArray(fieldsValue)){
            return fieldsValue.filter(x=>1).map(da => xt.isObject(da)? this.getDefaultFieldValue(this.getObjectValue(da, {}, defaultValue), ignore): da);
        }
        return xt.isUndefined(fieldsValue) ? defaultValue : fieldsValue;
    },

    getForm() {
        let oldFieldsValue = this.fieldsStore.getFieldsValue;
        this.fieldsStore.getFieldsValue = names => this.getObjectValue(oldFieldsValue(names));
        return {
            getFieldsValue: this.fieldsStore.getFieldsValue,
            getFieldValue: this.getObjectFieldValue,
            getNFieldValue: (name, defaultValue) => {
                let value = this.getObjectFieldValue(name, defaultValue, false);
                if(xt.isObject(value)){
                    let newObj = {};
                    Object.keys(value).forEach( da => {
                        newObj[xt.getFormIgnoreKey(da)] = value[da];
                    });
                    return newObj;
                }
                return value;
            },
            getFieldInstance: this.getFieldInstance,
            setFieldsValue: this.setFieldsValue,
            setFields: this.setFields,
            setFieldsInitialValue: this.fieldsStore.setFieldsInitialValue,
            getFieldDecorator: this.getFieldDecorator,
            getFieldProps: this.getFieldProps,
            getNFieldProps: (...args) => {
                let props = this.getFieldProps(...args);
                if (props.value === null || !xt.isObject(props.value) || Array.isArray(props.value)) return props;
                props.value = props.value[continuFormLabel];
                props.value = props.value === null ? undefined: props.value;
                return props;
            },
            getFieldsError: this.fieldsStore.getFieldsError,
            getFieldError: this.fieldsStore.getFieldError,
            isFieldValidating: this.fieldsStore.isFieldValidating,
            isFieldsValidating: this.fieldsStore.isFieldsValidating,
            isFieldsTouched: this.fieldsStore.isFieldsTouched,
            isFieldTouched: this.fieldsStore.isFieldTouched,
            isSubmitting: this.isSubmitting,
            submit: this.submit,
            validateFields: (ns, opt, cb) => {
                const { names, callback, options } = getParams(ns, opt, cb);
                this.validateFields(names, options, (error, value)=>{
                    if(error){
                        let field = this.getFieldInstance(Object.keys(error)[0]);
                        field && field.focus && field.focus();
                    }
                    callback(error, value);
                });
            },
            resetFields: this.resetFields,
            getFieldErrorStyle: (field, errorStyle, className)=>{
                return this.fieldsStore.getFieldError(field)? className + " " + errorStyle: className;
            },
        };
    },
};

function createForm(options) {
    return createBaseForm(options, [mixin]);
}

export default createForm;
