import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});
// eslint-disable-next-line react/prop-types
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setUser(data);
        setReady(true);
      });
    }
  });
  return (
    <UserContext.Provider value={{ user,ready, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
