import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const md = new MarkdownIt();
md.use(markdownItAttrs);

export function renderMarkdown(markdownString: string) {
  return md.render(markdownString);
}
