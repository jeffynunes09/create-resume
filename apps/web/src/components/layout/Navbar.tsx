import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { ROUTES_PATH } from "@create-resume/routes";
import { FileText, LogOut, User } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES_PATH.LOGIN);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to={ROUTES_PATH.DASHBOARD}
              className="flex items-center gap-2 font-bold text-lg"
            >
              <FileText className="h-5 w-5" />
              Create Resume
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link
                to={ROUTES_PATH.DASHBOARD}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to={ROUTES_PATH.RESUME_CREATE}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Novo Currículo
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {user?.email}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
