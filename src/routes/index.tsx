import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SpaceBackground } from "@/components/SpaceBackground";
import { PLANETS } from "@/components/planets";
import { scrollState } from "@/components/scroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shwetank — AI & ML Student Portfolio in 3D" },
      {
        name: "description",
        content:
          "Scroll through a 3D solar system to explore Shwetank's work: math for ML, machine learning basics, data handling with Python, and core CS.",
      },
      { property: "og:title", content: "Shwetank — AI & ML Student Portfolio in 3D" },
      {
        property: "og:description",
        content:
          "A scroll-driven 3D solar system portfolio by Shwetank, 1st year B.Tech student in AI & Machine Learning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      scrollState.progress = p;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setProgress(p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return progress;
}

function Section({
  index,
  align,
  children,
}: {
  index: number;
  align: "left" | "right";
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry && setVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const planet = PLANETS[index]!;

  return (
    <section
      id={planet.id}
      className="flex min-h-screen items-center px-6 py-24 md:px-16"
      aria-labelledby={`${planet.id}-heading`}
    >
      <div
        ref={ref}
        className={[
          "w-full max-w-xl transition-all duration-700",
          align === "right" ? "ml-auto" : "mr-auto",
          visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-sm",
        ].join(" ")}
      >
        <div className="panel p-7 md:p-9">
          <p className="chip mb-4">
            {String(index).padStart(2, "0")} · {planet.name}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}

const CURRENT = [
  {
    index: 2,
    title: "Math for ML",
    body: "Linear algebra, matrix operations, multivariate calculus, and probability — the language every model is written in.",
    items: ["Linear algebra", "Matrix operations", "Multivariate calculus", "Probability"],
  },
  {
    index: 3,
    title: "Machine Learning Basics",
    body: "Supervised learning from the ground up: how the loss moves, how the weights follow.",
    items: ["Supervised learning", "Gradient descent", "Linear & logistic regression", "scikit-learn"],
  },
  {
    index: 4,
    title: "Data Handling",
    body: "Cleaning, reshaping and visualizing data before any model gets to see it.",
    items: ["Data cleaning", "Visualization", "NumPy", "Pandas", "Matplotlib"],
  },
  {
    index: 5,
    title: "Core CS",
    body: "Data structures and algorithms, written close to the metal and then again in Python.",
    items: ["Data structures", "Algorithms", "C / C++", "Python"],
  },
];

function Index() {
  const progress = useScrollProgress();

  return (
    <>
      <SpaceBackground />

      <div className="pointer-events-none fixed left-0 right-0 top-0 z-20 h-[2px] bg-border">
        <div
          className="h-full bg-primary transition-[width] duration-150"
          style={{ width: `${progress * 100}%`, boxShadow: "var(--glow-primary)" }}
        />
      </div>

      <nav className="fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {PLANETS.map((p, i) => {
          const active = Math.round(progress * (PLANETS.length - 1)) === i;
          return (
            <a
              key={p.id}
              href={`#${p.id}`}
              title={p.name}
              aria-label={p.name}
              className={[
                "h-2.5 w-2.5 rounded-full border transition-all",
                active
                  ? "scale-150 border-primary bg-primary"
                  : "border-muted-foreground/50 bg-transparent hover:bg-muted-foreground/50",
              ].join(" ")}
            />
          );
        })}
      </nav>

      <main className="relative z-10">
        {/* Hero / Sun */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="rise panel max-w-2xl p-8 md:p-12">
            <p className="chip mb-5">1st year B.Tech · AI & Machine Learning</p>
            <h1 className="text-glow font-sans text-6xl font-bold tracking-tight md:text-8xl">
              Shwetank
            </h1>
            <p className="mt-5 text-base text-muted-foreground md:text-lg">
              A first-year B.Tech student learning computer science fundamentals, practicing
              programming, and figuring out how machine learning models work under the hood.
            </p>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              scroll to travel ↓
            </p>
          </div>
        </section>

        <Section index={1} align="left">
          <h2 id="about-heading" className="text-3xl font-semibold md:text-4xl">
            About
          </h2>
          <p className="mt-4 text-muted-foreground">
            I&apos;m spending my time on computer science fundamentals, day-to-day programming
            practice, and understanding the machinery behind machine learning models.
          </p>
          <p className="mt-4 text-muted-foreground">
            Right now the focus is strengthening my math background — calculus, linear algebra and
            probability — and writing clean Python for data analysis and basic ML algorithms.
          </p>
        </Section>

        {CURRENT.map((s, n) => (
          <Section key={s.index} index={s.index} align={n % 2 === 0 ? "right" : "left"}>
            <h2 id={`${PLANETS[s.index]!.id}-heading`} className="text-3xl font-semibold md:text-4xl">
              {s.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{s.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {s.items.map((it) => (
                <li key={it} className="chip">
                  {it}
                </li>
              ))}
            </ul>
          </Section>
        ))}

        <Section index={6} align="right">
          <h2 id="skills-heading" className="text-3xl font-semibold md:text-4xl">
            Skills &amp; Tools
          </h2>
          <dl className="mt-6 space-y-5">
            {[
              {
                k: "Languages",
                v: ["Python", "C", "C++", "Julia", "JavaScript", "Bash", "SQL (basic)", "HTML"],
              },
              { k: "Libraries", v: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn", "React"] },
              { k: "Tools", v: ["Git", "GitHub", "VS Code", "Jupyter Notebook", "Linux"] },
            ].map((row) => (
              <div key={row.k}>
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  {row.k}
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {row.v.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section index={7} align="left">
          <h2 id="contact-heading" className="text-3xl font-semibold md:text-4xl">
            Contact &amp; Links
          </h2>
          <p className="mt-4 text-muted-foreground">
            Always up for talking about ML, math, or messy datasets.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="mailto:shwetanks860@gmail.com"
              className="group flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-5 py-4 transition-colors hover:border-primary"
            >
              <span className="font-mono text-sm">shwetanks860@gmail.com</span>
              <span className="text-muted-foreground transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="https://github.com/ILikeCheeseYums"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-5 py-4 transition-colors hover:border-primary"
            >
              <span className="font-mono text-sm">github.com/ILikeCheeseYums</span>
              <span className="text-muted-foreground transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
          <p className="mt-8 font-mono text-xs text-muted-foreground">Shwetank · 2026</p>
        </Section>
      </main>
    </>
  );
}
