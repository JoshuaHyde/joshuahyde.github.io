// Dependency-free lifecycle and numerical regression checks: node --test tests/aquatic.test.cjs
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(require("node:path").join(__dirname, "../aquatic.js"), "utf8");

function habitat({ reduced = false, saved = null, blockedStorage = false, width = 390 } = {}) {
  const queue = new Map(), events = new Map();
  let next = 0, clock = 0, mediaChange, intersection, mutation;
  let strokes = 0, invalidNumbers = 0, maxQueue = 0;
  const ctx = new Proxy({globalAlpha:1}, {
    get: (target, key) => key in target ? target[key] : (...args) => {
      if (["stroke", "fillText", "fillRect"].includes(key)) strokes++;
      for (const arg of args) if (typeof arg === "number" && !Number.isFinite(arg)) invalidNumbers++;
    },
    set: (target, key, value) => {target[key]=value;return true}
  });
  const rect = () => ({width, height:844, top:0, left:0, right:width, bottom:844});
  const canvas = {getContext:()=>ctx,getBoundingClientRect:rect};
  const button = {hidden:true,disabled:false,attrs:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){events.set('button:'+k,fn)}};
  const root = {dataset:{theme:'dark'}};
  const document = {
    hidden:false,documentElement:root,
    getElementById:()=>canvas,
    querySelector:s=>s==='.life-toggle'?button:{getBoundingClientRect:()=>({top:0})},
    querySelectorAll:()=>[],
    addEventListener:(k,fn)=>events.set(k,fn)
  };
  const media = {matches:reduced,addEventListener:(_,fn)=>{mediaChange=fn}};
  const storage = {
    getItem:()=>{if(blockedStorage)throw Error('blocked');return saved},
    setItem:(_,v)=>{if(blockedStorage)throw Error('blocked');saved=v}
  };
  const sandbox = {
    document, localStorage:storage, matchMedia:()=>media,
    innerHeight:844, devicePixelRatio:3,
    window:{addEventListener:(k,fn)=>events.set(k,fn)},
    requestAnimationFrame:fn=>{queue.set(++next,fn);maxQueue=Math.max(maxQueue,queue.size);return next},
    cancelAnimationFrame:id=>queue.delete(id),
    ResizeObserver:class{observe(){}},
    IntersectionObserver:class{constructor(fn){intersection=fn}observe(){}},
    MutationObserver:class{constructor(fn){mutation=fn}observe(){}}
  };
  vm.runInNewContext(source,sandbox);
  function step(count=1) {
    for(let i=0;i<count;i++){
      const callbacks=[...queue.values()]; queue.clear(); clock+=34;
      callbacks.forEach(fn=>fn(clock));
    }
  }
  return {
    step,button,document,root,canvas,queue,events,
    get strokes(){return strokes}, get invalidNumbers(){return invalidNumbers},get maxQueue(){return maxQueue},
    click:()=>events.get('button:click')(),
    visible:value=>{document.hidden=!value;events.get('visibilitychange')()},
    pond:value=>intersection([{isIntersecting:value}]),
    theme:()=>{root.dataset.theme='light';mutation()},
    reduced:value=>{media.matches=value;mediaChange()},
    get saved(){return saved}
  };
}

test('pause stops both scenes, persists, repaints a theme change, and resumes one scheduler',()=>{
  const h=habitat(); h.pond(true); h.step(5);
  assert(h.strokes>0); h.click(); h.step(1);
  assert.equal(h.saved,'true'); assert.equal(h.queue.size,0);
  const before=h.strokes; h.step(10); assert.equal(h.strokes,before);
  h.theme(); h.step(1); assert(h.strokes>before); assert.equal(h.queue.size,0);
  h.click(); h.step(5); assert.equal(h.saved,'false'); assert.equal(h.queue.size,1);
  assert.equal(h.maxQueue,1);
});

test('hidden documents stop scheduling and resume without accumulated catch-up',()=>{
  const h=habitat(); h.pond(true); h.step(10); h.visible(false);
  const before=h.strokes; h.step(100); assert.equal(h.strokes,before); assert.equal(h.queue.size,0);
  h.theme(); h.step(2); assert.equal(h.queue.size,0);
  h.visible(true); h.step(10); assert(h.strokes>before); assert.equal(h.queue.size,1);
});

test('reduced motion creates a still scene and respects stored pause on preference changes',()=>{
  const h=habitat({reduced:true,saved:'true'}); h.step(1);
  assert(h.strokes>0); assert.equal(h.queue.size,0); assert(h.button.disabled);
  h.reduced(false); h.step(1); assert(!h.button.disabled); assert.equal(h.queue.size,0);
  h.click(); h.step(2); assert.equal(h.queue.size,1);
  h.reduced(true); h.step(1); assert.equal(h.queue.size,0);
});

test('blocked browser storage does not break initialization or pause',()=>{
  const h=habitat({blockedStorage:true}); h.step(2); assert(!h.button.hidden);
  h.click(); h.step(1); assert.equal(h.queue.size,0);
});

test('long runs and mobile roster changes keep all drawing coordinates finite',()=>{
  for(const width of [320,1440]) {
    const h=habitat({width}); h.pond(true); h.step(1500);
    assert.equal(h.invalidNumbers,0); assert.equal(h.maxQueue,1);
    assert(h.strokes>10000);
    assert.equal(h.canvas.width,Math.round(width*1.75));
  }
});

test('missing Canvas support leaves controls hidden and content alone',()=>{
  const button={hidden:true};
  vm.runInNewContext(source,{document:{documentElement:{},getElementById:()=>({getContext:()=>null}),querySelector:()=>button}});
  assert(button.hidden);
});
