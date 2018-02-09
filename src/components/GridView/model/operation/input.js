import {Record}from "immutable";


export class InputModel extends Record({
    isInputing: false,
    text: ""
}) {
    isInputing;
    text;

    static create(){
        return new InputModel();
    }

    setIsInputing(isInputing) {

        if (isInputing) {
            return this.set("isInputing", isInputing);
        }

        return (this.set("isInputing", isInputing)).setText("");
    }

    setText(text) {
        return this.set("text", text);
    }
}

export {
InputModel as default
}
