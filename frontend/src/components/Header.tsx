import { authScreenAtom } from "@/atoms/authAtom";
import { userAtom } from "@/atoms/userAtom";
import useLogout from "@/hooks/useLogout";
import { Button, Flex, Image } from "@chakra-ui/react";
import { useAtomValue, useSetAtom } from "jotai/react";
import { AiFillHome } from "react-icons/ai";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSettings } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";

const Header = () => {
  const user = useAtomValue(userAtom);
  const setAuthScreen = useSetAtom(authScreenAtom);
  const logout = useLogout();

  return (
    <Flex justifyContent={"space-between"} mt={6} mb='12'>
      {user && (
        <Link to='/'>
          <AiFillHome size={24} />
        </Link>
      )}
      {!user && (
        <Link to={"/auth"} onClick={() => setAuthScreen("login")}>
          Login
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt='logo'
        w={6}
        src={"/light-logo.svg"}
      />

      {user && (
        <Flex alignItems={"center"} gap={4}>
          {/* TODO: to={`/${user.username}`} */}
          <Link to={`#`}>
            <RxAvatar size={24} />
          </Link>

          {/* TODO: to={`/chat`} */}
          <Link to={`#`}>
            <BsFillChatQuoteFill size={20} />
          </Link>

          {/* TODO: to={`/settings`} */}
          <Link to={`#`}>
            <MdOutlineSettings size={20} />
          </Link>

          <Button onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}

      {!user && (
        <Link to={"/auth"} onClick={() => setAuthScreen("signup")}>
          Sign up
        </Link>
      )}
    </Flex>
  )
}

export default Header;