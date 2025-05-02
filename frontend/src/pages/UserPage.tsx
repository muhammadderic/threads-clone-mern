import { postsAtom } from "@/atoms/postAtom";
import { toaster } from "@/components/ui/toaster";
import UserHeader from "@/components/UserHeader";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserPage = () => {
  const { username } = useParams();
  const { user, loading: userLoading } = useGetUserProfile();
  const [posts, setPosts] = useAtom(postsAtom);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user || !username) return;

      setPostsLoading(true);
      try {
        const res = await fetch(`/api/v1/posts/user/${username}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch posts");

        setPosts(data.data);
      } catch (error) {
        toaster.create({
          title: "Error",
          description: "Failed to load user profile. Please check your connection.",
          type: "error",
          duration: 3000,
        });
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchUserPosts();
  }, [username, user, setPosts]);

  // Loading state for user data
  if (userLoading) {
    return (
      <Flex justifyContent="center" my={12}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  // User not found state
  if (!user) {
    return (
      <Text textAlign="center" fontSize="xl" mt={10}>
        User not found
      </Text>
    );
  }

  return (
    <>
      <UserHeader user={user} />

      {/* Posts loading state */}
      {postsLoading ? (
        <Flex justifyContent="center" my={12}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        /* Posts content */
        posts.length === 0 ? (
          <Text textAlign="center" my={10}>
            No posts yet
          </Text>
        ) : (
          <h1>You have some posts, but the feature not yet created</h1>
        )
      )}
    </>
  )
}

export default UserPage;