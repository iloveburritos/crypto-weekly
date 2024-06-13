// components/PostList.js
import Link from 'next/link';

const PostList = ({ posts }) => {
  return (
    <ul>
      <main>
      {posts.map((post) => (
        <li key={post.slug}>
          
          <Link href={`/posts/${post.slug}`} className="gap-4">
          {post.date && <span className="date-numerical hover:underline">{post.date}</span>}
              {post.longdate && <span className="date-written font-bold hover:underline">{post.longdate}</span>}
          </Link>
        </li>
        
      ))}
      </main>
    </ul>
  );
};

export default PostList;
