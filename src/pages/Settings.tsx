import { useAuthContext } from "../hooks/useAuthContext";
// import { useState } from "react";
// import PrimaryButton from "../components/Buttons/PrimaryButton";
// import SecondaryButton from "../components/Buttons/SecondaryButton";
// import supabase from "../config/supabaseClient";

const Settings = () => {

  const { user } = useAuthContext()

  // const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  // const handleDeleteConfirmation = () => {
  //   setDeleteConfirmationOpen(true);
  // };

  // const handleCancelDelete = () => {
  //   setDeleteConfirmationOpen(false);
  // };

  // const handleDeleteAccount = async () => {
  //   if (user) {
  //     const { data, error } = await supabase.auth.admin.deleteUser(user?.id)
  //   }
  // };
 

  return (
    <div className="settings flex justify-center w-full">
        <div className="mycontainer flex flex-col">
            <div className="page-header flex justify-between items-center">
                <div>
                    <p className="fs-h2 mb-2">Settings</p>
                    <p className="h3">An overview of your account</p>
                </div>
            </div>

            <div className="flex flex-col gap-8 mt-[60px]">
              {/* <div className="profile-image">
                  <div className="fs-caption">Profile Image:</div>
              </div>
              <div className="username">
                  <div className="fs-caption">Username:</div>
              </div> */}
              <div className="email">
                  <div className="fs-caption">Email:</div>
                  <p>{user?.email}</p>
              </div>
            </div>


            {/* <div className="mt-[30px]">
                <PrimaryButton text="Delete Account" onClickFunction={handleDeleteConfirmation} additionalClasses="bg-color-icon-fill-red border-color-icon-fill-red"/>

                {isDeleteConfirmationOpen && (
                  <div className="mt-4">
                    <p>Are you sure you want to delete your account?</p>
                    <PrimaryButton text="Yes, Delete Account" onClickFunction={handleDeleteAccount} additionalClasses="bg-color-icon-fill-red border-color-icon-fill-red"/>
                    <SecondaryButton text="Cancel" onClickFunction={handleCancelDelete} additionalClasses="ml-2"/>
                  </div>
                )}
            </div> */}
        </div>
    </div>
  );
};

export default Settings;
