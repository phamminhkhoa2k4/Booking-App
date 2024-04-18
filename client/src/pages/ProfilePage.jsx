import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PlacesPage from "./PlacesPage";
import AccountNavigation from "../components/Account Navigation/AccountNavigation";

const AccountPage = () => {
  const { ready, user , setUser} = useContext(UserContext);
  const [isRedirect, setIsRedirect] = useState(false);
  let { subpage } = useParams();

  const logout = async () => {
    await axios.post("/logout").then(({ data }) => {
      if (data) {
        setIsRedirect(true);
        setUser(null);
        toast.success("Logout Successfully !!!");
      } else {
        toast.error("Error Server");
      }
    });
  };
  if (isRedirect) return <Navigate to={"/"} />;
  if (!ready) return "Loading ...";
  if (ready && !user) return <Navigate to={"/login"} />;

  if (subpage === undefined) subpage = "profile";


  return (
    <div>
      <AccountNavigation/>
      {subpage === "profile" && ready && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
};

export default AccountPage;
