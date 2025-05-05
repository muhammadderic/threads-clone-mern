import { Box, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useAtomValue } from "jotai";
import { userAtom } from "./atoms/userAtom";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import UserPage from "./pages/UserPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";

function App() {
  const { pathname } = useLocation();
  const user = useAtomValue(userAtom);

  return (
    <Box position={"relative"} w='full'>
      <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
        <Header />

        <Routes>
          <Route path='/' element={user ? <HomePage /> : <Navigate to='/auth' />} />
          <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
          <Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />

          <Route
            path='/:username'
            element={
              user ? (
                <>
                  <UserPage />
                </>
              ) : (
                <UserPage />
              )
            }
          />
        </Routes>

        <Toaster />
      </Container>
    </Box>
  )
}

export default App
