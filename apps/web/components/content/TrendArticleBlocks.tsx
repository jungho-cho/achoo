import { slugify, toneClass } from "../../lib/content";
import type {
  ArticleBlock,
  ArticleChartBlock,
  ArticleChecklistBlock,
  ArticleComparisonBlock,
  ArticleLocalization,
  ArticleQuoteBlock,
  ArticleSectionBlock,
  ArticleTableBlock,
  ArticleTimelineBlock,
} from "../../content/articles/schema";

function blockId(block: ArticleBlock) {
  return `${block.id}-${slugify(block.heading)}`;
}

function SectionBlock({ block }: { block: ArticleSectionBlock }) {
  return (
    <section
      id={blockId(block)}
      className={`trend-card trend-rise rounded-[2rem] border p-6 shadow-sm ${toneClass(block.tone)}`}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {block.heading}
        </h2>
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-7 text-gray-700">
            {paragraph}
          </p>
        ))}
        {block.bullets && block.bullets.length > 0 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {block.bullets.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-gray-700"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ChecklistBlock({ block }: { block: ArticleChecklistBlock }) {
  return (
    <section
      id={blockId(block)}
      className="trend-card trend-rise rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        {block.heading}
      </h2>
      {block.intro && (
        <p className="mt-3 text-sm leading-7 text-gray-600">{block.intro}</p>
      )}
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {block.items.map((item, index) => (
          <div
            key={item}
            className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white px-4 py-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
              Step {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-sm leading-7 text-gray-700">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComparisonBlock({ block }: { block: ArticleComparisonBlock }) {
  return (
    <section
      id={blockId(block)}
      className="trend-card trend-rise rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        {block.heading}
      </h2>
      {block.intro && (
        <p className="mt-3 text-sm leading-7 text-gray-600">{block.intro}</p>
      )}
      <div className="mt-5 overflow-hidden rounded-3xl border border-gray-100">
        <div className="grid grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)] bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <div className="px-4 py-3" />
          <div className="border-l border-gray-100 px-4 py-3">
            {block.leftTitle}
          </div>
          <div className="border-l border-gray-100 px-4 py-3">
            {block.rightTitle}
          </div>
        </div>
        {block.rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)] border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-4 text-sm font-semibold text-gray-900">
              {row.label}
            </div>
            <div className="border-l border-gray-100 px-4 py-4 text-sm leading-7 text-gray-700">
              {row.left}
            </div>
            <div className="border-l border-gray-100 px-4 py-4 text-sm leading-7 text-gray-700">
              {row.right}
            </div>
          </div>
        ))}
      </div>
      {block.footnote && (
        <p className="mt-3 text-xs leading-6 text-gray-500">{block.footnote}</p>
      )}
    </section>
  );
}

function TableBlock({ block }: { block: ArticleTableBlock }) {
  return (
    <section
      id={blockId(block)}
      className="trend-card trend-rise rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        {block.heading}
      </h2>
      {block.intro && (
        <p className="mt-3 text-sm leading-7 text-gray-600">{block.intro}</p>
      )}
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full overflow-hidden rounded-3xl border border-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {block.columns.map((column) => (
                <th
                  key={column}
                  className="border-b border-gray-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, index) => (
              <tr
                key={`${row.cells.join("-")}-${index}`}
                className={row.tone ? toneClass(row.tone) : "bg-white"}
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`${cell}-${cellIndex}`}
                    className="border-b border-gray-100 px-4 py-4 text-sm leading-7 text-gray-700 last:border-r-0"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.footnote && (
        <p className="mt-3 text-xs leading-6 text-gray-500">{block.footnote}</p>
      )}
    </section>
  );
}

function ChartBlock({ block }: { block: ArticleChartBlock }) {
  return (
    <section
      id={blockId(block)}
      className="trend-card trend-rise rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        {block.heading}
      </h2>
      {block.intro && (
        <p className="mt-3 text-sm leading-7 text-gray-600">{block.intro}</p>
      )}
      <div className="mt-5 space-y-4">
        {block.bars.map((bar) => {
          const width = Math.max(18, Math.min(100, (bar.value / 5) * 100));
          return (
            <div key={bar.label} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">
                  {bar.label}
                </p>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  {block.scaleLabel}
                </p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${bar.tone === "amber" ? "bg-amber-400" : bar.tone === "blue" ? "bg-blue-500" : bar.tone === "rose" ? "bg-rose-500" : bar.tone === "gray" ? "bg-gray-400" : "bg-green-500"}`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <p className="text-sm leading-7 text-gray-600">{bar.detail}</p>
            </div>
          );
        })}
      </div>
      {block.footnote && (
        <p className="mt-4 text-xs leading-6 text-gray-500">{block.footnote}</p>
      )}
    </section>
  );
}

function TimelineBlock({ block }: { block: ArticleTimelineBlock }) {
  return (
    <section
      id={blockId(block)}
      className="trend-card trend-rise rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        {block.heading}
      </h2>
      {block.intro && (
        <p className="mt-3 text-sm leading-7 text-gray-600">{block.intro}</p>
      )}
      <div className="mt-5 space-y-4">
        {block.items.map((item) => (
          <div
            key={`${item.label}-${item.title}`}
            className="grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 md:grid-cols-[96px_minmax(0,1fr)]"
          >
            <div>
              <p className="inline-flex rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {item.label}
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-700">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuoteBlock({ block }: { block: ArticleQuoteBlock }) {
  return (
    <section
      id={blockId(block)}
      className="trend-card trend-rise rounded-[2rem] border border-green-100 bg-gradient-to-br from-green-50 via-white to-white p-6 shadow-sm"
    >
      <p className="text-lg leading-8 text-gray-800">“{block.quote}”</p>
      {block.attribution && (
        <p className="mt-3 text-sm font-medium text-green-700">
          {block.attribution}
        </p>
      )}
    </section>
  );
}

export function TrendArticleBlocks({
  content,
}: {
  content: ArticleLocalization;
}) {
  return (
    <>
      {content.blocks.map((block) => {
        switch (block.type) {
          case "section":
            return <SectionBlock key={block.id} block={block} />;
          case "checklist":
            return <ChecklistBlock key={block.id} block={block} />;
          case "comparison":
            return <ComparisonBlock key={block.id} block={block} />;
          case "table":
            return <TableBlock key={block.id} block={block} />;
          case "chart":
            return <ChartBlock key={block.id} block={block} />;
          case "timeline":
            return <TimelineBlock key={block.id} block={block} />;
          case "quote":
            return <QuoteBlock key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
