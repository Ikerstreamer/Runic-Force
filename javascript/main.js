const KNOWLEDGETHRESHOLDS = [0, 5, 10, 25, 50, 50, 250, 500, 2000, 3000, 8000, 4e4, 1e5, 1e6, 1e8, 1e12];
const KNOWLEDGELEVELS = ['???', 'unknown', 'none', 'fragments', 'slight', 'novice', 'acquainted', 'informed', 'learned', 'impressive', 'brilliant', 'erudite', 'enlightened', 'omniscient'];

const KNOWLEDGE = {
  '???': {
    actions: ['Stare at stones'],
    time: 10,
    steps: 1,
    check: function(name) {
      return player.stones[name].amnt > player.stones[name].knowledge;
    },
    tick: function(name, delta) {
      if (this.check(name)) {
        player.stones[name].progress += 0.1 / this.time * delta;
      }
    },
  },
  unknown: {
    actions: ['Pick up stone', 'Rub the stone', 'Lick the stone', 'Kiss the stone'],
    time: 20,
    steps: 1,
    check: function(name) {
      return player.stones[name].amnt >= player.stones[name].knowledge * 3;
    },
    tick: function(name, delta) {
      if (this.check(name)) {
        let cost = 10 + player.stones[name].knowledge * 3;
        let progressTime = (player.stones[name].progress / 100 * this.time) % (this.time / cost);
        if (this.time / cost <= delta / 1000 + progressTime) {
          player.stones[name].amnt -= 1;
        }
        player.stones[name].progress += 0.1 / this.time * delta;
      }
    }
  },
  none: {
    actions: ['Drop the stone from a tree', 'Watch the stone skid over the water', 'Drop the stone on your toes'],
    time: 15,
    steps: 1,
    check: function(name) {
      return player.stones[name].amnt >= Math.pow(player.stones[name].knowledge, 2) / this.time;
    },
    tick: function(name, delta) {
      if (this.check(name)) {
        let cost = Math.pow(player.stones[name].knowledge, 2);
        let progressTime = (player.stones[name].progress / 100 * this.time) % (this.time / cost);
        if (this.time / cost <= delta / 1000 + progressTime) {
          player.stones[name].amnt -= 1;
        }
        player.stones[name].progress += 0.1 / this.time * delta;
      }
    }
  },
  fragments: {
    actions: ['Stone meet stone', 'STONE SMASH', 'Hit stone with stone', 'Step on the stone'],
    time: 20,
    steps: 1,
    check: function(name) {
      return player.stones[name].amnt >= player.stones[name].knowledge * 100 / this.time;
    },
    tick: function(name, delta) {
      if (player.stones[name].amnt > player.stones[name].knowledge) return true;
      else return false;
    }
  },
}

