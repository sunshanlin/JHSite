// Preload for the video-shotcraft workbench on Windows without symlink privilege: directory symlinks become
// junctions (no privilege needed), file symlinks become hard links (same volume) or copies.
import fs from 'node:fs';
import path from 'node:path';
import { syncBuiltinESMExports } from 'node:module';

const orig = fs.symlinkSync;
fs.symlinkSync = (target, linkPath, type) => {
  const abs = path.resolve(path.dirname(String(linkPath)), String(target));
  let isDir = false;
  try { isDir = fs.statSync(abs).isDirectory(); } catch { /* missing target: let the original call report it */ }
  if (isDir) return orig(abs, linkPath, 'junction');
  try { return orig(target, linkPath, type); } catch (e) {
    if (e.code !== 'EPERM') throw e;
    try { return fs.linkSync(abs, linkPath); } catch { return fs.copyFileSync(abs, linkPath); }
  }
};
syncBuiltinESMExports();
