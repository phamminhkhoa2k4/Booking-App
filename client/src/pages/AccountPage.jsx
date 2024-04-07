import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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

  function LinkClasses(type = null) {
    let classes = "py-2 px-6";
    if (subpage === type || (subpage === undefined && type === "profile")) {
      classes += " bg-primary rounded-full text-white";
    }
    return classes;
  }
  return (
    <div>
      <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
        <Link className={LinkClasses("profile")} to={"/account/"}>
          My Profile
        </Link>
        <Link className={LinkClasses("bookings")} to={"/account/bookings"}>
          My Booking
        </Link>
        <Link className={LinkClasses("places")} to={"/account/places"}>
          My Accommodations
        </Link>
      </nav>
      {subpage === "profile" && ready && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
