import { oval, path, shape, stroke, box } from './ink.js';

const ink = '#322022';
const cream = '#fff0cb';

function tail(c, time) {
  const feathers = [
    [-1.12, '#912e29'], [-.83, '#bc4330'], [-.53, '#dc5c34'],
    [-.20, '#f0863d'], [.14, '#e36a35'], [.46, '#bd4832'],
  ];
  for (const [angle, color] of feathers) {
    c.save();
    c.translate(-16, -32);
    c.rotate(angle + Math.sin(time * 12) * .045);
    oval(c, 0, -34, 13, 43, ink);
    oval(c, 0, -35, 10.5, 39, color);
    oval(c, 0, -59, 8, 12, '#ffd074');
    stroke(c, '#6b3029', 1.7, [[0, -51], [0, -17]]);
    c.restore();
  }
}

export function turkey(c, x, y, scale, time, pose = {}) {
  const { airborne, panic, slide, perched, relieved, hero } = pose;
  c.save();
  c.translate(x, y);
  c.scale(scale, scale);
  if (slide) c.transform(1.13, 0, -.24, .55, 0, 1);
  const beat = time * 17;
  if (!airborne && !perched && !slide) {
    const stretch = Math.cos(beat*2);
    c.scale(1-stretch*.085,1+stretch*.09);
  }
  if (hero) c.transform(1,0,-.17,1,0,0);
  const stride = perched ? 2 : hero ? 36 : airborne ? 20 : Math.sin(beat) * 28;
  c.translate(0, airborne || perched || slide ? 0 : -Math.abs(Math.cos(beat)) * 3);
  tail(c, time);
  for (const side of [-1, 1]) {
    const foot = side * stride;
    const lift = airborne ? 2 + side * 5 : Math.max(0, Math.cos(beat) * side) * (perched ? 0 : 9);
    const leg = [[side * 8, -26], [foot * .61 - 5, -13 - lift / 2], [foot, -2 - lift], [foot + 13, -2 - lift]];
    stroke(c, ink, 8, leg);
    stroke(c, side === 1 ? '#ffc262' : '#dc813c', 4, leg);
  }
  oval(c, -1, -34, 38, 28, ink, .15);
  oval(c, -2, -35, 34, 24, '#743a2d', .15);
  c.save();
  c.translate(8, -41);
  c.rotate(airborne ? -.65 - Math.sin(time * 15) * .36 : -.08 + Math.sin(beat) * .1);
  shape(c, ink, p => { p.moveTo(11,-10); p.bezierCurveTo(-4,-22,-37,-15,-52,2); p.bezierCurveTo(-34,19,4,23,13,4); });
  shape(c, '#b05d39', p => { p.moveTo(9,-8); p.bezierCurveTo(-5,-18,-34,-12,-46,2); p.bezierCurveTo(-28,15,4,20,10,2); });
  stroke(c, '#e78b50', 2, [[-36,2],[-23,5],[-13,3]]);
  stroke(c, '#e78b50', 2, [[-27,9],[-14,11],[-4,8]]);
  c.restore();
  oval(c, 26, -48, 14, 27, ink, .34);
  oval(c, 26, -49, 11, 24, '#df7250', .34);
  oval(c, 33, -71, 20, 19, ink);
  oval(c, 33, -72, 17, 16, '#eb935c');
  stroke(c, '#b13331', 5, [[24,-85],[26,-92],[31,-88],[35,-94]]);
  shape(c, '#bc3530', p => { p.moveTo(44,-68); p.bezierCurveTo(55,-63,43,-51,48,-45); p.bezierCurveTo(29,-43,36,-63,40,-68); });
  path(c, ink, [[44,-77],[63,-69],[46,-59],[41,-65]]);
  path(c, '#ffc254', [[45,-74],[58,-69],[45,-63]]);
  if (relieved) {
    stroke(c,ink,3,[[28,-74],[32,-78],[38,-79],[43,-75]]);
    stroke(c,ink,2,[[43,-65],[49,-65],[53,-68]]);
  } else {
    oval(c,35,-74,panic?13:9,panic?13:9,cream);
    oval(c,panic?31:39,-74,panic?3.6:4.3,5,ink);
    oval(c,panic?32:40,-76,1.5,1.5,'#fff');
    if (panic) {
      stroke(c,ink,2.6,[[21,-86],[31,-93],[43,-89]]);
      path(c,'#641f21',[[45,-69],[58,-69],[52,-63],[45,-60]]);
      oval(c,18,-89,2.5,4.3,'#ffe6ad',-.6);
    } else if (hero) stroke(c,ink,3.2,[[26,-85],[42,-80]]);
  }
  c.restore();
}

