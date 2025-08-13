import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const hireRequests = pgTable("hire_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),           // add a UNIQUE in the DB migration if you want
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const courseSections = pgTable("course_sections", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(), // ideally references(courses.id) in your migration
  title: text("title").notNull(),
  content: text("content"),
  sortOrder: integer("sort_order"),         // optional ordering
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const reels = pgTable("reels", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),   // "youtube" | "cloudinary"
  ref: text("ref").notNull(),     // youtube videoId OR cloudinary publicId
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});




export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  excerpt: text("excerpt"),
  coverUrl: text("cover_url"),
  contentMd: text("content_md"),
  externalUrl: text("external_url"),
  // NEW: tags as comma-separated text array
  tags: text("tags").array(),                    // ← Postgres text[]
  published: boolean("published").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
