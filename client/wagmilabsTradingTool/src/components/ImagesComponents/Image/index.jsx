import React from "react";
import { placeholderImage } from "@Assets";

export const Image = ({ src, alt, className, round, square, width, height, pointer, customWidth, borderRadius }) => {
  const styles = {
    aspectRatio: square ? "1" : "auto",
    borderRadius: round ? "50%" : "0",
    cursor: pointer ? "pointer" : "auto",
  };

  if (!customWidth) styles.width = width || "30px";
  if (height) styles.height = height;
  if (borderRadius === true) styles.borderRadius = "10px";
  else if (borderRadius) styles.borderRadius = borderRadius;
  return (
    <img
      className={className}
      style={styles}
      src={src || placeholderImage}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // prevents looping
        currentTarget.src = placeholderImage;
      }}
      alt={alt}
    />
  );
};
