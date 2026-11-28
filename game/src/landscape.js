import { createRandom } from './random.js';
import { WIDTH, HEIGHT, GROUND, GOAL } from './config.js';
import { box, oval, path, shape, stroke } from './ink.js';

const mod = (n, d) => ((n % d) + d) % d;
const grain = createRandom(947);
const flecks = Array.from({ length: 3300 }, () => [grain() * WIDTH, grain() * HEIGHT, grain() * 2 + .4, grain()]);
const grasses = Array.from({ length: 90 }, () => [grain() * 1450, grain(), grain()]);

function cloud(c,x,y,s,color) {
  c.save(); c.translate(x,y); c.scale(s,s);
  path(c,color,[[-115,9],[-82,2],[-64,-10],[-41,-9],[-25,-25],[7,-30],[35,-17],[48,-20],[78,-10],[114,-5],[145,8],[78,13],[-70,15]]);
  c.restore();
}

function barn(c,x,y,s) {
  c.save(); c.translate(x,y); c.scale(s,s);
  path(c,'#9b4534',[[0,0],[0,-76],[76,-118],[151,-76],[151,0]]);
  path(c,'#793b31',[[112,-89],[151,-76],[151,0],[112,0]]);
  path(c,'#643429',[[-12,-73],[10,-110],[72,-136],[127,-111],[163,-72],[147,-70],[116,-92],[72,-109],[20,-92],[4,-71]]);
  box(c,53,-54,51,54,'#de8d55');
  box(c,59,-49,39,49,'#65372e');
  stroke(c,'#c87548',4,[[59,-49],[98,0]]);
  stroke(c,'#c87548',4,[[98,-49],[59,0]]);
  box(c,67,-90,20,16,'#edaa60');
  for (let i=12;i<151;i+=12) stroke(c,'#74372e',1.5,[[i,-68],[i,-4]]);
  c.restore();
}

function silo(c,x,y) {
  oval(c,x,y-105,23,22,'#713c36');
  box(c,x-23,y-105,46,105,'#713c36');
  box(c,x-19,y-104,25,104,'#a6533a');
  for(let i=19;i<104;i+=17) stroke(c,'#854535',2,[[x-22,y-i],[x+22,y-i]]);
  stroke(c,'#63342f',3,[[x+13,y],[x+13,y-113]]);
}

export function pine(c,x,y,h,color) {
  const w=h*.26;
  path(c,color,[[x,y-h],[x+w*.54,y-h*.72],[x+w*.30,y-h*.73],[x+w*.77,y-h*.46],
    [x+w*.46,y-h*.48],[x+w,y-h*.18],[x+w*.16,y-h*.21],[x+w*.16,y],[x-w*.16,y],
    [x-w*.16,y-h*.21],[x-w,y-h*.17],[x-w*.47,y-h*.48],[x-w*.77,y-h*.46],
    [x-w*.31,y-h*.73],[x-w*.55,y-h*.72]]);
}

export function forest(c, start, base, color, height) {
  const random = createRandom(791);
  for(let x=start;x<WIDTH+110;x+=34) {
    pine(c,x,base+random()*41,height*(.56+random()*.68),color);
  }
}

