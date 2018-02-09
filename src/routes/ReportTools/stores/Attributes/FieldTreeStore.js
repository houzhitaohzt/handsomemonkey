/**
 *
 * @flow
 * @author tangzehua
 * @sine 2018-01-15 16:00
 */
import {observable, action, computed} from 'mobx';
import {AttributeStore} from './index';
import {SelectType, ReportConst} from './../Config';
import xt from '../../../../common/xt';

import {apiGet, apiPost, apiForm, API_FOODING_DS} from '../../../../services/apiCall';

/**
 * 属性树, store
 */
export class FieldTreeStore {
    attribute: AttributeStore = null;
    @observable
    _treeList: Array<Object> = [];
    treeAttr: Array<Object> = [];

    @observable
    rightPos: Object = {x: 0, y: 0};
    @observable
    rightMenuVisible: Boolean = false;
    menuTreeItem: Object = null;
    //选择的表达式
    menuFormIdentity: string = null;
    //字表的所有字段属性
    subFieldMap: Map<string, Array<Object>> = new Map();

    //右键菜单
    rightMenu: Array<Object> = [
        {action: 1, classn: 'foddingicon fooding-add-icon3', title: "应用字段"},
        {action: 2, classn: 'foddingicon fooding-add-icon3', title: "应用表达式"},
        {action: 3, classn: 'foddingicon fooding-copy', title: "复制表达式"},
        {action: 4, classn: 'foddingicon fooding-add-icon3', title: "应用表格"}
    ];
    //激活的右键item配置
    activeRight: Array<number> = [];
    commonRightMenu = [1];
    mainRightMenu = [1, 2, 3];
    subRightMenu = [1, 4];
    subChildRightMenu = [1, 3];

    constructor(attribute: AttributeStore) {
        this.attribute = attribute;
    }

    /**
     * 请求接口
     */
    fetchTree = (id: string) => {
        let that = this;
        apiGet(API_FOODING_DS, "/formObject/getTree", {id},
            that.setTreeData,
            error => {
                window.Tip.errorTips(String(error));
            });
    };

    @action
    setTreeData = (data)=> {
        let that = this, treeData = data.data;
        let subCha = (da, fieldName, isSub) => {
            fieldName = (fieldName && (fieldName + ".") || fieldName) + da.formIdentity;
            da._sub = isSub;
            if(da.children){
                da.children = da.children.map(da => subCha(da, fieldName, isSub));
            }
            fieldName && that.treeAttr.push({
                key: fieldName,
                typeId: da.typeId,
            });
            return da;
        };
        treeData.mainInfo.children.forEach(da => subCha(da, treeData.mainInfo.formIdentity, false));
        let subAry = treeData.subInfoList.map(da => subCha(da, '', true));
        that._treeList = [ treeData.mainInfo, ...subAry];
    };

    /**
     * 获取树的数据
     * @returns {Object[]}
     */
    @computed
    get treeList() {
        return this._treeList.slice();
    };

    /**
     * 树按下右键
     * @param event
     * @param node
     * @returns {*}
     */
    @action
    onTreeRightClick = ({event, node}) => {
        let that = this, label = node.props.label,
            selectCellType = that.attribute.report.pager.selectCellType;
        if ( selectCellType === null ) return;

        let position = {x: event.clientX, y: event.clientY}, rightMenu = that.commonRightMenu;
        that.menuTreeItem = label;
        if(label._sub){
            //子表
            if(selectCellType === SelectType.ROW && (label.children && label.children.length)){
                rightMenu = that.subRightMenu;
                that.identity(node);
            } else if( !label.children || !label.children.length){
                rightMenu = that.subChildRightMenu;
                that.identity(node);
            }

        } else if ( (label.children && label.children.length)
            || selectCellType !== SelectType.CELL) {

            // return console.log("未知");
        } else {
            //此行不是 Table 属性行
            rightMenu = that.mainRightMenu;
            that.identity(node);
        }
        that.setRightVisible(true, position, rightMenu);
    };

    /**
     * 计算选择树节点的表达式
     * @param node
     */
    identity = (node)=> {
        let that = this;
        let parent = node.props.parent;
        let getKey = (nd, identity: string) => {
            if(parent.id === nd.id){
                that.menuFormIdentity = identity + "." + that.menuTreeItem.formIdentity
            } else if(nd.children){
                nd.children.forEach(da => getKey(da, identity + "." + da.formIdentity));
            }
        };
        if (parent){
            that.treeList.forEach(da => getKey(da, da.formIdentity));
        } else {
            that.menuFormIdentity = that.menuTreeItem.formIdentity;
        }
        console.log(that.menuFormIdentity)
    };

    /**
     * 设置树的右键菜单属性
     * @param visible
     * @param position
     * @param menu
     */
    @action
    setRightVisible = (visible: boolean, position :? Object, menu :? Array<number>)=> {
        let that = this;
        menu && (that.activeRight = menu);
        position && (that.rightPos = position);
        that.rightMenuVisible = visible;
    };

    /**
     * 树右键失去焦点后,设置显示为false
     */
    onRightBlur = ()=> {
        this.setRightVisible(false);
    };

    /**
     * 右键子节点被点击
     * @param type
     * @param e
     */
    onRightMenuClick = (type, e)=> {
        let that = this, pager = that.attribute.report.pager;
        let field = "${" + that.menuFormIdentity + "}";
        // console.log(type, this.menuTreeItem, field);
        console.log(type, field);
        switch (type){
            case 1: pager.setCellValue(that.menuTreeItem.name); break; // 应用字段名
            case 2: pager.setCellValue(field); break; // 应用表达式
            case 3: xt.clipboardCopy(field); break; // copy 表达式
            case 4: that.setRowCellMeta(field); break; // 应用表格
            default: break;
        }
        that.setRightVisible(false)
    };

    /**
     * 应用表格
     * @param field
     */
    setRowCellMeta = (field) => {
        let that = this, pager = that.attribute.report.pager;
        let cellAry = that.attribute.getHotTable().getSelected();
        //TODO 这里需要处理这行的所有数据
        pager.setCellMeta(ReportConst.tableMetaName, {
            name: that.menuTreeItem.name,
            field,
            itemIndex: ReportConst.defaultTableMeta.rowIndex,

        }, [cellAry[0], cellAry[1] - 1]);
    };

    /**
     * 根据字表key获取所有字段数据
     * @param key
     * @returns {Array<Object>}
     */
    getTableFieldByKey = ( key: string ): Array<Object> => {
        let that = this;
        if (that.subFieldMap.has(key)) {
            return that.subFieldMap.get(key);
        } else {
            let fields = [];
            let optionKey = (sub: Object, identity: string, parentName: string) => {
                let value = `${identity}.${sub.formIdentity}`, name = parentName? `${parentName}-${sub.name}`: sub.name;
                if (sub.children) {
                    sub.children.forEach(da => optionKey(da, value, name));
                } else {
                    fields.push({name: name, value: `\${${value}}`});
                }
            };

            that.treeList.forEach(da => {
                if ( !da._sub ||  key.indexOf(da.formIdentity) === -1) return;
                da.children.forEach(sda => optionKey(sda, da.formIdentity));
            });
            that.subFieldMap.set(key, fields);
            return fields;
        }
    }


}
