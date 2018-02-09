/**
 * 分页组件
 * @flow
 * @author tangzehua
 * @sine 2018-01-22 11:25
 */
import React from 'react';
import {observable, action, computed, toJS} from 'mobx';
import UUID from 'uuid';
import { apiGet } from '../../services/apiCall';

export class Paging {

    /**
     * 表格列配置数据
     * @type {Array}
     */
    @observable tableCols: Array<Object> = [];

    /**
     * fetchPages 请求api
     * @type {null}
     */
    pageApi: String = null;

    /**
     * fetch Pages api uri
     * @type {null}
     */
    pageUri: String = null;

    /**
     * 分页筛选, 条件对象
     * @type {{}}
     */
    @observable searchValues: Object = {};

    /**
     * 分页组件数据
     * @type {{size: number, totalPages: number, currentPage: number, totalRecord: number}}
     */
    @observable page: Object = {pageSize: 20, totalPages: 0, currentPage: 1, totalRecord: 0};

    /**
     * row checkbox 配置信息
     * @type {{show: boolean, position: string}}
     */
    @observable checkboxConfig: Object = {show: true, position: 'first'};

    /**
     * row 颜色配置, 目前不支持
     * @type {{show: boolean, dataIndex: string}}
     */
    @observable colorConfig: Object = {show: false, dataIndex: 'colorType'};

    /**
     * row 星标配置, 目前不支持
     * @type {{show: boolean, dataIndex: string}}
     */
    @observable followConfig: Object = {show: false, dataIndex: 'followMark'};

    /**
     * 右键菜单数组配置
     * @type {null}
     */
    @observable contextMenuItems: Array<Object> = [];

    /**
     * 是否启动右键菜单
     * @type {boolean}
     */
    @observable contextMenuEnable: boolean = false;
    /**
     * 右键菜单回调事件
     */
    @observable contextMenuClick: (event: Object, data: {action: Object, record: Object}) => {};

    /**
     * 工具条组
     * @type {Array}
     */
    @observable barGroup: Array<Object> = [];

    /**
     * 工具条组点击后
     */
    @observable barGroupClick: (type: string)=> {};

    /**
     * 是否启动Cols 排序
     * @type {boolean}
     */
    @observable enableSort: boolean = false;

    /**
     * 是否为单选, 默认多选
     * @type {boolean}
     */
    @observable singleSelect: boolean = false;

    /**
     * 滚动条高度
     * @type {number}
     */
    @observable scrollHeight: number = 0;

    /**
     * 分页数据
     * @type {null}
     * @private
     */
    @observable _pageData: Array<Object> = [];

    //table DOM对象
    tableDom = null;

    /**
     * row 双击回调方法
     * @param record
     * @param index
     */
    rowDoubleClick = (record: Object, index: number): void => {};

    constructor (data: Paging = {}): Paging {
        for(let [k, v] of Object.entries(data)){
            if(k[0] !== '-') this[k] = v;
        }
    }

    /**
     * 查询分页数据
     * @param currentPage
     * @param pageSize
     */
    fetchPages = (currentPage, pageSize) => {
        apiGet(this.pageApi, this.pageUri, this.getFetchPageParam(currentPage, pageSize), this.successFetchPage, this.errorFetchPage);
    };

    /**
     * 表格表头排序
     * @param {Object} order
     */
    _sortPages = (order) => {
        console.log("暂时不支持", order);
    };

    /**
     * 配置表头排序
     * @returns {*}
     */
    @computed get sortPages (){
        return this.enableSort ? this._sortPages: null;
    }

    /**
     * 获取fetch page 请求参数
     * @param currentPage
     * @param pageSize
     */
    getFetchPageParam = (currentPage, pageSize) => {
        let that = this;
        return {
            currentPage: currentPage || that.page.currentPage,
            pageSize: pageSize || that.page.pageSize,
            ...that.searchValues
        }
    };

    /**
     * fetch page 失败后回调
     * @param errorMsg
     */
    errorFetchPage = ({message: errorMsg}) => {
        window.Tip.errorTips(errorMsg);
    };

    /**
     * fetch page 成功后回调
     * @param responseData
     */
    @action successFetchPage = ({data: responseData}) => {
        let that = this;
        let {totalRecords, totalPages, currentPage, pageSize, data} = responseData;
        that._pageData = data;
        that.page = {totalRecords, totalPages, currentPage, pageSize};
    };

    /**
     * 浏览器改变后,改变高度
     */
    @action handleResize = ()=> {
        this.scrollHeight = document.body.offsetHeight - 100;
    };

    /**
     * 获取table 所有checkbox选择的row数据
     * @returns {Array}
     */
    getTableSelectRow = ()=> {
        return this.tableDom? this.tableDom.getSelectArr(): [];
    };

    /**
     * 获取table列配置, 由子类实现
     * @returns {Array}
     */
    @computed get getTableCols () {
        return this.tableCols.slice();
    };

    /**
     * 获取分页数据
     * @returns {Object[]}
     */
    @computed get pageData() {
        return this._pageData.slice();
    }

    /**
     * 获取table右键菜单配置
     * @returns {{enable: boolean, menuItems: Array<Object>}}
     */
    @computed get contextMenuConfig(){
        let that = this;
        return {
            enable: that.contextMenuEnable,
            menuItems: that.contextMenuItems.map(da => ({
                onClick: that.contextMenuClick,
                content: <div><i className={da.icon}/>{da.title}</div>,
                ...toJS(da)
            }))
        }
    }

    @computed get barGroupConfig() {
        let that = this;
        return that.barGroup.map(da => ({
            onClick: that.barGroupClick.bind(null, da.type),
            ...toJS(da)
        }));
    }

}
