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

const LoginCard = () => {
  const setAuthScreen = useSetAtom(authScreenAtom);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleLogin = () => {
    setLoading(true);
    setLoading(false);
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