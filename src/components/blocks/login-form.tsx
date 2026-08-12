import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail, Lock } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { loginSchema, type LoginSchema } from "@/types/validations/auth/auth";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import type { ApiError } from "@/types/shared";



export function LoginCard() {
  const [login, { isLoading }] = useLoginMutation();
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
      await login(values).unwrap();

      toast.success("Login successful");

      navigate("/app/products");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error?.data?.message || "Invalid email or password");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-100 sm:min-w-100 md:min-w-112.5"
    >
      <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
        <CardContent className="p-7 sm:p-8">
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-4 grid size-18 shrink-0 place-items-center rounded-xl border border-border/60 bg-background">
              <img src="/commerce-os.png" alt="Northbay" className="size-14 rounded-xl object-contain" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
            CommerceOS
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="email"
                          autoComplete="email"
                          className="h-11 rounded-xl bg-muted/40 pl-9 shadow-none transition-colors focus-visible:bg-background"
                          {...field}
                        />
                      </div>
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
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="password"
                          autoComplete="current-password"
                          placeholder="password"
                          className="h-11 rounded-xl bg-muted/40 pl-9 shadow-none transition-colors focus-visible:bg-background"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" className="rounded-[5px]" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none text-muted-foreground"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl text-sm font-semibold shadow-sm transition-colors hover:bg-primary/90"
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
    </motion.div>
  );
}
