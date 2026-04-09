import { toneClass, type SummaryItem } from "../../lib/content";

interface TocItem {
  id: string;
  label: string;
}

interface RelatedLink {
  href: string;
  label: string;
}

interface Props {
  locale: string;
  backHref: string;
  backLabel: string;
  eyebrow?: string;
  title: string;
  description: string;
  titleClassName?: string;
  summaryItems?: SummaryItem[];
  toc?: TocItem[];
  tocTitle?: string;
  relatedLinks?: RelatedLink[];
  relatedTitle?: string;
  heroVariant?: "guide" | "editorial";
  children: React.ReactNode;
}

export function ArticleLayout({
  locale,
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  titleClassName,
  summaryItems = [],
  toc = [],
  tocTitle = "On this page",
  relatedLinks = [],
  relatedTitle = "Related",
  heroVariant = "guide",
  children,
}: Props) {
  const heroClasses =
    heroVariant === "editorial"
      ? "rounded-[2rem] border border-[var(--ach-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,245,238,0.94))] p-5 shadow-[var(--ach-shadow-lg)] md:p-8"
      : "rounded-[2rem] border border-[var(--ach-line)] bg-[var(--ach-surface)] p-5 shadow-[var(--ach-shadow-md)] md:p-8";

  return (
    <div className="ach-page">
      <div className="ach-page-shell ach-page-shell--wide space-y-6 md:space-y-8">
        <div className="flex items-center gap-4">
          <a href={backHref} className="ach-top-link shrink-0">
            &larr; {backLabel}
          </a>
        </div>

        <section className={heroClasses}>
          {eyebrow && (
            <p className="ach-eyebrow">
              {eyebrow}
            </p>
          )}
          <div className="mt-4 grid gap-4 md:gap-6 md:grid-cols-[minmax(0,1.28fr)_minmax(280px,0.92fr)] md:items-start">
            <div className="space-y-3">
              <h1
                className={`text-[2rem] leading-tight font-bold tracking-tight text-gray-900 md:text-[2.8rem] ${titleClassName ?? ""}`}
              >
                {title}
              </h1>
              <p className="text-sm leading-7 text-[var(--ach-text-muted)] md:text-[15px] md:leading-8">
                {description}
              </p>
            </div>

            {summaryItems.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {summaryItems.map((item) => (
                  <div
                    key={`${item.label}-${item.value}`}
                    className={`rounded-[1.35rem] border px-4 py-3 ${toneClass(item.tone)}`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xs font-medium leading-6 md:text-sm">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <article className="space-y-6">{children}</article>

          <aside className="space-y-4 lg:sticky lg:top-6">
            {toc.length > 0 && (
              <nav className="ach-panel p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ach-text-muted)]">
                  {tocTitle}
                </p>
                <ul className="mt-3 space-y-2">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm leading-6 text-[var(--ach-text-muted)] transition hover:text-gray-900"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {relatedLinks.length > 0 && (
              <div className="ach-panel p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ach-text-muted)]">
                  {relatedTitle}
                </p>
                <div className="mt-3 space-y-2">
                  {relatedLinks.map((link) => (
                    <a
                      key={link.href}
                      href={`/${locale}${link.href}`}
                      className="flex items-center justify-between rounded-[1rem] border border-[var(--ach-line)] bg-[var(--ach-surface-soft)] px-3 py-2 text-sm text-gray-700 transition hover:bg-white"
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
