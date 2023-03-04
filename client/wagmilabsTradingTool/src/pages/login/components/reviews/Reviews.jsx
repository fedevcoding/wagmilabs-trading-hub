import React from "react";
import { reviews } from "./reviews";
import { HStack } from "@chakra-ui/react";

export const Reviews = React.memo(() => {
  return (
    <div className="reviews-section">
      <h1>What traders say about us...</h1>

      <div className="reviews-container">
        {reviews.map((review, index) => {
          return <Review review={review} key={index} />;
        })}
      </div>
    </div>
  );
});

const Review = ({ review }) => {
  const { name, image, description, username } = review;
  return (
    <div className="review">
      <HStack gap={"10px"}>
        <img src={image} className="image" alt={name}></img>
        <div className="flex-col">
          <p>{name}</p>
          <p className="low-opacity little-text">{username}</p>
        </div>
      </HStack>
      <p className="review-description">{description}</p>
    </div>
  );
};
