import {Record} from "immutable";

const abc = ["A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L", "M", "N", "O",
    "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

// セル位置モデル
export class CellPoint extends Record({
    columnNo: 0,
    rowNo: 0
}) {
    columnNo;
    rowNo;

    _id = null;

    // コンストラクタ
    constructor(columnNo, rowNo) {
        super({
            columnNo: Number(columnNo)|0,
            rowNo: Number(rowNo)|0
        });
    }

    static create(columnNo, rowNo){
        return new CellPoint(columnNo, rowNo);
    }

    static fromJS(json){
        if(!json){
            return null;
        }

        return new CellPoint(
            json.columnNo || 0,
            json.rowNo || 0
        );
    }

    setColumnNo(columnNo) {
        return this.set("columnNo", columnNo);
    }

    setRowNo(rowNo) {
        return this.set("rowNo", rowNo);
    }

    // ID化
    toId() {
        if (this._id){
            return this._id;
        }
        if ((!this.columnNo) || (!this.rowNo)) {
            return "";
        }
        this._id =CellPoint.getColumnId(this.columnNo) + this.rowNo;
        return this._id;
    }

    static fromId(id) {
        let columnNo = 0;
        let rowNo = 0;
        for (let i = 0; i < id.length; i=(i+1)|0) {
            const s = id.charAt(i);

            if (s.match(/^[A-Z]/)) {
                columnNo = columnNo * abc.length + abc.indexOf(s) + 1;
            }
            else if (s.match(/^[0-9]/)) {
                rowNo = rowNo * 10 + Number(s);
            }
        }

        return new CellPoint(columnNo, rowNo);
    }

    static getColumnId(x) {
        const num = x - 1;
        const quotient = Math.floor(num / abc.length) - 1;
        const remainder = num % abc.length;
        const quotientStr = (quotient < 0) ? "" : abc[quotient];
        const remainderStr = abc[remainder];
        return quotientStr + remainderStr;
    }

    equals(cellPoint) {
        if (!cellPoint) {
            return false;
        }

        if (cellPoint.columnNo !== this.columnNo) {
            return false;
        }

        if (cellPoint.rowNo !== this.rowNo) {
            return false;
        }

        return true;
    }
}

export {
    CellPoint as default
}
