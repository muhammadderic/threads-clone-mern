import { userAtom } from "@/atoms/userAtom";
import { toaster } from "@/components/ui/toaster";
import usePreviewImg from "@/hooks/usePreviewImg";
import {
  Avatar,
  Button,
  Center,
  Field,
  Flex,
  Heading,
  Input,
  Stack
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

const UpdateProfilePage = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useAtom(userAtom);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    password: "",
  });

  const { handleImageChange, imgUrl } = usePreviewImg();

  useEffect(() => {
    if (user) {
      setInputs({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: "",
      });
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updating || !user) return;
    setUpdating(true);

    try {
      const formData = new FormData();

      // Append all text fields
      Object.entries(inputs).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append image file if exists
      if (imgUrl && fileRef.current?.files?.[0]) {
        formData.append('profilePic', fileRef.current.files[0]);
      }

      const res = await fetch(`/api/v1/users/update/${user._id}`, {
        method: "PUT",
        body: formData, // No Content-Type header needed for FormData
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Update failed");
      }

      // Handle success
      setUser(data.data);
      toaster.create({
        title: "Success",
        description: "Profile updated successfully",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Failed to load user profile. Please check your connection.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          gap={4}
          w={"full"}
          maxW={"md"}
          bg={"white"}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>

          <Field.Root id='userName'>
            <Stack direction={["column", "row"]} gap={6}>
              <Center>
                <Avatar.Root
                  size='xl'
                  boxShadow={"md"}
                >
                  <Avatar.Fallback name="user image" />
                  <Avatar.Image src={imgUrl || user?.profilePic || '/default-pp.jpg'} />
                </Avatar.Root>
              </Center>

              <Center w='full'>
                <Button
                  w='full'
                  onClick={() => fileRef.current?.click()}
                >
                  Change Avatar
                </Button>
                <Input
                  type='file'
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                  accept="image/*" />
              </Center>
            </Stack>
          </Field.Root>

          <Field.Root>
            <Field.Label>Full name</Field.Label>
            <Input
              placeholder='John Doe'
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type='text'
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>User name</Field.Label>
            <Input
              placeholder='johndoe'
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type='text'
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Email address</Field.Label>
            <Input
              placeholder='your-email@example.com'
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type='email'
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Bio</Field.Label>
            <Input
              placeholder='Your bio.'
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type='text'
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input
              placeholder='password'
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type='password'
            />
          </Field.Root>

          <Stack gap={4} direction={["column", "column-reverse"]} w="full">
            <Button
              bg={"red.400"}
              color={"white"}
              w='full'
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>

            <Button
              bg={"green.400"}
              color={"white"}
              w='full'
              _hover={{
                bg: "green.500",
              }}
              type='submit'
              loading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  )
}

export default UpdateProfilePage;