import {Record} from "immutable";
import {CellPoint} from "./cell-point";
import {Sheet} from "../sheet";

/**
 * ウィンドウ固定枠
 */
export class FreezePane extends Record({
    topLeft: null,
    firstPoint: null,
    lastPoint: null,
    bottomRight: null
}) {
    // 表示する左上座標
    topLeft;
    // 固定始めの座標
    firstPoint;
    // 固定終わりの座標
    lastPoint;
    // 表示する右下座標
    bottomRight;

    // コンストラクタ
    constructor(topLeft, firstPoint, lastPoint, bottomRight) {
        super({
            topLeft: topLeft,
            firstPoint: firstPoint,
            lastPoint: lastPoint,
            bottomRight: bottomRight
        });
    }

    static create(topLeft, firstPoint, lastPoint, bottomRight) {
        return new FreezePane(topLeft, firstPoint, lastPoint, bottomRight);
    }

    static fromJS(json) {
        if (!json) {
            return null;
        }

        return new FreezePane(
            CellPoint.fromJS(json.topLeft),
            CellPoint.fromJS(json.firstPoint),
            CellPoint.fromJS(json.lastPoint),
            CellPoint.fromJS(json.bottomRight)
        );
    }

    toMinJS() {
        let json: any = {};
        if (this.topLeft !== null) {
            json.topLeft = this.topLeft.toJS();
        }
        if (this.firstPoint !== null) {
            json.firstPoint = this.firstPoint.toJS();
        }
        if (this.lastPoint !== null) {
            json.lastPoint = this.lastPoint.toJS();
        }
        if (this.bottomRight !== null) {
            json.bottomRight = this.bottomRight.toJS();
        }
        return json;
    }


    /**
     * 値の等価性判定
     */
    equals(freezePan) {
        if (!freezePan) {
            return false;
        }

        if (this.topLeft.equals(freezePan.topLeft)) {
            return false;
        }
        if (this.firstPoint.equals(freezePan.firstPoint)) {
            return false;
        }
        if (this.lastPoint.equals(freezePan.lastPoint)) {
            return false;
        }
        if (this.bottomRight.equals(freezePan.bottomRight)) {
            return false;
        }
        return true;
    }
}