let game = new Vue({
  el: '#game',
  data: {
    player: {
      time: 0,
      lastUpdate: Date.now(),
      runes: [],
      stones: {
        black: {
          name: 'black',
          amnt: 0,
          knowledge: 0,
          research: false,
          progress: 0,
          unlock: true,
        },
        red: {
          name: 'red',
          amnt: 0,
          knowledge: 0,
          research: false,
          progress: 0,
          unlock: false,
        },
      },
      mines: {
        inst: [{
          count: 0,
          total: 15,
          id: 0,
          cycle: 0,
        }],
        amnt: 1,
        output: ['black'],
      },
      tabs: [{
          name: 'Mines',
          unlock: true,
          active: true,
          style: {
            color: '#d5d500'
          },
          id: 0
        },
        {
          name: 'Stones',
          unlock: false,
          active: false,
          style: {
            color: 'blue'
          },
          id: 1
        },
        {
          name: 'Runes',
          unlock: false,
          active: false,
          style: {
            color: 'red'
          },
          id: 2
        }
      ],
    },
  },
  computed: {
    curTab: function() {
      return this.player.tabs.find((x) => x.active).name;
    },
    researchLevels: function() {
      let ret = {};
      for (let name in this.player.stones) {
        let know = this.player.stones[name].knowledge;
        let find = KNOWLEDGETHRESHOLDS.find(function(x, i, a) {
          return x <= know && know < a[i + 1];
        });
        ret[name] = KNOWLEDGETHRESHOLDS.indexOf(find) + 1;
      }
      return ret;
    },
    knowledgeProdMulti: function() {
      let ret = {};
      for (let name in this.player.stones) {
        ret[name] = Math.floor((1 + Math.pow(0.5, this.researchLevels[name]) * (this.player.stones[name].knowledge + 1)) * Math.pow(this.researchLevels[name], 2));
      }
      return ret;
    }
  },
  methods: {
    switchTab: function(id) {
      for (let i = 0; i < this.player.tabs.length; i++) {
        if (this.player.tabs[i].id === id) this.player.tabs[i].active = true;
        else this.player.tabs[i].active = false;
      }
    },
    formatNum: function(x) {
      if (x >= 10000) {
        let e = Math.floor(Math.log10(x));
        let m = x / (10 ** e);
        console.log(m, e);
        return m.toFixed(2) + "e" + e;
      }
      return x;
    },
    newMine: function(fn) {
      fn();
      this.player.mines.inst.push({
        count: 0,
        total: 15,
        id: this.player.mines.inst.length,
        cycle: 0,
      })
      this.player.mines.amnt++;
      if (this.player.mines.amnt >= 2) this.player.tabs[1].unlock = true;
    },
    startResearch: function(name, res) {
      this.player.stones[name].research = res;
    },
    mineStones: function(id) {
      let mine = this.player.mines.inst[id];
      let type = this.player.mines.output[mine.cycle];
      if (mine.count < mine.total) return;
      mine.count = 0;
      this.player.stones[type].amnt += this.knowledgeProdMulti[type];
      mine.cycle = (mine.cycle + 1) % this.player.mines.output.length;
    },
    getStoneKnowledge: function(color) {
      const arr = ['???', 'unknown', 'none', 'fragments', 'slight', 'novice', 'acquainted', 'informed', 'learned', 'impressive', 'brilliant', 'erudite', 'enlightened', 'omniscient']
    },
  }
});

// const KNOWLEDGEACTIONS = {
//   '???': ['Stare at stones'],
//   unknown: ['Pick up stone', 'Rub the stone', 'Lick the stone', 'Kiss the stone'],
//   none: ['Drop the stone from a tree', 'Watch the stone skid over the water', 'Drop the stone on your toes'],
//   fragments: ['Rock meet rock', 'ROCK SMASH', 'Hit rock with rock']
// }
// const KNOWLEDGETIME = {
//   '???': 10,
//   unknown: 20,
//   none: 15,
//   fragments: 20,
// }
// const KNOWLEDGESTEPS = {
//   '???': 1,
//   unknown: 1,
//   none: 1,
//   fragments: 1,
// }
// const KNOWLEDGETICK = {
//   '???': funtion(name, delta) {
//     if (player.stones[name].amnt > player.stones[name].knowledge) return true;
//     else return false;
//   },
//   unknown: funtion(name, delta) {
//
//   },
//   none: function(name, delta) {
//
//   },
//   fragments: function(name, delta) {
//
//   },
// }

function gameLoop() {
  //set player to the player object
  player = game.player;
  // find the current delta
  let delta = Date.now() - player.lastUpdate;
  //mine production
  mineProduction(delta);
  stoneResearch(delta);
  //reset last update
  player.lastUpdate = Date.now();
  requestAnimationFrame(gameLoop);
}

function stoneResearch(delta) {
  for (let name in this.player.stones) {
    let stone = this.player.stones[name];
    if (stone.research) {
      KNOWLEDGE[stone.research].tick(name, delta);
      if (stone.progress >= 100) {
        stone.research = false;
        stone.progress = 0;
        stone.knowledge++;
      }
    }
  }
}

function mineProduction(delta) {
  for (let i = 0; i < player.mines.inst.length; i++) {
    if (player.mines.inst[i].count >= player.mines.inst[i].total)
      game.mineStones(i);
    else player.mines.inst[i].count += delta / 1000;
  }
}

requestAnimationFrame(gameLoop);