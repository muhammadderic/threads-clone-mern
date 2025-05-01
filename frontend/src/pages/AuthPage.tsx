import { authScreenAtom } from "@/atoms/authAtom";
import SignupCard from "@/components/LoginCard";
import LoginCard from "@/components/LoginCard";
import { useAtomValue } from "jotai";

const AuthPage = () => {
  const authScreenState = useAtomValue(authScreenAtom);

  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
}

export default AuthPage;