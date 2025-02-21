import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Header from "@/components/Header";
import MenuBar from "./MenuBar";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-svh flex-col">
        <Header />

        <div className="container relative flex grow gap-5 pb-16 pt-8">
          <MenuBar className="sticky top-20 hidden h-fit shrink-0 flex-col space-y-2 rounded-2xl bg-card px-3 py-5 shadow-sm sm:flex lg:p-5 xl:w-56" />
          {children}
        </div>

        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 shadow-sm sm:hidden" />
      </div>
    </SessionProvider>
  );
};

export default Layout;
