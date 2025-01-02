import { Link } from "react-router-dom";
import Navigation from "./navigation";
import Header from "./header";
import grvlLogo from "../../assets/grvl-logo-rmbg.png";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen">
      <div className="hidden md:block fixed inset-y-0 w-60 bg-muted/40">
        <div className="flex h-full flex-col bg-[#27534c]">
          <div className="flex h-14 items-center bg-white border-b border-r px-4 lg:h-[60px] lg:px-6">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <img src={grvlLogo} className="h-8 w-12" />
              <span className="text-[#1a3733]">Manager</span>
            </Link>
          </div>
          <div className="mt-2">
            <Navigation />
          </div>
        </div>
      </div>

      <div className="flex-1 ml-0 md:ml-60">
        <Header />
        <main className="mt-14 lg:mt-[60px] overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
