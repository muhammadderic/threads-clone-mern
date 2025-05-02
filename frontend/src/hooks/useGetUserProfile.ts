import { toaster } from "@/components/ui/toaster";
import { User } from "@/types/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type UserProfileResult = {
  user: User | null;
  loading: boolean;
  error?: Error | null;
}

const useGetUserProfile = (): UserProfileResult => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/v1/users/profile/${username}`);
        const data = await res.json();
        if (!data.success) {
          toaster.create({
            title: "User Not Found",
            description: "We couldn't find the profile for this user.",
            type: "error",
            duration: 3000,
          });
          return;
        }

        if (data.data.isFrozen) {
          setUser(null);
          return;
        }
        setUser(data.data);
      } catch (error) {
        toaster.create({
          title: "Network Error",
          description: "Failed to load user profile. Please check your connection.",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username]);

  return { user, loading };
};

export default useGetUserProfile;
