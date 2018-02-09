/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-12-26 16:32
 */
import {observable, action, computed} from 'mobx';

import {ReportStore} from '../ReportStore';
import {FieldTreeStore} from './FieldTreeStore';
import {AttrStore} from './AttrStore';
import {TableAttrStore} from './TableAttrStore';
import {SelectType, EMITTER_KEY, ReportConst} from '../Config';
import xt from "../../../../common/xt";

export class AttributeStore {

    report: ReportStore = null;
    fieldTree: FieldTreeStore = null;
    attr: AttrStore = null;
    tableAttr: TableAttrStore = null;

    constructor(report: ReportStore) {
        let that = this;
        that.report = report;
        that.fieldTree = new FieldTreeStore(this);
        that.attr = new AttrStore(this);
        that.tableAttr = new TableAttrStore(this);
        that.initListener();
    }

    init = (oneData: Object): void=> {
        this.fieldTree.fetchTree(oneData.formObjectId);
    };

    initListener = ()=> {
        let that = this;
        that.report.addListener(EMITTER_KEY.CELL_CLICK, that.onCellClick);
        that.report.addListener(EMITTER_KEY.CELL_CHANGE, that.onCellChange);
    };

    getHotTable = ()=> {
        return this.report.getHotTable();
    };

    /**
     * 单元格值改变之后
     * @param value
     */
    onCellChange = (value: string) => {
        this.attr.setValue(value);
    };

    /**
     * 单元格被点击之后
     * @param cellType
     * @param cellMeta
     */
    onCellClick = (cellType: number, cellMeta) => {
        let that = this;
        if(cellType === SelectType.CELL){
            that.attr.onCellClick(cellMeta);
            that.tableAttr.onCellClick(cellMeta);
        } else {
            that.attr.onRowColClick(cellMeta);
            that.tableAttr.onRowColClick(cellMeta);
        }
    };

    /**
     * 判断这行是否为Table
     * @param row
     * @returns {boolean}
     */
    isRowTable = (row:? number): boolean => {
        return ReportConst.tableMetaName in this.report.pager.getRowHeaderCellMeta(row);
    }


}
