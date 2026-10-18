// Second pass: the property paths this engine actually uses (from `props --flat`), not AE's
// ADBE match names. Turns on the three things the trial exists to test — real extrusion, cast
// shadows and depth of field.

var comp = null;
for (var i = 1; i <= app.project.items.length; i++) {
  var it = app.project.items[i];
  if (it.name === 'SeriesObject') { comp = it; break; }
}
if (!comp) { writeLn('no comp'); }

function setPath(layer, path, value) {
  var parts = path.split('/');
  var p = layer;
  for (var i = 0; i < parts.length; i++) {
    p = p.property(parts[i]);
    if (!p) { writeLn('MISS ' + layer.name + ' ' + path + ' at ' + parts[i]); return false; }
  }
  p.setValue(value);
  return true;
}

var names = ['L3-back', 'L2-mid', 'L1-front'];
for (var n = 0; n < names.length; n++) {
  var L = null;
  for (var k = 1; k <= comp.layers.length; k++) {
    if (comp.layers[k].name === names[n]) { L = comp.layers[k]; break; }
  }
  if (!L) { writeLn('no layer ' + names[n]); continue; }
  setPath(L, 'geometryOptions/extrusionDepth', 30);
  setPath(L, 'geometryOptions/bevelStyle', 1);
  setPath(L, 'geometryOptions/bevelDepth', 3);
  setPath(L, 'materialOptions/castsShadows', 1);
  setPath(L, 'materialOptions/acceptsShadows', 1);
  setPath(L, 'materialOptions/specularIntensity', 55);
  setPath(L, 'materialOptions/specularShininess', 22);
  setPath(L, 'materialOptions/metal', 30);
  setPath(L, 'materialOptions/ambient', 45);
  writeLn(names[n] + ' done');
}

// light
for (var k2 = 1; k2 <= comp.layers.length; k2++) {
  var LL = comp.layers[k2];
  if (LL.name === 'Key') {
    setPath(LL, 'lightOptions/castsShadows', true);
    setPath(LL, 'lightOptions/shadowDarkness', 62);
    setPath(LL, 'lightOptions/shadowDiffusion', 70);
    writeLn('key light done');
  }
  if (LL.name === 'Cam') {
    setPath(LL, 'cameraOptions/dof', true);
    setPath(LL, 'cameraOptions/focusDistance', 1700);
    setPath(LL, 'cameraOptions/aperture', 110);
    setPath(LL, 'cameraOptions/blurLevel', 100);
    writeLn('camera done');
  }
}

writeLn('ok');
