Vue.createApp({
    data: function () {
        return {posts: [], title: "", content: "", image: null};
    },
    methods: {
        handleFileUpload: function (event) {
            this.image = event.target.files[0];
        },
        createPost: async function () {
            const formData = new FormData();
            formData.append("title", this.title);
            formData.append("content", this.content);
            formData.append("image", this.image);
            let requestOption = {method: "POST", body: formData};
            let response = await fetch("http://localhost:8080/posts", requestOption);
            const data = await response.json();
            this.posts.push(data);
        },
        getPosts: async function () {
            let response = await fetch("http://localhost:8080/posts");
            const data = await response.json();
            this.posts = data;
            console.log(data);
        }
    },
    created: function () {
        console.log("Image Uploads app created.");
        this.getPosts();
    }
}).mount("#app");