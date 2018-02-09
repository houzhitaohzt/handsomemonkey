/**
 * 打印模板编辑
 * @flow
 * @author tangzehua
 * @sine 2018-01-22 17:53
 */
import {observable, action, computed} from 'mobx';
import xt from '../../../common/xt';
import {apiPost, API_NOOHLE_PTPM} from '../../../services/apiCall';

export class ReportEditStore {

    form = null;
    @observable oneData: Object = {};
    @observable editVisible: boolean = false;
    saveAndCloseCallback = null;
    @observable editType: 0;// 0 = 添加, 1 = 修改, 2 = 复制
    editTitle = '';

    setForm = (form): void => {
        this.form = form;
    };

    @action open = (data: Object, type:? number = 0): void => {
        let that = this;
        that.oneData = data;
        that.editType = type;
        that.editVisible = true;

        switch (type){
            case 0: that.editTitle = '添加打印模板'; break;
            case 1: that.editTitle = '编辑打印模板'; break;
            case 2: that.editTitle = '复制打印模板'; break;
            default: break;
        }
    };

    @action close = () => {
        this.editVisible = false;
    };

    onSaveAndClose = () => {
        let that = this;
        that.form.validateFields((errors, value) => {
            if (!errors) {
                let param = value;
                if (that.editType === 1) {
                    param = Object.assign({id: that.oneData.id, optlock: that.oneData.optlock, formObjectId: xt.getItemValue(that.oneData, 'formObject.id')}, value);
                } else if(that.editType === 2){
                    param = Object.assign({formObjectId: xt.getItemValue(that.oneData, 'formObject.id')}, value)
                }
                that._saveOne(param);
            }
        })
    };

    /**
     * 保存数据
     * @param data
     * @private
     */
    _saveOne = (data: Object): void => {
        let that = this;

        apiPost(API_NOOHLE_PTPM, '/printTpm/save', data, response => {
            window.Tip.successTips("保存成功!");
            that.form.resetFields();
            that.close();
            that.saveAndCloseCallback && that.saveAndCloseCallback();
        }, error => {
            window.Tip.errorTips(error.message);
        })
    }

}
