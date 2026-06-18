import {
  PortableText,
  type PortableTextProps,
} from "@portabletext/react";

type PortableTextValue = PortableTextProps["value"];

interface PortableTextBodyProps extends Omit<PortableTextProps, "value"> {
  value: unknown;
}

/** Renders Sanity portable text without repeated type casts at call sites */
export default function PortableTextBody({
  value,
  ...props
}: PortableTextBodyProps) {
  return (
    <PortableText value={value as PortableTextValue} {...props} />
  );
}
