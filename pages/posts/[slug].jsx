// pages/posts/[slug].jsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import remarkBreaks from 'remark-breaks';


export default function PostPage({ frontmatter, content }) {
    const { title, longdate } = frontmatter;
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <>
          <Layout>
          <div className="max-w-[680px] mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-left mb-1 underline">{title}</h2>
            <p className="text-left italic mb-8">{longdate}</p>
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
          </div>
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

    return {
        props: {
            frontmatter,
            content,
            slug,
        },
    };
}