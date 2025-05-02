import { authScreenAtom } from "@/atoms/authAtom";
import LoginCard from "@/components/LoginCard";
import SignupCard from "@/components/SignupCard";
import { useAtomValue } from "jotai";

const AuthPage = () => {
  const authScreenState = useAtomValue(authScreenAtom);

  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
}

export default AuthPage;