import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";



import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginSchema } from "@/types/validations/auth/auth";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import type { ApiError } from "@/types/shared";

export function LoginCard() {
  const [login, { isLoading}] = useLoginMutation();
  const navigate = useNavigate();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting || isLoading;

async function onSubmit(values: LoginSchema) {
  try {
    const res = await login(values).unwrap();

    toast.success("Login successful");

    navigate("/"); 

    console.log(res);
  } catch (err) {

    const error = err as ApiError;
    toast.error(
      error?.data?.message || "Invalid email or password"
    );
  }
}

  return (
    <Card className="w-full max-w-md border-border/60 shadow-sm">
      <CardContent className="space-y-6 p-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in
          </h1>

          <p className="text-muted-foreground text-sm">
            Enter your credentials to access the dashboard.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="admin@example.com"
                      autoComplete="email"
                      {...field}
                    />
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
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              )}

              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}