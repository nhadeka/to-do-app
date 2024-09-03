export default class todoList {
    constructor() {
        this._list = [];
    }

    getList() {
        return this._list;
    }

    clearList() {
        return this._list = [];
    }

    addItemToList(itemObj) {
        this._list.push(itemObj);
    }

    removeItemFromList(id) {
        const list = this._list;

        for (let i = 0; i < list.length; i++) {
            // not strict equal sign, get id from dom directly so it may not be integer
            if (list[i]._id == id) {
                list.splice(i, 1);
                break;
            }
        }
    }
}