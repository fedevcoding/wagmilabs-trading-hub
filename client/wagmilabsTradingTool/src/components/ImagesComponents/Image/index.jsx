import React from "react";
import { placeholderImage } from "@Assets";

export const Image = ({ src, alt, className, round, square, width, height, pointer }) => {
  return (
    <img
      className={className}
      style={{
        aspectRatio: square ? "1/1" : "auto",
        borderRadius: round ? "50%" : "0",
        width: width || "30px",
        height: height || "30px",
        cursor: pointer ? "pointer" : "auto",
      }}
      src={src || placeholderImage}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // prevents looping
        currentTarget.src = placeholderImage;
      }}
      alt={alt}
    />
  );
};
