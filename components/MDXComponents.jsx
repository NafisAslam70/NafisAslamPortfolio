"use client";
import Image from "next/image";
import Link from "next/link";

export function Callout({ children, type = "note" }) {
  const styles = {
    note:  "border-cyan-400/30 bg-cyan-400/10",
    warn:  "border-amber-400/30 bg-amber-400/10",
    info:  "border-violet-400/30 bg-violet-400/10",
    success:"border-emerald-400/30 bg-emerald-400/10"
  };
  return <div className={`border rounded-xl px-3 py-2 text-sm ${styles[type] || styles.note}`}>{children}</div>;
}

const A = ({ className = "", ...props }) => <Link {...props} className={`link ${className}`.trim()} />;

const Img = ({ src, alt = "", width = 1200, height = 630, className = "", ...rest }) => {
  if (!src) return null;
  const finalAlt = typeof alt === "string" ? alt : "";
  const imageProps = {
    className: `rounded-lg border border-[var(--border)] ${className}`.trim(),
    ...rest,
  };
  if (!("fill" in imageProps)) {
    imageProps.width = width;
    imageProps.height = height;
  }
  return <Image src={src} alt={finalAlt} {...imageProps} />;
};

const components = { a: A, img: Img, Callout };

export default components;
