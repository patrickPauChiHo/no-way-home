import { LuUser2 } from "react-icons/lu";
import { fetchProfileImage } from "@/utils/action";
import { use } from "react";

function UserIcon() {
  const profileImage = use(fetchProfileImage());
  if (profileImage) {
    return (
      <img src={profileImage} className="w-6 h-6  rounded-full object-cover" />
    );
  }

  return <LuUser2 className="w-6 h-6 bg-primary rounded-full text-white" />;
}

export default UserIcon;
