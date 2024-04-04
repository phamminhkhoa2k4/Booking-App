import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRedirect, setIsRedirect] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { setUser } = useContext(UserContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) toast.warn("please enter email !!!");
    else if (!password) toast.warn("please enter password !!!");
    if (email && password) {
      await axios
        .post("/login", { email, password })
        .then(({ data }) => {
          if (data.statusCode == 0) {
            setUser(data);
            toast.success(data.msg);
            setEmail("");
            setPassword("");
            setIsRedirect(true);
          } else if (data.statusCode == 1) {
            toast.error(data.msg);
          } else if (data.statusCode == 2) {
            toast.error(data.msg);
            setEmail("");
            setPassword("");
          }
        })
        .catch((e) => toast.error(e));
    }
  };

  if (isRedirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-32">
          <h1 className="text-4xl text-center mb-4">Login</h1>
          <form className="max-w-md mx-auto" onSubmit={handleLogin}>
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
            <button className="primary">Login</button>
            <div className="text-center py-2 text-gray-500">
              Don&rsquo;t have an account yet?{" "}
              <Link to={"/register"} className="underline text-black">
                Register now
              </Link>{" "}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
