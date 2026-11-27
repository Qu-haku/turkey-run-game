export function box(c, x, y, w, h, color, radius = 0) {
  c.beginPath();
  c.roundRect(x, y, w, h, radius);
  c.fillStyle = color;
  c.fill();
}

export function oval(c, x, y, rx, ry, color, angle = 0) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, angle, 0, Math.PI * 2);
  c.fillStyle = color;
  c.fill();
}

export function path(c, color, points) {
  c.beginPath();
  c.moveTo(...points[0]);
  for (const point of points.slice(1)) c.lineTo(...point);
  c.closePath();
  c.fillStyle = color;
  c.fill();
}

export function stroke(c, color, width, points) {
  c.beginPath();
  c.moveTo(...points[0]);
  for (const point of points.slice(1)) c.lineTo(...point);
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.stroke();
}

export function shape(c, color, draw) {
  c.beginPath();
  draw(c);
  c.closePath();
  c.fillStyle = color;
  c.fill();
}

export function label(c, value, x, y, size, color, options = {}) {
  const { align = 'left', weight = 800, family = 'system-ui', spacing = 0, baseline = 'alphabetic' } = options;
  c.font = `${weight} ${size}px ${family}`;
  c.textAlign = align;
  c.textBaseline = baseline;
  c.letterSpacing = `${spacing}px`;
  c.fillStyle = color;
  c.fillText(value, x, y);
  c.letterSpacing = '0px';
}

export function star(c, x, y, size, color) {
  path(c, color, [[x, y-size], [x+size*.23, y-size*.23], [x+size, y], [x+size*.23, y+size*.23],
    [x, y+size], [x-size*.23, y+size*.23], [x-size, y], [x-size*.23, y-size*.23]]);
}
