import { GROUND, WIDTH, HEIGHT, GOAL, TURKEY_X, clamp } from './config.js';
import { box, label, oval, path, shape, star, stroke } from './ink.js';
import { farmer, turkey } from './characters.js';
import { terrain, paper, pine } from './landscape.js';
import { obstacle } from './props.js';
import { totalScore } from './world.js';
import { drawControls } from './interface.js';

const cream = '#fff0cc';
const gold = '#ffc765';
const display = 'Impact, "Arial Black", "DejaVu Sans", sans-serif';
const ink = '#301e1c';
const vermilion = '#992e20';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function displayLine(c, text, x, y, size, width, color, shadow) {
  c.save();
  c.translate(x, y);
  c.font = `900 ${size}px ${display}`;
  c.scale(width / c.measureText(text).width, 1);
  const style = { weight: 900, family: display };
  if (shadow) label(c,text,5,7,size,shadow,style);
  label(c,text,0,0,size,color,style);
  c.restore();
}

function posterPanel(c) {
  path(c,ink,[[0,0],[689,0],[533,680],[0,680]]);
  path(c,'#f8dfaa',[[0,0],[677,0],[521,680],[0,680]]);
  stroke(c,vermilion,2,[[38,42],[639,42]]);
  stroke(c,vermilion,2,[[38,638],[500,638]]);
}

function roadDust(c, x, y, time, color) {
  for(let i=0;i<9;i++){
    const step = (time*2.3+i*.173)%1;
    c.globalAlpha = (1-step)*.6;
    const px = x-step*(135+i*4);
    const py = y-step*(10+i%4*13);
    oval(c,px,py,5+step*14,2+step*5,color);
    if (i%2 === 0) oval(c,px+5,py-4,3+step*8,2+step*6,color);
  }
  c.globalAlpha=1;
}

function heart(c, x, y, full) {
  c.save();c.translate(x,y);
  shape(c,full?'#ff8c70':'#76504a',p=>{
    p.moveTo(0,10);p.bezierCurveTo(-4,7,-13,0,-13,-6);p.bezierCurveTo(-13,-13,-4,-14,0,-8);
    p.bezierCurveTo(4,-14,13,-13,13,-6);p.bezierCurveTo(13,0,4,7,0,10);
  });
  c.restore();
}

function hud(c, run) {
  const close = clamp(1-run.gap/280,0,1);
  box(c,30,25,1220,108,'#2d1b1a');
  box(c,30,25,1220,5,'#f4c569');
  box(c,34,34,910,93,'#f8dfaa');
  for (const x of [215,391]) stroke(c,'#bd925f',2,[[x,49],[x,111]]);
  const tag = {spacing:2.1};
  label(c,'SCORE',57,63,14,vermilion,tag);
  label(c,totalScore(run).toLocaleString('en-US'),57,104,37,ink,{family:display});
  label(c,'HEARTS',240,63,14,vermilion,tag);
  for(let i=0;i<3;i++) heart(c,252+i*43,95,i<run.lives);
  label(c,'FREEDOM FOREST',415,63,14,vermilion,tag);
  label(c,`${Math.floor(run.distance).toLocaleString('en-US')} / 1,200 m`,904,66,24,ink,{align:'right',family:display});
  box(c,416,87,454,12,'#c39368');
  box(c,416,87,454*run.distance/GOAL,12,vermilion);
  box(c,414+454*run.distance/GOAL,82,6,22,ink);
  pine(c,901,109,32,'#365344');
  pine(c,915,109,23,'#52725b');
  label(c,'FARMER',966,64,15,gold,tag);
  label(c,close > .5 ? 'TOO CLOSE' : close > .22 ? 'GAINING' : 'TRAILING',1221,64,16,close>.5?'#ff9676':cream,{align:'right',family:display});
  for(let i=0;i<9;i++) box(c,966+i*29,84,23,19,i<Math.ceil(close*9)?(close>.5?'#ff7957':'#ffc765'):'#694139');
}

