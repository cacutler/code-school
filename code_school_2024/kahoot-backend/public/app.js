Vue.createApp({
    data: function () {
        return {editingQuiz: false, currentQuiz: null, currentPage: "loading", user: {name: "", email: "", password: ""}, currentUser: null, newQuiz: {title: "", description: "", questions: []}, newQuestions: [{questionText: "", possibleChoices: [{answerText: "", isCorrect: false}]}], quizzes: [], currentQuizQuestion: 0, currentQuizQuestionAnswered: false, currentQuizTotalScore: 0};
    },
    methods: {
        setPage: function (page) {
            this.currentPage = page;
        },
        registerUser: async function () {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            let requestOptions = {method: "POST", body: JSON.stringify(this.user), headers: myHeaders};
            let response = await fetch("http://localhost:8080/users", requestOptions);
            if (response.status === 201) {
                console.log("Successfully registered");
                this.loginUser();
            } else {
                console.log("Failed to register");
            }
        },
        loginUser: async function () {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            let requestOptions = {method: "POST", body: JSON.stringify(this.user), headers: myHeaders};
            let response = await fetch("http://localhost:8080/session", requestOptions);
            let data = await response.json();
            if (response.status === 201) {
                console.log("Successfully logged in");
                this.currentUser = data;
                this.user = {name: "", email: "", password: ""};
                this.getQuizzes();
                this.currentPage = "quizzes";
            } else {
                console.log("Failed to log in");
            }
        },
        getSession: async function () {
            let response = await fetch("http://localhost:8080/session");
            if (response.status === 200) {
                let data = await response.json();
                this.currentUser = data;
                this.getQuizzes();
                this.currentPage = "quizzes";
            } else {
                this.currentPage = "login";
                console.log("Didn't have a cookie");
            }
        },
        deleteSession: async function () {
            let requestOptions = {method: "DELETE"};
            let response = await fetch("http://localhost:8080/session", requestOptions);
            if (response.status === 204) {
                this.currentPage = "login";
                this.currentUser = null;
            } else {
                console.log("Failed to log out");
            }
        },
        addQuestion: function () {
            this.newQuestions.push({questionText: "", possibleChoices: [{answerText: "", isCorrect: false}]});
        },
        addAnswer: function (index) {
            this.newQuestions[index].possibleChoices.push({answerText: "", isCorrect: false});
        },
        createQuiz: async function () {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            this.newQuiz.questions = this.newQuestions;
            let requestOptions = {method: "POST", body: JSON.stringify(this.newQuiz), headers: myHeaders};
            let response = await fetch("http://localhost:8080/quizzes", requestOptions);
            if (response.status === 201) {
                this.getQuizzes();
                this.currentPage = "quizzes";
                console.log("Successfully created new quiz.");
            } else {
                console.log("Failed to create new quiz.");
            }
        },
        getQuizzes: async function () {
            let response = await fetch("http://localhost:8080/quizzes");
            let data = await response.json();
            this.quizzes = data;
            console.log(data);
        },
        clearQuiz: function () {
            this.newQuiz = {title: "", description: "", questions: []};
            this.newQuestions = [{questionText: "", possibleChoices: [{answerText: "", isCorrect: false}]}];
            this.currentQuiz = {};
            this.currentQuizQuestion = 0;
            this.currentQuizQuestionAnswered = false;
            this.currentQuizTotalScore = 0;
            this.editingQuiz = false;
        },
        deleteQuiz: async function (quizId) {
            let requestOptions = {method: "DELETE"};
            let response = await fetch(`http://localhost:8080/quizzes/${quizId}`, requestOptions);
            if (response.status === 204) {
                this.getQuizzes();
                console.log("Deleted quiz.");
            } else {
                console.log("Failed to delete quiz.");
            }
        },
        startQuiz: async function (quizId) {
            let response = await fetch(`http://localhost:8080/quizzes/${quizId}`);
            let data = await response.json();
            this.currentQuiz = data;
            this.currentPage = "singleQuiz";
        },
        nextQuestion: function () {
            this.currentQuizQuestion++;
            this.currentQuizQuestionAnswered = false;
        },
        answerQuestion: function (answer) {
            if (answer.isCorrect) {
                this.currentQuizTotalScore++;
            }
            this.currentQuizQuestionAnswered = true;
        },
        editQuiz: function (quiz) {
            this.newQuiz = quiz;
            this.newQuestions = quiz.questions;
            this.currentPage = "createQuiz";
            this.editingQuiz = true;
        },
        saveQuiz: async function () {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            this.newQuiz.questions = this.newQuestions;
            let requestOptions = {method: "PUT", body: JSON.stringify(this.newQuiz), headers: myHeaders};
            let response = await fetch(`http://localhost:8080/quizzes/${this.newQuiz._id}`, requestOptions);
            if (response.status === 204) {
                this.getQuizzes();
                this.clearQuiz();
                this.currentPage = "quizzes";
                console.log("Updated quiz.");
            } else {
                console.log("Failed to update quiz.");
            }
        }
    },
    created: function () {
        console.log("Kahoot App created.");
        this.getSession();
    }
}).mount("#app");