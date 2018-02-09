
import {Record} from "immutable";

// セル位置モデル
export class Point extends Record({
    x: 0,
    y: 0
}) {
    x;
    y;

    constructor(x, y) {
        super({
            x: Number(x),
            y: Number(y)
        });
    }
    static create(x, y){
        return new Point(x, y);
    }
}
