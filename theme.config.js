/** @type {const} */
const themeColors = {
  primary:    { light: '#A855F7', dark: '#C084FC' },   // violet
  secondary:  { light: '#EC4899', dark: '#F472B6' },   // pink
  background: { light: '#F5F0FF', dark: '#0A0A0F' },   // near black / soft lavender
  surface:    { light: '#EDE9FE', dark: '#13111C' },   // dark card / light lavender
  surface2:   { light: '#DDD6FE', dark: '#1C1828' },   // slightly lighter card
  foreground: { light: '#1A1A2E', dark: '#F0EEFF' },   // text
  muted:      { light: '#7C6FA0', dark: '#9580C4' },   // muted text
  border:     { light: '#D8B4FE', dark: '#2D1F4E' },   // border
  success:    { light: '#10B981', dark: '#34D399' },
  warning:    { light: '#F59E0B', dark: '#FBBF24' },
  error:      { light: '#EF4444', dark: '#F87171' },
  tint:       { light: '#A855F7', dark: '#C084FC' },
  glow:       { light: '#A855F7', dark: '#A855F7' },   // glow effect color
};

module.exports = { themeColors };
