import { useSetAtom } from "jotai/react";
import { userAtom } from "../atoms/userAtom";
import { toaster } from "@/components/ui/toaster";

const useLogout = () => {
  const setUser = useSetAtom(userAtom);

  const logout = async () => {
    try {
      const res = await fetch("/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        toaster.create({
          title: "Logout Failed",
          description: data.error.message || "Something went wrong during logout.",
          type: "error",
          duration: 3000,
        });
        return;
      }

      setUser(null);

      toaster.create({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        type: "info",
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: "Network Error",
        description: "Unable to reach the server. Please try again.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return logout;
};


export default useLogout;