import TodoList from "./todoList.js";
import TodoItem from "./todoItem.js";

const todoList = new TodoList();

//launch app
document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initApp();
    }
});

const initApp = () => {
    //add listeners
    const itemEntryForm = document.getElementById("itemEntryForm");
    itemEntryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        processSubmission();
    });

    const clearItems = document.getElementById("clearItems");

    clearItems.addEventListener("click", (event) => {
        const list = todoList.getList();
        if (list.length) {
            const confirmed = confirm("are you sure you want to clear the entire list?");
            if (confirmed) {
                todoList.clearList();
                //update persistent data
                updatePersistentData(todoList.getList());
                refreshThePage();
            }
        }
    });

    loadListObject();
    refreshThePage();
};

const loadListObject = () => {
    const storedList = localStorage.getItem("myTodoList");

    if (typeof storedList !== "string") return;

    const parsedList = JSON.parse(storedList);
    console.log('parsed list', parsedList);
    //when we stored todoList in local storage, we have our list items data(_id,_item) but we lose our methods. 
    //so we get items data from parsedList.
    //we recreate todoItems and todoList. after that we can use our methods again.
    parsedList.forEach(itemObj => {
        //this list item data comes from parsedList so they don't have getter and setter(getId() and setId()) YET.
        const newTodoItem = createNewItem(itemObj._id, itemObj._item);

        todoList.addItemToList(newTodoItem);
    });
};

const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
};

const clearListDisplay = () => {
    const parentElement = document.getElementById("listItems");

    deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
    //1. round: parentElement={a,b}  child={b}
    //2. round: parentElement={a}    child={a}
    let child = parentElement.lastElementChild;

    while (child) {
        //1. round: remove {b}
        //2. round: remove {a}
        parentElement.removeChild(child);
        //1. round: updated parentElement={a}   updated child={a}
        //2. round: updated parentElement=null  updated child=null => K.O. 
        child = parentElement.lastElementChild;
    }
};

const renderList = () => {
    const list = todoList.getList();

    list.forEach((item) => {
        buildListItem(item);
    });
};

const buildListItem = (item) => {
    /* 
          <div class="item">
            <input type="checkbox" id="1" tabindex="0" />
            <label for="1">read</label>
          </div>
       
    */
    const div = document.createElement("div");
    div.className = "item";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;

    addClickListenerToCheckbox(check);

    const label = document.createElement("label");
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);

    const container = document.getElementById("listItems");
    container.appendChild(div);
};

const addClickListenerToCheckbox = (checkbox) => {
    checkbox.addEventListener("click", (event) => {
        todoList.removeItemFromList(checkbox.id);
        updatePersistentData(todoList.getList());

        const removedText = getLabelText(checkbox.id);

        updateScreenReaderConfirmation(removedText, "removed from list");
        //slow down removing item to see the action of removing more clearly in ui 
        setTimeout(() => {
            refreshThePage();
        }, 1000);
    });
};

const getLabelText = (checkboxId) => {
    //checkbox's nextElementSibling is label which has the item's text we're looking for.
    return document.getElementById(checkboxId).nextElementSibling.textContent;
}

const updatePersistentData = (listArray) => {
    localStorage.setItem("myTodoList", JSON.stringify(listArray));
};

const clearItemEntryField = () => {
    document.getElementById("newItem").value = "";
};

const setFocusOnItemEntry = () => {
    document.getElementById("newItem").focus();
};

const processSubmission = () => {
    const newEntryText = getNewEntry();

    if (!newEntryText.length) return;

    const nextItemId = calcNextItemId();
    const todoItem = createNewItem(nextItemId, newEntryText);

    todoList.addItemToList(todoItem);
    updateScreenReaderConfirmation(newEntryText, "added to list");
    updatePersistentData(todoList.getList());
    refreshThePage();
};

const getNewEntry = () => {
    return document.getElementById("newItem").value.trim();
};

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = todoList.getList();

    if (list.length > 0) {
        nextItemId = list[list.length - 1].getId() + 1;
    }

    return nextItemId;
};

const createNewItem = (itemId, itemText) => {
    const todo = new TodoItem();

    todo.setId(itemId);
    todo.setItem(itemText);

    return todo;
};

const updateScreenReaderConfirmation = (newEntryText, actionVerb) => {
    document.getElementById("confirmation").textContent = `${newEntryText} ${actionVerb}.`;
}