import { useState, useEffect } from 'react';
import Settings from '../../components/Settings';
import Profile from '../../components/Profile';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, FiBook, FiStar, FiSettings, 
  FiLogOut, FiPlus, FiSearch, FiMenu, FiX, FiThumbsUp, FiMessageCircle, FiUser
} from 'react-icons/fi';

type Comment = {
  id: number;
  user: string;
  text: string;
  createdAt: string;
};

type Joke = {
  id: number;
  content: string;
  category: string;
  isFavorite: boolean;
  createdAt: string;
  likes: number;
  likedByUser: boolean;
  comments: Comment[];
};

type Category = {
  id: number;
  name: string;
  count: number;
};

type User = {
  name: string;
  email: string;
  username: string;
  joinDate: string;
  totalJokes: number;
  totalLikes: number;
  avatar: string;
};

/** @jsxImportSource react */
type StatItem = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

const Dashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'my-jokes' | 'settings' | 'profile'>('my-jokes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [newComment, setNewComment] = useState<string>('');
  const [commentingOn, setCommentingOn] = useState<number | null>(null);

  const { user: authUser } = useAuth();
  
  const user: User = {
    name: authUser?.username || 'Anonymous',
    email: authUser?.email || '',
    username: authUser?.username || 'anonymous',
    joinDate: new Date(authUser?.registration_date || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
    totalJokes: authUser?.jokes?.length || 0,
    totalLikes: authUser?.totalLikes || 0,
    avatar: authUser?.profile_picture || 'https://randomuser.me/api/portraits/lego/1.jpg'
  };

  const [jokes, setJokes] = useState<Joke[]>([
    {
      id: 1,
      content: "Why don't scientists trust atoms? Because they make up everything!",
      category: 'Science',
      isFavorite: true,
      createdAt: '2023-05-15',
      likes: 12,
      likedByUser: false,
      comments: [
        { id: 1, user: 'user1', text: 'So true!', createdAt: '2023-05-16' },
        { id: 2, user: 'user2', text: 'I love this one.', createdAt: '2023-05-17' }
      ]
    },
    {
      id: 2,
      content: "Why did the scarecrow win an award? Because he was outstanding in his field!",
      category: 'Agriculture',
      isFavorite: false,
      createdAt: '2023-05-10',
      likes: 8,
      likedByUser: true,
      comments: [
        { id: 1, user: 'user3', text: 'Classic!', createdAt: '2023-05-11' },
        { id: 2, user: 'user4', text: 'Haha 😄', createdAt: '2023-05-12' }
      ]
    }
  ]);

  const categories: Category[] = [
    { id: 1, name: 'All', count: jokes.length },
    { id: 2, name: 'Science', count: jokes.filter(j => j.category === 'Science').length },
    { id: 3, name: 'Favorites', count: jokes.filter(j => j.isFavorite).length },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > 768 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [windowWidth, isMobileMenuOpen]);

  const toggleFavorite = (id: number) => {
    setJokes(jokes.map(joke => 
      joke.id === id ? { ...joke, isFavorite: !joke.isFavorite } : joke
    ));
  };

  const likeJoke = (id: number) => {
    setJokes(jokes.map(joke => 
      joke.id === id ? { 
        ...joke, 
        likes: joke.likedByUser ? joke.likes - 1 : joke.likes + 1,
        likedByUser: !joke.likedByUser 
      } : joke
    ));
  };

  const addComment = (id: number) => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now(),
      user: user.username,
      text: newComment,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setJokes(jokes.map(joke =>
      joke.id === id ? { 
        ...joke, 
        comments: [...joke.comments, comment] 
      } : joke
    ));
    
    setNewComment('');
    setCommentingOn(null);
  };

  const filteredJokes = jokes.filter(joke => {
    const matchesSearch = joke.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                         (selectedCategory === 'Favorites' ? joke.isFavorite : joke.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-gray-200 w-64 p-4 flex flex-col ${isMobileMenuOpen ? 'absolute inset-y-0 z-50 md:relative' : 'hidden md:flex'}`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">JokeHub</h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden">
            <FiX size={24} />
          </button>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`flex items-center w-full p-2 rounded ${activeTab === 'dashboard' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-700'}`}
              >
                <FiHome className="mr-2" /> Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('my-jokes')} 
                className={`flex items-center w-full p-2 rounded ${activeTab === 'my-jokes' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-700'}`}
              >
                <FiBook className="mr-2" /> My Jokes
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('profile')} 
                className={`flex items-center w-full p-2 rounded ${activeTab === 'profile' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-700'}`}
              >
                <FiUser className="mr-2" /> Profile
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('settings')} 
                className={`flex items-center w-full p-2 rounded ${activeTab === 'settings' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-700'}`}
              >
                <FiSettings className="mr-2" /> Settings
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto">
          <button 
            onClick={logout}
            className="flex items-center w-full p-2 rounded hover:bg-gray-700 hover:text-red-400 transition-colors"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="mr-4 md:hidden"
              >
                <FiMenu size={24} />
              </button>
              <h2 className="text-xl font-semibold">
                {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'my-jokes' ? 'My Jokes' : activeTab === 'profile' ? 'Profile' : 'Settings'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jokes..."
                  className="pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <img 
                  src={user.avatar} 
                  alt="User" 
                  className="w-8 h-8 rounded-full object-cover" 
                />
                <span className="ml-2 hidden md:inline">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 bg-gray-900">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm ${selectedCategory === category.name ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Total Jokes', value: jokes.length, icon: <FiBook className="text-indigo-400" /> },
                  { title: 'Favorites', value: jokes.filter(j => j.isFavorite).length, icon: <FiStar className="text-yellow-400" /> },
                  { title: 'Categories', value: categories.length - 1, icon: <FiPlus className="text-green-400" /> }
                ].map((stat: StatItem, index: number) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg shadow flex items-center">
                    <div className="p-3 rounded-full bg-gray-700 mr-4">
                      {stat.icon}
                    </div>
                    <div>
                      <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* User Profile */}
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-16 h-16 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                    <p className="text-gray-400">@{user.username}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="font-medium text-white">{user.email}</p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-gray-400 text-sm">Member since</p>
                    <p className="font-medium text-white">{user.joinDate}</p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-gray-400 text-sm">Total Jokes</p>
                    <p className="font-medium text-white">{user.totalJokes}</p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-gray-400 text-sm">Total Likes</p>
                    <p className="font-medium text-white">{user.totalLikes}</p>
                  </div>
                </div>
              </div>

              {/* Recent Jokes with likes/comments */}
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Jokes</h3>
                {jokes.slice(0, 2).map(joke => (
                  <div key={joke.id} className="border-b border-gray-700 pb-4 mb-4 last:border-b-0 last:mb-0">
                    <p className="text-gray-100 mb-2">{joke.content}</p>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span className="bg-gray-700 px-2 py-1 rounded">{joke.category}</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleFavorite(joke.id)} 
                          className={`${joke.isFavorite ? 'text-yellow-400' : 'text-gray-500'} hover:text-yellow-400`}
                        >
                          <FiStar className={joke.isFavorite ? 'fill-current' : ''} />
                        </button>
                        <button 
                          onClick={() => likeJoke(joke.id)} 
                          className={`flex items-center gap-1 ${joke.likedByUser ? 'text-indigo-400' : 'text-gray-500'} hover:text-indigo-400`}
                        >
                          <FiThumbsUp /> {joke.likes}
                        </button>
                        <button 
                          onClick={() => setCommentingOn(commentingOn === joke.id ? null : joke.id)}
                          className="flex items-center gap-1 text-gray-500 hover:text-indigo-400"
                        >
                          <FiMessageCircle /> {joke.comments.length}
                        </button>
                      </div>
                    </div>
                    
                    {/* Comments section */}
                    {(commentingOn === joke.id || joke.comments.length > 0) && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-700">
                        {joke.comments.map(comment => (
                          <div key={comment.id} className="mb-2 text-sm">
                            <p className="font-medium text-gray-300">@{comment.user}</p>
                            <p className="text-gray-400">{comment.text}</p>
                          </div>
                        ))}
                        
                        {commentingOn === joke.id && (
                          <div className="mt-3 flex">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="flex-1 px-3 py-2 border border-gray-600 rounded-l bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addComment(joke.id)}
                            />
                            <button
                              onClick={() => addComment(joke.id)}
                              className="bg-indigo-600 text-white px-3 py-2 rounded-r hover:bg-indigo-700"
                            >
                              Post
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && <Profile />}
          {activeTab === 'settings' && <Settings />}

          {activeTab === 'my-jokes' && (
            <div className="space-y-4">
              {filteredJokes.length > 0 ? (
                filteredJokes.map(joke => (
                  <div key={joke.id} className="bg-gray-800 p-4 rounded-lg shadow">
                    <p className="text-gray-100 mb-2">{joke.content}</p>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span className="bg-gray-700 px-2 py-1 rounded">{joke.category}</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleFavorite(joke.id)} 
                          className={`${joke.isFavorite ? 'text-yellow-400' : 'text-gray-500'} hover:text-yellow-400`}
                        >
                          <FiStar className={joke.isFavorite ? 'fill-current' : ''} />
                        </button>
                        <button 
                          onClick={() => likeJoke(joke.id)} 
                          className={`flex items-center gap-1 ${joke.likedByUser ? 'text-indigo-400' : 'text-gray-500'} hover:text-indigo-400`}
                        >
                          <FiThumbsUp /> {joke.likes}
                        </button>
                        <button 
                          onClick={() => setCommentingOn(commentingOn === joke.id ? null : joke.id)}
                          className="flex items-center gap-1 text-gray-500 hover:text-indigo-400"
                        >
                          <FiMessageCircle /> {joke.comments.length}
                        </button>
                      </div>
                    </div>
                    
                    {/* Comments section */}
                    {(commentingOn === joke.id || joke.comments.length > 0) && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-700">
                        {joke.comments.map(comment => (
                          <div key={comment.id} className="mb-2 text-sm">
                            <p className="font-medium text-gray-300">@{comment.user}</p>
                            <p className="text-gray-400">{comment.text}</p>
                          </div>
                        ))}
                        
                        {commentingOn === joke.id && (
                          <div className="mt-3 flex">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="flex-1 px-3 py-2 border border-gray-600 rounded-l bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addComment(joke.id)}
                            />
                            <button
                              onClick={() => addComment(joke.id)}
                              className="bg-indigo-600 text-white px-3 py-2 rounded-r hover:bg-indigo-700"
                            >
                              Post
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-gray-800 p-8 rounded-lg shadow text-center">
                  <p className="text-gray-400">No jokes found matching your criteria</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;