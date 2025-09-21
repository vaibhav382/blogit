import React, { useState, useEffect } from 'react';
import { ChatWidget } from "contentstack-chat-sdk"


const STACK_API_KEY = import.meta.env.VITE_CONTENTSTACK_API_KEY;
const DELIVERY_TOKEN = import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN;
const ENVIRONMENT = import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT;
const CONTENT_TYPE = 'blog_post';


interface BlogPost {
  uid: string;
  title: string;
  url: string;
  body: string;
}

const App: React.FC = () => {
  const [stack, setStack] = useState<any>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStack = async () => {
      try {
        const ContentstackModule = await import('contentstack');
        const Contentstack = ContentstackModule.default || ContentstackModule;
        
        const stackInstance = Contentstack.Stack(STACK_API_KEY, DELIVERY_TOKEN, ENVIRONMENT);
        setStack(stackInstance);
      } catch (err) {
        console.error("Failed to initialize Contentstack SDK:", err);
        setError("Could not load Contentstack SDK. Please check the network and refresh the page.");
        setLoading(false);
      }
    };

    initializeStack();
  }, []); 

  useEffect(() => {
    if (!stack) {
      return;
    }

    const fetchBlogs = async () => {
      try {
        setError(null);
        
        const Query = stack.ContentType(CONTENT_TYPE).Query();
        
        const result = await Query.toJSON().find();
        
        if (result && result[0]) {
          setBlogs(result[0]);
        }
        
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError('Failed to fetch blog posts. Please check your Contentstack credentials and network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [stack]); 

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }
    
    if (selectedBlog) {
      return <BlogPostView blog={selectedBlog} onBack={() => setSelectedBlog(null)} />;
    }
    
    return <BlogList blogs={blogs} onSelectBlog={setSelectedBlog} />;
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <ChatWidget
        apiEndpoint="http://127.0.0.1:8000/chat"
        collectionName="agent_3707864b-f735-4ebf-8a07-68a4ba8823cd"
      />
    </div>
  );
};


const Header: React.FC = () => (
  <header className="bg-white shadow-md">
    <div className="container mx-auto p-4 md:p-6 flex justify-between items-center">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Tech Blog</h1>
      <p className="text-slate-500">Powered by Contentstack</p>
    </div>
  </header>
);

interface BlogListProps {
  blogs: BlogPost[];
  onSelectBlog: (blog: BlogPost) => void;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, onSelectBlog }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold border-b pb-4 mb-6">Latest Posts</h2>
    {blogs.length > 0 ? (
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <li
            key={blog.uid}
            onClick={() => onSelectBlog(blog)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
          >
            <h3 className="text-xl font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
              {blog.title}
            </h3>
            <span className="text-sm text-slate-400 mt-4 block">Read more &rarr;</span>
          </li>
        ))}
      </ul>
    ) : (
      <p>No blog posts found. Please add some posts in your Contentstack space.</p>
    )}
  </div>
);

interface BlogPostViewProps {
  blog: BlogPost;
  onBack: () => void;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ blog, onBack }) => (
  <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
    <button
      onClick={onBack}
      className="mb-6 text-blue-600 hover:text-blue-800 transition-colors"
    >
      &larr; Back to all posts
    </button>
    <article>
      <h2 className="text-4xl font-extrabold mb-4 text-slate-900">{blog.title}</h2>
      <div
        className="prose lg:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.body }}
      />
    </article>
  </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-bold">Error</p>
        <p>{message}</p>
    </div>
);

export default App;

