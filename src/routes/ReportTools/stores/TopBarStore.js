/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-12-26 15:03
 */
import {observable, action, computed} from 'mobx';
import RpConfig, { ReportConst, ToolBarDefine, ToolBarChildrenDefine, MenuItemDefine, SelectType, EMITTER_KEY } from './Config';
import {API_NOOHLE_PTPM} from '../../../services/apiCall';
import {ReportStore} from './ReportStore';

export class TopBarStore {

    //工具栏
    @observable
    toolbarAry: Array<ToolBarDefine> = [];
    menuItemAry: Array<MenuItemDefine> = [];

    report: ReportStore = null;

    constructor (report: ReportStore){
        let that = this;
        that.report = report;
        for(let [k, v] of Object.entries(RpConfig.toolbar)) {
            that.toolbarAry.push({name: k, ...v, isSelect: false});
        }
        for(let [k, v] of Object.entries(RpConfig.menuBar)) {
            that.menuItemAry.push({name: k, ...v});
        }
        that.addListener();
    }

    addListener = ()=> {
        let that = this;
        that.report.addListener(EMITTER_KEY.CELL_CLICK, that.onCellClick);
    };

    getHotTable = ()=> {
        return this.report.pager.hotTable;
    };

    /**
     * 普通菜单点击回调
     * @param item
     */
    onMenuClick = (item: MenuItemDefine)=> {
        let that = this;
        switch (item.name){
            case 'save': that.onSave(); break;
            case 'preview': that.onPreview(that.report.reportNo); break;
            default: break;
        }
    };

    /**
     * 预览
     */
    onPreview = (reportNo)=> {
        //TODO 测试用的
        let uri = `${API_NOOHLE_PTPM}/printTpm/preview?ptpmId=${reportNo}&infParam=302`;
        window.navTabs.open("报表预览", `/third/report-preview/${reportNo}`, {uri}, {refresh: true});
    };

    /**
     * 保存配置信息
     */
    onSave = () => {
        let that = this, table = that.getHotTable(), data =  table.getData();
        let mergeCells = table.mergeCells.mergedCellInfoCollection,
            rows = [], cols = [],
            cellMeta = that.report.pager.cellMeta;

        table.getRowHeader().forEach((da, index) => {
            rows.push(Math.max(table.getRowHeight(index) || 0, ReportConst.minHeight));
        });

        table.getColHeader().forEach((da, index) => {
            cols.push(table.getColWidth(index));
        });

        let borders = table.view.wt.selections.map(da => da.settings);

        let excelData = { rows, cols, data, borders, mergeCells: Array.from(mergeCells), cellMeta};
        that.report.onSaveReport(excelData);
    };

    /**
     * 工具被点击
     * @param item
     */
    onItemClick = (item: ToolBarDefine)=> {
        let that = this, table = that.getHotTable();
        that.setItemSelect(item);
        //这里之后处理事件回调

        if(item.commend){
            let contextMenu = table.getPlugin('contextMenu');
            contextMenu.executeCommand(item.commend);
        } else {
            let selectCell = table.getSelected();
            if( !selectCell) return;
            let cellMeta = table.getCellMeta(selectCell[0], selectCell[1]);

            if(item.className){
                let className = cellMeta.className || "";
                if(className.indexOf(item.className) !== -1) {
                    className = className.replace(item.className, '');
                } else {
                    className = `${className} ${item.className}`;
                }
                table.table.rows[selectCell[0]].cells[selectCell[1]].className = className;
                table.setCellMeta(selectCell[0], selectCell[1], "className", className);
                table.render();
            }
            // console.log(selectCell, cellMeta);
        }
    };

    /**
     * 列表选择器选择后
     * @param item
     * @param value
     */
    @action
    onListItemClick = (item: ToolBarDefine, value: ToolBarChildrenDefine) => {
        let that = this, table = that.getHotTable();
        item.childrenValue = item.children.findIndex(da => da.label === value.label);

        let selectCell = table.getSelected();
        if( !selectCell) return;
        let cellMeta = table.getCellMeta(selectCell[0], selectCell[1]);

        let className = cellMeta.className || "", fIx = className.indexOf(item.className);
        if( fIx  !== -1 ) {
            className = className.substring(0, fIx) + item.className + value.value + className.substring(className.indexOf(" "), fIx);
        } else {
            className = `${className} ${item.className}${value.value}`;
        }
        table.table.rows[selectCell[0]].cells[selectCell[1]].className = className;
        table.setCellMeta(selectCell[0], selectCell[1], "className", className);
        table.render();
    };

    /**
     * 设置工具item为选中, 如果是item group则取消其他选项
     * @param item
     * @param select
     */
    @action
    setItemSelect = (item: ToolBarDefine, select: boolean = true)=> {
        let that = this;
        if(item.groupId !== -1){
            that.toolbarAry.forEach( (da: ToolBarDefine)  => {
                if (item.groupId === da.groupId){
                    da.isSelect = false;
                }
            });
        }
        if(item.type === ReportConst.TYPE_SELECT){
            item.isSelect = select;
        }
    };

    /**
     * 单元格被点击之后
     * @param cellType
     * @param cellMeta
     */
    onCellClick = (cellType, cellMeta) => {
        let that = this;
        if (cellType === SelectType.CELL){
            that.onCellMetaClazz(cellMeta);
        }
    };

    /**
     * 单元格的class属性, 回显工具
     * @param cellMeta
     */
    @action
    onCellMetaClazz = (cellMeta)=> {
        let that = this;
        let className = cellMeta.className;
        if(className) {
            let classAry = className.split(" "),  selectAry = [];
            that.toolbarAry.forEach( (da: ToolBarDefine)  => {
                if(da.type === ReportConst.TYPE_SELECT){
                    da.isSelect = false;
                }
                if(da.type === ReportConst.TYPE_LIST){
                    da.childrenValue = da.children.findIndex(cda => classAry.indexOf(da.className + cda.value) !== -1);
                    da.childrenValue = da.childrenValue !== -1? da.childrenValue: ReportConst.defaultFontSizeIndex;
                } else if(da.className && classAry.indexOf(da.className) !== -1){
                    selectAry.push(da);
                }
            });
            selectAry.forEach(da => da.isSelect = true);
        }
    }

}

