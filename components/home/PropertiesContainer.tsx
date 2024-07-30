import { fetchProperties } from "@/utils/action";
import PropertiesList from "./PropertiesList";
import EmptyList from "./EmptyList";
import type { PropertyCardProps } from "@/utils/types";
import { use } from "react";

function PropertiesContainer({
  category,
  search,
}: {
  category?: string;
  search?: string;
}) {
  const properties: PropertyCardProps[] = use(
    fetchProperties({
      category,
      search,
    })
  );
  //console.log(properties);
  if (properties.length === 0) {
    return (
      <EmptyList
        heading="No results."
        message="Try a different search term."
        btnText="clear filters"
      />
    );
  }
  return <PropertiesList properties={properties} />;
}

export default PropertiesContainer;
