import { FaStar } from "react-icons/fa";
import { fetchPropertyRating } from "@/utils/action";
import { use } from "react";

function PropertyRating({
  propertyId,
  inPage,
}: {
  propertyId: string;
  inPage: boolean;
}) {
  //temp

  const { rating, count } = use(fetchPropertyRating(propertyId));
  if (count === 0) return null;

  const className = `flex gap-1 items-center ${inPage ? "text-md" : "tsxt-xs"}`;

  const countText = count > 1 ? "reviews" : "review";
  const countValue = `(${count}) ${inPage ? countText : ""}`;

  return (
    <span className={className}>
      <FaStar className="w-3 h-3 " />
      {rating} {countValue}
    </span>
  );
}

export default PropertyRating;
