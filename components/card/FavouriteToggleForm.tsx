"use client";

import { usePathname } from "next/navigation";
import FormContainer from "../form/FormContainer";
import { toggleFavouriteAction } from "@/utils/action";
import { CardSubmitButton } from "../form/Button";

type FavouriteToggleFormProps = {
  favouriteId: string | null;
  propertyId: string;
};

function FavouriteToggleForm({
  favouriteId,
  propertyId,
}: FavouriteToggleFormProps) {
  const pathname = usePathname();
  const toggleAction = toggleFavouriteAction.bind(null, {
    propertyId,
    favouriteId,
    pathname,
  });

  return (
    <FormContainer action={toggleAction}>
      <CardSubmitButton isFavourite={favouriteId ? true : false} />
    </FormContainer>
  );
}

export default FavouriteToggleForm;
