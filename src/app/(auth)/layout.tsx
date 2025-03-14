import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

const AuthLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return <>{children}</>;
};

export default AuthLayout;
