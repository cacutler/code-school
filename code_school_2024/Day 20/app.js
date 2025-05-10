Vue.createApp({
    data: function () {
        return {colors: [], red: 0, green: 0, blue: 0};
    },
    methods: {
        addColor: function () {
            this.colors.push({red: this.red, green: this.green, blue: this.blue, colorString: this.rgbString});
        }
    },
    created: function () {
        console.log("RGB Color Palette app loaded.");
    },
    computed: {
        rgbString: function () {
            return `rgb(${this.red}, ${this.green}, ${this.blue})`;
        }
    }
}).mount("#app");