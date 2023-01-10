const PLACING = 0;
const DRAWING = 1;

var center = new cfloat(0, 0);
var radius = 1.5;
var roots = [];
var root_colors = [];
var mode = PLACING;
var tolerance = 0.1;
var r_color;
var color_text;
var directions;
var coloring = 0;
var a = 1;

document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
}, false);


function setup() {
  const help_text_1 = 'INTERACTIVE NEWTON FRACTAL GENERATOR<br><br>- You need at least 3 roots to make a fractal<br><br> - Modified by Marco Nieto';
  
  cnv = createCanvas(500, 500);
  cnv.position(500, 15 );
  cnv.mousePressed(mousePress);
  pixelDensity(1);

  r_color = createColorPicker(color('red'));
  r_color.position(240, 132);

  color_text = createP("Choose a color for each root:");
  color_text.position(15, 120);

  directions = createP(help_text_1);
  directions.position(+15);

  re_input = createInput('0', "number");
  re_input.size(50);
  re_input.position(20, height + 30);

  plus = createP("+");
  plus.position(97, height + 15);

  im_input = createInput('0', "number");
  im_input.size(50);
  im_input.position(125, height + 30);

  im_unit = createP('i');
  im_unit.position(190, height + 15);

  add_root_button = createButton('Add Root');
  add_root_button.position(229, height + 30);
  add_root_button.mouseClicked(rootButton);

  remove_root_button = createButton('Remove Root');
  remove_root_button.position(1, height + 60);
  remove_root_button.size(144);
  remove_root_button.mouseClicked(removeRoot);

  clear_roots_button = createButton('Clear Roots');
  clear_roots_button.position(156, height + 60);
  clear_roots_button.size(144);
  clear_roots_button.mouseClicked(clearRoots);

  alpha_slider = createSlider(0.1, 2.2, 1, 0.1);
  alpha_slider.position(1, height + 90);
  alpha_slider.size(3 * width / 4);
  
  alpha_p = createP('a = ' + a);
  alpha_p.position(20 + 3 * width / 4, height + 75);

  mode_button = createButton('Make a Fractal!');
  mode_button.id('mode button');
  mode_button.position(1, height + 120);
  mode_button.size(width);
  mode_button.mouseClicked(changeMode);
}

function draw() {
  background(220);
  a = alpha_slider.value();
  alpha_p.html('a = ' + a);
  if (mode == PLACING) {
    drawRoots();
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
      let zMouse = pixelToComplex(createVector(mouseX, mouseY));
      let zre = round(zMouse.re, 3);
      let zim = round(zMouse.im, 3);
      text(zre + " + " + zim + "i", 0, 3);
    }
  } else if (mode == DRAWING) {
    if (coloring == 0) {
      createFractal(alpha_slider.value());
    } else {
      createFractal1(alpha_slider.value());
    }
    noLoop();
    saveCanvas(canvas, 'mi-dibujo', 'png')
  }
}

function complexToPixel(z) {
  let px = map(z.re, center.re - radius, center.re + radius, 0, width);
  let py = map(z.im, center.im - radius, center.im + radius, height, 0);
  return createVector(px, py);
}

function pixelToComplex(vec) {
  let re = map(vec.x, 0, width, center.re - radius, center.re + radius);
  let im = map(vec.y, height, 0, center.im - radius, center.im + radius);
  return new cfloat(re, im);
}

function drawRoots() {
  strokeWeight(6);
  for (let i = 0; i < roots.length; i++) {
    stroke(root_colors[i]);
    point(complexToPixel(roots[i]));
  }
}

function f(z) {
  var vec = new cfloat(1, 0);
  for (let i = 0; i < roots.length; i++) {
    var factor = z.sub(roots[i]);
    vec = vec.mult(factor);
  }
  return vec;
}

function df(z) {
  var vec = new cfloat(0, 0);
  for (let j = 0; j < roots.length; j++) {
    var factor = new cfloat(1, 0);
    for (let i = 0; i < roots.length; i++) {
      if (i != j) {
        factor = factor.mult(z.sub(roots[i]));
      }
    }
    vec = vec.add(factor);
  }
  return vec;
}

