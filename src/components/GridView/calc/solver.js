import {Record, Set} from "immutable";
import {Sheet} from "../model/sheet";

export class Solver extends Record({
    text: null,
    value: 0,
    pointer: 0,
    sheet: null,
    refIds: Set(),
    isError: false
}) {
    text;
    value;
    pointer;
    refIds;
    sheet;
    isError;

    static createEmpty() {
        return new Solver();
    }

    setText(text) {
        return this.set("text", text);
    }

    setValue(value) {
        return this.set("value", value);
    }

    setPointer(pointer) {
        return this.set("pointer", pointer);
    }

    addPointer(pointer) {
        pointer = pointer || 1;
        return this.set("pointer", this.pointer + pointer);
    }

    addRefId(id): Solver {
        if (this.refIds.has(id)) {
            return this.setIsError(true);
        }
        return this.set("refIds", this.refIds.add(id));
    }

    setRefIds(ids) {
        return this.set("refIds", ids);
    }

    setView(sheet) {
        return this.set("sheet", sheet);
    }

    setIsError(isError) {
        return this.set("isError", isError);
    }

    // 解析処理していない残り文字数
    get leftLenght() {
        if (!this.text) {
            return 0;
        }
        return this.text.length - this.pointer;
    }

    pointSubstr(length?) {
        // テキストなし
        if (!this.text) {
            return "";
        }

        // 範囲外
        if (this.text.length <= this.pointer) {
            return "";
        }
        length = length || (this.text.length - this.pointer);

        return this.text.substr(this.pointer, length);
    }

}

export {
    Solver as default
}
