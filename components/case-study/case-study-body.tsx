import { MDXRemote } from "next-mdx-remote-client/rsc";
import { useMDXComponents } from "@/mdx-components";

interface CaseStudyBodyProps {
  body: string;
}

export function CaseStudyBody({ body }: CaseStudyBodyProps) {
  const components = useMDXComponents({});
  return (
    <article className="mx-auto mt-24 max-w-3xl px-6 md:px-0">
      <MDXRemote source={body} components={components} />
    </article>
  );
}
