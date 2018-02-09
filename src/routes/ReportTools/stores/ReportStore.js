/**
 * 报表工具统筹Store
 * @flow
 * @author tangzehua
 * @sine 2017-12-26 15:03
 */
import {observable, action, computed} from 'mobx';

import {TopBarStore} from './TopBarStore';
import {PagerStore} from './PagerStore';
import {AttributeStore} from './Attributes';
import {apiPost, API_NOOHLE_PTPM, apiGet} from '../../../services/apiCall';
import EventEmitter from '../../../common/EventEmitter';
import {getDefaultCellType} from './Config';
import xt from '../../../common/xt';
import ReportConvert from '../../../common/Report/ReportConvert';

export class ReportStore {

    topBar: TopBarStore = null;
    pager: PagerStore = null;
    attribute: AttributeStore = null;

    oneData: Object = null;

    _emitter: EventEmitter = null;

    @observable
    scrollHeight: string = 0;
    filterHeight: number = 0;
    //模板编号
    reportNo: number = null;

    constructor(props) {
        let that = this;
        that.reportNo = props.router.params.id;
        that._emitter = new EventEmitter();
        that.pager = new PagerStore(that);
        that.attribute = new AttributeStore(that);
        that.topBar = new TopBarStore(that);
    }

    getHotTable = (): void => {
        return this.pager.hotTable;
    };

    /**
     * 设置可以滚动的高度
     * @param height
     */
    @action
    setScrollHeight = (height: string): void => {
        this.scrollHeight = height;
    };

    /**
     * 获取接口数据
     */
    loadExcelData = () => {
        let that = this;
        apiGet(API_NOOHLE_PTPM, '/printTpm/getDataContent', {id: that.reportNo},
            ({data}) => {
                try{
                    that.oneData = data;
                    that.attribute.init(data);
                    that.pager.init(data);
                } catch (e) {
                    window.Tip.errorTips("初始化编辑失败!");
                }
            }, ({message: errorMsg}) => {
                window.Tip.errorTips("初始化编辑失败!");
            });
    };

    /**
     * 保存模板数据
     * @param data
     */
    onSaveReport = (data): void => {
        let that = this;
        data.version = ReportConvert.version;
        let htmlContent = ReportConvert.toHtml(data, that.pager.pagerSetting, {
                field: that.attribute.fieldTree.treeAttr,
                getFormat: getDefaultCellType,
            }),
            dataContent =  JSON.stringify(data);
        // console.log(htmlContent)
        let params = Object.assign({}, that.oneData, {htmlContent, dataContent});//, id: '5a7ac60c9c61147fedcb8725', optlock: 0
        apiPost(API_NOOHLE_PTPM, "/printTpm/editContext", params,
            response => {
                window.Tip.successTips("保存成功!");
            }, error => {
                window.Tip.errorTips(error.message);
            });
    };

    /**
     * 添加监听事件
     * @param key
     * @param callback
     */
    addListener = (key: string, callback?: () => {}) => {
        this._emitter.on(key, callback);
    };

    /**
     * 移除监听事件
     * @param key
     * @param callback
     */
    removeListener = (key: string, callback?: () => {}) => {
        this._emitter.off(key, callback);
    };

    /**
     * 触发监听事件
     * @param key
     * @param args
     */
    emitListener = (key: string, ...args: Array<any>) => {
        this._emitter.emit(key, ...args);
    };

}
