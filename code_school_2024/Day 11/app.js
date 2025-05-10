Vue.createApp({
    data: function () {
        return {
            book: [],
            name: "",
            address: "",
            isEditing: false,
            editingIndex: -1
        }
    },
    methods: {
        addContact: function () {
            let contact = {name: this.name, address: this.address};
            this.book.push(contact);
            this.name = "";
            this.address = "";
        },
        deleteContact: function (index) {
            this.book.splice(index, 1);
        },
        editContact: function (index) {
            let addressItem = this.book[index];
            this.name = addressItem.name;
            this.address = addressItem.address;
            this.isEditing = true;
            this.editingIndex = index;
        },
        saveEdit: function () {
            let contact = this.book[this.editingIndex];
            contact.name = this.name;
            contact.address = this.address;
            this.isEditing = false;
            this.editingIndex = -1;
            this.name = "";
            this.address = "";
        }
    },
    created: function () {
        console.log("Address Book app created.");
    }
}).mount("#app");