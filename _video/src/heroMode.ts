import React from 'react';

// True while a scene is mounted inside the 4:5 hero (Hero.tsx): the hero's own band carries the copy, so scenes
// leave out their titles / pills (they would otherwise leak into crops, final review Q9).
export const HeroMode = React.createContext(false);
export const useHeroMode = () => React.useContext(HeroMode);
