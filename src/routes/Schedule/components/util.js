import i18n from './../../../lib/i18n';
const dataList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];

const daySelect = () => dataList.map((e,i) => ({id:e,localName:e,name:e}));

export const dayList = daySelect();

export const getExplain = (value = {},starts) => {
    if(JSON.stringify(Object.assign({},value)) === "{}") return "";
    let currentDate = new Date(starts);
    let declare = "";
    if (value.intervalsId == "DAILY") {
        declare += i18n.t(500307/*每天*/);
    } else if (value.intervalsId == "WEEKLY") {
        declare += i18n.t(600189/*每周*/);
        let b = (value.Monday ? "周一," : "") + (value.Tuesday ? "周二," : "") + (value.Wednesday ? "周三," : "") + (value.Thursday ? "周四," : "") + (value.Friday ? "周五," : "") + (value.Saturday ? "周六," : "") + (value.Sunday ? "周日," : "");
        b = b.slice(0, -1) + i18n.t(400140/*重复*/);
        declare += b;
    } else if (value.intervalsId == "MONTHLY") {
        let c = currentDate.getDate();
        declare += i18n.t(600190/*每月*/) + c + "号";
    } else if (value.intervalsId == "YEARLY") {
        let d = currentDate.getMonth() + 1;
        let e = currentDate.getDate();
        declare += i18n.t(500308/*每年*/) + d + "月" + e + "日";
    }

    if (value.neverend) {//从不

    } else if (value.interrupt) {//发生多少次之后
        declare += ",共执行" + value.COUNT + "次";
    } else if (value.timeSlot) {//在某个时间点之前
        declare += ",直到" + value.UNTIL + i18n.t(500309/*结束*/);
    }
    return declare;
};