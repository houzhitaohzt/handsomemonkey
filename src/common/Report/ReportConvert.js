/**
 * @flow
 * @author tangzehua
 * @since 2018-01-25
 */
import xt from './../xt';

const ReportConst = {
    cellTypeName: 'cellType',
    tableMetaName: 'xTable',
};

const style = `<style>
body{font-family: "Helvetica Neue For Number",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC",
"Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif;margin:0;padding:0;}
/*@media print{.noprint{display:none;height:0 !important;}}*/
.ReportPrint{display:flex;justify-content:center;margin-top:0;font-size:14px;line-height:14px;}
.rp-pager-print{background:#fff;border:0 solid blue;overflow-x:hidden;}
.ReportPrint th, .ReportPrint td {border: 0;padding:0;}
table{border-spacing:0}
.report-print-html{overflow-y:auto !important;}
.report-print-body{background:#eee;height:initial;overflow-y:auto !important;}
.htBold{font-weight:bold;}
.htUnderline{text-decoration:underline;}
.htItalic{font-style:italic}
.htLeft{text-align:left;}
.htCenter{text-align:center;}
.htRight{text-align:right;}
.htJustify{text-align:justify;}
.htTop{vertical-align:top;}
.htMiddle{vertical-align:middle;}
.htBottom{vertical-align:bottom;}
.htBorderBottom{border-bottom:1px solid #000 !important;}
.htBorderTop{border-top:1px solid #000 !important;}
.htBorderLeft{border-left:1px solid #000 !important;}
.htBorderRight{border-right:1px solid #000 !important;}
.htFontSize-12{font-size:12px;line-height:12px;}
.htFontSize-14{font-size:14px;line-height:14px;}
.htFontSize-16{font-size:16px;line-height:16px;}
.htFontSize-18{font-size:18px;line-height:18px;}
.htFontSize-22{font-size:22px;line-height:22px;}
.htFontSize-26{font-size:26px;line-height:26px;}
.htFontSize-30{font-size:30px;line-height:30px;}
.htFontSize-36{font-size:36px;line-height:36px;}
.htFontSize-42{font-size:42px;line-height:42px;}
.htFontSize-46{font-size:46px;line-height:46px;}
.htFontSize-50{font-size:50px;line-height:50px;}
.htFontSize-54{font-size:54px;line-height:54px;}
</style>`;

const BaseHTML =
    '<!doctype html><html lang="cn" class="report-print-html">' +
    '<head><title>${title}</title><meta charset="utf-8"/>' +
    '<meta name="viewport" content="width=device-width,user-scalable=no"/>' +
    '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>' +
    '<meta name="keywords" content="Fooding，Noohle"/>' + style +
    // '<link rel="stylesheet" href="'+ location.foodingOrigin +'/style.css"/>' +
    '</head><body class="report-print-body">' +
    // '<div style="height:60px;display:flex;justify-content:center;align-items:center;" class="noprint"><button class="btn btn-success btn-sm" onclick="print();">打印</button></div>' +
    '<div class="ReportPrint" ><div class="rp-pager-print" style="max-width: {pageWidth}px">' +
    '<div class="ReportContainer"><table cellspacing="0"><colgroup>{colGroup}</colgroup><tbody>{tBody}</tbody></table></div>' +
    '</div></div></body></html>';

