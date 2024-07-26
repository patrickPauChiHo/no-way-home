"use server";

import {
  createReviewSchema,
  profileSchema,
  propertySchema,
  validatedWithZodSchema,
} from "./schema";
import db from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { imageSchema } from "./schema";
import { uploadImage } from "./supabase";
import {
  TbArrowAutofitContent,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be logged in to access this page");
  }
  if (!user.privateMetadata.hasProfile) {
    redirect("/profile/create");
  }
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);

  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

export const createProfileAction = async (
  prevState: any,
  FormData: FormData
) => {
  try {
    const user = await currentUser();
    console.log(user);
    if (!user) throw new Error("Please log in to create a profile.");
    const rawData = Object.fromEntries(FormData);
    const validatedFields = validatedWithZodSchema(profileSchema, rawData);
    //console.log(rawData);
    //console.log(prevState);
    //console.log(validatedFields);
    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/");
};

export const fetchProfileImage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });
  return profile?.profileImage;
};

export const fetchProfile = async () => {
  const user = await getAuthUser();
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });
  if (!profile) redirect("/profile/create");
  return profile;
};

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validatedWithZodSchema(profileSchema, rawData);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    });
    revalidatePath("/profile");
    return { message: "Profile updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const image = formData.get("image") as File;
    //check the data against the schema
    const validatedFields = validatedWithZodSchema(imageSchema, { image });
    //console.log(validatedFields);
    const fullPath = await uploadImage(validatedFields.image);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });
    revalidatePath("/profile");

    return { message: "Profile image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const createPropertyAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;

    const validatedfields = validatedWithZodSchema(propertySchema, rawData);
    const validatedFile = validatedWithZodSchema(imageSchema, { image: file });

    const fullPath = await uploadImage(validatedFile.image);
    console.log(fullPath);

    await db.property.create({
      data: {
        ...validatedfields,
        image: fullPath,
        profileId: user.id,
      },
    });
    //return { message: "Property created successfully" };
  } catch (error) {
    return renderError(error);
  }
  redirect("/");
};

export const fetchProperties = async ({
  search = "",
  category,
}: {
  search?: string;
  category?: string;
}) => {
  const properties = await db.property.findMany({
    where: {
      category,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      country: true,
      price: true,
      image: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return properties;
};

export const fetchFavouriteId = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  try {
    const user = await getAuthUser();
    const favourite = await db.favourite.findFirst({
      where: {
        propertyId,
        profileId: user.id,
      },
      select: {
        id: true,
      },
    });
    return favourite?.id || null;
  } catch (error) {
    return null;
  }
};

export const toggleFavouriteAction = async (prevState: {
  propertyId: string;
  favouriteId: string | null;
  pathname: string;
}) => {
  const { propertyId, favouriteId, pathname } = prevState;
  //console.log(propertyId, favouriteId, pathname);
  const user = await getAuthUser();
  try {
    if (favouriteId) {
      await db.favourite.delete({
        where: {
          id: favouriteId,
        },
      });
    } else {
      await db.favourite.create({
        data: {
          propertyId,
          profileId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    return {
      message: favouriteId ? "Removed from favourites" : "Added to favourites",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchFavourites = async () => {
  const user = await getAuthUser();
  const favourites = await db.favourite.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      property: {
        select: {
          id: true,
          name: true,
          tagline: true,
          country: true,
          price: true,
          image: true,
        },
      },
    },
  });
  return favourites.map((favourite) => favourite.property);
};

export const fetchProperty = async (id: string) => {
  return await db.property.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
    },
  });
};

export const createReviewAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validatedWithZodSchema(createReviewSchema, rawData);

    await db.review.create({
      data: {
        ...validatedFields,
        profileId: user.id,
      },
    });
    revalidatePath(`/properties/${validatedFields.propertyId}`);
    return { message: "Review Submitted Successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchPropertyReviews = async (propertyId: string) => {
  const reviews = await db.review.findMany({
    where: {
      propertyId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      profile: {
        select: {
          firstName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
};

export const fetchPropertyReviewsByUser = async () => {
  const user = await getAuthUser();
  const reviews = await db.review.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      property: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return reviews;
};

export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;
  const user = await getAuthUser();

  try {
    await db.review.delete({
      where: {
        id: reviewId,
        profileId: user.id,
      },
    });
    revalidatePath("/reviews");

    return { message: "Review deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export async function fetchPropertyRating(propertyId: string) {
  const result = await db.review.groupBy({
    by: ["propertyId"],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      propertyId,
    },
  });

  return {
    rating: result[0]?._avg.rating?.toFixed() ?? 0,
    count: result[0]?._count.rating ?? 0,
  };
}

export const findExistingReview = async (useId: string, propertyId: string) => {
  return db.review.findFirst({
    where: {
      profileId: useId,
      propertyId,
    },
  });
};
