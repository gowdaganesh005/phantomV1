import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import axios from "axios";
import { useEffect, useState } from "react";
import { Search, Calendar, Clock, RefreshCw, AlertCircle, Plus, Filter, GridIcon, ListIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoData {
  videoId: string;
  created_at: string;
}

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<VideoData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  async function fetchUserVideos() {
    if (!user) return;

    try {
      setRefreshing(true);
      const token = await user.getIdToken();
      const response = await axios.get("http://localhost:3000/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) setData(response.data.data);
    } catch (err) {
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchUserVideos();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAndSortedVideos = data
    ? [...data]
        .filter((video) =>
          video.videoId.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return sortOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
        })
    : [];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen">
      {/* Header with glass effect */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-900/80 border-b border-gray-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white mr-2">
                Meeting Library
              </h1>
              <span className="bg-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full text-white">
                {filteredAndSortedVideos.length} Meetings
              </span>
            </div>
            
            <div className="flex space-x-2">
              
              
              <button
                onClick={() => fetchUserVideos()}
                disabled={refreshing || loading}
                className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors disabled:opacity-50 shadow-md"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and filters panel */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg border border-gray-700/50">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-600 rounded-lg bg-gray-700/50 text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className="bg-gray-700 hover:bg-gray-600 p-2.5 rounded-lg text-gray-200"
                title="Filter options"
              >
                <Filter className="h-5 w-5" />
              </button>
              
              <div className="bg-gray-700 rounded-lg flex overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 ${
                    viewMode === "grid" ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-600"
                  }`}
                  title="Grid view"
                >
                  <GridIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 ${
                    viewMode === "list" ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-600"
                  }`}
                  title="List view"
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex bg-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setSortOrder("desc")}
                  className={`px-3 py-2 text-sm font-medium ${
                    sortOrder === "desc"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortOrder("asc")}
                  className={`px-3 py-2 text-sm font-medium ${
                    sortOrder === "asc"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-400 font-medium">Loading your meetings...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-500/50 rounded-xl p-6 mb-6 flex items-start shadow-lg">
            <AlertCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium text-lg mb-1">Unable to load meetings</p>
              <p className="text-red-300/80">{error}</p>
              <button
                onClick={fetchUserVideos}
                className="mt-3 text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredAndSortedVideos.length === 0 && (
          <div className="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-700/50 mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-200 mb-2">No meetings found</h3>
            {searchQuery ? (
              <p className="text-gray-400 max-w-md mx-auto">No results match your search criteria. Try adjusting your filters or search terms.</p>
            ) : (
              <div>
                <p className="text-gray-400 max-w-md mx-auto mb-4">You haven't recorded any meetings yet. Start recording to build your library.</p>
                <button
                  onClick={() => navigate("/new-meeting")}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Meeting
                </button>
              </div>
            )}
          </div>
        )}

        {/* Video grid view */}
        {!loading && !error && filteredAndSortedVideos.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredAndSortedVideos.map((video) => (
              <div
                key={video.videoId}
                className="group bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50 hover:bg-gray-800/60 cursor-pointer"
                onClick={() => navigate(`/summary?videoId=${video.videoId}`)}
              >
                <div className="relative aspect-video">
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-sm font-medium text-white truncate">
                      {video.videoId.split("/").pop()}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-xs text-gray-300">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                      <span>{formatDate(video.created_at)}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-300">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                      <span>{formatTime(video.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      ID: {video.videoId.substring(video.videoId.lastIndexOf('/') + 1, video.videoId.lastIndexOf('/') + 9)}...
                    </span>
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-700/50">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video list view */}
        {!loading && !error && filteredAndSortedVideos.length > 0 && viewMode === "list" && (
          <div className="space-y-3">
            {filteredAndSortedVideos.map((video) => (
              <div
                key={video.videoId}
                className="group flex bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-lg border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50 hover:bg-gray-800/60 cursor-pointer"
                onClick={() => navigate(`/summary?videoId=${video.videoId}`)}
              >
                
                
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm md:text-base font-medium text-white truncate mr-2">
                        {video.videoId.split("/").pop()}
                      </div>
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 whitespace-nowrap">
                        View Details
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      ID: {video.videoId}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-300 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                      <span>{formatDate(video.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                      <span>{formatTime(video.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;