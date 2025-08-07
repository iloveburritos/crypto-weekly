// pages/posts/[slug].jsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import remarkBreaks from 'remark-breaks';


export default function PostPage({ frontmatter, content, prevPost, nextPost }) {
    const { date, longdate } = frontmatter;
    const router = useRouter();
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
            
            // Calculate reading progress
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <>
          {/* Reading Progress Bar */}
          <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
            <div
              className="h-full bg-blue-600 transition-all duration-150"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
          
          <Layout>
          <div className="max-w-[680px] mx-auto px-4 py-8">
            {/* Header with back link */}
            <div className="mb-8">
              <Link
                href="/posts"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Archive
              </Link>
              <h2 className="text-2xl font-bold text-left mb-1 underline">{longdate}</h2>
              <p className="text-left italic mb-8">{date}</p>
            </div>

            <article className="prose max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkBreaks]}
                components={{
                  // This custom renderer will size down images
                  img: ({node, ...props}) => (
                    <img style={{ maxWidth: '70%' }} {...props} />
                  ),
                }}
                >
                {content}
              </ReactMarkdown>
            </article>
            
            {/* Navigation */}
            <nav className="flex justify-between items-center mt-12 pt-8 border-t border-gray-300">
              <div className="flex-1">
                {prevPost && (
                  <Link
                    href={`/posts/${prevPost.slug}`}
                    className="group inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <div className="text-left">
                      <div className="text-sm text-gray-500">Previous</div>
                      <div className="font-medium">{prevPost.longdate}</div>
                    </div>
                  </Link>
                )}
              </div>
              <div className="flex-1 text-right">
                {nextPost && (
                  <Link
                    href={`/posts/${nextPost.slug}`}
                    className="group inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Next</div>
                      <div className="font-medium">{nextPost.longdate}</div>
                    </div>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </nav>
          </div>

          {/* Back to Top Button */}
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50"
              aria-label="Back to top"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </button>
          )}
          </Layout>
        </>
      );
    }

export async function getStaticPaths() {
    const files = fs.readdirSync(path.join('posts')).filter(file => file.endsWith('.md'));

    console.log('Files:', files); // Debugging line to check files

    const paths = files.map((filename) => ({
        params: {
            slug: filename.replace('.md', ''),
        },
    }));

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params: { slug } }) {
    const markdownWithMeta = fs.readFileSync(path.join('posts', slug + '.md'), 'utf-8');
    const { data: frontmatter, content } = matter(markdownWithMeta);

    // Get all posts for navigation
    const files = fs.readdirSync(path.join('posts')).filter(file => file.endsWith('.md'));
    const posts = files.map((filename) => {
        const postSlug = filename.replace('.md', '');
        const postMarkdown = fs.readFileSync(path.join('posts', filename), 'utf-8');
        const { data: postFrontmatter } = matter(postMarkdown);
        
        return {
            slug: postSlug,
            date: postFrontmatter.date,
            longdate: postFrontmatter.longdate,
        };
    });

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Find current post index
    const currentIndex = posts.findIndex(post => post.slug === slug);
    
    // Get previous and next posts (previous is newer, next is older)
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    return {
        props: {
            frontmatter,
            content,
            slug,
            prevPost,
            nextPost,
        },
    };
}