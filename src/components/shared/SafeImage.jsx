import { useState } from "react";

const SafeImage = ({ src, alt, className = "" }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-base-200 text-sm text-base-content/50 ${className}`}
      >
        Image not available
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export default SafeImage;