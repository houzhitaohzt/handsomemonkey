import {Record} from "immutable";
import {LINE_STYLE} from "../common";
import toMinJS from "../lib/to-min-js";

export class Border extends Record({
    // 線幅
    weight: 1,
    colors: ["#BBB"],
    lineStyle: LINE_STYLE.NORMAL,
    dash: []
}) {
    weight;
    colors;
    lineStyle;
    dash;


    static fromJS(json) {
        const border = Border.create();

        if (!json) {
            return border;
        }
        return border
            .setWeight(json.weight || border.weight)
            .setColors(json.colors || border.colors)
            .setLineStyle(json.lineStyle || border.lineStyle)
            .setDash(json.dash || border.dash);
    }

    toMinJS() {
        return toMinJS(this, new Border, Border);
    }
    static create() {
        return new Border();
    };

    setWeight(weight) {
        return this.set("weight", weight);
    }

    setColors(colors) {
        return this.set("colors", colors);
    }

    setColor(color){
        return this.set("colors", [color]);
    }

    setLineStyle(lineStyle) {
        return this.set("lineStyle", lineStyle);
    }

    setDash(dash) {
        return this.set("dash", dash);
    }

    equals(border) {
        return JSON.stringify(this.toJS()) === JSON.stringify(border.toJS());
    }

}

export {
Border as default
}
