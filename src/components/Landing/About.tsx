import { SectionHeading } from "@/components/Landing/SectionHeading";

export function About() {
  return (
    <section id="about" className="border-t border-white/[0.09]">
      <div className="mx-auto max-w-[680px] px-6 py-[60px] sm:px-8">
        <SectionHeading title="About Me" />
        <div className="space-y-[18px] text-[16px] font-light leading-[1.8] text-foreground/75">
          <p>
            Technology has been a part of my life for as long as I can remember. 
            I have always been one to tinker and break things accidentally while
            trying to figure out how something works. I decided to explore an alternative
            path in university, where I ended up studying Psychology with an emphasis
            on Neuroscience. 
          </p>
          <p>
            After my education, I wanted to take a step back and rethink a career in tech.
            Moving from healthcare IT to a startup SaaS taught me lots about real workflows, from the basics
            like user provisioning to more advanced topics like cloud architecture.
            Going forward, I have my eyes set on moving up the stack, from primarily customer
            facing roles to the ones managing and building infrastructure.
          </p>
        </div>
      </div>
    </section>
  );
}
