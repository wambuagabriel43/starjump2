import React from 'react';
import { Calendar, User, Tag, ArrowRight, Clock } from 'lucide-react';
import { useBlogPosts } from '../hooks/useContentData';
import { usePageContent, getContentWithFallback } from '../hooks/usePageContent';

const Blog: React.FC = () => {
  const { posts: blogPosts, loading, error } = useBlogPosts();
  const { content: pageContent, loading: contentLoading } = usePageContent('blog');

  // Get page content with fallbacks
  const heroContent = getContentWithFallback(pageContent, 'hero', {
    title: 'Star Jump Blog',
    content_text: 'Insights, tips, and stories from Kenya\'s leading children\'s entertainment experts'
  });

  const featuredContent = getContentWithFallback(pageContent, 'featured', {
    title: 'Featured Articles',
    content_text: 'Our most popular and insightful posts'
  });

  const newsletterContent = getContentWithFallback(pageContent, 'newsletter', {
    title: 'Stay Updated!',
    content_text: 'Subscribe to our newsletter for the latest tips, event updates, and exclusive offers from Star Jump Kenya.'
  });

  const categories = ['All', 'Parenting Tips', 'Events', 'Safety', 'Corporate', 'Partnerships'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const latestPosts = blogPosts.slice(0, 3);

  if (loading || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Unable to load blog posts</p>
          <p className="text-white/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-20 right-20 w-24 h-16 bg-star-yellow/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-10 left-1/4 w-28 h-18 bg-fun-pink/15 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            {heroContent.title.split(' ').map((word, index) => 
              word === 'Blog' ? 
                <span key={index} className="text-star-yellow">{word}</span> : 
                <span key={index}>{word} </span>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed">
            {heroContent.content_text}
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {featuredContent.title.split(' ').map((word, index) => 
                word === 'Articles' ? 
                  <span key={index} className="text-star-yellow">{word}</span> : 
                  <span key={index}>{word} </span>
              )}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {featuredContent.content_text}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-3xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image_url || 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-star-yellow text-royal-blue px-4 py-2 rounded-full font-bold text-sm">
                    Featured
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 text-royal-blue px-3 py-1 rounded-full font-bold text-sm">
                    {post.category}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.read_time}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-royal-blue mb-4 hover:text-bright-orange transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold py-2 px-6 rounded-full hover:from-blue-600 hover:to-royal-blue transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-star-yellow text-royal-blue shadow-lg'
                    : 'bg-white text-royal-blue hover:bg-star-yellow hover:text-royal-blue shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-3xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image_url || 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-royal-blue text-white px-3 py-1 rounded-full font-bold text-sm">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-3 text-xs text-gray-600">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-royal-blue mb-3 hover:text-bright-orange transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{post.read_time}</span>
                    <button className="bg-gradient-to-r from-bright-orange to-fun-pink text-white font-bold py-2 px-4 rounded-full hover:from-fun-pink hover:to-bright-orange transition-all duration-300 transform hover:scale-105 shadow-lg text-sm">
                      Read More
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-royal-blue mb-6">
              {newsletterContent.title}
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {newsletterContent.content_text}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-full focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-colors duration-300 outline-none"
              />
              <button className="bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold px-8 py-3 rounded-full hover:from-blue-600 hover:to-royal-blue transition-all duration-300 transform hover:scale-105 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;