import TwixtCard from "@/components/cards/TwixtCard";
import { fetchTwixtById } from "@/lib/actions/twixt.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  if (!userInfo.onboarded) redirect("/onboarding");

  const twixt = await fetchTwixtById(params.id);
  return (
    <section className="relative">
      <div>
        <TwixtCard
          key={twixt._id}
          id={twixt._id}
          currentUserId={user?.id || ""}
          parentId={twixt.parentId}
          content={twixt.text}
          author={twixt.author}
          community={twixt.community}
          createdAt={twixt.createdAt}
          comments={twixt.children}
        />
      </div>
    </section>
  );
};
export default Page;