function stageTitle(c, run) {
  const time = run.time;
  c.save();
  c.filter = 'brightness(.20) saturate(.55)';
  farmer(c,783,660,2.48,time,'chase',.78);
  c.restore();
  roadDust(c,949,661,time,'#ffd883');
  oval(c,996,658,154,15,'#62342d92');
  turkey(c,993,624,3.55,time,{airborne:true,hero:true});
  for(const [x,y,s] of [[1158,311,12],[1214,389,8],[1150,480,6]]) star(c,x,y,s,'#fff0b6');
  for(const [x,y,w] of [[762,415,95],[793,448,47],[887,550,83]]) {
    path(c,'#ffe7a9',[[x,y],[x+w,y-15],[x+w-16,y-5]]);
  }
  posterPanel(c);
  displayLine(c,'TURKEY',43,199,153,536,ink,'#deaa65');
  displayLine(c,'ON THE',43,323,153,476,ink,'#deaa65');
  displayLine(c,'RUN',39,463,181,422,vermilion,'#deaa65');
  label(c,'The Great Escape to Freedom Forest',49,498,24,ink,{family:'Georgia, serif'});
  label(c,'1,200 m to Freedom Forest',49,626,23,vermilion,{family:display});
}

const motion = new WeakMap();

function landingDust(c, run) {
  const last = motion.get(run);
  const landed = last?.rise > 0 && run.rise === 0 ? run.time : last?.landed;
  motion.set(run,{ rise: run.rise, landed });
  const age = run.time - landed;
  if (!(age >= 0 && age < .37)) return;
  c.globalAlpha = 1-age/.37;
  for (let i=0;i<7;i++) {
    oval(c,TURKEY_X+(i-3)*(8+age*93),646-age*(22+i%3*27),5+age*30,3+age*13,'#ffd18b');
  }
  c.globalAlpha = 1;
}

function pressingHand(c, time, threat) {
  c.save();
  c.translate(-230+threat*235,388+Math.sin(time*10)*6);
  c.rotate(-.14);
  path(c,'#442220',[[-150,40],[124,24],[179,53],[166,104],[-150,139]]);
  path(c,'#963b2e',[[-130,48],[76,30],[117,42],[128,108],[-130,130]]);
  stroke(c,'#d06a45',5,[[-15,51],[95,43]]);
  shape(c,'#f2aa68',p=>{
    p.moveTo(109,38); p.lineTo(155,30); p.lineTo(200,43);
    p.quadraticCurveTo(223,55,210,64); p.lineTo(171,53);
    p.lineTo(221,78); p.quadraticCurveTo(234,91,217,94);
    p.lineTo(168,74); p.lineTo(207,102); p.quadraticCurveTo(218,119,199,115);
    p.lineTo(154,93); p.quadraticCurveTo(166,123,147,119);
    p.lineTo(117,97);
  });
  stroke(c,'#77382b',4,[[125,55],[145,68],[153,88]]);
  c.restore();
}

function chaseVignette(c, time, threat) {
  if (threat <= 0) return;
  const pulse = reducedMotion.matches ? .48 : .55 + Math.sin(time*9)*.15;
  const shade = c.createRadialGradient(610,415,320,610,415,710);
  shade.addColorStop(0,'#9c151800');
  shade.addColorStop(1,`rgba(132,16,20,${threat*pulse})`);
  box(c,0,0,WIDTH,HEIGHT,shade);
}

function pickupBurst(c, effect) {
  const { x, y, age, gold: golden } = effect;
  const fade = 1-age/.45;
  c.globalAlpha = fade;
  if (golden) {
    const glow = c.createRadialGradient(x,y,0,x,y,28+age*110);
    glow.addColorStop(0,'#fff4bd');
    glow.addColorStop(.35,'#ffc34aaf');
    glow.addColorStop(1,'#ff982200');
    oval(c,x,y,28+age*110,28+age*110,glow);
    c.beginPath();
    c.arc(x,y,8+age*104,0,Math.PI*2);
    c.strokeStyle = '#ffdf86';
    c.lineWidth = 3;
    c.stroke();
  }
  for(let i=0;i<8;i++){
    const angle=i*Math.PI/4, radius=age*(golden?145:90);
    star(c,x+Math.cos(angle)*radius,y+Math.sin(angle)*radius-age*26,(golden?11:5)*fade,gold);
  }
  c.globalAlpha = 1;
}

