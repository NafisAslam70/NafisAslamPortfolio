"use client";
import { useMDXComponent } from "next-contentlayer/hooks";
export default function MdxRenderer({ code }) {
  const Component = useMDXComponent(code);
  return <Component components={{}} />;
}
