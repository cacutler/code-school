const URL = "http://localhost:8080";
Vue.createApp({
    data: function () {
        return {
            expenses: [],
            searchInput: "",
            newExpense: {description: "", amount: 0, category: ""},
            sortOrder: "",
            modalOpen: false,
            modal: {description: "", amount: 0, category: "", index: -1}
        }
    },
    methods: {
        getExpenses: async function () {
            let response = await fetch(`${URL}/expenses`);
            let data = await response.json();
            this.expenses = data;
        },
        addExpense: async function () {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            let encodedData = "description=" + encodeURI(this.newExpense.description) + "&amount=" + encodeURI(this.newExpense.amount) + "&category=" + encodeURI(this.newExpense.category);
            let requestOptions = {method: "POST", body: encodedData, headers: myHeaders};
            let response = await fetch(`${URL}/expenses`, requestOptions);
            if (response.status === 201) {
                let data = await response.json();
                this.expenses.push(data);
                this.newExpense.description = "";
                this.newExpense.amount = 0;
                this.newExpense.category = "";
            } else {
                alert("Failed to add expense.");
            }
        },
        deleteExpense: async function (index) {
            let requestOptions = {method: "DELETE"};
            let expId = this.expenses[index]._id;
            let response = await fetch(`${URL}/expenses/${expId}`, requestOptions);
            if (response.status === 204) {
                this.expenses.splice(index, 1);
            } else {
                alert("Failed to delete expense.");
            }
        },
        updateExpense: async function () {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            let encodedData = "description=" + encodeURI(this.modal.description) + "&amount=" + encodeURI(this.modal.amount) + "&category=" + encodeURI(this.modal.category);
            let requestOptions = {method: "PUT", body: encodedData, headers: myHeaders};
            let expId = this.expenses[this.modal.index]._id;
            let response = await fetch(`${URL}/expenses/${expId}`, requestOptions);
            if (response.status === 204) {
                let exp = this.expenses[this.modal.index];
                exp.description = this.modal.description;
                exp.amount = parseFloat(this.modal.amount);
                exp.category = this.modal.category;
            } else {
                alert("Failed to update expense.");
            }
            this.toggleModal();
        },
        toggleModal: function (index = null) {
            this.modalOpen = !this.modalOpen;
            if (index !== null) {
                let exp = this.expenses[index];
                this.modal.index = index;
                this.modal.description = exp.description;
                this.modal.amount = exp.amount;
                this.modal.category = exp.category;
            }
        },
        clearSearch: function () {
            this.searchInput = "";
        },
        sortExpenses: function () {
            if (this.sortOrder === "asc") {
                function compare(a, b) {
                    if (a.amount > b.amount) {
                        return -1;
                    }
                    if (a.amount < b.amount) {
                        return 1;
                    }
                    return 0;
                }
                this.sortOrder = "desc";
            } else {
                function compare(a, b) {
                    if (a.amount < b.amount) {
                        return -1;
                    }
                    if (a.amount > b.amount) {
                        return 1;
                    }
                    return 0;
                }
                this.sortOrder = "asc";
            }
            this.expenses.sort(compare);
        }
    },
    created: function () {
        console.log("Vue app created.");
        this.getExpenses();
    },
    computed: {
        balance: function () {
            let total = 0;
            for (expense of this.filteredExpenses) {
                total += parseFloat(expense.amount);
            }
            return total;
        },
        filteredExpenses: function () {
            return this.expenses.filter((expense) => {
                return expense.description.toLowerCase().includes(this.searchInput.toLowerCase());
            });
        }
    }
}).mount("#app");