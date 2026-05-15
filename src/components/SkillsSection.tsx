"use client";

type Tier = 1 | 2 | 3;

type Skill = {
  name: string;
  tier: Tier;
};

const skillGroups: { category: string; skills: Skill[] }[] = [
  {
    category: "Identity & Endpoint",
    skills: [
      { name: "Active Directory", tier: 3 },
      { name: "Microsoft Intune", tier: 3 },
      { name: "NinjaRMM", tier: 3 },
      { name: "Defender for Endpoint", tier: 2 },
      { name: "Group Policy", tier: 2 },
    ],
  },
  {
    category: "Systems & Cloud",
    skills: [
      { name: "Linux administration", tier: 3 },
      { name: "Bash scripting", tier: 2 },
      { name: "Git / GitHub Actions", tier: 2 },
      { name: "AWS (S3, CloudFront, IAM)", tier: 1 },
      { name: "Python", tier: 1 },
    ],
  },
];

const learning = ["AWS SAA", "Terraform", "Kubernetes", "Docker", "Snowflake"];

const tierLabel: Record<Tier, string> = {
  3: "Daily driver",
  2: "Comfortable",
  1: "Learning",
};

function TierDots({ tier }: { tier: Tier }) {
  return (
    <span
      className="flex items-center gap-0.5"
      aria-label={tierLabel[tier]}
      title={tierLabel[tier]}
    >
      {[1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={`h-1.5 w-1.5 rounded-full ${
            dot <= tier ? "bg-purple" : "bg-white/12"
          }`}
        />
      ))}
    </span>
  );
}

export function SkillsSection() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        {skillGroups.map(({ category, skills }) => (
          <div
            key={category}
            className="rounded-xl border border-white/8 bg-white/[0.03] p-4"
          >
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
              {category}
            </p>
            <ul className="mt-3 space-y-2.5">
              {skills.map((skill) => (
                <li
                  key={skill.name}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-foreground/90">
                    {skill.name}
                  </span>
                  <TierDots tier={skill.tier} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
            Currently learning
          </p>
          <span className="h-px flex-1 bg-white/8" />
        </div>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {learning.map((item) => (
            <li
              key={item}
              className="rounded-md border border-purple-border bg-purple-soft px-2.5 py-1 text-xs text-purple"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3 text-[0.65rem] text-muted">
        <div className="flex items-center gap-1.5">
          <TierDots tier={3} />
          <span>Daily driver</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TierDots tier={2} />
          <span>Comfortable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TierDots tier={1} />
          <span>Learning</span>
        </div>
      </div>
    </div>
  );
}
