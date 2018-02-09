/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-12-26 16:31
 */
import {observable, action, computed} from 'mobx';
import Handsontable from 'handsontable';
import {ReportStore} from './ReportStore';
import xt from '../../../common/xt';
import {apiGet, API_NOOHLE_PTPM} from '../../../services/apiCall';
import {SelectType, EMITTER_KEY, ReportConst} from './Config';

export class PagerStore {

    // excel table
    hotTable = null;

    report: ReportStore = null;
    pagerSetting = {
        colCount: 40,
        rowCount: 52,
        width: 805,
        height: 1105,
    };
    @observable
    isLoading: boolean = true;

    excelData: Object = null;
    hotSetting: Object = {};
    cellMeta: Array<Array<Object>> = [];

    //选择的类型
    selectCellType = null;
    selectCellCoords = null;

    constructor(report: ReportStore) {
        let that = this;
        that.report = report;

        that.hotSetting = {
            language: 'zh-CN',
            contextMenu: true,
            copyable: true,
            wordWrap: false,
            autoRowSize: false,
            autoColumnSize: false,
            manualColumnMove: false,
            manualRowMove: false,
            manualColumnResize: true,
            outsideClickDeselects: false,
            colHeaders: index => index + 1,
            rowHeaders: true,
            startCols: 10,
            mergeCells: [],
            customBorders: true,
            // stretchH: 'all',
            currentHeaderClassName: 'rp-currentHeader',
            currentRowClassName: 'rp-currentRow',
            currentColClassName: 'rp-currentCol',
            width: that.pagerSetting.width + 50,
            height: that.pagerSetting.height + 50,
            className: 'rp-handsontable',
            beforeChange: that.beforeChange,
            afterChange: that.afterChange,
            afterOnCellMouseDown: that.afterOnCellMouseDown,
            afterSetCellMeta: that.afterSetCellMeta,
            renderer: that.renderCell,
            cells: (row, col, prop) => xt.getItemValue(that.cellMeta, `${row}.${col}`, {}),
        };
    }

    init = (oneData: Object): void => {
        this.initExcelData(oneData.dataContent);
    };

    getDefaultData = () => {
        let setting = this.pagerSetting;
        return {
            data: Handsontable.helper.createEmptySpreadsheetData(setting.rowCount, setting.colCount),
            mergeCells: [],
            cellMeta: [],
            borders: [],
            cols: parseInt(setting.width / setting.colCount),
            rows: ReportConst.minHeight
        };
    };

    setHotTable = (hotTable) => {
        if (!hotTable) return;
        this.hotTable = hotTable.hotInstance;
    };

    initExcelData = (data) => {
        let that = this;
        let excelData = data ? JSON.parse(data) : that.getDefaultData();
        that.cellMeta = excelData.cellMeta || [];
        that.hotSetting.mergeCells = excelData.mergeCells || [];
        that.hotSetting.data = excelData.data;
        that.hotSetting.colWidths = excelData.cols;
        that.hotSetting.manualRowResize = excelData.rows;
        that.hotSetting.customBorders = (!excelData.borders || !excelData.borders.length) ? true : excelData.borders;
        that.setLoading(false);
    };

    @action
    setLoading = (loading) => {
        this.isLoading = loading;
    };

    /**
     * 表格属性修改后毁回调
     * borders 不在此保存
     * @param row
     * @param col
     * @param key
     * @param value
     */
    afterSetCellMeta = (row, col, key, value) => {
        let that = this;
        if (key === 'borders') return;

        let rowMeta = that.cellMeta[row] || {};
        let meta = rowMeta[col] || {};
        meta[key] = value;

        if (!rowMeta[col]) {
            rowMeta[col] = {[key]: value};
        } else {
            rowMeta[col][key] = value;
        }
        that.cellMeta[row] = rowMeta;
    };

    /**
     * 单元格被修改后
     * @param changes
     * @param source
     */
    beforeChange = (changes, source) => {
        let that = this;
        // console.log(changes, source);
        that.report.emitListener(EMITTER_KEY.CELL_CHANGE, changes[0][3]);
    };

    /**
     * 点击单元格之后
     * @param event
     * @param coords
     * @param dom
     */
    afterOnCellMouseDown = (event, coords, dom) => {
        let that = this;
        coords = that.hotTable.getCoords(dom);
        let cellMeta = that.hotTable.getCellMeta(coords.row, coords.col);

        that.selectCellCoords = coords;
        if (coords.col === -1) {
            // 行头被点击
            that.selectCellType = SelectType.ROW;
        } else if (coords.row === -1) {
            //列头被点击
            that.selectCellType = SelectType.COL;
        } else {
            that.selectCellType = SelectType.CELL;
        }
        that.report.emitListener(EMITTER_KEY.CELL_CLICK, that.selectCellType, cellMeta);
        console.log('普通格子:', coords.row + 1, coords.col + 1, "=>", that.hotTable.getValue(), cellMeta);
    };

    /**
     * 设置单元格值
     * @param value
     * @param cellSelected
     */
    setCellValue = (value: string, cellSelected?: Array<number>) => {
        let that = this;
        if (!cellSelected) {
            cellSelected = that.hotTable.getSelected();
        }
        that.hotTable.setDataAtCell(cellSelected[0], cellSelected[1], value);
    };

    /**
     * 设置cellMeta
     * @param key
     * @param value
     * @param cellSelected
     */
    setCellMeta = (key: string, value: any, cellSelected?: Array<number>) => {
        let that = this;
        if (!cellSelected) {
            cellSelected = that.hotTable.getSelected();
        }
        that.hotTable.setCellMeta(cellSelected[0], cellSelected[1], key, value);
    };

    /**
     * 获取行的meta属性
     * @param cellSelected
     * @returns {*|Object}
     */
    getCellMeta = (cellSelected?: Array<number>) => {
        let that = this;
        if (!cellSelected) {
            cellSelected = that.hotTable.getSelected();
        }
        return that.hotTable.getCellMeta(cellSelected[0], cellSelected[1])
    };

    /**
     * 获取RowHeader属性
     * @param row
     * @returns {*|Object}
     */
    getRowHeaderCellMeta = (row:? number) => {
        let that = this;
        if ( xt.isEmpty(row) ) {
            let selected = that.hotTable.getSelected();
            row = selected[0];
        }
        return that.getCellMeta([row, -1]);
    };

    renderCell = (instance, td, row, col, prop, value, cellProperties) => {
        Handsontable.renderers.TextRenderer.call(null, instance, td, row, col, prop, value, cellProperties);
        td.className = cellProperties.className;
    }

}
