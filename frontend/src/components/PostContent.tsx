import { Post, User } from "@/types/types";
import {
  Avatar,
  Box,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { toaster } from "./ui/toaster";
import { useEffect, useState } from "react";

type PostProps = {
  post: Post;
  postedBy: User;
}

const PostContent = ({ post, postedBy }: PostProps) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      console.log("PostContent postedBy: ", postedBy);
      try {
        const res = await fetch("/api/v1/users/profile/" + postedBy);
        const data = await res.json();
        console.log("PostContent while fetch: ", data.data);
        if (!data.success) {
          toaster.create({
            title: "Failed to Load User Posts",
            description: "We couldn't fetch your posts. Please try again later.",
            type: "error",
            duration: 3000,
          });
          return;
        }
        console.log("PostContent after fetch: ", data.data);

        setUser(data.data);
      } catch (error) {
        toaster.create({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your internet connection.",
          type: "error",
          duration: 3000,
        });
        setUser(null);
      }
    };

    getUser();
  }, [postedBy]);

  if (!user) return null;

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar.Root
            size='md'
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          >
            <Avatar.Fallback name={user.name} />
            <Avatar.Image src={user?.profilePic} />
          </Avatar.Root>

          <Box w='1px' h={"full"} bg='gray.light' my={2}></Box>

          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar.Root
                size='xs'
                position={"absolute"}
                top={"0px"}
                left='15px'
                padding={"2px"}
              >
                <Avatar.Fallback name='John doe' />
                <Avatar.Image src={post.replies[0].userProfilePic} />
              </Avatar.Root>
            )}

            {post.replies[1] && (
              <Avatar.Root
                size='xs'
                position={"absolute"}
                bottom={"0px"}
                right='-5px'
                padding={"2px"}
              >
                <Avatar.Fallback name='John doe' />
                <Avatar.Image src={post.replies[1].userProfilePic} />
              </Avatar.Root>
            )}

            {post.replies[2] && (
              <Avatar.Root
                size='xs'
                position={"absolute"}
                bottom={"0px"}
                left='4px'
                padding={"2px"}
              >
                <Avatar.Fallback name='John doe' />
                <Avatar.Image src={post.replies[2].userProfilePic} />
              </Avatar.Root>
            )}
          </Box>
        </Flex>

        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>

              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box display="flex" justifyContent="center" overflow="hidden">
              <Image src={post.img} w="50%" objectFit="cover" borderRadius={6} />
            </Box>

          )}
        </Flex>
      </Flex>
    </Link>
  )
}

export default PostContent;