const Convert = {

    convertConfig: {
        "1": { // 日期格式
            k: 'date-mode',
            v: "${#dates.format(new com.fooding.fc.restful.jackson.NoohleDateFormat().parse(%s), '%s')}",
        },
        "5": { // 数值格式
            k: 'number-decimal',
            v: '${#numbers.formatDecimal(%s, 1, %d)}',
        }
    },

    /**
     * 转换格式，转换成后台模板需要的格式
     * @param text
     * @param exp
     * @param setting
     * @returns {string}
     * @private
     */
    _convertFormat: (text: string, exp: Object, setting: Object) => {
        let that = Convert;
        let format = setting.getFormat((exp || {}).type, exp);
        return text.replace(new RegExp('(\\${[\\w-\\.\+\*\/\\s]*})', 'g'), $1 => {
            let mat;
            if (/\${[\w.\s]+(\+|\-|\*|\/)+[\w.\s]*}/g.test($1)) {
                //数值
                mat = that.convertConfig['5'];
                return xt.string(mat.v, $1.replace(/(\${|})/g, ''), format[mat.k]);
            }

            let field = setting.field.find(da => ("${" + da.key + "}") === $1);
            mat = field && that.convertConfig[field.typeId];
            $1 = mat && format[mat.k] ? xt.string(mat.v, field.key, format[mat.k]) : $1;

            return $1;
        });
    },

    /**
     * 转换的模板数据为html格式
     * @param excelData
     * @param pageSize
     * @param setting
     * @returns {string}
     */
    toHtml: (excelData: Object, pageSize: Object, setting: Object): string => {
        let that = Convert;
        if (!excelData || !pageSize) return '';

        let {rows, cols, mergeCells, borders, data, cellMeta} = excelData;
        let mergeCs = [], bordersCs = {};
        (mergeCells || []).forEach(({row, col, rowspan, colspan}, index) => {
            // mergeCs.push([]);
            for (let i = 0; i < colspan; i++) {
                mergeCs.push(row + "-" + (col + i));
            }
            for (let i = 0; i < rowspan - 1; i++) {
                mergeCs.push((row + 1) + "-" + col);
            }
        });
        (borders || []).forEach(({bottom, top, left, right, col, row}) => {
            let borderClass = '';
            if (bottom && bottom.width) borderClass += ' htBorderBottom';
            if (top && top.width) borderClass += ' htBorderTop';
            if (left && left.width) borderClass += ' htBorderLeft';
            if (right && right.width) borderClass += ' htBorderRight';
            bordersCs[row + "-" + col] = borderClass;
        });

        //处理每个TD数据
        let getTD = (tdWidth, rowIndex, colIndex, isTable) => {
            let meta = (cellMeta[rowIndex] || [])[colIndex] || {}, tableMeta = meta[ReportConst.tableMetaName];
            let merge = mergeCells.find(da => da.row === rowIndex && da.col === colIndex) || {};
            let className = meta.className || '';

            if (mergeCs.indexOf(rowIndex + "-" + colIndex) !== -1 && (rowIndex !== merge.row && colIndex !== merge.col)) {
                return null;//如果是空TD就不导出
            }

            let borderClass = bordersCs[rowIndex + "-" + colIndex];
            if (borderClass) className += ' ' + borderClass;
            let value = data[rowIndex][colIndex] || '', text = '', context = '';

            if (isTable && tableMeta) {
                value = !tableMeta.expType ? tableMeta.expSelectValue : tableMeta.expValue;
            }

            if (/(\${[\w-\.\*\/\+\s]*})/g.test(value)) {
                text = that._convertFormat(value, meta[ReportConst.cellTypeName], setting);
            } else {
                context = value;
            }
            return `<td ${text ? "th:text=\"" + text + "\"" : ""} class="${className}" colSpan="${merge.colspan || 1}" rowSpan="${merge.rowspan || 1}">${context}</td>`;
        };

        let colGroup = (cols || []).map(da => `<col style="width: ${da}px"/>`);

        let tBody = (rows || []).map((tr, index) => {
            let trMeta = cellMeta[index], eachDom = '';

            //是否有表格数据
            if (trMeta && '-1' in trMeta && ReportConst.tableMetaName in trMeta['-1']) {
                let tableMeta = trMeta['-1'][ReportConst.tableMetaName];
                eachDom = ` th:each='${/([A-Za-z_]+[w-]*)/g.exec(tableMeta.field)[0]}:${tableMeta.field}'`;
            }
            return `<tr height="${tr}px" ${eachDom}>${ (cols || []).map((da, colIndex) => getTD(da, index, colIndex, !!eachDom)).join("") }</tr>`;
        });

        return xt.stringTm(BaseHTML, {
            pageWidth: pageSize.width,
            colGroup: colGroup.join(""),
            tBody: tBody.join(""),
            title: '{title}'
        })
    }

};
export default Convert;
