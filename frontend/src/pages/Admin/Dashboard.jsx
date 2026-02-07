import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios.js";
import { Users, Store, Star, TrendingUp, Activity, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/stats");
        setStats(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching stats", err);
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "+12.5%",
      trendUp: true,
      description: "Active users"
    },
    {
      title: "Total Stores",
      value: stats.stores,
      icon: Store,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: "+8.2%",
      trendUp: true,
      description: "Registered stores"
    },
    {
      title: "Total Ratings",
      value: stats.ratings,
      icon: Star,
      gradient: "from-orange-500 to-yellow-500",
      bgGradient: "from-orange-50 to-yellow-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: "+23.1%",
      trendUp: true,
      description: "Customer reviews"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="p-6 max-w-7xl mx-auto">
      
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Real-time overview of your platform
              </p>
            </div>
          </div>
        </div>

        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                 
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                 
                  <div className="relative p-6">
                
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                        stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      } text-xs font-semibold`}>
                        {stat.trendUp ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                        {stat.trend}
                      </div>
                    </div>

                    
                    <div className="mb-2">
                      <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                      <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.value.toLocaleString()}
                      </p>
                    </div>

                   
                    <p className="text-gray-500 text-xs">{stat.description}</p>

                   
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                  </div>
                </div>
              ))}
            </div>

      
           
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;