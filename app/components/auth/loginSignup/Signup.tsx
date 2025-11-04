import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import zod from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/passwordInput";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@radix-ui/themes";

import { signupUser } from "./signupUser";

export const Signup = ({ groupName }: { groupName?: "user" | "admin" }) => {
  const formDataSchema = zod
    .object({
      username: zod.string().min(1, "Username is required"),
      firstName: zod.string().min(1, "First name is required"),
      lastName: zod.string().min(1, "Last name is required"),
      password: zod.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: zod
        .string()
        .min(8, "Password must be at least 8 characters"),
      email: zod.string().email("Invalid email address"),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "Passwords do not match",
        });
      }
    });

  const form = useForm({
    resolver: zodResolver(formDataSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          try {
            const result = await signupUser({
              username: data.username,
              password: data.password,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              groupName,
            });
            console.log("User signed up successfully:", result);
          } catch (error) {
            console.error("Error signing up user:", error);
          }
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="First name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Last name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" {...field} placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 w-full justify-around items-center mt-4">
          <div className="flex flex-row gap-2 items-center h-[1px] w-[35%] bg-gray-300" />
          <span>Login Details</span>
          <div className="flex flex-row gap-2 items-center h-[1px] w-[35%] bg-gray-300" />
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput {...field} placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="Confirm Password"
                  onChange={(e) => {
                    // Use debounce to avoid immediate validation
                    debounce(() => {
                      // Validate the confirm password field

                      if (
                        e.target.value !== form.getValues("password") &&
                        e.target.value.length > 0
                      ) {
                        form.setError("confirmPassword", {
                          type: "manual",
                          message: "Passwords do not match",
                        });
                      } else {
                        form.clearErrors("confirmPassword");
                      }
                    }, 600)();

                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant={"solid"}
          disabled={!form.formState.isValid}
        >
          Sign Up
        </Button>
      </form>

      <FormMessage />
    </Form>
  );
};
