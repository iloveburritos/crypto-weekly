// components/PostList.js
import Link from 'next/link';

const PostList = ({ posts }) => {
  return (
    <div className="max-w-[680px] mx-auto px-4 text-center">
      <div className="space-y-1">
        {posts.map((post) => (
          <div key={post.slug}>
            <Link 
              href={`/posts/${post.slug}`} 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 block py-1"
            >
              {post.date}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