function stagePlay(c, run) {
  const close=clamp(1-run.gap/280,0,1);
  const farmerX=TURKEY_X-run.gap*.90-65;
  c.save();
  const threat = clamp((close-.46)/.54,0,1);
  if (!reducedMotion.matches) {
    c.translate(Math.sin(run.time*71)*(threat*3+(run.hurt>1.18?4:0)),Math.sin(run.time*49)*threat*2);
  }
  roadDust(c,farmerX,650,run.time,'#ffd282');
  if (!run.rise) roadDust(c,TURKEY_X,650,run.time+.2,'#ffd282');
  landingDust(c,run);
  if (run.speed > 405) {
    c.globalAlpha = clamp((run.speed-405)/115,.12,.74);
    for (let i=0;i<8;i++) {
      const x = TURKEY_X-48-((run.time*(220+i*16)+i*41)%190);
      const y = 540+i*12-run.rise*.45;
      stroke(c,'#fff1bc',2+i%3,[[x-33-i*5,y+5],[x,y]]);
    }
    c.globalAlpha=1;
  }
  oval(c,farmerX,653,72,9,'#74362680');
  oval(c,TURKEY_X,651,52-run.rise*.065,8,'#74362680');
  for(const item of run.items.filter(item=>item.kind!=='knife')) obstacle(c,item,run.time);
  farmer(c,farmerX,650,1.22,run.time,'chase',close);
  if (threat > 0) pressingHand(c,run.time,threat);
  c.globalAlpha=run.hurt&&Math.floor(run.hurt*15)%2 ? .53 : 1;
  turkey(c,TURKEY_X,GROUND-run.rise,run.slide?1.38:1.62,run.time,{airborne:run.rise>0,panic:close>.50,relieved:run.distance>1030 && close<=.50,slide:run.slide});
  c.globalAlpha=1;
  for(const item of run.items.filter(item=>item.kind==='knife')) obstacle(c,item,run.time);
  for(const effect of run.effects) pickupBurst(c,effect);
  if(run.feedbackTime) label(c,run.feedback,TURKEY_X,GROUND-run.rise-195,22,cream,{align:'center',spacing:1.4});
  c.restore();
  chaseVignette(c,run.time,threat);
  hud(c,run);
  const stage=run.distance<400?'THE FARMYARD':run.distance<800?'HARVEST ROW':run.distance<1030?'THE WOODLINE':'FREEDOM FOREST';
  label(c,stage,39,708,23,cream,{family:display,spacing:1});
  label(c,'JUMP  SPACE / CLICK     •     SLIDE  ↓     •     PACE  ← →',39,738,14,'#e9ae7e',{spacing:1.4});
}

function stageEnding(c, run, escaped) {
  const time=run.time;
  if(escaped){
    farmer(c,674,612,.45,time,'fist');
    oval(c,1006,663,151,20,'#142f2c9c');
    path(c,'#3d5042',[[879,653],[912,614],[980,605],[1046,621],[1094,667],[904,669]]);
    path(c,'#7d8664',[[879,653],[912,614],[980,605],[1046,621],[1010,638],[922,647]]);
    turkey(c,997,618,2.75,time,{perched:true,relieved:true});
    for(const [x,y,s] of [[989,314,11],[1097,358,11],[1145,427,7],[844,401,6]]) star(c,x,y,s,cream);
    for(const [x,y,h] of [[1250,693,297],[1171,684,184],[1284,662,235]]) pine(c,x,y,h,'#193c35');
  } else {
    oval(c,899,653,133,19,'#7436268c');
    farmer(c,860,650,2.18,time,'hold');
    c.save();c.translate(1058,327);c.rotate(Math.PI+.18);
    turkey(c,0,0,1.99,time,{perched:true,panic:true});
    c.restore();
    for(const [x,y,s] of [[1119,531,11],[1028,549,8],[1159,444,7]]) star(c,x,y,s,cream);
    stroke(c,cream,4,[[1149,480],[1174,485]]);
    stroke(c,cream,4,[[1146,500],[1165,510]]);
  }
  posterPanel(c);
  label(c,escaped?'FREEDOM FOREST':'THE FARMER GOT YOU',49,113,20,vermilion,{spacing:3});
  displayLine(c,escaped?'ESCAPED!':'CAUGHT!',40,292,151,515,escaped?'#254b3c':vermilion,'#deaa65');
  label(c,escaped?'You live to gobble another day.':'Dinner plans are back on.',49,348,26,ink,{family:'Georgia, serif'});
  stroke(c,vermilion,2,[[49,388],[457,388]]);
  label(c,'FINAL SCORE',49,430,15,vermilion,{spacing:2.4});
  label(c,'DISTANCE',279,430,15,vermilion,{spacing:2.4});
  label(c,totalScore(run).toLocaleString('en-US'),49,484,48,ink,{family:display});
  label(c,`${Math.floor(run.distance).toLocaleString('en-US')} m`,279,484,48,ink,{family:display});

}

export function render(c, screen, run, { muted, hover }) {
  c.clearRect(0,0,WIDTH,HEIGHT);
  terrain(c,screen==='title'?0:run.travel,screen,run.distance);
  if(screen==='title') stageTitle(c,run);
  else if(screen==='play') stagePlay(c,run);
  else stageEnding(c,run,screen==='escaped');
  paper(c);
  drawControls(c,screen,muted,hover);
}
