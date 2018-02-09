

class Format {
    _string = '';

    constructor (str){
        this._string = str;
    }

    toString (){
        return this._string;
    }

    //转换成大写
    toUpperCase = ()=>{
        this._string = this._string.replace(/[a-zA-z]/g, c => c.toUpperCase());
        return this;
    };

    //必须输入数字和英文
    toNumAZ = ()=>{
        this._string = this._string.replace(/[^0-9a-zA-Z]|\s/g, '');
        return this;
    };

    //多个空格保留一个空格
    toOneSpace = ()=>{
        this._string = this._string.replace(/\s+/g, " ");
        return this;
    };

    //去掉首字空格
    toFirstSpace = ()=>{
        this._string = this._string.replace(/^\s/g, " ");
        return this;
    };

    //首字母变成大写
    toFirstUpperCase = ()=>{
        this._string = this._string.toLowerCase().replace(/\b(\w)|\s(\w)/g, c => c.toUpperCase());
        return this;
    }
}

export const format = str => new Format(str);
export default class {

    //税号
    static taxIdenSN (value, prevValue, allValues){
        if(value === prevValue) return value;
        //全部大写不能有空格,无全角.
        return format(value).toNumAZ().toUpperCase().toString();
    }

    //产品编码
    static beMtlCode (value, prevValue, allValues){
        if(value === prevValue) return value;
        //全部大写不能有空格,无全角.
        return format(value).toNumAZ().toUpperCase().toString();
    }
}