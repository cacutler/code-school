Vue.createApp({
    data: function () {
        return {
            tasks: [],
            description: "",
            category: "",
            searchInput: "",
            isEditing: false,
            editingIndex: -1
        }
    },
    methods: {
        addTask: function () {
            let task = {description: this.description, category: this.category};
            this.tasks.push(task);
            this.description = "";
            this.category = "";
        },
        deleteTask: function (index) {
            this.tasks.splice(index, 1);
        },
        editTask: function (index) {
            let todoItem = this.tasks[index];
            this.category = todoItem.category;
            this.description = todoItem.description;
            this.editingIndex = index;
            this.isEditing = true;
        },
        updateTask: function () {
            let todo = this.tasks[this.editingIndex];
            todo.description = this.description;
            todo.category = this.category;
            this.isEditing = false;
            this.editingIndex = -1;
            this.category = "";
            this.description = "";
        }
    },
    created: function () {
        console.log("To Do List app created.");
    },
    computed: {
        filteredTasks: function () {
            return this.tasks.filter((task) => {
                return task.description.toLowerCase().includes(this.searchInput.toLowerCase());
            });
        }
    }
}).mount("#app");