function newtonsMethod(z, alfa) {
  var n = 0;
  var x = z.copy();
  var sq_dist = 1000;
  while (n < 100 && sq_dist > tolerance * tolerance) {
    var prev = x.copy();
    var fx = f(x);
    var dfx = df(x);
    while (dfx.magSq() == 0) {
      var v = new cfloat(random(0, 0.01), random(0, 0.01));
      dfx = dfx.add(v);
    }
    x = x.sub(fx.div(dfx).scale(alfa));
    sq_dist = x.distSq(prev);
    n++;
  }
  return x;
}

function newtonsMethodN(z,alfa) {
  var n = 0;
  var x = z.copy();
  var sq_dist = 1000;
  while (n < 100 && sq_dist > tolerance * tolerance) {
    var prev = x.copy();
    var fx = f(x);
    var dfx = df(x);
    while (dfx.magSq() == 0) {
      var v = new cfloat(random(0, 0.01), random(0, 0.01));
      dfx = dfx.add(v);
    }
    x = x.sub(fx.div(dfx).scale(alfa));
    sq_dist = x.distSq(prev);
    n++;
  }
  return n;
}

function createFractal(alfa) {
  loadPixels();
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      var pix = (i + j * width) * 4;
      var v = pixelToComplex(createVector(i, j));
      v = newtonsMethod(v,alfa);
      var got_to_root = false;
      for (let k = 0; k < roots.length; k++) {
        var dsq = roots[k].distSq(v);
        if (dsq < tolerance * tolerance) {
          got_to_root = true;
          pixels[pix + 0] = red(root_colors[k]);
          pixels[pix + 1] = green(root_colors[k]);
          pixels[pix + 2] = blue(root_colors[k]);
          pixels[pix + 3] = 255;
          break;
        }
      }
      if (!got_to_root) {
        pixels[pix + 0] = 0;
        pixels[pix + 1] = 0;
        pixels[pix + 2] = 0;
        pixels[pix + 3] = 255;
      }
    }
  }
  updatePixels();
}

function createFractal1(alfa) {
  loadPixels();
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      var pix = (i + j * width) * 4;
      var n = newtonsMethodN(pixelToComplex(createVector(i, j)), alfa);
      var val = map(n, 0, 100, 0, 255);
      pixels[pix + 0] = val;
      pixels[pix + 1] = val;
      pixels[pix + 2] = val;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
}

function rootButton() {
  if (mode == PLACING) {
    var re = re_input.value();
    var im = im_input.value();
    append(roots, new cfloat(re, im));
    append(root_colors, r_color.color());
  }
}

function removeRoot() {
  if (mode == PLACING) {
    roots.pop();
    root_colors.pop();
  }
}

function clearRoots() {
  if (mode == PLACING) {
    roots = [];
    root_colors = [];
  }
}

function mousePress() {
  if (mode == PLACING) {
    if (mouseButton == LEFT) {
      var r = pixelToComplex(createVector(mouseX, mouseY));
      append(roots, r);
      append(root_colors, r_color.color());
    } else if (mouseButton == RIGHT) {
      roots.pop();
      root_colors.pop();
    }
  } else if (mode == DRAWING) {
    var v = pixelToComplex(createVector(mouseX, mouseY));
    if (mouseButton == LEFT) {
      center = v;
      radius /= 2;
    } else if (mouseButton == RIGHT) {
      center = v;
      radius *= 2;
    }
    redraw();
  }
}

function changeMode() {
  const help_text_2 = 'INTERACTIVE NEWTON FRACTAL GENERATOR<br><br>Zoom in on a point by left clicking on it<br>Zoom out from a point, right click on it';
  const help_text_1 = 'INTERACTIVE NEWTON FRACTAL GENERATOR<br><br>- You need at least 3 roots to make a fractal<br><br> - Modified by Marco Nieto';

  if (mode == PLACING && roots.length > 2) {
    mode = DRAWING;
    directions.html(help_text_2);
    document.getElementById('mode button').innerHTML = "Make a New Fractal!";
  } else if (mode == DRAWING) {
    mode = PLACING;
    center = new cfloat(0, 0);
    radius = 1.5;
    directions.html(help_text_1);
    document.getElementById('mode button').innerHTML = "Make a Fractal!";
    loop();
  }
}