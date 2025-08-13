import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "blog/**/*.mdx",
  contentType: "mdx",
  fields: {
    title:    { type: "string", required: true },
    date:     { type: "date",   required: true },
    summary:  { type: "string" },
    tags:     { type: "list", of: { type: "string" } },
    cover:    { type: "string" },
    published:{ type: "boolean", default: true }
  },
  computedFields: {
    slug: { type: "string", resolve: (doc) => doc._raw.flattenedPath.replace(/^blog\//, "") },
    url:  { type: "string", resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace(/^blog\//, "")}` }
  }
}));

export const Now = defineDocumentType(() => ({
  name: "Now",
  filePathPattern: "dashboard/now.mdx",
  contentType: "mdx",
  fields: {
    updated: { type: "date", required: true },
    title:   { type: "string", required: true }
  }
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Blog, Now]
});
