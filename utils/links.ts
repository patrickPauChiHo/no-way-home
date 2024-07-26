type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/favourites", label: "favourites" },

  { href: "/rentals/create", label: "create rental" },

  { href: "/profile", label: "profile" },
];
