Vue.createApp({
  data: function () {
    return {students: [], student_name: "", student_major: ""};
  },
  methods: {
    loadStudents: async function () {
      let resp = await fetch("http://localhost:8080/students");
      this.students = await resp.json();
    },
    addStudent: async function () {
      myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      if (this.student_name.trim() === "" || this.student_major.trim() === "") {
        alert("No empty fields");
        return;
      }
      let encodedData = "name=" + encodeURIComponent(this.student_name) + "&major=" + encodeURIComponent(this.student_major);
      let requestOptions = {method: "POST", body: encodedData, headers: myHeaders};
      fetch("http://localhost:8080/students", requestOptions).then(() => {
        this.loadStudents();
      });
    }
  },
  created: function () {
    console.log("Hello, Vue.");
    this.loadStudents();
  }
}).mount("#app");