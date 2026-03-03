import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  BlogPost,
  BlogPostContent,
  Category,
  Lesson,
  LessonContent,
  Locale,
} from "./types";

const contentDir = path.join(process.cwd(), "content");

function getContentDir(locale: Locale) {
  return path.join(contentDir, locale);
}

export function getCategories(locale: Locale): Category[] {
  const dir = getContentDir(locale);
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const categories: Category[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const categoryPath = path.join(dir, entry.name, "_category_.json");
    if (!fs.existsSync(categoryPath)) continue;

    const raw = JSON.parse(fs.readFileSync(categoryPath, "utf-8"));
    categories.push({
      slug: entry.name,
      label: raw.label,
      description: raw.link?.description ?? "",
      position: raw.position,
    });
  }

  return categories.sort((a, b) => a.position - b.position);
}

export function getLessons(locale: Locale, category: string): Lesson[] {
  const dir = path.join(getContentDir(locale), category);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const lessons: Lesson[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const slug = file.replace(/\.mdx?$/, "");
    const title = data.title ?? extractTitleFromContent(content) ?? slug;
    const position = data.sidebar_position ?? 99;

    lessons.push({ slug, title, category, position });
  }

  return lessons.sort((a, b) => a.position - b.position);
}

export function getLesson(
  locale: Locale,
  category: string,
  slug: string
): LessonContent | null {
  const dir = path.join(getContentDir(locale), category);
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);

  const filePath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const title = data.title ?? extractTitleFromContent(content) ?? slug;
  const position = data.sidebar_position ?? 99;

  return { slug, title, category, position, source: content };
}

export function getAllLessonParams(locale: Locale) {
  const categories = getCategories(locale);
  const params: { locale: string; category: string; slug: string }[] = [];

  for (const cat of categories) {
    const lessons = getLessons(locale, cat.slug);
    for (const lesson of lessons) {
      params.push({ locale, category: cat.slug, slug: lesson.slug });
    }
  }

  return params;
}

function extractTitleFromContent(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

// Blog

const blogDir = path.join(contentDir, "blog");

function findBlogFiles(): { filePath: string; name: string }[] {
  if (!fs.existsSync(blogDir)) return [];

  const results: { filePath: string; name: string }[] = [];
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))) {
      results.push({ filePath: path.join(blogDir, entry.name), name: entry.name });
    } else if (entry.isDirectory()) {
      const indexMd = path.join(blogDir, entry.name, "index.md");
      const indexMdx = path.join(blogDir, entry.name, "index.mdx");
      const indexPath = fs.existsSync(indexMdx) ? indexMdx : fs.existsSync(indexMd) ? indexMd : null;
      if (indexPath) {
        results.push({ filePath: indexPath, name: entry.name });
      }
    }
  }

  return results;
}

function parseBlogEntry(filePath: string, name: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content: body } = matter(raw);

  const slug = data.slug ?? name.replace(/\.mdx?$/, "");
  const title = data.title ?? extractTitleFromContent(body) ?? slug;
  const dateMatch = name.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : "";
  const excerpt = body.slice(0, 160).replace(/\n/g, " ").trim();

  return { slug, title, date, excerpt, source: body };
}

export function getBlogPosts(): BlogPost[] {
  const files = findBlogFiles();
  const posts = files.map(({ filePath, name }) => {
    const { slug, title, date, excerpt } = parseBlogEntry(filePath, name);
    return { slug, title, date, excerpt };
  });

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string): BlogPostContent | null {
  const files = findBlogFiles();

  for (const { filePath, name } of files) {
    const entry = parseBlogEntry(filePath, name);
    if (entry.slug !== slug) continue;
    return entry;
  }

  return null;
}
