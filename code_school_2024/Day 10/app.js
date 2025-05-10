Vue.createApp({
    data: function() {
        return {
            answer: "",
            question: "",
            answerBank: ["Yes", "No", "Probably", "Don't count on it", "Unlikely"],
            validQuestion: false,
            showButton: false,
            history: []
        }
    },
    methods: {
        askQuestion: function () {
            this.showingButton();
            if (this.question.slice(-1) !== "?") {
                this.validQuestion = true;
                return;
            }
            if (this.question.slice(-1) === "?") {
                this.validQuestion = false;
                let index = Math.floor(Math.random() * this.answerBank.length);
                this.answer = this.answerBank[index];
                this.history.push({question: this.question, answer: this.answer});
                this.question = "";
            }
        },
        showingButton: function () {
            if (this.question.length < 2 || this.question[this.question.length - 1] !== "?") {
                this.showButton = false;
            } else {
                this.showButton = true;
            }
        },
        deleteItem: function (index) {
            this.history.splice(index, 1);
        }
    },
    created: function() {
        console.log("Vue app loaded.");
    }
}).mount("#app");