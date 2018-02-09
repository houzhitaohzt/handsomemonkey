import {Record} from "immutable";
import {Rect, Point, CellPoint} from "../../common";

import {OBJECT_TYPE} from "../../sheet";
import {Operation} from "../../operation";

// セル位置モデル
export class SelectInfo extends Record({
    objectType: null,
    cellPoint: null,
    point: null,
    rect: null
}) {
    objectType;
    cellPoint;
    point;
    rect;

    constructor(objectType, cellPoint, rect, point) {
        super({
            objectType: objectType,
            cellPoint: cellPoint,
            rect: rect,
            point: point
        });
    }

    static create(objectType, cellPoint, rect, point) {
        return new SelectInfo(objectType, cellPoint, rect, point);
    }
}
