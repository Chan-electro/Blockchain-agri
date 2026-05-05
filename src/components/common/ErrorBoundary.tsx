import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Dev aid only — production should route this to a logging service.
    if (import.meta.env.DEV) console.error("Route error:", error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="rounded-full bg-destructive/10 p-3 text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="max-w-md text-sm text-muted-foreground">{this.state.error.message}</p>
          </div>
          <Button onClick={this.reset} variant="outline">Try again</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
