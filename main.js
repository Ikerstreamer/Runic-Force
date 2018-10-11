Vue.component('container', {
    props: {
        width: { default: 0 },
        height: { default: this.twidth },
        sty: {default: {}, type:Object}
    },
    data: function () {
        return {
            styles: Object.assign({
                display: 'inline-flex',
                position: 'relative',
                width: this.width,
                height: this.height,
            }, this.sty)
        };
    },
    template: `<div v-bind:style="styles"><slot></slot></div>`
});

Vue.component('tab-select', {
    props: {
        name: String,
        active: Boolean,
        sty: Object,
        order: Number
    },
    computed: {

        styles: function () {
            return Object.assign({
                    width: '100%',
                    'font-size': '2vw',
                    'padding-bottom': '5px',
                    'padding-top': '5px',
                    border: 'solid',
                    'border-width': '0.5px',
                    'border-color': 'black',
                    'text-align': 'center',
                    'line-height': '100%',
                    cursor: 'pointer',
                    'background-color': this.active ? '#C0C0C0' : '#DCDCDC',
                    order: this.order
                }, this.sty)
        },
    },
    template: `<div v-bind:style="styles" @click="$emit('activate')">{{name}}</div>`
});

Vue.component('Mines-tab', {
    template: `<div><button>Start new Mine</button></div>`,
});

Vue.component('rune', {
    props: {
        tcolor: String,
        tsize: { type: Number, default: 200 },
        name: {type: String, default: "Rune of the Unknown"}
    },
    data: function () {
        return {
            color: this.tcolor,
            size: this.tsize
        };
    },
    computed: {
        styles: function () {
            return {
                background: this.color,
                width: this.size * 5.2 + 'px',
                "font-size": this.size + 'px',
                "border-radius": this.size/5 + 'px'
            };
            }
    },
    template: `<div v-bind:style="styles">{{name}}</div>`
});


let game = new Vue({
    el: '#game',
    data: {
        player: {
            runes: [],
            stones: [],
            mines: {
                timer: { count: 0, total: 60 },
                output: { red: 0.5, black: 0.5 }
            }



        },
        tabs: [
            { name: 'Mines', unlock: true, active: true, style: { color: 'yellow' }, id:0 },
            { name: 'Stones', unlock: true, active: false, style: { color: 'blue' }, id:1 },
            { name: 'Runes', unlock: true, active: false, style: { color: 'red' }, id:2 }
        ]
    },
    computed: {
        curTab: function () {
            return this.tabs.find((x) => x.active).name + "-tab";
        }

    },
    methods: {
        switchTab: function (id) {
            for (let i = 0; i < this.tabs.length; i++){
                if (this.tabs[i].id === id) this.tabs[i].active = true;
                else this.tabs[i].active = false;
            }
        }
    }
});
