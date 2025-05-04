import { postsAtom } from "@/atoms/postAtom";
import PostContent from "@/components/PostContent";
import { toaster } from "@/components/ui/toaster";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useAtom } from "jotai/react";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [posts, setPosts] = useAtom(postsAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);

      try {
        const res = await fetch("/api/v1/posts/feed");
        const data = await res.json();
        if (!data.success) {
          toaster.create({
            title: "Failed to Load Posts",
            description: "We couldn't fetch your feed. Please try again later.",
            type: "error",
            duration: 3000,
          });
          return;
        }

        setPosts(data.data.posts);
        console.log("HomePage getFeedPosts: ", data.data);
      } catch (error) {
        toaster.create({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your internet connection.",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    getFeedPosts();
  }, [setPosts]);

  return (
    <Flex gap='10' alignItems={"flex-start"}>
      <Box flex={70}>
        {loading && (
          <Flex justify='center'>
            <Spinner size='xl' />
          </Flex>
        )}

        {!loading && posts.length === 0 ? (
          <h1>Follow some users to see the feed</h1>
        ) : (
          posts.map((post) => (
            <PostContent
              key={post._id}
              post={post}
              postedBy={post.postedBy}
            />
          ))
        )}
      </Box>
    </Flex>
  )
}

export default HomePage;