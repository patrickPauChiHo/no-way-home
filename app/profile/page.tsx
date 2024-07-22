import FormContainer from "@/components/form/FormContainer";
import {
  updateProfileAction,
  fetchProfile,
  updateProfileImageAction,
} from "@/utils/action";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Button";
import ImageInputContainer from "@/components/form/ImageInputContainer";

async function ProfilePage() {
  const profile = await fetchProfile();

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">user profile</h1>
      <div className="border p-8 rounded-md ">
        <ImageInputContainer
          image={profile.profileImage}
          name={profile.username}
          action={updateProfileImageAction}
          text="Update profile image"
        />
        <FormContainer action={updateProfileAction}>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <FormInput
              defaultValue={profile.firstName}
              type="text"
              name="firstName"
              label="First Name"
            />
            <FormInput
              defaultValue={profile.lastName}
              type="text"
              name="lastName"
              label="Last Name"
            />
            <FormInput
              defaultValue={profile.username}
              type="text"
              name="username"
              label="username"
            />
          </div>
          <SubmitButton text="Update profile" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
}

export default ProfilePage;
