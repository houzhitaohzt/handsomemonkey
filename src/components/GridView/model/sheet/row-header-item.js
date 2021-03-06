import {Record} from "immutable";
import Cell from "./cell";
import {VERTICAL_ALIGN, TEXT_ALIGN} from "../common";
import toMinJS from "../lib/to-min-js";

const emptyCell = new Cell();
const defCell = emptyCell
    .setVerticalAlign(VERTICAL_ALIGN.MIDDLE)
    .setTextAlign(TEXT_ALIGN.RIGHT);

export const DEFAULT_HEIGHT = 21;

export class RowHeaderItem extends Record({
    cell: defCell,
    height: DEFAULT_HEIGHT,
    top: 0
}) {
    cell;
    height;
    top;

    static create() {
        return new RowHeaderItem();
    }
    // JSONから本クラスを生成
    static fromJS(json) {
        return RowHeaderItem.create()
            .setCell(Cell.fromJS(json.cell, defCell))
            .setHeight(json.height);
    }

    toMinJS(rowHeaderItem) {
        if (this.height === DEFAULT_HEIGHT){
            return {};
        }
        return {
            height: this.height
        };
        //return toMinJS(this, rowHeaderItem, RowHeaderItem);
    }

    setCell(cell) {
        return this.set("cell", cell);
    }

    setHeight(height) {
        return this.set("height", Math.round(height));
    }

    setTop(top) {
        return this.set("top", top);
    }

    get bottom() {
        return this.top + this.height;
    }

    setValue(value) {
        const cell = this.cell.setValue(value);
        return this.set("cell", cell);
    }

    setBackground(background) {
        const cell = this.cell.setBackground(background);
        return this.set("cell", cell);
    }
}

export{
    RowHeaderItem as default
}
