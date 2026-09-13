const steps = [
  { n: '01', title: 'Browse by category', body: 'Find products across technology, home, fitness, and more.' },
  { n: '02', title: 'Read honest ratings', body: 'See clear scores and useful experiences from real owners.' },
  { n: '03', title: 'Share your review', body: 'Help someone else decide by adding your own perspective.' },
];

export function HowItWorks() {
  return (
    <section className="bg-base-200">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-neutral">
          A clearer way to choose
        </h2>
        <p className="mt-3 text-lg text-secondary">
          Useful opinions, easy comparisons, and room for your own experience.
        </p>
        <div className="mt-12 grid overflow-hidden rounded-2xl border border-base-300 bg-base-100 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.n} className={`p-8 ${i < steps.length - 1 ? 'md:border-r border-base-300' : ''}`}>
              <span className="font-[family-name:var(--font-heading)] font-bold text-primary">{step.n}</span>
              <h3 className="mt-3 font-[family-name:var(--font-heading)] text-xl font-bold text-neutral">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-secondary">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}