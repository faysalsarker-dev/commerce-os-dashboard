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
    <Card className="w-full max-w-md border border-border/60 bg-card/80 shadow-elevated backdrop-blur-sm">
      <CardContent className="p-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Sign in to Northbay
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter your credentials to access the dashboard.
          </p>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="admin@northbay.com"
                          autoComplete="email"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="password"
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                type="submit"
                className="w-full h-10"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                )}
                Sign in
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="text-center text-xs text-muted-foreground"
            >
              Demo credentials: admin@northbay.com / password123
            </motion.p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
