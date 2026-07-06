export const CVD_FILTERS_SVG = `
  <defs>
    <filter id="cvd-protanopia"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" /></filter>
    <filter id="cvd-deuteranopia"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" /></filter>
    <filter id="cvd-tritanopia"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" /></filter>
    <filter id="cvd-achromatopsia"><feColorMatrix type="matrix" values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0" /></filter>
  </defs>
`;

export const TYPOGRAPHY_ROLES = [
  { name: 'display-large', size: 57, lh: 64 }, { name: 'display-medium', size: 45, lh: 52 }, { name: 'display-small', size: 36, lh: 44 },
  { name: 'headline-large', size: 32, lh: 40 }, { name: 'headline-medium', size: 28, lh: 36 }, { name: 'headline-small', size: 24, lh: 32 },
  { name: 'title-large', size: 22, lh: 28 }, { name: 'title-medium', size: 16, lh: 24 }, { name: 'title-small', size: 14, lh: 20 },
  { name: 'body-large', size: 16, lh: 24 }, { name: 'body-medium', size: 14, lh: 20 }, { name: 'body-small', size: 12, lh: 16 },
  { name: 'label-large', size: 14, lh: 20 }, { name: 'label-medium', size: 12, lh: 16 }, { name: 'label-small', size: 11, lh: 16 },
];

export const SHAPE_ROLES = [
  { name: 'extra-small', size: 4 }, { name: 'small', size: 8 }, { name: 'medium', size: 12 },
  { name: 'large', size: 16 }, { name: 'extra-large', size: 28 }, { name: 'full', size: 9999 }
];