export function terrain(c, travel, scene, distance) {
  const dawn = scene === 'escaped';
  const title = scene === 'title';
  const approach = scene === 'play' ? Math.max(0,(distance-820)/(GOAL-820)) : 0;
  const wooded = dawn || approach > .50;
  const sky = c.createLinearGradient(0,0,0,590);
  sky.addColorStop(0,dawn?'#648a82':'#a83d39');
  sky.addColorStop(.55,dawn?'#9bb09a':'#ed854c');
  sky.addColorStop(1,dawn?'#f0c686':'#ffc678');
  box(c,0,0,WIDTH,HEIGHT,sky);
  const sx = dawn ? 880 : title ? 972 : 962;
  const sy = dawn ? 370 : title ? 300 : 334;
  oval(c,sx,sy,226,226,dawn?'#d4c396':'#eb9455');
  oval(c,sx,sy,198,198,dawn?'#f7d796':'#f4ad61');
  oval(c,sx,sy,176,176,'#ffd482');
  c.save();
  c.beginPath(); c.arc(sx,sy,176,0,Math.PI*2); c.clip();
  for(let i=0;i<8;i++) box(c,sx-180,sy+39+i*13,360,1+i*.35,dawn?'#ebbd7e':'#eba15a');
  c.restore();
  for(let i=0;i<7;i++) {
    const x=mod(74+i*244-travel*.03,1650)-115;
    cloud(c,x,159+(i%4)*58,.55+(i%3)*.36,dawn?'#b8b69a':i%2?'#df8250':'#ed995b');
  }
  shape(c,dawn?'#7b927e':'#bf6546',p=>{p.moveTo(0,437);p.bezierCurveTo(230,339,342,454,528,420);p.bezierCurveTo(834,333,945,469,1280,374);p.lineTo(1280,586);p.lineTo(0,586);});
  shape(c,dawn?'#526e61':'#9c503c',p=>{p.moveTo(0,492);p.bezierCurveTo(260,390,449,473,686,471);p.bezierCurveTo(960,421,1136,435,1280,473);p.lineTo(1280,604);p.lineTo(0,604);});
  const treeOffset = mod(travel*.052,1440);
  for(let i=0;i<38;i++) {
    const x = mod(i*42-treeOffset,1470)-60;
    oval(c,x,491+i%3*5,27+i%4*7,13+i%5*5,dawn?'#566d53':'#a5523b');
  }
  if (dawn || approach > 0) {
    forest(c,dawn?393:1270-approach*1740,556,dawn?'#42695f':'#796048',205);
    forest(c,dawn?609:1350-approach*1430,630,dawn?'#244b43':'#3f5142',285);
  }
  if (!dawn && approach < .58) {
    c.save();
    c.globalAlpha = Math.min(1,1.8-approach*3);
    const offset = mod(travel*.105,1440);
    for (const tile of [0,1440]) {
      const x = (title?648:345)+tile-offset;
      barn(c,x,510,.91);
      silo(c,x+160,510);
      oval(c,x-50,507,66,14,'#a25238');
    }
    c.restore();
  }
  shape(c,wooded?'#797c4c':'#c07a3e',p=>{p.moveTo(0,551);p.quadraticCurveTo(321,555,651,539);p.quadraticCurveTo(989,535,1280,559);p.lineTo(1280,651);p.lineTo(0,651);});
  for(let i=0;i<9;i++) {
    const y=549+i*11;
    shape(c,wooded?(i%2?'#6b7149':'#898251'):(i%2?'#ac6237':'#d18a43'),p=>{
      p.moveTo(0,y+7);p.quadraticCurveTo(600,y-27-i*3,1280,y+5);
      p.lineTo(1280,y+11+i);p.quadraticCurveTo(540,y-12-i*2,0,y+15+i);
    });
  }
  for(const [pos, h, shade] of grasses) {
    const x=mod(pos-travel*.31,1450)-45;
    const y=587+h*30;
    const color=wooded?'#505e42':shade>.5?'#8d4a2e':'#bf7737';
    stroke(c,color,2,[[x,y],[x+2,y-10-shade*10]]);
    oval(c,x-2,y-8,2,6,color,-.65);
    oval(c,x+4,y-13,2,6,color,.68);
    if (!wooded && shade>.4) oval(c,x+2,y-14,2.5,6,'#f0b653',.26);
  }
  const fenceOffset=mod(travel*.53,174);
  const rail=wooded?'#515b40':'#8c4b31';
  stroke(c,rail,9,[[0,597],[WIDTH,596]]);
  stroke(c,rail,7,[[0,620],[WIDTH,618]]);
  for(let x=-fenceOffset;x<WIDTH+25;x+=174){
    path(c,rail,[[x-7,637],[x-7,584],[x,577],[x+7,585],[x+7,638]]);
    stroke(c,dawn?'#888154':'#be7945',2,[[x-3,591],[x-3,627]]);
  }
  box(c,0,GROUND,WIDTH,HEIGHT-GROUND,dawn?'#283e35':'#542f2a');
  box(c,0,GROUND,WIDTH,7,dawn?'#b39d64':'#eea354');
  box(c,0,GROUND+7,WIDTH,13,dawn?'#7d7750':'#a85837');
  for(const [pos,h,shade] of grasses){
    const x=mod(pos-travel*(1+h*.2),1450)-55;
    const y=GROUND+24+h*117;
    stroke(c,dawn?'#57604a':shade<.6?'#854533':'#a25538',1+h*2,[[x,y],[x+10+shade*53,y]]);
  }
}

let paperLayer;
export function paper(c) {
  if (!paperLayer) {
    paperLayer = new OffscreenCanvas(WIDTH, HEIGHT);
    const texture = paperLayer.getContext('2d');
    for (const [x,y,size,shade] of flecks) {
      texture.fillStyle = shade < .5 ? '#331d24' : '#fff2c1';
      texture.globalAlpha = shade < .5 ? .115 : .2;
      texture.fillRect(x,y,size,size*.72);
    }
  }
  c.drawImage(paperLayer,0,0);
}
