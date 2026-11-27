import { GROUND } from './config.js';
import { box, oval, path, shape, stroke, star, label } from './ink.js';
import { knifeHeight } from './world.js';

export function corn(c, x, y, gold, time, scale = 1) {
  c.save(); c.translate(x, y + Math.sin(time*5+x*.04)*3); c.scale(scale,scale); c.rotate(.48);
  if (gold) {
    oval(c,0,0,28,28,'#ffdd7950');
    star(c,-23,-13,8,'#fff1ac'); star(c,24,10,9,'#fff1ac');
  }
  oval(c,0,-3,13,21,'#61352a');
  oval(c,0,-4,10,18,gold?'#fff0a0':'#ffc456');
  for(let row=0;row<5;row++) for(let col=-1;col<=1;col++){
    oval(c,col*5+(row%2)*1.5,-16+row*5,2.2,2.1,row%2?'#f2a034':'#e78b32');
  }
  path(c,'#37533d',[[-1,16],[-13,11],[-15,-7],[-4,2],[1,11],[6,1],[14,-4],[11,11],[4,17],[2,22]]);
  stroke(c,'#95a45c',1.7,[[-9,3],[-4,11],[1,16],[8,7]]);
  c.restore();
}

export function obstacle(c,item,time) {
  const {x,kind}=item;
  if(kind==='corn'||kind==='gold'){
    corn(c,x,item.y,kind==='gold',time);
    return;
  }
  if(kind==='knife'){
    const y=GROUND-knifeHeight(item);
    c.save();c.translate(x,y);c.rotate(-.22+Math.sin(time*5)*.15);
    stroke(c,'#fff0bf',4,[[55,-8],[95,-15],[150,-19]]);
    stroke(c,'#ffd894',3,[[65,7],[115,1]]);
    path(c,'#38272a',[[-51,-13],[29,-13],[52,-7],[54,11],[24,13],[-22,15],[-43,8]]);
    path(c,'#dee1cb',[[-44,-9],[23,-9],[24,10],[-20,12],[-36,6]]);
    path(c,'#fffae0',[[-39,1],[-24,6],[24,5],[24,10],[-20,12],[-36,6]]);
    box(c,23,-9,28,18,'#844738',5);
    oval(c,33,0,2.5,2.5,'#f6bb66');oval(c,44,0,2.5,2.5,'#f6bb66');
    c.restore();
    return;
  }
  c.save();c.translate(x,GROUND);
  oval(c,0,3,62,11,'#482c26a0');
  if(kind==='hay'){
    box(c,-44,-67,88,67,'#6f3e2a',10);
    box(c,-41,-64,79,60,'#d88c39',8);
    path(c,'#efae50',[[-37,-61],[36,-61],[27,-42],[-38,-40]]);
    for(let i=0;i<21;i++){
      const z=(i*31)%70-35, y=-53+(i*17)%46;
      stroke(c,i%2?'#f3b35b':'#b5692e',2,[[z,y],[z+7,y-3]]);
    }
    for(const z of [-20,19])stroke(c,'#834b2b',4,[[z+5,-62],[z,-43],[z,-5]]);
  } else if (kind==='fence') {
    for(const z of [-38,33]){
      path(c,'#61382b',[[z-8,0],[z-8,-88],[z,-104],[z+9,-90],[z+9,0]]);
      stroke(c,'#b57548',3,[[z-3,-83],[z-3,-2]]);
    }
    for(const y of [-73,-42]){
      box(c,-44,y,85,13,'#8b5437',2);
      stroke(c,'#db9353',2,[[-41,y+3],[38,y+3]]);
      for(const z of [-34,32]) oval(c,z,y+7,2,2,'#4b3027');
    }
  } else {
    const metal='#483436';
    box(c,-52,-117,104,77,metal,9);
    box(c,-47,-112,94,68,'#ad5b40',6);
    box(c,-49,-116,99,12,'#da925f',5);
    box(c,-39,-85,78,35,'#3b2c2e',5);
    box(c,-31,-78,62,21,'#e88646',3);
    path(c,'#ffd078',[[-26,-57],[-15,-73],[-13,-60],[-2,-74],[8,-58],[18,-70],[26,-57]]);
    stroke(c,'#edbc82',4,[[-20,-89],[22,-89]]);
    for(const z of [-31,0,31]) oval(c,z,-100,4,4,metal);
    for(const z of [-51,45]){
      box(c,z,-46,8,46,metal,2);
      box(c,z-4,-7,16,7,'#583528',2);
    }
    label(c,'OVEN',0,-129,15,'#fff0c3',{align:'center',spacing:3});
    path(c,'#ffe1a0',[[-7,-25],[8,-25],[8,-29],[18,-21],[8,-13],[8,-17],[-7,-17]]);
  }
  c.restore();
}
