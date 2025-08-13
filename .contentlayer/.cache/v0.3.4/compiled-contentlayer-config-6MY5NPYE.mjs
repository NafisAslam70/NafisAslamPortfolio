// contentlayer.config.js
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "blog/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    summary: { type: "string" },
    tags: { type: "list", of: { type: "string" } },
    cover: { type: "string" },
    published: { type: "boolean", default: true }
  },
  computedFields: {
    slug: { type: "string", resolve: (doc) => doc._raw.flattenedPath.replace(/^blog\//, "") },
    url: { type: "string", resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace(/^blog\//, "")}` }
  }
}));
var Now = defineDocumentType(() => ({
  name: "Now",
  filePathPattern: "dashboard/now.mdx",
  contentType: "mdx",
  fields: {
    updated: { type: "date", required: true },
    title: { type: "string", required: true }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Blog, Now]
});
export {
  Blog,
  Now,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-6MY5NPYE.mjs.map
