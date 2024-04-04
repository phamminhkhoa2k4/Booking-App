import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRedirect, setIsRedirect] = useState(false);
  const handleRegisterUser = async (e) => {
    e.preventDefault();
    if (!name) toast.warn("Please Enter Name !!!");
    else if (!email) toast.warn("Please Enter Email !!!");
    else if (!password) toast.warn("Please Enter Password !!!");

    if (name && email && password) {
      await axios
        .post("/register", { name, email, password })
        .then( async ({ data }) => {
          if (data.statusCode == 0) {
            toast.success(data.msg);
            setName("");
            setEmail("");
            setPassword("");
            await axios.post("/login", { email, password }).then(() => {
              setIsRedirect(true);
            })
          } else if (data.statusCode == 1) {
            toast.error(data.msg);
            setEmail("");
          } else if (data.statusCode == 2) {
            alert("Server Error !!!");
            setName("");
            setEmail("");
            setPassword("");
          }
        })
        .catch((e) => {
          toast.error(e);
        });
    }
  };

  if (isRedirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={handleRegisterUser}>
          <input
            type="text"
            placeholder="Wisdom Pham"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="your@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member?{" "}
            <Link to={"/login"} className="underline text-black">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
