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
  summaryItems?: SummaryItem[];
  toc?: TocItem[];
  tocTitle?: string;
  relatedLinks?: RelatedLink[];
  relatedTitle?: string;
  children: React.ReactNode;
}

export function ArticleLayout({
  locale,
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  summaryItems = [],
  toc = [],
  tocTitle = "On this page",
  relatedLinks = [],
  relatedTitle = "Related",
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <a
            href={backHref}
            className="text-gray-400 hover:text-gray-600 text-sm shrink-0"
          >
            &larr; {backLabel}
          </a>
        </div>

        <section className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-600">
              {eyebrow}
            </p>
          )}
          <div className="mt-3 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                {title}
              </h1>
              <p className="text-base md:text-lg leading-7 text-gray-600">
                {description}
              </p>
            </div>

            {summaryItems.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {summaryItems.map((item) => (
                  <div
                    key={`${item.label}-${item.value}`}
                    className={`rounded-2xl border px-4 py-3 ${toneClass(item.tone)}`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-6">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <article className="space-y-6">{children}</article>

          <aside className="space-y-4 lg:sticky lg:top-6">
            {toc.length > 0 && (
              <nav className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {tocTitle}
                </p>
                <ul className="mt-3 space-y-2">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {relatedLinks.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {relatedTitle}
                </p>
                <div className="mt-3 space-y-2">
                  {relatedLinks.map((link) => (
                    <a
                      key={link.href}
                      href={`/${locale}${link.href}`}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
