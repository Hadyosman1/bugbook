import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import signupImage from "@/../public/signup-image.jpg";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "SignUp",
};

const SignUpPage = () => {
  return (
    <main className="container flex min-h-svh items-center justify-center">
      <div className="my-8 flex h-[550px] max-w-4xl grow items-center overflow-hidden rounded-xl bg-card shadow-2xl">
        <div className="mx-auto max-w-xl basis-full overflow-y-auto px-3 py-8 md:basis-1/2 md:px-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">
              Sign up to <strong className="text-primary">Bugbook</strong>
            </h1>
            <p className="text-muted-foreground">
              The place where even <span className="italic">you</span> can find
              a friend.
            </p>
          </div>
          <div className="space-y-4">
            <SignUpForm />
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                className="text-primary underline hover:no-underline"
                href="/login"
              >
                login
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden shrink-0 basis-1/2 self-stretch shadow-lg md:block">
          <Image
            src={signupImage}
            alt="signup"
            fill
            placeholder="blur"
            className="object-cover object-right"
          />
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
