import { formatQuantity } from "@/utils/format";

type PropertyDetailsProps = {
  details: {
    baths: number;
    bedrooms: number;
    beds: number;
    guests: number;
  };
};

function PropertyDetails({
  details: { bedrooms, baths, beds, guests },
}: PropertyDetailsProps) {
  return (
    <p className="text-md font-light">
      <span>{formatQuantity(bedrooms, "bedroom")} &middot;</span>
      <span>{formatQuantity(baths, "bath")} &middot;</span>
      <span>{formatQuantity(guests, "guest")} &middot;</span>
      <span>{formatQuantity(beds, "bed")} </span>
    </p>
  );
}

export default PropertyDetails;
