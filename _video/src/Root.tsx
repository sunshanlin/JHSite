import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';
import { TOTAL } from './timeline';
import { TRAILER_FPS, rf } from './rate';
import { Hero, HERO_TOTAL } from './Hero';
import { Demo, DEMO_TOTAL, DEMO_FPS } from './demo/Demo';
import { Loc, LOC_TOTAL } from './loc/Loc';

export const Root: React.FC = () => (
  <>
    <Composition id="JwicMonth" component={Main} defaultProps={{ bgm: true }} durationInFrames={rf(TOTAL)} fps={TRAILER_FPS} width={1920} height={1080} />
    <Composition id="JwicMonthHero" component={Hero} durationInFrames={rf(HERO_TOTAL)} fps={TRAILER_FPS} width={1080} height={1350} />
    <Composition id="JwicLocalization" component={Loc} defaultProps={{ bgm: true }} durationInFrames={rf(LOC_TOTAL)} fps={TRAILER_FPS} width={1920} height={1080} />
    <Composition id="JwicDemoBilling" component={Demo} defaultProps={{ bgm: true }} durationInFrames={DEMO_TOTAL} fps={DEMO_FPS} width={1920} height={1080} />
  </>
);
