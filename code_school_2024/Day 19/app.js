Vue.createApp({
    data: function () {
        return {
            sides: 0,
            dice: []
        };
    },
    methods: {
        createDice: function () {
            if (this.sides > 0) {
                let diceObj = {sides: this.sides, value: this.sides};
                this.dice.push(diceObj);
            }
        },
        rollDice: function (index) {
            let currentDice = this.dice[index];
            let rollCount = 0;
            let rollInterval = setInterval(() => {
                currentDice.value = Math.ceil(Math.random() * currentDice.sides);
                if (rollCount > 10) {
                    clearInterval(rollInterval);
                }
                rollCount++;
            }, 50);
        },
        deleteDice: function (index) {
            this.dice.splice(index, 1);
        },
        rollAllDice: function () {
            this.dice.forEach((die, index) => {
                this.rollDice(index);
            });
        }
    },
    created: function () {
        console.log("Dice Vue app created.");
    }
}).mount("#app");