// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password"),
  role: text("role").default('member'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

// User-Course enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // references users.id
  courseId: integer("course_id").notNull(), // references courses.id
  enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow(),
});
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
  coverUrl: text("cover_url"),
  isFree: boolean("is_free").default(false),
  published: boolean("published").default(false),
  priceCents: integer("price_cents").default(0),
  status: text("status").default('draft'), // draft | design | preview | published
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const courseSections = pgTable("course_sections", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(), // ideally references(courses.id) in your migration
  title: text("title").notNull(),
  content: text("content"),
  sortOrder: integer("sort_order"),         // optional ordering
  // Optional media per section (simple MVP)
  videoType: text("video_type"),            // "youtube" | "cloudinary"
  videoRef: text("video_ref"),              // youtube id or cloudinary public_id
  freePreview: boolean("free_preview").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const courseLessons = pgTable("course_lessons", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  videoProvider: text("video_provider").default('youtube'),
  videoRef: text("video_ref"),              // youtube id or other provider ref
  sourceUrl: text("source_url"),
  durationSeconds: integer("duration_seconds"),
  freePreview: boolean("free_preview").default(false),
  sortOrder: integer("sort_order"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const courseMaterials = pgTable("course_materials", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  resourceType: text("resource_type"),      // "article" | "pdf" | "link"
  resourceUrl: text("resource_url").notNull(),
  sortOrder: integer("sort_order"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Optional: per-lesson articles/resources
export const lessonArticles = pgTable("lesson_articles", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  resourceUrl: text("resource_url").notNull(),
  sortOrder: integer("sort_order"),
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
