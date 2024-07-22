import { FaHeart } from "react-icons/fa";
import { Button } from "../ui/Button";
import { auth } from "@clerk/nextjs/server";
import { CardSignInButton } from "../form/Button";
import { fetchFavouriteId } from "@/utils/action";
import FavouriteToggleForm from "./FavouriteToggleForm";
import { use } from "react";

function FavouriteToggleButton({ propertyId }: { propertyId: string }) {
  const { userId } = auth();
  if (!userId) return <CardSignInButton />;
  const favouriteId = use(fetchFavouriteId({ propertyId }));
  return (
    <FavouriteToggleForm propertyId={propertyId} favouriteId={favouriteId} />
  );
}

export default FavouriteToggleButton;
