import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Error 404
          </span>

          <h1 className="text-3xl font-semibold tracking-tight">
            Page not found
          </h1>

          <p className="text-sm leading-6 text-muted-foreground">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <Button
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
      </div>
    </main>
  );
}