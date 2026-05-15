import { Nav } from "@/components/Landing/Nav";
import { Hero } from "@/components/Landing/Hero";
import { About } from "@/components/Landing/About";
import { Certifications } from "@/components/Landing/Certifications";
import { Experience } from "@/components/Landing/Experience";
import { Tools } from "@/components/Landing/Tools";
import { Projects } from "@/components/Landing/Projects";
import { Contact } from "@/components/Landing/Contact";
import { Footer } from "@/components/Landing/Footer";

export function Landing() {
  return (
    <div className="relative min-h-screen bg-[#161824] font-body text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 18% -8%, rgba(255,85,85,0.05), transparent 60%)",
        }}
      />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <About />
          <Certifications />
          <Experience />
          <Tools />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
