import {Record} from "immutable";

// 矩形モデル
export class Rect extends Record({
    left: 0,
    top: 0,
    width: 0,
    height: 0
}) {
    left;
    top;
    width;
    height;

    constructor(left, top, width, height) {
        super({
            left: left,
            top: top,
            width: width,
            height: height
        });
    }

    static create(left, top, width, height){
        return new Rect(left, top, width, height);
    }

    // 四隅の座標から矩形モデルを作成する
    static forPoints(
        x1,
        y1,
        x2,
        y2) {
        const left = Math.min(x1, x2);
        const right = Math.max(x1, x2);
        const top = Math.min(y1, y2);
        const bottom = Math.max(y1, y2);
        const width = right - left;
        const height = bottom - top;

        return new Rect(left, top, width, height);
    }

    static forRects(rect1, rect2) {
        const left = Math.min(rect1.left, rect2.left);
        const right = Math.max(rect1.right, rect2.right);
        const top = Math.min(rect1.top, rect2.top);
        const bottom = Math.max(rect1.bottom, rect2.bottom);
        const width = right - left;
        const height = bottom - top;

        return new Rect(left, top, width, height);
    }

    /**
     * 矩形を縮小させる
     */
    reduce(value) {
        return new Rect(
            this.left + value,
            this.top + value,
            this.width - value * 2,
            this.height - value * 2);
    }

    setLeft(left) {
        return this.set("left", left);
    }
    editLeft(mutator) {
        return this.set("left", mutator(this.left));
    }
    setTop(top) {
        return this.set("top", top);
    }
    editTop(mutator) {
        return this.set("top", mutator(this.top));
    }
    setWidth(width) {
        return this.set("width", width);
    }
    editWidth(mutator) {
        return this.set("width", mutator(this.width));
    }
    setHeight(height) {
        return this.set("height", height);
    }
    editHeight(mutator) {
        return this.set("height", mutator(this.height));
    }

    // 四角形同士が交差しているか判定
    isIntersected(rect) {
        if (!rect) {
            return false;
        }
        // 自身より右側にある
        if (rect.right <= this.left) {
            return false;
        }

        // 自身より左側にある
        if (rect.left >= this.right) {
            return false;
        }

        // 自身より上にある
        if (rect.bottom <= this.top) {
            return false;
        }

        // 自身より下にある
        if (rect.top >= this.bottom) {
            return false;
        }

        return true;
    }

    get right() {
        return this.left + this.width;
    }

    get bottom() {
        return this.top + this.height;
    }

    get middle() {
        return this.top + this.height / 2;
    }

    get center() {
        return this.left + this.width / 2;
    }

    get style() {
        return {
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height
        };
    }
}
