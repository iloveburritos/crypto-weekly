// pages/index.jsx

import Link from 'next/link';
import Layout from '../components/Layout';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import PostList from '../components/PostList';
import Head from 'next/head';

export async function getStaticProps() {
  const files = fs.readdirSync(path.join('posts'));

  let posts = files.map((filename) => {
    const slug = filename.replace('.md', '');
    const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8');
    const { data: frontmatter } = matter(markdownWithMeta);

    // Create the post object with conditional properties
    const post = {
      slug,
      title: frontmatter.title || slug, // Ensure there is a title fallback
      ...(frontmatter.date && { date: frontmatter.date }),
      ...(frontmatter.longdate && { longdate: frontmatter.longdate }),
    };

    return post;
  });

  // Sort posts by date in descending order
  posts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: {
      posts,
    },
  };
}


export default function Home({ posts }) {
  const recentPosts = posts.slice(0, 10);
  return (
    <>
    <Layout>
      <header className="text-center p-4">
        <h2 className="text-lg justify-center sm:text-md max-w-[680px] mx-auto flex">A weekly summary of blockchain and crypto industry news.</h2>
        <h2 className="text-lg justify-center sm:text-md max-w-[680px] mx-auto flex">All posts are publicly archived on <a 
    href="https://github.com/iloveburritos/crypto-weekly" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:underline text-blue-600 ml-1"
  >
    GitHub
  </a>.
</h2>
      </header>
      <main className="text-center">
        <posts>
          <h1 className="text-2xl font-bold my-4 underline">Latest Posts</h1>
          <PostList posts={recentPosts} />
        </posts>
        <h2 className="text-lg max-w-[680px] mx-auto flex justify-center mt-5"> 
        <Link className="hover:underline" href="/posts?reset=true">All Posts 👉</Link>
        </h2>        
      </main>
    </Layout>
    </>
  );
}

