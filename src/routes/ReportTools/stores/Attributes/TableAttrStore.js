/**
 *
 * @flow
 * @author tangzehua
 * @sine 2018-01-15 16:00
 */
import {observable, action, computed, toJS} from 'mobx';
import {AttributeStore} from './index';
import {CellType, ReportConst} from './../Config';

export class TableAttrStore {

    attribute: AttributeStore = null;

    //是否显示表格属性
    @observable
    visible: boolean = false;
    tableExpAttr: Object = null;

    //所有值
    @observable
    cellMeta: Object = ReportConst.defaultTableMeta;

    constructor(attribute: AttributeStore) {
        this.attribute = attribute;
    }

    /**
     * 字段数值改变之后
     * @param event
     */
    @action
    onDomMetaChange = (event): void => {
        let that = this, name = event.target.name, value = event.target.value;
        that.cellMeta[name] = value;
        that.attribute.report.pager.setCellMeta(ReportConst.tableMetaName, toJS(that.cellMeta));

        switch (name) {
            case 'expSelectValue':
                let text = event.target.querySelector(`option[value='${value}']`).innerHTML;
                that.attribute.attr.setValue(text);
                that.attribute.attr.onValueBlur();
                break;
            default:break;
        }
    };

    /**
     * 改变字段类型
     */
    @action
    onExpTypeChange = ()=> {
        let that = this;
        that.expType = !that.expType;
        that.cellMeta.expType = that.expType;
        that.attribute.report.pager.setCellMeta(ReportConst.tableMetaName, toJS(that.cellMeta));
    };

    /**
     * 单元格被点击之后
     * @param cellMeta
     */
    @action
    onCellClick = (cellMeta: Object): void=> {
        let that = this;
        that.visible = that.attribute.isRowTable(cellMeta.row);
        if (that.visible) {
            let rowHeaderCellMeta = that.attribute.report.pager.getRowHeaderCellMeta(cellMeta.row);
            that.tableExpAttr = rowHeaderCellMeta[ReportConst.tableMetaName];
            that.cellMeta = cellMeta[ReportConst.tableMetaName] || ReportConst.defaultTableMeta;
        }
    };

    /**
     * 行被选择之后
     * @param cellMeta
     */
    @action
    onRowColClick = (cellMeta: Object): void=> {
        let that = this;
        that.visible = false;
    };

    getFieldList = ()=>{
        return this.attribute.fieldTree.getTableFieldByKey(this.tableExpAttr.field);
    }
}
