Vue.component('container', {
  props: {
    width: {
      default: 0
    },
    height: {
      default: function() {
        return this.width
      }
    },
    size: {
      default: "inherit"
    },
    sty: {
      default: function() {
        return {};
      },
      type: Object
    }
  },
  computed: {
    styles: function() {
      return Object.assign({
        display: 'inline-flex',
        position: 'relative',
        width: this.width,
        height: this.height,
        'font-size': this.size,
      }, this.sty)
    }
  },
  template: `<div v-bind:style="styles" @click="$emit('click')"><slot></slot></div>`
});

Vue.component('progress-bar', {
  props: ['color', 'maxVal', 'curVal', 'width', 'height'],
  template: `
  <container @click="$emit('click')" v-bind:width="width" v-bind:height="height" v-bind:sty="{'background-color':'white','border-radius':'11px', border:'solid', 'border-color':'black'}">
    <container width="100%" v-bind:sty="{'z-index':1,'position':'absolute','justify-items':'center', 'justify-content':'center'}"><span style="position:relative; top:12.5%"><slot></slot></span></container>
    <container v-bind:width="width2" v-bind:sty="styles" v-bind:height="'calc(height + 1px)'"></container>
  </container>`,
  computed: {
    width2: function() {
      return ((this.curVal / this.maxVal) * 90 + 10) + '%'
    },
    styles: function() {
      return {
        'background-color': this.color,
        'border-bottom-left-radius': '10px',
        'border-top-left-radius': '10px',
        'border-top-right-radius': Math.min(Math.max(this.curVal / this.maxVal - 0.9, 0) * 100, 10) + 'px',
        'border-bottom-right-radius': Math.min(Math.max(this.curVal / this.maxVal - 0.9, 0) * 100, 10) + 'px',
        'margin-left': '-0.5px',
        'padding-right': '1.5px',
        'margin-top': '-0.5px'
      };
    }
  }
})

