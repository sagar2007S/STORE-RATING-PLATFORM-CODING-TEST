import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios.js";
import { 
  Search, 
  Star, 
  MapPin, 
  Building2,
  Filter,
  TrendingUp,
  Users,
  Award,
  Heart,
  CheckCircle2
} from "lucide-react";

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [userRatings, setUserRatings] = useState({});
  const [hoveredRating, setHoveredRating] = useState({});
  const [loading, setLoading] = useState(true);
  const [submittingRating, setSubmittingRating] = useState(null);

  // Fetch all stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const res = await api.get("/stores");
        setStores(res.data);
      } catch (err) {
        console.error("Error fetching stores", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  // Handle rating change
  const handleRating = async (storeId, rating) => {
    try {
      setSubmittingRating(storeId);
      const res = await api.post(`/stores/${storeId}/rate`, { rating });
      setUserRatings({ ...userRatings, [storeId]: rating });
      
      // Update the store's average rating in the list
      setStores(prevStores => 
        prevStores.map(store => 
          store.id === storeId 
            ? { ...store, averageRating: res.data.averageRating || store.averageRating }
            : store
        )
      );
      
      console.log("Rating submitted:", res.data);
    } catch (err) {
      console.error("Error submitting rating", err);
    } finally {
      setSubmittingRating(null);
    }
  };

  // Filtering Logic
  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  // Render stars for display (average rating)
  const renderStars = (rating, size = "w-4 h-4") => {
    if (!rating) return <span className="text-gray-400 text-sm italic">No ratings yet</span>;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className={`${size} fill-yellow-400 text-yellow-400`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className={`relative ${size}`}>
            <Star className={`${size} text-gray-300 absolute`} />
            <div className="overflow-hidden w-2 absolute">
              <Star className={`${size} fill-yellow-400 text-yellow-400`} />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className={`${size} text-gray-300`} />
        );
      }
    }
    
    return stars;
  };

  // Render interactive stars for user rating
  const renderInteractiveStars = (storeId) => {
    const currentRating = userRatings[storeId] || 0;
    const hovered = hoveredRating[storeId] || 0;
    const displayRating = hovered || currentRating;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => handleRating(storeId, num)}
            onMouseEnter={() => setHoveredRating({ ...hoveredRating, [storeId]: num })}
            onMouseLeave={() => setHoveredRating({ ...hoveredRating, [storeId]: 0 })}
            disabled={submittingRating === storeId}
            className="transition-transform hover:scale-110 disabled:opacity-50"
          >
            <Star
              className={`w-6 h-6 transition-all ${
                num <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            />
          </button>
        ))}
        {currentRating > 0 && (
          <span className="ml-2 text-sm font-medium text-gray-700">
            You rated: {currentRating}
          </span>
        )}
      </div>
    );
  };

  // Calculate stats
  const totalStores = stores.length;
  const ratedStores = stores.filter(s => s.averageRating).length;
  const averageRating = ratedStores > 0 
    ? (stores.reduce((acc, s) => acc + (s.averageRating || 0), 0) / ratedStores).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-600" />
            Browse & Rate Stores
          </h1>
          <p className="text-gray-600">Discover stores and share your experience</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Stores</p>
                <p className="text-3xl font-bold text-gray-800">{totalStores}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-gray-800">{averageRating}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Your Ratings</p>
                <p className="text-3xl font-bold text-gray-800">{Object.keys(userRatings).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stores by name or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Filters</span>
            </button>
          </div>
        </div>

        {/* Stores Grid/List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-block w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading stores...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No stores found</h3>
            <p className="text-gray-600">
              {search ? "Try adjusting your search criteria" : "No stores available at the moment"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
              >
                {/* Card Header with Gradient */}
                <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-indigo-600">
                          {store.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg truncate">
                          {store.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating Badge */}
                  {store.averageRating && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-800">{store.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Address */}
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {store.address || "No address provided"}
                    </p>
                  </div>

                  {/* Overall Rating Display */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Overall Rating</p>
                    <div className="flex items-center gap-2">
                      {renderStars(store.averageRating, "w-5 h-5")}
                      {store.averageRating && (
                        <span className="text-sm font-medium text-gray-700">
                          {store.averageRating.toFixed(1)} / 5.0
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Your Rating Section */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Rate This Store</p>
                    {renderInteractiveStars(store.id)}
                    {submittingRating === store.id && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-indigo-600">
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving rating...</span>
                      </div>
                    )}
                    {userRatings[store.id] && submittingRating !== store.id && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Rating saved!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredStores.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-800">{filteredStores.length}</span> of{" "}
              <span className="font-semibold text-gray-800">{totalStores}</span> stores
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;