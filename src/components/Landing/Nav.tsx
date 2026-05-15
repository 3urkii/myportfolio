export function Nav() {
  return (
    <header className="sticky top-0 z-20 bg-[#161824]/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-[680px] items-baseline justify-between px-6 py-[18px] sm:px-8">
        <a
          href="#top"
          className="font-serif text-[15px] font-light tracking-[-0.01em] text-foreground"
        >
          ryan berke<span className="text-red">.</span>
        </a>
        <a
          href="#contact"
          className="text-[12.5px] font-light text-foreground/55 transition-colors hover:text-foreground"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