Vue.component('tab-select', {
  props: {
    name: String,
    active: Boolean,
    sty: Object,
    order: Number
  },
  computed: {

    styles: function() {
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
  props: ['player'],
  template: `
    <container ref="tab" width="80%" height="100%" v-bind:sty="{'margin-left':'2.5%', 'margin-right':'2.5%'}">
  <container v-bind:width="modWidth" v-bind:height="modHeight" v-bind:sty="{'flex-wrap':'wrap','overflow-y':'scroll', 'justify-content': 'start', 'align-content':'start'}">
    <container v-for="mine in player.mines.inst" v-bind:key="mine.id + 1" width="164px" height="164px" v-bind:sty="{'flex-direction':'column','align-items':'center'}">
      <progress-bar width="128px" height="20px" color="green" v-bind:maxVal="mine.total" v-bind:curVal="mine.count">
      </progress-bar>
      <img src="imgs/mine.png" width="128px" height="128px" style="cursor:pointer;" draggable="false" />
    </container>
    <div v-bind:style="{height:'48px', width:'96px', 'border-radius': '20px', 'cursor':'pointer', border:'solid', 'text-align': 'center', 'margin-top':'32px', 'font-size':'12px', 'padding-top':'8px', 'padding-left':'4px', 'padding-right':'4px', 'vertical-align':'middle'}" @click="buyMine">
      <span style="font-size:1.5em">New Mine</span> ({{Math.pow(10, player.mines.amnt-1)}} Black)
    </div>
  </container>
</container>
</container>
    `,
  methods: {
    calcHeight: function() {
      this.modHeight = 164 * Math.floor((this.$refs.tab.$el.clientHeight * 0.8) / 164) + "px";
    },
    calcWidth: function() {
      this.modWidth = 164 * Math.floor((this.$refs.tab.$el.clientWidth * 0.6) / 132) + 16 + "px";
    },
    buyMine: function() {
      if (this.player.stones.black.amnt >= Math.pow(10, this.player.mines.amnt - 1)) {
        this.$emit('newmine', function() {
          player.stones.black.amnt -= Math.pow(10, this.player.mines.amnt - 1);
        });
      }
    },
  },
  data: function() {
    return {
      modHeight: '80%',
      modWidth: '80%',
    }
  },
  beforeUpdate: function() {
    this.calcHeight();
    this.calcWidth();
  }

});

Vue.component('stone-ui', {
  props: ['name', 'stone', 'knowprod'],
  template: `<container width="100%" height="15vw" v-bind:sty="{color:name, 'flex-direction':'column'}">
  <container width="auto" size="2em">{{title}}</container>
  <br>
  <container width="auto" size="1.5em">Knowledge: {{dispKnowledge}}</container>
  <container width="auto" size="1em">Stone output multiplier: {{knowprod}}x</container>
  <br>
  <progress-bar width="50%" height="1.5vw" color="lightblue" maxVal="100" v-bind:curVal="stone.progress" style="cursor:pointer" @click="start">{{actionDisp}}</progress-bar>
  <br>
  <container v-if="showReq" width="auto" size="1em"> <ul style="list-style-type: none; margin: 0; padding: 0;" ><li v-for="Req in researchReqs[dispKnowledge]">{{Req}}</li></ul></container>
  <container width="auto" size="1em" v-else>{{falvourText[0]}}<br>{{falvourText[1]}}<br>{{falvourText[2]}}</container>
  </container>
  `,
  data: function() {
    return {
      action: '',
      actionDisp: 'Click me to research!',
      showReq: false,
      endText: {
        //???
        'Stare at stones': ['They stare back at you...', 'I believe it looks like a rock'],
        //Unknown
        'Pick up stone': ['Macho man'],
        'Rub the stone': ['The power of friction'],
        'Lick the stone': ['Damn, it tastes like LoL'],
        'Kiss the stone': ['You smooched it. Mission accomplished. Sorta.'],
        //none
        'Drop the stone from a tree': ['I believe it can fly... Wait no it can\'t'],
        'Watch the stone skid over the water': ['Aaaaaaand you just lost it. Congrats.'],
        'Drop the stone on your toes': ['Why did I think this was a good idea :thonk:'],
        //fragments
        'Stone meet stone': ['Reunited at long last, so now what?'],
        'STONE SMASH': ['Hulk was a scientist right?'],
        'Hit stone with stone': ['Look at all the little ones'],
      }
    }
  },
  computed: {
    areResearching: function() {
      return this.stone.research !== false;
    },
    title: function() {
      return this.name.charAt(0).toUpperCase() + this.name.slice(1);
    },
    dispKnowledge: function() {
      let know = this.stone.knowledge;
      let find = KNOWLEDGETHRESHOLDS.find(function(x, i, a) {
        return x <= know && know < a[i + 1];
      });
      return KNOWLEDGELEVELS[KNOWLEDGETHRESHOLDS.indexOf(find)];
    },
    falvourText: function() {
      if (!this.stone.research && this.action !== '') {
        return ['Research Complete!', 'Method: ' + this.action, 'Results: ' + this.endText[this.action][Math.floor(Math.random() * this.endText[this.action].length)]];
      } else return ['', '', ''];
    },
    researchReqs: function() {
      return {
        '???': ['Have ' + (this.stone.knowledge + 1) + ' ' + this.name + ' stones, actively available for research.', ' None will be consumed.'],
        unknown: ['Have ' + this.stone.knowledge * 3 + ' ' + this.name + ' stones, actively available for research.', (this.stone.knowledge * 3 + 10) + ' will be consumed.'],
        none: ['Have ' + Math.pow(this.stone.knowledge, 2) / KNOWLEDGE.none.time + ' ' + this.name + ' stones, available for research.', Math.pow(this.stone.knowledge, 2) + ' will be consumed.'],
        fragments: ['Have ' + this.stone.knowledge * 100 + ' ' + this.name + 'stones'],
      };
    }
  },
  watch: {
    areResearching: function(oldVal, newVal) {
      if (!oldVal && newVal) this.showReq = false;
    }
  },
  methods: {
    updateAction: function() {
      if (this.stone.research) {
        let ret = this.action;
        const dots = ['\xa0\xa0\xa0', '.\xa0\xa0', '..\xa0', '...']
        ret += dots[Math.floor(Date.now() / 1000) % 4]
        this.actionDisp = ret;
      } else this.actionDisp = 'Click me to research!';
    },
    start: function() {
      let temp = KNOWLEDGE[this.dispKnowledge]
      this.showReq = true;
      if (temp.check(this.name)) {
        this.stone.research = this.dispKnowledge;
        this.action = temp.actions[Math.floor(Math.random() * temp.actions.length)];
        this.$emit('start');
      }
    }
  },
  beforeUpdate: function() {
    this.updateAction();
  }
});

Vue.component('Stones-tab', {
  props: ['player', 'knowprod'],
  template: `
<container ref="tab" width="80%" height="100%" v-bind:sty="{'margin-left':'2.5%', 'margin-right':'2.5%'}">
  <container width="50%" height="80%" v-bind:sty="{'flex-wrap':'wrap','overflow-y':'scroll', 'justify-content': 'start', 'align-content':'start', 'flex-direction':'column'}">
    <stone-ui v-for="(stone, key) in player.stones" :key="key" v-bind:stone.sync="stone" v-bind:knowprod="knowprod[key]" v-bind:name="key" @start="$emit('research',key,stone.research)">
    </stone-ui>
  </container>
</container>
  `,
});



Vue.component('rune', {
  props: {
    tcolor: String,
    tsize: {
      type: Number,
      default: 200
    },
    name: {
      type: String,
      default: "Rune of the Unknown"
    }
  },
  data: function() {
    return {
      color: this.tcolor,
      size: this.tsize
    };
  },
  computed: {
    styles: function() {
      return {
        background: this.color,
        width: this.size * 5.2 + 'px',
        "font-size": this.size + 'px',
        "border-radius": this.size / 5 + 'px'
      };
    }
  },
  template: `<div v-bind:style="styles">{{name}}</div>`
});