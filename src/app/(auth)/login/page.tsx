import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import LoginImage from "@/../public/login-image.jpg";
import LoginForm from "./LoginForm";
import GoogleSignInButton from "./google/GoogleSignInButton";

export const metadata: Metadata = {
  title: "SignIn",
};

const LoginPage = () => {
  return (
    <main className="container flex min-h-svh items-center justify-center">
      <div className="my-8 flex h-[550px] max-w-4xl grow items-center overflow-hidden rounded-xl bg-card shadow-2xl">
        <div className="mx-auto max-w-xl basis-full overflow-y-auto px-3 py-8 md:basis-1/2 md:px-8">
          <h1 className="mb-4 text-center text-2xl font-bold">
            Login to <strong className="text-primary">Bugbook</strong>
          </h1>

          <div className="space-y-4">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <p className="text-center text-sm text-muted-foreground">
              Don{"'"}t have an account?{" "}
              <Link
                className="text-primary underline hover:no-underline"
                href="/signup"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden shrink-0 basis-1/2 self-stretch shadow-lg md:block">
          <Image
            src={LoginImage}
            alt="signup"
            fill
            placeholder="blur"
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
