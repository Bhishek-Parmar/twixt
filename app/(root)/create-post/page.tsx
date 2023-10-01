import PostTwixt from "@/components/forms/PostTwixt";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");
  //   console.log(userInfo.id);
  return (
    <>
      <h1 className="head-text">Create post</h1>;
      <PostTwixt userId={userInfo._id} />
    </>
  );
}
export default Page;
