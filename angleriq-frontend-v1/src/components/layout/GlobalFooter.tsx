const GlobalFooter = () => {
  return (
    <footer className="mt-6 border-t border-slate-800 pt-3 pb-4 text-[10px] text-slate-500">
      <div className="mx-auto w-full max-w-md space-y-1">
        <p className="text-[11px] text-slate-400">AnglerIQ · Powered by SAGE</p>
        <p className="text-[10px] text-slate-500">
          Environmental Understanding — Elevated and Interpreted.
        </p>
        <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-slate-500">
          <button className="underline-offset-2 hover:underline">Help</button>
          <button className="underline-offset-2 hover:underline">Terms</button>
          <button className="underline-offset-2 hover:underline">
            Privacy
          </button>
          <button className="underline-offset-2 hover:underline">
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
