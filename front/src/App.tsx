import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Menu, PenLine } from "lucide-react";
import { Toaster } from "sonner";
import AppSidebar, { Wordmark } from "./components/AppSidebar";
import { Button } from "./components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
import { AuthProvider, useAuth } from "./provider/AuthProvider";

function Shell() {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (!isLoggedIn && !isAuthPage) return <Navigate to="/login" replace />;
  if (isAuthPage) return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r lg:block">
        <AppSidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur lg:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigation, the hubs and people you follow, and your account.
              </SheetDescription>
              <AppSidebar />
            </SheetContent>
          </Sheet>
          <Wordmark />
          <Button asChild size="sm" className="ml-auto">
            <Link to="/create-post">
              <PenLine />
              Post
            </Link>
          </Button>
        </header>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Shell />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
            fontFamily: "inherit",
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
