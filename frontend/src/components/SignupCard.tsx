import { authScreenAtom } from "@/atoms/authAtom";
import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSetAtom } from "jotai/react";
import { useState } from "react";

const SignupCard = () => {
  const setAuthScreen = useSetAtom(authScreenAtom);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSignup = () => {
    setLoading(true);
    setLoading(false);
  }

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack gap={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>

        <Box
          rounded={"lg"}
          bg={"white"}
          boxShadow={"lg"}
          p={8}
        >
          <Stack gap={4}>
            <HStack>
              <Box flex={1}>
                <Field.Root>
                  <Field.Label>Full name</Field.Label>
                  <Input
                    type="text"
                    onChange={(e) => setInputs(prev => ({ ...prev, name: e.target.value }))}
                    value={inputs.name}
                  />
                </Field.Root>
              </Box>

              <Box flex={1}>
                <Field.Root>
                  <Field.Label>Username</Field.Label>
                  <Input
                    type="text"
                    onChange={(e) => setInputs(prev => ({ ...prev, username: e.target.value }))}
                    value={inputs.username}
                  />
                </Field.Root>
              </Box>
            </HStack>

            <Field.Root>
              <Field.Label>Email address</Field.Label>
              <Input
                type='email'
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                value={inputs.email}
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
                loadingText='Submitting'
                size='lg'
                bg={"gray.600"}
                color={"white"}
                _hover={{
                  bg: "gray.700",
                }}
                onClick={handleSignup}
                loading={loading}
              >
                Sign up
              </Button>
            </Stack>

            <Stack pt={6}>
              <Text>
                Already a user?{" "}
                <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default SignupCard;