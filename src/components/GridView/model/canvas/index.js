import {Record, Map} from "immutable";
import {drawFillText, getVerticalProp, getAlignProp} from "./draw-text";
import {TEXT_ALIGN, VERTICAL_ALIGN, Rect} from "../common";

export class Canvas extends Record({
    context: null,
    width: 0,
    height: 0
}) {

    context;
    width;
    height;

    // 線分のキャッシュ
    _lineCache;
    // テキストのキャッシュ
    _textCache;

    _fillRectCache;

    // 現在のストローク
    strokeStyle = "";
    lineWidth = 1;
    fillStyle = "";
    font = "";

    constructor(context, width, height) {
        super({context: context, width: width, height: height});
    }

    beginCache() {
        this._lineCache = Map();
        this._textCache = Map();
        this._fillRectCache = Map();
    }

    strockCache() {
        const context = this.context;

        this._fillRectCache.forEach((group) => {
            context.fillStyle = group.fillStyle;
            for (let i = 0; i < (group.rectList.length | 0); i = (i + 1) | 0) {
                const r = group.rectList[i];
                context.fillRect(r.x, r.y, r.width, r.height)
            }
        });
        this._textCache.forEach((group) => {
            context.font = group.font;
            context.fillStyle = group.fillStyle;
            context.textAlign = group.textAlign;
            context.textBaseline = group.textBaseline;
            for (let i = 0; i < (group.textList.length | 0); i = (i + 1) | 0) {
                const t = group.textList[i];
                context.fillText(t.text, t.x, t.y);
            }
        });
        this._lineCache.forEach((line) => {
            context.strokeStyle = line.strokeStyle;
            context.lineWidth = line.lineWidth;
            context.beginPath();

            for (let i = 0; i < (line.paths.length | 0); i = (i + 1) | 0) {
                const v = line.paths[i];
                context.moveTo(v.x1 + 0.5, v.y1 + 0.5);
                context.lineTo(v.x2 + 0.5, v.y2 + 0.5);
            }
            context.stroke();
        });
    }

    createLineKey() {
        return this.lineWidth + "-" + this.strokeStyle;
    }

    createTextKey(textAlign, textBaseline) {
        return this.font + "-" + this.fillStyle + "-" + textAlign + textBaseline;
    }

    createFillRectKey() {
        return this.fillStyle;
    }

    cacheText(value, rect, textAligin, verticalAlign, indent = 0) {

        const vp = getVerticalProp(rect, verticalAlign, indent);
        const av = getAlignProp(rect, textAligin, indent);
        const key = this.createTextKey(av.textAlign, vp.textBaseline);
        const tGroup = this._textCache.get(key) || {
            fillStyle: this.fillStyle,
            font: this.font,
            textAlign: av.textAlign,
            textBaseline: vp.textBaseline,
            textList: []
        };
        tGroup.textList.push({
            x: av.x,
            y: vp.y,
            text: value
        });
        this._textCache = this._textCache.set(key, tGroup);
    }

    /**
     * 塗りつぶし矩形のパスをキャッシュする
     */
    cacheFillRect(x, y, width, height) {
        const key = this.createFillRectKey();
        const fillRect = this._fillRectCache.get(key) || {
            fillStyle: this.fillStyle,
            rectList: []
        };

        fillRect.rectList.push({
            x: x,
            y: y,
            width: width,
            height: height
        });
        this._fillRectCache = this._fillRectCache.set(key, fillRect);
    }

    drawText(value, rect, textAligin, verticalAlign, indent = 0) {
        drawFillText(this.context, value, rect, textAligin, verticalAlign, indent);
    }

    /**
     * 直線のパスをキャッシュする
     */
    cacheLine(x1, y1, x2, y2) {
        const key = this.createLineKey();
        const line = this._lineCache.get(key) || {
            strokeStyle: this.strokeStyle,
            lineWidth: this.lineWidth,
            paths: []
        };

        line.paths.push({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        });
        this._lineCache = this._lineCache.set(key, line);
    }

    // 点線を引く
    cacheDashedLine(x, y, x2, y2, dashArray) {
        // const context = this.context;
        // context.beginPath();
        if (!dashArray) {
            dashArray = [1, 1];
        }
        let lx = x;
        let ly = y;

        const dashCount = dashArray.length;
        // context.moveTo(x + 0.5, y + 0.5);
        var dx = (x2 - x),
            dy = (y2 - y);
        var slope = dx ? dy / dx : 1e15;
        var distRemaining = Math.sqrt(dx * dx + dy * dy);
        var dashIndex = 0,
            draw = true;
        while (distRemaining >= 0.1) {
            let dashLength = dashArray[dashIndex++ % dashCount];
            if (dashLength > distRemaining) {
                dashLength = distRemaining;
            }
            var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
            if (dx < 0) {
                xStep = -xStep;
            }
            x += xStep;
            y += slope * xStep;

            if (draw) {
                this.cacheLine(lx, ly, x, y);
            }
            else {
                lx = x;
                ly = y;
            }
            //context[draw ? 'lineTo' : 'moveTo'](x + 0.5, y + 0.5);
            distRemaining -= dashLength;
            draw = !draw;
        }
        //context.stroke();
    }

    // 直線を引く
    drawLine(x1, y1, x2, y2) {
        const context = this.context;
        context.beginPath();
        context.moveTo(x1 + 0.5, y1 + 0.5);
        context.lineTo(x2 + 0.5, y2 + 0.5);
        context.stroke();
    }

    drawLines(points) {
        const context = this.context;
        context.beginPath();
        points.forEach((v) => {
            context.moveTo(v.x1 + 0.5, v.y1 + 0.5);
            context.lineTo(v.x2 + 0.5, v.y2 + 0.5);
        });

        context.stroke();
    }

    // 点線を引く
    drawDashedLine(x, y, x2, y2, dashArray) {
        const context = this.context;
        context.beginPath();
        if (!dashArray) {
            dashArray = [1, 1];
        }
        const dashCount = dashArray.length;
        context.moveTo(x + 0.5, y + 0.5);
        var dx = (x2 - x),
            dy = (y2 - y);
        var slope = dx ? dy / dx : 1e15;
        var distRemaining = Math.sqrt(dx * dx + dy * dy);
        var dashIndex = 0,
            draw = true;
        while (distRemaining >= 0.1) {
            let dashLength = dashArray[dashIndex++ % dashCount];
            if (dashLength > distRemaining) {
                dashLength = distRemaining;
            }
            var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
            if (dx < 0) {
                xStep = -xStep;
            }
            x += xStep;
            y += slope * xStep;
            context[draw ? 'lineTo' : 'moveTo'](x + 0.5, y + 0.5);
            distRemaining -= dashLength;
            draw = !draw;
        }
        context.stroke();
    }

    drawRectLine(rect) {
        // 上ライン
        this.drawLine(rect.left, rect.top, rect.right, rect.top);
        // 右ライン
        this.drawLine(rect.right, rect.top, rect.right, rect.bottom);
        // 下ライン
        this.drawLine(rect.left, rect.bottom, rect.right, rect.bottom);
        // 左ライン
        this.drawLine(rect.left, rect.top, rect.left, rect.bottom);
    }

    drawRectDashedLine(rect, dashArray) {
        // 上ライン
        this.drawDashedLine(rect.left, rect.top, rect.right, rect.top, dashArray);
        // 右ライン
        this.drawDashedLine(rect.right, rect.top, rect.right, rect.bottom, dashArray);
        // 下ライン
        this.drawDashedLine(rect.left, rect.bottom, rect.right, rect.bottom, dashArray);
        // 左ライン
        this.drawDashedLine(rect.left, rect.top, rect.left, rect.bottom, dashArray);
    }

    drawRectFill(rect) {
        const context = this.context;
        context.fillRect(rect.left, rect.top, rect.width, rect.height);
    }
}

export {
    Canvas as default
}
