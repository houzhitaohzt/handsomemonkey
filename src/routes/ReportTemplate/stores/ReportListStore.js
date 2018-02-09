/**
 *
 * @flow
 * @author tangzehua
 * @sine 2018-01-22 10:04
 */
import {observable, action, computed} from 'mobx';
import i18n from '../.././../lib/i18n';
import {API_NOOHLE_PTPM, apiGet, apiForm} from '../../../services/apiCall';
import {Paging} from '.././../../components/Paging';
import {ReportEditStore} from './ReportEditStore';
import Confirm from '../../../components/Dialog/Confirm';

const renderData = (data)=> {
    return data && new Date(data).Format('yyyy-MM-dd') || null;
};

export class ReportListStore {

    tableCols: Array<Object> = [
        {title: '企业', dataIndex: 'company.localName', width: '6%'},
        {title: '模板名称', dataIndex: 'localName', width: '10%'},
        {title: '业务表单', dataIndex: 'formObject.localName', width: '10%'},
        {title: '创建时间', dataIndex: 'createDate', width: '5%', render: renderData},
        {title: '创建人', dataIndex: 'createUserName', width: '6%'},
        {title: '修改人', dataIndex: 'updateUserName', width: '6%'},
        {title: '修改时间', dataIndex: 'updateDate', width: '5%', render: renderData},
        {title: '状态', dataIndex: 'irowSts.name', width: '4%'},
    ];

    contextMenuItems: Array<Object> = [
        {icon: 'foddingicon fooding-delete-icon3', title: i18n.t(100437/*删除*/), data: {action: 1}},
        // {icon: 'foddingicon fooding-alter_icon2', title: i18n.t(100439/*编辑*/), data: {action: 2}},
        // {icon: 'foddingicon fooding-sx-icon2', title: i18n.t(100441/*失效*/), data: {action: 3}, condition: [{key: 'irowSts.id', value: [10], exp: '==='}]},
        // {icon: 'foddingicon ooding-jh-icon2', title: i18n.t(100442/*激活*/), data: {action: 4}, condition: [{key: 'irowSts.id', value: [5], exp: '==='}]},
        // {icon: 'foddingicon fooding-copy', title: i18n.t(100452/*复制*/), data: {action: 5}},
    ];

    barGroup: Array<Object> = [
        {type: 'add'},
        {type: 'delete'},
    ];

    /**
     * 分页
     * @type {null}
     */
    @observable
    paging: Paging = null;

    editStore = null;

    constructor(props) {
        let that = this;
        this.paging = new Paging({
            pageApi: API_NOOHLE_PTPM,
            pageUri: "/printTpm/getPage",
            tableCols: that.tableCols,
            contextMenuEnable: true,
            contextMenuItems: that.contextMenuItems,
            contextMenuClick: that.onContextMenuClick,
            rowDoubleClick: that.onRowDoubleClick,
            barGroup: that.barGroup,
            barGroupClick: that.onBarGroupClick,
        });
        that.editStore = new ReportEditStore();
        that.editStore.saveAndCloseCallback = that.onRefresh;
    };

    /**
     * row 双击
     * @param record
     * @param index
     */
    onRowDoubleClick = (record: Object, index: number): void => {
        window.navTabs.open(`编辑打印模板-${record.localName}{${record.id}}`, '/report/tools/' + record.id);
    };

    /**
     * 右键选择
     * @param event
     * @param Object
     * @param Object
     */
    onContextMenuClick = (event, {action, record}) => {
        console.log(action, record);
        let that = this;
        switch (action) {
            case 1: that.onDelete([record.id]); break;
            case 2: that.onEdit(record);  break;
            case 3:
                console.log("失效");
                break;
            case 4:
                console.log('激活');
                break;
            case 5: that.onCopy(record); break;
            default: break;
        }
    };

    /**
     * 工具条按钮被点击后
     * @param type
     */
    onBarGroupClick = (type: string) => {
        let that = this;
        let selectData = that.paging.getTableSelectRow();
        switch (type) {
            case 'add': that.onAdd(); break;
            case 'delete': that.onDelete(selectData.map(da => da.id));  break;
            default: break;
        }
    };

    /**
     * 刷新table数据
     */
    onRefresh = () => {
        this.paging.fetchPages(0);
    };

    /**
     * 编辑
     * @param record
     */
    onEdit = (record: Object): void => {
        this.editStore.open(record, 1);
    };

    /**
     * 复制
     * @param record
     */
    onCopy = (record: Obejct): void => {
        this.editStore.open(record, 2);
    };

    /**
     * 添加
     */
    @action onAdd = (): void => {
        this.editStore.open();
    };

    /**
     * 删除一条数据
     * @param ids
     */
    onDelete = (ids: Array<number>): void => {
        let that = this;
        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                apiForm(API_NOOHLE_PTPM, '/printTpm/delete', {id: ids}, response => {
                    window.Tip.successTips("删除成功!");
                    that.onRefresh();
                }, error => {
                    window.Tip.errorTips("删除失败!");
                });
            },
            close:() => { }
        });
    }

}
