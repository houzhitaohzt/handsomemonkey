
import {Rect, CellPoint, CellRange} from "../../common";
import {Sheet} from "../../sheet";

function targetToTop(model, target, offsetRowNo) {

    if (!target.rowNo) {
        return null;
    }

    const scrollTop = model.rowHeader.items.get(offsetRowNo).top;
    const rowTop = model.rowHeader.items.get(target.rowNo).top;
    const top = model.columnHeader.height + rowTop - scrollTop;
    return top;
}


function targetToBottom(model, target, offsetRowNo) {

    if (!target.rowNo) {
        return null;
    }

    const scrollTop = model.rowHeader.items.get(offsetRowNo).top;
    const item = model.rowHeader.items.get(target.rowNo);
    const rowTop = item.top;
    const top = model.columnHeader.height + rowTop - scrollTop;
    return top + item.height;
}

// ターゲットの左座標を求める
function targetToLeft(model, target, offsetColumnNo) {

    if (!target.columnNo) {
        return null;
    }
    const scrollLeft = model.columnHeader.items.get(offsetColumnNo).left;
    const targetLeft = model.columnHeader.items.get(target.columnNo).left;
    const left = model.rowHeader.width + targetLeft - scrollLeft;
    return left;
}

function targetToRight(model, target, offsetColumnNo) {

    if (!target.columnNo) {
        return null;
    }

    const scrollLeft = model.columnHeader.items.get(offsetColumnNo).left;
    const item = model.columnHeader.items.get(target.columnNo);
    const rowLeft = item.left;
    const left = model.rowHeader.width + rowLeft - scrollLeft;
    return left + item.width;
}


export function cellRangeToRect(sheet, cellRange, scroll) {

    if (!cellRange){
        return new Rect(0, 0, 0, 0);
    }
    const offsetColumnNo = (scroll && scroll.columnNo) || 1;
    const offsetRowNo = (scroll && scroll.rowNo) || 1;

    const left = targetToLeft(sheet, cellRange.leftTopPoint, offsetColumnNo);
    const top = targetToTop(sheet, cellRange.leftTopPoint, offsetRowNo);
    const right = targetToRight(sheet, cellRange.rightBottomPoint, offsetColumnNo);
    const bottom = targetToBottom(sheet, cellRange.rightBottomPoint, offsetRowNo);

    return Rect.forPoints(left, top, right, bottom);
}

// 対象セルの位置を取得する
export function targetToRect(sheet, target, scroll) {

    if (!target){
        return new Rect(0, 0, 0, 0);
    }

    const columnItem = sheet.columnHeader.items.get(target.columnNo);
    if (!columnItem) {
        return new Rect(0, 0, 0, 0);
    }
    const rowItem = sheet.rowHeader.items.get(target.rowNo);
    if (!rowItem) {
        return new Rect(0, 0, 0, 0);
    }
    const offsetColumnNo = (scroll && scroll.columnNo) || 1;
    const offsetRowNo = (scroll && scroll.rowNo) || 1;
    const top = targetToTop(sheet, target, offsetRowNo);
    const left = targetToLeft(sheet, target, offsetColumnNo);

    const width = columnItem.width;
    const height = rowItem.height;

    return new Rect(left, top, width, height);
}

