import {Rect} from "./rect";
import {CellPoint} from "./cell-point";
import {CellRange, fitRange} from "./cell-range";
import {FreezePane} from "./freeze-pane";
import {Point} from "./point";
import {COLOR} from "./color";

const VERTICAL_ALIGN = {
    TOP: 0,
    MIDDLE: 1,
    BOTTOM: 2
};

const TEXT_ALIGN = {
    LEFT: 0,
    CENTER: 1,
    RIGHT:2
};

const LINE_STYLE  = {
    NORMAL: 0,
    DOT: 1
};

const BORDER_POSITION = {
    TOP: 0,
    LEFT: 1,
    RIGHT: 2,
    BOTTOM: 3
};



const HEADER_SIZE = Object.freeze({
    HEIGHT: 18,
    WIDTH: 50
});

// リサイザーの幅
const RESIZER_BORDER_WIDTH = 4;


export {
Rect,
CellPoint,
CellRange,
FreezePane,
Point,
VERTICAL_ALIGN,
TEXT_ALIGN,
RESIZER_BORDER_WIDTH,
LINE_STYLE,
BORDER_POSITION,
HEADER_SIZE,
COLOR,
fitRange
};
