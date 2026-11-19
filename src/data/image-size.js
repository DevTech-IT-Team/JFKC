import sizes from './image-size.json';

export function dims(key) {
  const size = sizes[key];
  if (!size) return {};
  return { width: size.width, height: size.height };
}

export function imageMeta(key) {
  const size = sizes[key];
  if (!size) return {};
  return { imageWidth: size.width, imageHeight: size.height };
}
