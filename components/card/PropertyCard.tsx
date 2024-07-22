import type { PropertyCardProps } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import CountryFlagAndName from "./CountryFlagAndName";
import PropertyRating from "./PropertyRating";
import FavouriteToggleButton from "./FavouriteToggleButton";
import { formatCurrency } from "@/utils/format";
import { Suspense } from "react";

function PropertyCard({ property }: { property: PropertyCardProps }) {
  const { name, image, price } = property;
  const { country, id: propertyId, tagline } = property;
  return (
    <article className="group relative">
      <Link href={`/properties/${propertyId}`}>
        <div className="relative h-[300px] mb-2 overflow-hidden rounded-md ">
          <Image
            className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
            src={image}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            alt={name}
          />
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold mt-1">
            {name.substring(0, 30)}
          </h3>
          {/* property rating*/}
          <PropertyRating inPage={false} propertyId={propertyId} />
        </div>
        <p className="text-sm mt-1 text-muted-foreground">
          {tagline.substring(0, 40)}
        </p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm mt-1">
            <span className="font-semibold">{formatCurrency(price)} </span>
            night
          </p>
          {/* country flag and name */}
          <CountryFlagAndName countryCode={country} />
        </div>
      </Link>
      <div className="absolute top-5 right-5 z-5">
        {/* favourite toggle button */}
        <Suspense fallback={null}>
          <FavouriteToggleButton propertyId={propertyId} />
        </Suspense>
      </div>
    </article>
  );
}

export default PropertyCard;
