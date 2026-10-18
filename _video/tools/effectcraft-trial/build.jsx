// EffectCraft trial — the series object (three extruded panels) in Advanced 3D.
// Goal of the trial: see whether real motion blur, cast shadows and depth of field make a visible
// difference over the three.js version rendered through Remotion.

var W = 1240, H = 1240, FPS = 60, DUR = 3;

var proj = app.project;
var comp = proj.items.addComp('SeriesObject', W, H, 1, DUR, FPS);
comp.bgColor = [0, 0, 0];
comp.motionBlur = true;
try { comp.shutterAngle = 180; } catch (e) { writeLn('shutterAngle: ' + e); }
try { comp.motionBlurSamples = 24; } catch (e) { writeLn('samples: ' + e); }
try { comp.renderer = 'advanced3D'; } catch (e) { writeLn('renderer prop: ' + e); }
writeLn('renderer now: ' + comp.renderer);

// --- panels -----------------------------------------------------------------
var SPEC = [
  { n: 'L3-back',  col: [0x35 / 255, 0x77 / 255, 0x6A / 255], z: 260, dx: -210, dy: 120 },
  { n: 'L2-mid',   col: [0x3E / 255, 0x8E / 255, 0x7B / 255], z: 130, dx: -105, dy: 60 },
  { n: 'L1-front', col: [0x49 / 255, 0xB3 / 255, 0x92 / 255], z: 0,   dx: 0,    dy: 0 }
];

function roundedPanel(name, col, w, h) {
  var L = comp.layers.addShape();
  L.name = name;
  var contents = L.property('ADBE Root Vectors Group');
  var grp = contents.addProperty('ADBE Vector Group');
  var items = grp.property('ADBE Vectors Group');
  var rect = items.addProperty('ADBE Vector Shape - Rect');
  rect.property('ADBE Vector Rect Size').setValue([w, h]);
  rect.property('ADBE Vector Rect Roundness').setValue(28);
  var fill = items.addProperty('ADBE Vector Graphic - Fill');
  fill.property('ADBE Vector Fill Color').setValue([col[0], col[1], col[2], 1]);
  L.threeDLayer = true;
  L.motionBlur = true;
  return L;
}

var layers = [];
for (var i = 0; i < SPEC.length; i++) {
  var s = SPEC[i];
  var L = roundedPanel(s.n, s.col, 760, 520);
  L.property('ADBE Transform Group').property('ADBE Position').setValue([W / 2 + s.dx, H / 2 + s.dy, s.z]);
  // Advanced 3D gives shape layers real thickness
  try {
    var geo = L.property('ADBE Extrsn Options Group');
    if (geo) {
      geo.property('ADBE Extrsn Depth').setValue(26);
      writeLn(s.n + ': extruded');
    } else { writeLn(s.n + ': no geometry options'); }
  } catch (e) { writeLn(s.n + ' geo: ' + e); }
  layers.push(L);
}

// --- the move: the stack turns, and the layers pull apart --------------------
var front = layers[layers.length - 1];
for (var j = 0; j < layers.length; j++) {
  var L = layers[j];
  var rotY = L.property('ADBE Transform Group').property('ADBE Rotate Y');
  rotY.setValueAtTime(0, -42);
  rotY.setValueAtTime(DUR, -8);
  var pos = L.property('ADBE Transform Group').property('ADBE Position');
  var k = layers.length - 1 - j;
  var p0 = pos.valueAtTime(0, false);
  pos.setValueAtTime(0, [p0[0] + k * 40, p0[1] - k * 20, p0[2] * 0.4]);
  pos.setValueAtTime(DUR, [p0[0] - k * 40, p0[1] + k * 26, p0[2] * 1.5]);
}

// --- light and camera -------------------------------------------------------
var key = comp.layers.addLight('Key', [W / 2 - 420, H / 2 - 380, -820]);
key.lightType = LightType.POINT;
key.property('ADBE Light Options Group').property('ADBE Light Intensity').setValue(190);
try {
  key.property('ADBE Light Options Group').property('ADBE Casts Shadows').setValue(1);
  key.property('ADBE Light Options Group').property('ADBE Light Shadow Darkness').setValue(60);
  key.property('ADBE Light Options Group').property('ADBE Light Shadow Diffusion').setValue(60);
  writeLn('shadows on');
} catch (e) { writeLn('shadow: ' + e); }

var amb = comp.layers.addLight('Fill', [W / 2, H / 2, 0]);
amb.lightType = LightType.AMBIENT;
amb.property('ADBE Light Options Group').property('ADBE Light Intensity').setValue(42);
amb.property('ADBE Light Options Group').property('ADBE Light Color').setValue([0.75, 0.88, 0.84]);

var cam = comp.layers.addCamera('Cam', [W / 2, H / 2]);
cam.property('ADBE Transform Group').property('ADBE Position').setValue([W / 2, H / 2, -1700]);
try {
  var co = cam.property('ADBE Camera Options Group');
  co.property('ADBE Camera Depth of Field').setValue(1);
  co.property('ADBE Camera Focus Distance').setValue(1700);
  co.property('ADBE Camera Apertureq').setValue(60);
  writeLn('dof on');
} catch (e) { writeLn('dof: ' + e); }

// every panel casts and receives
for (var m = 0; m < layers.length; m++) {
  try {
    var mo = layers[m].property('ADBE Material Options Group');
    mo.property('ADBE Casts Shadows').setValue(1);
    mo.property('ADBE Accepts Shadows').setValue(1);
    mo.property('ADBE Specular Coeff').setValue(45);
    mo.property('ADBE Shininess Coeff').setValue(28);
  } catch (e) { writeLn('material: ' + e); }
}

writeLn('built: ' + comp.name + ' ' + comp.width + 'x' + comp.height + ' @' + comp.frameRate);
