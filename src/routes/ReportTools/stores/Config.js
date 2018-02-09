export const ReportConst = {
    version: "0.1.0",
    TYPE_NORMAL: 0,
    TYPE_SELECT: 1,
    TYPE_LIST: 2,

    minHeight: 21,//默认行高

    defaultFontSize: 14,//默认字体大小
    defaultFontSizeIndex: 1,//与上面一样,默认字体配置的下标

    cellTypeName: 'cellType',
    tableMetaName: 'xTable',

    //默认的table数据
    defaultTableMeta: {
        expType: false, //表达式类型, 0 = 下拉框, 1 = 自定义
        expValue: '',
        expSelectValue: ''
    }
};
//工具条子节点属性
export type ToolBarChildrenDefine = {
    label: string,
    value: string,
    icon: ? string,
    className: ?string,
}
//工具条节点属性
export type ToolBarDefine = {
    name: string,
    icon: ?string,
    groupId: number,// 是否为一组
    type: number,//
    isSelect: ?boolean, // 是否为选中状态
    className: ? string, // 类型属性
    commend: ? string, //命令
    children: ? Array<ToolBarChildrenDefine>, // 子节点数据
    childrenValue: ? number, // 子节点默认值, children 下标
    value: ? any,// children 选择之后的值
}

export type MenuItemDefine = {
    name: string,
    icon: string,
}

/**
 * 选择的单元格类型
 * @type {{CELL: number, COL: number, ROW: number}}
 */
export const SelectType = {
    CELL: 0, // 普通格子
    COL: 1, // 列
    ROW: 2, // 行
};

/**
 * 监听事件名称
 * @type {{}}
 */
export const EMITTER_KEY = {
    CELL_CLICK: 'CELL_CLICK', //单元格被点击
    CELL_CHANGE: 'CELL_CHANGE', // 单元格值改变
};

/**
 * 类型配置
 */
export const CellType = [
    {
        type: 'normal',
        name: '基础',
        format: [
            {
                name: "保留小数位",
                element:  'input',
                key: 'number-decimal',
                value: ''
            },
            {
                name: '日期格式',
                element: 'select',
                key: 'date-mode',
                value: 'yyyy-MM-dd',
                select: [
                    {name: 'yyyy-MM', value: 'yyyy-MM'},
                    {name: 'yyyy-MM-dd', value: 'yyyy-MM-dd'},
                    {name: 'yyyy-MM-dd HH:mm', value: 'yyyy-MM-dd HH:mm'}
                ]
            }

        ]
    },
    // {
    //     type: 'number',
    //     name: '数字',
    //     format: {
    //         name: '保留小数位',
    //         element: 'input',
    //         type: 'number',
    //         key: 'decimal',
    //         value: '2'
    //     },
    // },
    // {
    //     type: 'money',
    //     name: '金额',
    //     format: [
    //         {
    //             name: "金额格式",
    //             element: 'select',
    //             type: 'number',
    //             key: 'mode',
    //             value: 1,
    //             select: [
    //                 {name: '3位一个逗号', value: 1},
    //                 {name: '转大写', value: 2}
    //             ]
    //         },
    //         {
    //             name: '保留小数位',
    //             element: 'input',
    //             key: 'decimal',
    //             value: '2'
    //         }
    //     ]
    // },
    // {
    //     type: 'data',
    //     name: '日期',
    //     format: {
    //         name: '日期格式',
    //         element: 'select',
    //         key: 'mode',
    //         value: 'yyyy-MM-dd',
    //         select: [
    //             {name: 'yyyy-MM', value: 'yyyy-MM'},
    //             {name: 'yyyy-MM-dd', value: 'yyyy-MM-dd'},
    //             {name: 'yyyy-MM-dd HH:mm', value: 'yyyy-MM-dd HH:mm'}
    //         ]
    //     }
    // },
    // {
    //     type: 'picture',
    //     name: '图片',
    //     format: [
    //         {
    //             name: '图片位置类型',
    //             element: 'select',
    //             key: 'position',
    //             value: '1',
    //             select: [
    //                 {name: '基础', value: '1'}
    //             ]
    //         },
    //         {
    //             name: '图片路径',
    //             key: 'path',
    //             element: 'input'
    //         }
    //     ]
    // }
];

export function getDefaultCellType(type = 'normal', config = {}){
    let cell = CellType.find(da => da.type === type);
    let format = Array.isArray(cell.format)? cell.format: [cell.format];
    format.forEach(da => {
        if ( !config[da.key]){
            config[da.key] = da.value;
        }
    });
    return config;
}

const Config = {
    //属性值定了不要修改
    toolbar: {
        undo: {
            groupId: 0,
            commend: 'undo',
            type: ReportConst.TYPE_NORMAL,
            icon: "email-chexiao"
        },
        redo: {
            groupId: 0,
            commend: 'redo',
            type: ReportConst.TYPE_NORMAL,
            icon: 'email-cx',
        },
        bold: {
            groupId: -1,
            type: ReportConst.TYPE_SELECT,
            className: 'htBold',
            icon: 'email-jiachu'
        },
        underline: {
            groupId: -1,
            type: ReportConst.TYPE_SELECT,
            className: 'htUnderline',
            icon: 'email-xiahuaxian'
        },
        italic: {
            groupId: -1,
            type: ReportConst.TYPE_SELECT,
            className: 'htItalic',
            icon: 'email-xieti'
        },
        textLeft: {
            groupId: 2,
            className: 'htLeft',
            commend: 'alignment:left',
            type: ReportConst.TYPE_SELECT,
            icon: 'email-zuoduiqi'
        },
        textCenter: {
            groupId: 2,
            className: 'htCenter',
            commend: 'alignment:center',
            type: ReportConst.TYPE_SELECT,
            icon: 'email-center'
        },
        textRight: {
            groupId: 2,
            className: 'htRight',
            commend: 'alignment:right',
            type: ReportConst.TYPE_SELECT,
            icon: "email-youduiqi"
        },
        textBottom: {
            groupId: 3,
            className: 'htBottom',
            commend: 'alignment:bottom',
            type: ReportConst.TYPE_SELECT,
            icon: "email-align-bottom"
        },
        textMiddle: {
            groupId: 3,
            className: 'htMiddle',
            commend: 'alignment:middle',
            type: ReportConst.TYPE_SELECT,
            icon: "email-align-middle"
        },
        textTop: {
            groupId: 3,
            className: 'htTop',
            commend: 'alignment:top',
            type: ReportConst.TYPE_SELECT,
            icon: "email-align-top"
        },
        fontSize: {
            groupId: -1,
            type: ReportConst.TYPE_LIST,
            className: 'htFontSize-',
            children: [
                {label: '12', value: 12},
                {label: '14', value: 14},
                {label: '16', value: 16},
                {label: '18', value: 18},
                {label: '22', value: 22},
                {label: '26', value: 26},
                {label: '30', value: 30},
                {label: '36', value: 36},
                {label: '42', value: 42},
                {label: '46', value: 46},
                {label: '50', value: 50},
                {label: '54', value: 54},
            ],
            childrenValue: ReportConst.defaultFontSizeIndex,
        }
    },
    menuBar: {
        save: {
            icon: "fooding-save"
        },
        preview: {
            icon: 'fooding-preview',
        }
    },
};

export default Config;
