import { SectionHeading } from "@/components/Landing/SectionHeading";
import { ContactForm } from "@/components/Landing/ContactForm";
import {
  GitHubIcon,
  LinkedInIcon,
  ResumeIcon,
} from "@/components/Landing/icons";

export function Contact() {
  return (
    <section id="contact" className="border-t border-white/[0.09]">
      <div className="mx-auto max-w-[680px] px-6 py-[60px] sm:px-8">
        <SectionHeading title="Contact" />
        <div className="-mt-5 mb-9 flex items-center gap-5">
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
        <ContactForm />
      </div>
    </section>
  );
}
