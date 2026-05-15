import {
  GitHubIcon,
  LinkedInIcon,
  ResumeIcon,
} from "@/components/Landing/icons";

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto max-w-[680px] px-6 pb-[76px] pt-20 sm:px-8 sm:pt-28"
    >
      <h1 className="font-serif text-[44px] font-extralight leading-[0.98] tracking-[-0.025em] text-foreground sm:text-[58px]">
        Ryan Berke<span className="text-red">.</span>
      </h1>
      <div className="mt-[26px] flex items-center gap-5">
        <a
          href="https://github.com/3urkii"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="relative inline-flex text-foreground/55 transition-colors before:absolute before:-inset-2.5 before:content-[''] hover:text-red"
        >
          <GitHubIcon className="h-[18px] w-[18px]" />
        </a>
        <a
          href="https://www.linkedin.com/in/ryan-berke/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="relative inline-flex text-foreground/55 transition-colors before:absolute before:-inset-2.5 before:content-[''] hover:text-red"
        >
          <LinkedInIcon className="h-[18px] w-[18px]" />
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View résumé"
          className="relative inline-flex text-foreground/55 transition-colors before:absolute before:-inset-2.5 before:content-[''] hover:text-red"
        >
          <ResumeIcon className="h-[18px] w-[18px]" />
        </a>
      </div>
    </section>
  );
}
