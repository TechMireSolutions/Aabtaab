import {
  PortableText,
  type PortableTextProps,
  type PortableTextComponents,
} from "@portabletext/react";
import OpensInNewTab from "@/components/ui/OpensInNewTab";
import { EXTERNAL_LINK_PROPS } from "@/lib/urls";

type PortableTextValue = PortableTextProps["value"];

const semanticComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "";
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(isExternal ? EXTERNAL_LINK_PROPS : {})}>
          {children}
          {isExternal ? <OpensInNewTab /> : null}
        </a>
      );
    },
  },
};

interface PortableTextBodyProps extends Omit<PortableTextProps, "value"> {
  value: unknown;
}

/** Renders Sanity portable text without repeated type casts at call sites */
export default function PortableTextBody({
  value,
  ...props
}: PortableTextBodyProps) {
  return (
    <PortableText
      value={value as PortableTextValue}
      components={semanticComponents}
      {...props}
    />
  );
}
