import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Scan } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="text-6xl font-bold text-primary">404</div>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you're looking for doesn't exist. It may have moved or never existed.
      </p>
      <div className="mt-2 flex gap-2">
        <Button asChild variant="default"><Link to="/"><Home className="mr-2 size-4" /> Home</Link></Button>
        <Button asChild variant="outline"><Link to="/scan"><Scan className="mr-2 size-4" /> Scan a batch</Link></Button>
      </div>
    </div>
  );
}
