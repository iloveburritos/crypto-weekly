// components/PostList.js
import Link from 'next/link';

const PostList = ({ posts }) => {
  return (
    <div className="max-w-[680px] mx-auto px-4">
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="group">
            <Link 
              href={`/posts/${post.slug}`} 
              className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {post.longdate || post.title}
                </h3>
                {post.date && (
                  <time className="text-sm text-gray-500 font-mono">
                    {post.date}
                  </time>
                )}
              </div>
              <div className="flex-shrink-0 ml-4">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
