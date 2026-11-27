import { GROUND, WIDTH, HEIGHT, GOAL, TURKEY_X, clamp } from './config.js';
import { box, label, oval, path, shape, star, stroke } from './ink.js';
import { farmer, turkey } from './characters.js';
import { terrain, paper, pine } from './landscape.js';
import { obstacle } from './props.js';
import { totalScore } from './world.js';
import { drawControls } from './interface.js';

const cream = '#fff0cc';
const gold = '#ffc765';
const display = 'Georgia, serif';

function headline(c, text, x, y, size, shade = '#642d29') {
  const style = { weight: 900, family: display, spacing: -size*.065 };
  label(c,text,x+3,y+7,size,shade,style);
  label(c,text,x,y,size,cream,style);
}

function roadDust(c, x, y, time, color) {
  for(let i=0;i<9;i++){
    const step = (time*2.3+i*.173)%1;
    c.globalAlpha = (1-step)*.6;
    oval(c,x-step*(135+i*4),y-step*(10+i%4*13),5+step*14,2+step*5,color);
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
  box(c,35,30,1210,103,'#392624',15);
  box(c,35,27,1210,99,'#412925',15);
  stroke(c,'#a46346',1,[[53,124],[1227,124]]);
  for (const x of [228,396,926]) stroke(c,'#7b5041',1,[[x,48],[x,107]]);
  label(c,'SCORE',62,59,13,gold,{spacing:2.7});
  label(c,totalScore(run).toLocaleString('en-US'),62,100,34,cream,{family:'monospace'});
  label(c,'HEARTS',253,59,13,gold,{spacing:2.7});
  for(let i=0;i<3;i++) heart(c,268+i*37,91,i<run.lives);
  label(c,'FREEDOM FOREST',424,59,13,gold,{spacing:2.1});
  label(c,`${Math.floor(run.distance)} / 1,200 m`,869,59,18,cream,{align:'right',family:'monospace'});
  box(c,429,81,416,13,'#785143',6);
  const marker=429+416*(run.distance/GOAL);
  box(c,429,81,marker-429,13,gold,6);
  turkey(c,marker,98,.245,0,{perched:true});
  pine(c,868,103,33,'#b4c393');
  pine(c,883,103,26,'#789683');
  label(c,'FARMER',951,59,13,gold,{spacing:2.6});
  label(c,close > .5 ? 'TOO CLOSE' : close > .22 ? 'GAINING' : 'TRAILING',1217,59,13,close>.5?'#ff9c83':cream,{align:'right',spacing:1.6});
  for(let i=0;i<9;i++) box(c,951+i*30,79,24,15,i<Math.ceil(close*9)?(close>.5?'#f77c62':'#e5a760'):'#755044',3);
}

function stageTitle(c, run) {
  const time=run.time;
  roadDust(c,818,646,time,'#e9ae64');
  roadDust(c,1015,646,time+.23,'#e9ae64');
  oval(c,800,650,111,15,'#733b2a91');oval(c,1043,646,109,14,'#733b2a91');
  farmer(c,804,650,1.66,time,'chase',.78);
  turkey(c,1040,611,2.5,time,{airborne:true,panic:true});
  for(const [x,y,s] of [[1125,347,11],[1183,401,7],[919,306,8],[1156,288,5]]) star(c,x,y,s,'#fff0b6');
  stroke(c,'#fff0c6',5,[[1110,354],[1133,328]]);
  stroke(c,'#fff0c6',4,[[1140,378],[1160,372]]);
  label(c,'THE GREAT TURKEY ESCAPE',78,111,18,cream,{spacing:5});
  stroke(c,'#ffc666',2,[[79,134],[322,134]]);
  headline(c,'GOBBLE',69,274,143);
  headline(c,'RUN',66,409,163);
  label(c,'The oven is hot. The woods are 1,200 m away.',80,467,20,cream,{weight:700});
}

function stagePlay(c, run) {
  const close=clamp(1-run.gap/280,0,1);
  const farmerX=TURKEY_X-run.gap*.90-65;
  c.save();
  if (run.hurt > 1.18) c.translate(Math.sin(run.time*130)*7,0);
  roadDust(c,farmerX,650,run.time,'#ffd282');
  roadDust(c,TURKEY_X,650,run.time+.2,'#ffd282');
  oval(c,farmerX,653,72,9,'#74362680');
  oval(c,TURKEY_X,651,52-run.rise*.065,8,'#74362680');
  for(const item of run.items.filter(item=>item.kind!=='knife')) obstacle(c,item,run.time);
  farmer(c,farmerX,650,1.22,run.time,'chase',close);
  c.globalAlpha=run.hurt&&Math.floor(run.hurt*15)%2 ? .53 : 1;
  turkey(c,TURKEY_X,GROUND-run.rise,1.22,run.time,{airborne:run.rise>0,panic:close>.38,slide:run.slide});
  c.globalAlpha=1;
  for(const item of run.items.filter(item=>item.kind==='knife')) obstacle(c,item,run.time);
  for(const effect of run.effects){
    for(let i=0;i<6;i++){
      const angle=i*Math.PI/3, radius=effect.age*90;
      star(c,effect.x+Math.cos(angle)*radius,effect.y+Math.sin(angle)*radius-effect.age*26,5*(1-effect.age/.45),gold);
    }
  }
  if(run.feedbackTime) label(c,run.feedback,TURKEY_X,GROUND-run.rise-157,22,cream,{align:'center',spacing:1.4});
  c.restore();
  hud(c,run);
  const stage=run.distance<400?'THE FARMYARD':run.distance<800?'HARVEST ROW':'THE WOODLINE';
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
    turkey(c,997,618,2.75,time,{perched:true});
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
  const accent=escaped?'#dce5aa':gold;
  label(c,escaped?'FREEDOM FOREST':'THE FARMER GOT YOU',78,156,17,accent,{spacing:4});
  headline(c,escaped?'ESCAPED!':'CAUGHT!',72,313,escaped?109:117,escaped?'#35564b':'#70362e');
  label(c,escaped?'You live to gobble another day.':'Dinner plans are back on.',80,361,25,cream,{weight:750});
  stroke(c,accent,1.5,[[80,401],[527,401]]);
  label(c,'FINAL SCORE',80,438,14,accent,{spacing:2.4});
  label(c,'DISTANCE',309,438,14,accent,{spacing:2.4});
  label(c,totalScore(run).toLocaleString('en-US'),80,489,43,cream,{family:'monospace'});
  label(c,`${Math.floor(run.distance).toLocaleString('en-US')} m`,309,489,43,cream,{family:'monospace'});
}

export function render(c, screen, run, { muted, hover }) {
  c.clearRect(0,0,WIDTH,HEIGHT);
  terrain(c,screen==='title'?0:run.travel,run.time,screen);
  if(screen==='title') stageTitle(c,run);
  else if(screen==='play') stagePlay(c,run);
  else stageEnding(c,run,screen==='escaped');
  paper(c);
  drawControls(c,screen,muted,hover);
}
