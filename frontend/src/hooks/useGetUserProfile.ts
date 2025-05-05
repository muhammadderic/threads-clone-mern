import { toaster } from "@/components/ui/toaster";
import { User } from "@/types/types";
import { useEffect, useState } from "react";

type UserProfileResult = {
  user: User | null;
  loading: boolean;
  error?: Error | null;
}

const useGetUserProfile = (username?: string): UserProfileResult => {
  const [state, setState] = useState<UserProfileResult>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!username) {
      setState({ user: null, loading: false, error: null });
      return;
    }

    const getUser = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));

        const res = await fetch(`/api/v1/users/profile/${username}`);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "User not found");
        }

        if (data.data.isFrozen) {
          throw new Error("Account is frozen");
        }

        setState({
          user: data.data,
          loading: false,
          error: null
        });
      } catch (error) {
        setState({
          user: null,
          loading: false,
          error: error as Error
        });

        toaster.create({
          title: "Error",
          description: "Error",
          type: "error",
          duration: 3000,
        });
      }
    };

    getUser();
  }, [username]);

  return state;
};

export default useGetUserProfile;