export function farmer(c, x, y, scale, time, pose = 'chase', urgency = 1) {
  c.save();
  c.translate(x,y);
  c.scale(scale,scale);
  const beat = time * (9 + urgency * 5);
  const stride = pose === 'chase' ? Math.sin(beat) * (25 + urgency * 22) : 17;
  c.translate(0, pose === 'chase' ? -Math.abs(Math.cos(beat)) * 7 : 0);
  const denim = '#344b46';
  const shirt = '#853e31';
  for (const side of [-1,1]) {
    const foot = side * stride;
    const lift = pose === 'chase' ? Math.max(0, Math.cos(beat) * side) * 17 : 0;
    const leg = [[side * 13,-76],[foot * .58,-42 - lift],[foot,-8 - lift]];
    stroke(c, ink, 28, leg);
    stroke(c, side > 0 ? denim : '#293b39', 19, leg);
    box(c, foot - 12, -14 - lift, 35, 13, ink, 4);
    stroke(c,'#a36044',2,[[foot-9,-4-lift],[foot+19,-4-lift]]);
  }
  stroke(c, ink, 22, [[-23,-126],[-49,-102],[-57,-111 + stride * .18]]);
  stroke(c, '#a9503a', 15, [[-23,-126],[-49,-102],[-57,-111 + stride * .18]]);
  oval(c,-58,-109+stride*.18,9,8,'#cf8659');
  shape(c, ink, p => { p.moveTo(-35,-83); p.quadraticCurveTo(-49,-128,-14,-152); p.quadraticCurveTo(29,-165,43,-133); p.lineTo(36,-78); p.quadraticCurveTo(2,-65,-35,-83); });
  shape(c, shirt, p => { p.moveTo(-31,-86); p.quadraticCurveTo(-42,-126,-13,-147); p.quadraticCurveTo(25,-155,38,-132); p.lineTo(32,-81); p.quadraticCurveTo(2,-71,-31,-86); });
  for (let i = -25; i < 34; i += 12) stroke(c,'#a8513b',2,[[i,-123],[i+4,-100]]);
  stroke(c, '#bf6245', 4, [[-29,-129],[33,-129]]);
  stroke(c, '#bf6245', 3, [[-31,-115],[31,-115]]);
  path(c, denim, [[-24,-84],[-16,-115],[27,-115],[35,-82],[21,-69],[-17,-71]]);
  stroke(c, '#253b36', 7, [[-17,-112],[-14,-140]]);
  stroke(c, '#263a36', 7, [[26,-111],[21,-144]]);
  box(c,-5,-107,23,16,'#506356',3);
  oval(c,-13,-113,3,3,'#ecaa58'); oval(c,25,-113,3,3,'#ecaa58');
  oval(c,20,-159,23,28,ink,.14);
  oval(c,23,-162,20,23,'#d39462',.14);
  oval(c,42,-158,11,7,'#eaaa71',.25);
  oval(c,5,-161,7,9,'#b46b50');
  shape(c, '#5c3426', p => { p.moveTo(16,-155); p.quadraticCurveTo(32,-161,45,-151); p.lineTo(40,-140); p.quadraticCurveTo(20,-135,16,-155); });
  oval(c,34,-166,6,5,cream);
  oval(c,37,-166,2.5,3.5,ink);
  stroke(c,ink,3.5,[[26,-174],[40,-171]]);
  path(c, ink, [[-5,-176],[-4,-199],[7,-210],[37,-205],[45,-180]]);
  path(c, '#a2603b', [[-1,-178],[0,-197],[8,-205],[33,-200],[40,-179]]);
  path(c, '#562e25', [[0,-187],[37,-188],[41,-178],[-1,-176]]);
  oval(c,20,-178,43,8,ink,-.07);
  oval(c,19,-181,40,5,'#bd7943',-.07);
  const hand = pose === 'hold' ? [90,-152] : pose === 'fist' ? [62,-171] : [81 + stride * .16,-112 - stride * .12];
  const elbow = pose === 'hold' ? [59,-117] : [53,-112];
  const arm = [[30,-132],elbow,hand];
  stroke(c, ink, 25, arm);
  stroke(c, '#a45138', 18, arm.slice(0,2));
  stroke(c, '#db9664', 13, arm.slice(1));
  oval(c,hand[0],hand[1],11,9,'#e1a06a');
  if (pose === 'chase') {
    for (let i=0;i<3;i++) stroke(c,'#e1a06a',4,[hand,[hand[0]+12,hand[1]-6+i*6]]);
  } else {
    stroke(c,'#995842',2,[[hand[0]-4,hand[1]-4],[hand[0]+5,hand[1]-3]]);
  }
  c.restore();
}
