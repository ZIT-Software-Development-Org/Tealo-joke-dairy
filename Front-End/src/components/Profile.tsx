import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiEdit2, FiThumbsUp, FiClock } from 'react-icons/fi';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  bio: string;
  profile_picture: string;
  registration_date: string;
  totalJokes: number;
  totalLikes: number;
  recentJokes: {
    id: number;
    content: string;
    likes: number;
    createdAt: string;
  }[];
}

const Profile = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Fetching profile data...');
        console.log('Fetching profile data...');
        
        // Configure axios for session-based auth
        axios.defaults.withCredentials = true;
        
        const response = await axios.get('http://localhost:4000/api/users/profile', {
          withCredentials: true // This is needed for cookies/session
        });

        console.log('Profile data received:', response.data);
        if (!response.data) {
          throw new Error('No profile data received');
        }
        setProfile(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        console.error('Error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
          config: {
            url: err.config?.url,
            method: err.config?.method,
            headers: err.config?.headers
          }
        });
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load profile';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600 text-white p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-gray-800 text-gray-300 p-4 rounded-lg">
        No profile data available
      </div>
    );
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('profile_picture', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post('http://localhost:4000/api/users/profile/picture', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (profile) {
        setProfile({ ...profile, profile_picture: response.data.profile_picture });
      }

      // Update the auth context with new user data
      if (user) {
        login({ ...user, profile_picture: response.data.profile_picture });
      }
    } catch (err: any) {
      console.error('Error uploading profile picture:', err);
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="relative group">
            <img 
              src={profile.profile_picture || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
              alt={profile.username}
              className="w-24 h-24 rounded-full object-cover"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
              {uploadingImage ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                <span className="text-white text-sm">Change Photo</span>
              )}
            </label>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{profile.username}</h1>
                <p className="text-gray-400">{profile.email}</p>
              </div>
              <button 
                onClick={() => {}} 
                className="text-gray-400 hover:text-white"
              >
                <FiEdit2 size={20} />
              </button>
            </div>
            <p className="mt-4 text-gray-300">{profile.bio || 'No bio yet'}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 mb-1">Member Since</div>
          <div className="text-xl text-white">
            {new Date(profile.registration_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 mb-1">Total Jokes</div>
          <div className="text-xl text-white">{profile.totalJokes}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 mb-1">Total Likes</div>
          <div className="text-xl text-white">{profile.totalLikes}</div>
        </div>
      </div>

      {/* Recent Jokes */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Jokes</h2>
        <div className="space-y-4">
          {profile.recentJokes?.map(joke => (
            <div key={joke.id} className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-200 mb-3">{joke.content}</p>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-gray-400">
                  <FiClock className="mr-1" />
                  {new Date(joke.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-400">
                  <FiThumbsUp className="mr-1" />
                  {joke.likes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
