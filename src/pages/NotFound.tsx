import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "#0d0f12" }}>
      <div className="text-center">
        <h1 className="text-[120px] font-extralight tracking-tight text-foreground/10 leading-none">404</h1>
        <p className="mt-4 text-[18px] font-light text-muted-foreground">Страница не найдена</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium transition-colors hover:opacity-80"
          style={{ color: "#b8860b" }}
        >
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
