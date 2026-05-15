export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-9 flex flex-col gap-2.5">
      <div aria-hidden className="h-px w-7 bg-red/60" />
      <h2 className="font-serif text-[32px] font-extralight tracking-[-0.02em] text-foreground">
        {title}
      </h2>
    </div>
  );
}
