// components/PostList.js
import Link from 'next/link';

const PostList = ({ posts }) => {
  return (
    <ul>
      <main>
      {posts.map((post) => (
        <li key={post.slug}>
          
          <Link className="space-y-6" href={`/posts/${post.slug}`} >
          {post.date && <span className="date-numerical hover:underline">{post.date}</span>}
              
          </Link>
        </li>
        
      ))}
      </main>
    </ul>
  );
};

export default PostList;
