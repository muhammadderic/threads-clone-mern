import SignupCard from "@/components/LoginCard";
import LoginCard from "@/components/LoginCard";

const AuthPage = () => {
  const authScreenState = "login";

  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
}

export default AuthPage;