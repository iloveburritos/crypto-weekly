// pages/search.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import lunr from 'lunr';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from '../components/Layout';

// Function to strip markdown and URLs from content
const stripMarkdown = (content) => {
  return content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image tags
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove link tags
    .replace(/`.*?`/g, '') // Remove inline code
    .replace(/\*\*.*?\*\*/g, '') // Remove bold text
    .replace(/\*.*?\*/g, '') // Remove italic text
    .replace(/#+\s.*?\n/g, '') // Remove headers
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/>\s.*?\n/g, '') // Remove blockquotes
    .replace(/-|\*|\+ \s.*?\n/g, '') // Remove list items
    .replace(/`{3}.*?\n[\s\S]*?\n`{3}/g, ''); // Remove code blocks
};

const getSnippet = (content, query) => {
  const strippedContent = stripMarkdown(content);
  const terms = query.toLowerCase().split(' ');
  let snippet = '';
  let foundTerm = false;

  for (const term of terms) {
    const index = strippedContent.toLowerCase().indexOf(term);
    if (index !== -1) {
      foundTerm = true;
      const startIndex = Math.max(index - 30, 0);
      const endIndex = Math.min(index + term.length + 120, strippedContent.length);
      snippet = strippedContent.substring(startIndex, endIndex);
      break;
    }
  }

  if (!foundTerm) {
    return strippedContent.substring(0, 150) + (strippedContent.length > 150 ? '...' : '');
  }

  return snippet + (snippet.length < strippedContent.length ? '...' : '');
};

const SearchResults = ({ documents, index }) => {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      const idx = lunr.Index.load(index);
      const searchResults = idx.search(query).map(({ ref }) => {
        return documents.find((doc) => doc.slug === ref);
      });
      setResults(searchResults);
    }
  }, [query, documents, index]);

  return (
    <>
      <Layout >
      <div className="max-w-[680px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-left mb-4">Search Results for {query}</h1>
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result.slug} className="mb-4">
              <Link href={`/posts/${result.slug}`} className="text-xl font-bold text-blue-600">{result.title}
              </Link>
              <p className="text-sm italic">{getSnippet(result.content, query)}</p>
            </div>
          ))
        ) : (
          <p>No results found for {query}.</p>
        )}
      </div>
      </Layout>
    </>
  );
};

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));

  const documents = files.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      title: data.title,
      content: content,
      slug: fileName.replace(/\.md$/, ''),
    };
  });

  const idx = lunr(function () {
    this.ref('slug');
    this.field('title');
    this.field('content');

    documents.forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  return {
    props: {
      documents,
      index: idx.toJSON(),
    },
  };
}

export default SearchResults;