"use client";

import { signUpSchema, SignUpValues } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import PasswordInput from "@/components/ui/password-input";
import { useState, useTransition } from "react";
import { signUp } from "./actions";

const SignUpForm = () => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = (values: SignUpValues) => {
    setError("");

    startTransition(async () => {
      const { error } = await signUp(values);
      if (error) setError(error);
    });
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-2.5 py-6"
      >
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="bg-card"
                  {...field}
                  placeholder="Enter your username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="bg-card"
                  type="email"
                  {...field}
                  placeholder="Enter your email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  className="bg-card"
                  placeholder="Enter your password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-3">
          <LoadingButton
            type="submit"
            className="w-full"
            isLoading={isPending || isSubmitting}
          >
            {isPending || isSubmitting ? "Signing up... " : "Sign up"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
