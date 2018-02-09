/**
 *
 * @flow
 * @author tangzehua
 * @sine 2018-01-15 16:00
 */
import {observable, action, computed} from 'mobx';
import {AttributeStore} from './index';
import {CellType} from './../Config';
import {ReportConst} from "../Config";

export class AttrStore {

    attribute: AttributeStore = null;

    @observable
    value: string = null;

    /**
     * 表格其他属性
     * @type {null}
     */
    @observable
    attrData: Object = null;

    /**
     *
     * @type {null}
     */
    @observable
    formatIndex: number = 0;
    defaultFormatIndex: number = 0;

    constructor(attribute: AttributeStore) {
        this.attribute = attribute;
    }

    /**
     * 单元格点击
     * @param cellMeta
     */
    @action
    onCellClick = (cellMeta) => {
        let that = this;
        that.setValue(cellMeta.instance.getValue());
        that.attrData = cellMeta[ReportConst.cellTypeName];
        if( that.attrData ){
            that.formatIndex = CellType.findIndex(da => da.type === that.attrData.type);
        } else {
            that.formatIndex = that.defaultFormatIndex;
        }
    };

    /**
     * 行或者列被点击
     */
    onRowColClick = () => {
        let that = this;
        that.setValue(null);
        that.formatIndex = that.defaultFormatIndex;
    };

    /**
     * 内容框值改变
     * @param event
     */
    onValueChange = (event) => {
        this.setValue(event.target.value);
    };

    /**
     * 内容框失去焦点
     */
    onValueBlur = () => {
        this.attribute.report.pager.setCellValue(this.value);
    };

    /**
     * 字段类型选择
     * @param event
     */
    @action
    onCellTypeSelect = (event) => {
        let that = this;
        let type = event.target.value;
        that.formatIndex = CellType.findIndex(da => da.type === type);

        let format = CellType[that.formatIndex].format;
        let meta = {  type  };
        if(Array.isArray(format)){
            format.forEach(da => {
                meta[da.key] = da.value;
            });
        } else {
            meta[format.key] = format.value;
        }
        that.attribute.report.pager.setCellMeta(ReportConst.cellTypeName, that.attrData = meta);
    };

    /**
     * 属性值改变
     * @param event
     */
    @action
    onAttrChange = (event): void => {
        let that = this, cell = CellType[that.formatIndex];
        let defType = that.attribute.report.pager.getCellMeta()[ReportConst.cellTypeName];
        let newMeta = {
            type: cell.type,
            [event.target.name]: event.target.value
        }, meta;
        if(!defType || defType.type !== cell.type){
            meta = newMeta;
        } else {
            meta = Object.assign({}, defType, newMeta );
        }
        that.attribute.report.pager.setCellMeta(ReportConst.cellTypeName, that.attrData = meta);
    };

    @action
    setValue = (value) => {
        this.value = value;
    }
}
