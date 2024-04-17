import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import hljs from 'highlight.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// @ts-ignore
const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch (__) { }
    }

    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

md.use(markdownItAttrs);

export function renderMarkdown(markdownString: string) {
  return md.render(markdownString);
}
