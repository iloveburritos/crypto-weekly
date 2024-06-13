// pages/posts.js

import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import PostList from '../components/PostList';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import {useRouter} from 'next/router';

export async function getStaticProps() {
  const files = fs.readdirSync(path.join('posts'));

  let posts = files.map((filename) => {
    const slug = filename.replace('.md', '');
    const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8');
    const { data: frontmatter } = matter(markdownWithMeta);

    // Create the post object
    const post = {
      slug,
      title: frontmatter.title || slug, // Ensure there is a title fallback
      // Check for both the presence and type of 'date' to ensure it's a string
      date: typeof frontmatter.date === 'string' ? frontmatter.date : null,
      longdate: typeof frontmatter.longdate === 'string' ? frontmatter.longdate : null,
    };

    return post;
  }).filter(post => post.date !== null); // Filter out any posts without a valid date

  // Sort posts by date in descending order
  posts = posts.sort((a, b) => {
    // Split the date strings and rearrange them to match the expected format for JavaScript Date parsing
    const datePartsA = a.date.split('-');
    const datePartsB = b.date.split('-');
    const dateA = new Date(`${datePartsA[2]}-${datePartsA[0]}-${datePartsA[1]}`);
    const dateB = new Date(`${datePartsB[2]}-${datePartsB[0]}-${datePartsB[1]}`);
    return dateB - dateA;
  });



  return {
    props: {
      posts,
    },
  };
}

export default function All({ posts }) {
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [activeYearFilter, setActiveYearFilter] = useState('All Posts');
  const router = useRouter();

  useEffect(() => {
    const shouldResetFilter = router.query.reset;

    if(shouldResetFilter) {
      // Reset the filter
      setActiveYearFilter('All Posts');
      setFilteredPosts(posts);
      sessionStorage.removeItem('activeYearFilter');
        // Clear the query parameter by redirecting
        router.push('/posts', undefined, { shallow: true });
    } else {
      // Check for a saved filter state in sessionStorage
      const savedFilter = sessionStorage.getItem('activeYearFilter');
      if (savedFilter) {
        handleSelectYear(savedFilter);
      }
    }
  }, [router.query.reset]);
    

  const handleSelectYear = (year) => {
    setActiveYearFilter(year);
    sessionStorage.setItem('activeYearFilter', year);
    if (year === 'All') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => {
        const postYear = post.date.split('-')[2]; // Extract the year correctly
        return postYear === year;
      });
      setFilteredPosts(filtered);
    }
  };
  

  return (
    <>
      <Layout >
      <div className="max-w-[680px] mx-auto flex p-3"> {/* Adjusted for width and padding */}
        <div className="w-1/4 pl-2 lg:pl-4"> {/* Sidebar takes up 1/4 of the container */}
          <Sidebar onSelectYear={handleSelectYear} />
        </div>
        <main className="w-3/4"> {/* PostList takes up 3/4 of the container */}
          <PostList posts={filteredPosts} />
        </main>
      </div>
      </ Layout>
    </>
  );
}
