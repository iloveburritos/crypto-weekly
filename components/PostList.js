// components/PostList.js
import Link from 'next/link';

const PostList = ({ posts }) => {
  return (
    <div className="max-w-[680px] mx-auto px-4">
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/posts/${post.slug}`} className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {post.longdate || post.title}
                  </h3>
                  {post.date && (
                    <time className="text-sm text-gray-500 font-mono">
                      {post.date}
                    </time>
                  )}
                </div>
                <div className="mt-2 sm:mt-0 sm:ml-4">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default PostList;
