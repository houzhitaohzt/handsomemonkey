import {Record, Set} from "immutable";
import {VERTICAL_ALIGN, TEXT_ALIGN} from "../common";
import {calc, isCalc} from "../../calc";
import {CellPoint, CellRange} from "../common";
import toMinJS from "../lib/to-min-js";
import {Sheet} from "./index";

const jsonExclude = Set([
    "calcValue",
    "childIds",
    "refs"
]);

export class Cell extends Record({
    text: "",
    verticalAlign: VERTICAL_ALIGN.MIDDLE,
    textAlign: TEXT_ALIGN.RIGHT,
    indent: 1,
    background: "",
    textColor: "",
    font: "10pt Arial",
    // このセルを参照しているセル
    childIds: Set(),
    // このセルが参照しているセル
    refs: Set(),
    calcValue: null,
    nodeName: "",
    mergeRange: null
}) {
    text;
    verticalAlign;
    textAlign;
    indent;
    background;
    textColor;
    font;
    // このセルを参照しているセル
    childIds;
    // このセルが参照しているセル
    refs;
    calcValue;
    nodeName;
    mergeRange;

    static create() {
        return new Cell();
    }

    static fromJS(json, defaultCell) {
        const cell = defaultCell || Cell.create();

        if (!json) {
            return cell;
        }
        return cell
            .setBackground(json.background || cell.background)
            .setText(json.text || cell.text)
            .setVerticalAlign(json.verticalAlign || cell.verticalAlign)
            .setTextAlign(json.textAlign || cell.textAlign)
            .setIndent(json.indent || cell.indent)
            .setTextColor(json.textColor || cell.textColor)
            .setMergeRange(CellRange.fromJS(json.mergeRange));
    }

    toMinJS(cell) {
        return toMinJS(this, cell, Cell, jsonExclude);
    }

    setBackground(background) {
        return this.set("background", background);
    }

    setText(value) {
        return this.set("text", value);
    }
    setValue(value) {
        return this.set("text", value);
    }

    solveCalc(sheet) {

        const result = calc(this.text, sheet);
        if (result.isError) {
            return this.set("calcValue", null);
        }
        return this
            .set("refs", result.refs)
            .set("calcValue", result.value);
    }

    get value() {
        return isCalc(this.text) ? this.calcValue : this.text;
    }


    setRefs(refs) {
        return this.set("refs", refs);
    }

    setVerticalAlign(verticalAlign) {
        return this.set("verticalAlign", verticalAlign);
    }

    setTextAlign(textAlign) {
        return this.set("textAlign", textAlign);
    }

    setIndent(indent) {
        return this.set("indent", indent);
    }

    setTextColor(textColor) {
        return this.set("textColor", textColor);
    }

    setFont(font){
        return this.set("font", font);
    }


    setMergeRange(mergeRange) {
        return this.set("mergeRange", mergeRange);
    }

    setChildIds(childIds) {
        return this.set("childIds", childIds);
    }
    addChildId(childId) {
        return this.set("childIds", this.childIds.add(childId));
    }

    deleteChildId(childId) {
        return this.set("childIds", this.childIds.delete(childId));
    }

    setNodeName(nodeName) {
        return this.set("nodeName", nodeName);
    }

    equals(cell) {
        const tmp = cell
            .set("childIds", this.childIds)
            .set("refs", this.refs);

        return JSON.stringify(this.toJS()) === JSON.stringify(tmp.toJS());
    }
}

export {
Cell as default
}
