import UserHeader from "@/components/UserHeader";

const UserPage = () => {
  const user = {
    _id: "12345",
    username: "deric"
  }

  return (
    <>
      <UserHeader user={user} />
    </>
  )
}

export default UserPage;