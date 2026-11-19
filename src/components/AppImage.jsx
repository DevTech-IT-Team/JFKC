import { dims } from '../data/image-size';

const AppImage = ({ priority = false, src, alt = '', ...props }) => {
  const known = typeof src === 'string' ? dims(src) : {};
  return (
    <img
      alt={alt}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      {...(priority ? { fetchPriority: 'high' } : {})}
      {...known}
      {...props}
      src={src}
    />
  );
};

export default AppImage;
