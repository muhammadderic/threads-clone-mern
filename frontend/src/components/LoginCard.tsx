import { authScreenAtom } from "@/atoms/authAtom";
import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSetAtom } from "jotai/react";
import { useState } from "react";
import { toaster } from "./ui/toaster";
import { userAtom } from "@/atoms/userAtom";

const LoginCard = () => {
  const setAuthScreen = useSetAtom(authScreenAtom);
  const setUser = useSetAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!inputs.username || !inputs.password) {
        toaster.create({
          title: "Missing fields",
          description: "Please enter both username and password.",
          type: "warning",
          duration: 3000,
        });
        setLoading(false);
        return;
      }

      const res = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!data.success || !data.data) {
        toaster.create({
          title: "Login Failed",
          description: data?.error?.message || "Invalid username or password.",
          type: "error",
          duration: 5000,
        });
        return;
      }

      // Extract only safe user data
      const { _id, name, email, username, bio, profilePic } = data.data;
      setUser({ _id, name, email, username, bio, profilePic });

      toaster.create({
        title: "Welcome!",
        description: "Your login successfully",
        type: "success",
        duration: 5000,
      });
    } catch (error: any) {
      toaster.create({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack gap={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
        </Stack>

        <Box
          rounded={"lg"}
          bg={"white"}
          boxShadow={"lg"}
          p={8}
        >
          <Stack gap={4}>
            <Field.Root>
              <Field.Label>Username</Field.Label>
              <Input
                type="text"
                onChange={(e) => setInputs(prev => ({ ...prev, username: e.target.value }))}
                value={inputs.username}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Password</Field.Label>
              <Input
                type={"password"}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                value={inputs.password}
              />
            </Field.Root>

            <Stack gap={10} pt={2}>
              <Button
                loadingText='Logging in'
                size='lg'
                bg={"gray.600"}
                color={"white"}
                _hover={{
                  bg: "gray.700",
                }}
                onClick={handleLogin}
                loading={loading}
              >
                Login
              </Button>
            </Stack>

            <Stack pt={6}>
              <Text>
                Don&apos;t have an account?{" "}
                <Link color={"blue.400"} onClick={() => setAuthScreen("signup")}>
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default LoginCard;