import { User } from "@/types/types";
import {
  Box,
  Flex,
  VStack,
  Text,
  Avatar,
  Button,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Link } from "react-router-dom";
import { toaster } from "./ui/toaster";
import { userAtom } from "@/atoms/userAtom";
import { useAtomValue } from "jotai";

type UserHeaderProps = {
  user: User;
}

const UserHeader = ({ user }: UserHeaderProps) => {
  const currentUser = useAtomValue(userAtom); // logged in user

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toaster.create({
        title: "Success",
        description: "Profile link copied.",
        type: "info",
        duration: 3000,
        closable: true,
      });
    });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>

          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
              threads.net
            </Text>
          </Flex>
        </Box>

        <Box>
          {user.profilePic && (
            <Avatar.Root size={{
              base: "md",
              md: "xl",
            }}>
              <Avatar.Fallback name={user.name} />
              <Avatar.Image src={user.profilePic} />
            </Avatar.Root>
          )}
          {!user.profilePic && (
            <Avatar.Root size={{
              base: "md",
              md: "xl",
            }}>
              <Avatar.Fallback name={user.name} />
              <Avatar.Image src={"/default-pp.jpg"} />
            </Avatar.Root>
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link to='/update'>
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers?.length} followers</Text>
          <Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"} to={"#"}>instagram.com</Link>
        </Flex>

        <Flex>
          <Box className='icon-container'>
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button>
                <CgMoreO size={24} cursor={"pointer"} />
              </Button>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="copy-link" onClick={copyURL}>
                    Copy Link <Menu.ItemCommand>Ctrl+S</Menu.ItemCommand>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>

        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb='3'
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>

        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb='3'
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  )
}

export default UserHeader;