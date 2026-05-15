import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="mt-20 flex items-center gap-4 text-2xl font-semibold md:text-3xl">
        <span aria-hidden className="h-px w-10 gradient-accent" />
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-12 text-xl font-semibold">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mt-6 text-lg leading-relaxed text-fg-muted">{children}</p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-fg">{children}</strong>
    ),
    ul: ({ children }) => (
      <ul className="mt-6 list-disc space-y-2 pl-6 text-fg-muted">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-6 list-decimal space-y-2 pl-6 text-fg-muted">{children}</ol>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="underline decoration-fg-muted/40 underline-offset-4 transition-colors hover:decoration-fg"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
    ...components,
  };
}
