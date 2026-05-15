export function Footer() {
  return (
    <footer className="border-t border-white/[0.09]">
      <div className="mx-auto flex max-w-[680px] flex-wrap items-center justify-between gap-3 px-6 pb-14 pt-8 text-[11.5px] font-light text-foreground/40 sm:px-8">
        <span>Ryan Berke · Tampa, FL</span>
        <div className="flex gap-5">
          <a
            href="/desktop/"
            className="text-foreground/50 transition-colors hover:text-foreground"
          >
            /desktop
          </a>
          <a
            href="https://github.com/3urkii/myportfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/50 transition-colors hover:text-foreground"
          >
            Source
          </a>
        </div>
      </div>
    </footer>
  );
}
