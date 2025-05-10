Vue.createApp({
    data: function () {
        return {jokes: [], randomJoke: {}, searchInput: ""};
    },
    methods: {
        getJokes: function () {
            fetch("https://official-joke-api.appspot.com/jokes/ten").then((response) => {
                if (response.status === 200) {
                    response.json().then((jokesFromServer) => {
                        this.jokes = jokesFromServer;
                    });
                }
            });
        },
        getRandomJoke: function () {
            this.randomJoke = this.jokes[Math.ceil(Math.random() * this.jokes.length)];
        }
    },
    created: function () {
        console.log("Jokes App created.");
        this.getJokes();
    },
    computed: {
        filteredJokes: function () {
            return this.jokes.filter((joke) => {
                return joke.setup.toLowerCase().includes(this.searchInput.toLowerCase());
            });
        }
    }
}).mount("#app");