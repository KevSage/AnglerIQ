import type { ReactNode } from "react";
import GlobalHeader from "./GlobalHeader";

type ScreenContainerProps = {
  children: ReactNode;
};

const ScreenContainer = ({ children }: ScreenContainerProps) => {
  return (
    <div className="min-h-screen bg-black text-slate-100">
      {/* Global top bar */}
      <GlobalHeader />

      {/* Screen content */}
      <div className="px-4 py-4">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default ScreenContainer;
