import { fetchPropertyReviews } from "@/utils/action";
import React from "react";
import Title from "../properties/Title";
import ReviewCard from "./ReviewCard";
import { use } from "react";

function PropertyReviews({ propertyId }: { propertyId: string }) {
  const reviews = use(fetchPropertyReviews(propertyId));
  if (reviews.length === 0) return null;

  return (
    <div className="mt-8">
      <Title text="Reviews" />
      <div className="grid md:grid-cols-2 gap-8 myt-4">
        {reviews.map((review) => {
          const { comment, rating } = review;
          const { firstName, profileImage } = review.profile;
          const reviewInfo = {
            comment,
            rating,
            name: firstName,
            image: profileImage,
          };
          return <ReviewCard key={review.id} reviewInfo={reviewInfo} />;
        })}
      </div>
    </div>
  );
}

export default PropertyReviews;
