'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const fetchNews = async (reset = false, term = '') => {
    setIsLoading(true);
    setError(null);  // Reset any previous errors
    const apiKey = '041721128a5446c0947bc16446b972d8';
    let url;

    if (term) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(term)}&apiKey=${apiKey}&page=${page}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=${apiKey}&page=${page}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('API Response:', data);  // Log the response for debugging
      if (data.articles) {
        setArticles(reset ? data.articles : [...articles, ...data.articles]);
      } else {
        console.error('Error fetching articles:', data);
        setError('Error fetching articles.');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Error fetching news.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(true);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      fetchNews(true, searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (page > 1) {
      fetchNews(false, searchTerm);
    }
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchNews(true, searchTerm);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Latest News</h1>
            <button
              className="p-2 rounded bg-gray-300 dark:bg-gray-600"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <i className="fas fa-sun text-yellow-500"></i>
              ) : (
                <i className="fas fa-moon text-gray-700"></i>
              )}
            </button>
          </div>

          <div className="mt-4 flex">
            <input
              type="text"
              className="flex-grow p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="ml-2 p-2 rounded bg-blue-500 text-white"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          <div id="news-articles" className="mt-4 space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <div key={index} className="flex bg-white dark:bg-gray-700 p-4 rounded shadow">
                  <div
                    className="w-32 h-24 bg-cover bg-center rounded mr-4"
                    style={{
                      backgroundImage: `url(${
                        article.urlToImage ||
                        `https://via.placeholder.com/150x100?text=News`
                      })`,
                    }}
                  ></div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{article.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {article.description || 'No description available.'}
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      className="text-blue-500 hover:underline mt-2 block"
                      rel="noopener noreferrer"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div>No articles found.</div>
            )}
          </div>

          {isLoading && <div className="text-center my-4">Loading...</div>}

          {!isLoading && articles.length > 0 && (
            <button
              className="block mx-auto mt-4 p-2 rounded bg-blue-500 text-white"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
