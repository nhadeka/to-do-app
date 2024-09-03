export default class todoItem {
    constructor() {
        this._id = null;
        this._item = null;
    }

    //getter
    getId() {
        return this._id;
    }

    //setter
    setId(id) {
        this._id = id;
    }

    getItem() {
        return this._item;
    }

    setItem(item) {
        this._item = item;
    }
}