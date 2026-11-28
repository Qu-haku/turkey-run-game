import { box, label, path, stroke } from './ink.js';

const cream = '#fff0cc';
const gold = '#ffc765';

function borderButton(c, x, y, w, h, hot) {
  box(c,x,y,w,h,'#cd945d');
  box(c,x+1,y+1,w-2,h-2,hot?'#754535':'#39201d');
}

export function drawControls(c, screen, muted, hover) {
  if (screen !== 'play') {
    const title = screen === 'title';
    box(c,54,535,329,68,'#c69159');
    box(c,49,528,329,68,hover==='go'?'#643125':'#301e1c');
    box(c,49,528,7,68,'#992e20');
    label(c,title?'RUN FOR IT':'RUN AGAIN',70,557,25,cream);
    label(c,title?'Press SPACE or click to run':'Press SPACE or click to restart',70,580,14,gold,{weight:700});
    stroke(c,cream,3.2,[[336,562],[361,562]]);
    stroke(c,cream,3.2,[[352,553],[361,562],[352,571]]);
    if (title) {
      const sections = [
        [80,'JUMP ×2','↑ / W / SPACE / CLICK'],
        [287,'SLIDE','↓ / S'],
        [401,'CHANGE PACE','← → / A D'],
      ];
      for (const [x, name, keys] of sections) {
        label(c,name,x,718,13,gold,{spacing:2});
        label(c,keys,x,744,16,cream,{weight:750});
      }
    }
  } else {
    const pads = [[866,'slow','− PACE'],[967,'duck','↓ SLIDE'],[1068,'fast','+ PACE']];
    for (const [x,key,text] of pads) {
      borderButton(c,x,714,94,42,hover===key);
      label(c,text,x+47,740,14,cream,{align:'center',spacing:.65});
    }
  }
  borderButton(c,1187,709,55,47,hover==='mute');
  path(c,cream,[[1201,728],[1206,728],[1212,722],[1212,743],[1206,738],[1201,738]]);
  if (muted) {
    stroke(c,cream,2.3,[[1217,728],[1226,737]]);
    stroke(c,cream,2.3,[[1226,728],[1217,737]]);
  } else {
    for (const radius of [5,10]) {
      c.beginPath();
      c.arc(1215,732.5,radius,-.8,.8);
      c.lineWidth=2;
      c.strokeStyle=cream;
      c.stroke();
    }
  }
}
