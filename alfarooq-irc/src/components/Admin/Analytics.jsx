"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, Users, BookOpen, Eye, Heart, MessageSquare, Calendar, Award, Activity, Target, Clock, Globe, UserCheck, Bookmark } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Initialize Supabase client
// const supabaseUrl = 'https://your-project.supabase.co'; // Replace with your Supabase URL
// const supabaseKey = 'your-anon-key'; // Replace with your anon key
// const supabase = createClient(supabaseUrl, supabaseKey);


const Analytics = () => {
    const [timeRange, setTimeRange] = useState('7d');
    const [selectedMetric, setSelectedMetric] = useState('total_views');
    const [loading, setLoading] = useState(true);

    // State for all analytics data
    const [analyticsData, setAnalyticsData] = useState({
        totalUsers: 0,
        totalQuestions: 0,
        totalViews: 0,
        totalLikes: 0,
        totalBookmarks: 0,
        activeUsers: 0,
        authenticatedUsers: 0,
        anonymousUsers: 0
    });

    const [dailyActivity, setDailyActivity] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [subcategoryData, setSubcategoryData] = useState([]);
    const [topQuestions, setTopQuestions] = useState([]);
    const [userActivity, setUserActivity] = useState([]);
    const [sessionActivity, setSessionActivity] = useState([]);
    const [recentQuestions, setRecentQuestions] = useState([]);

    // Fetch overview statistics
    const fetchOverviewStats = async () => {
        try {
            // Get total questions from UserQuestions
            const { data: questions, error: questionsError } = await supabase
                .from('admin_dashboard_analytics')
                .select('*');

            // Get total users from qna_view
            const { data: users, error: usersError } = await supabase
                .from('AnonymousUser')
                .select('*')
            // .not('Q_User', 'is', null);

            // Get authenticated users count
            const { data: authUsers, error: authError } = await supabase
                .from('AuthenticatedUsers')
                .select('user_id');

            // Get anonymous users count
            const { data: anonUsers, error: anonError } = await supabase
                .from('AnonymousUser')
                .select('session_id');

            // Calculate totals
            const totalViews = questions?.reduce((sum, q) => sum + (q.total_views || 0), 0) || 0;
            const totalLikes = questions?.reduce((sum, q) => sum + (q.total_likes || 0), 0) || 0;
            const totalBookmarks = questions?.reduce((sum, q) => sum + (q.total_bookmarks || 0), 0) || 0;

            // Get unique users
            const uniqueUsers = new Set(users?.map(u => u.session_id)).size || 0;
            const uniqueAuthUsers = new Set(authUsers?.map(u => u.user_id)).size || 0;

            setAnalyticsData({
                totalUsers: uniqueUsers + uniqueAuthUsers,
                totalQuestions: questions?.length || 0,
                totalViews,
                totalLikes,
                totalBookmarks,
                authenticatedUsers: authUsers?.length || 0,
                anonymousUsers: anonUsers?.length || 0,
                activeUsers: Math.floor(uniqueUsers * 0.15) // Estimate 15% active
            });

        } catch (error) {
            console.error('Error fetching overview stats:', error);
        }
    };

    // Fetch daily activity data
    const fetchDailyActivity = async () => {
        try {
            const { data, error } = await supabase
                .from('admin_dashboard_analytics')
                .select('Published_At, total_views, total_likes, total_bookmarks, Q_User')
                .not('Published_At', 'is', null)
                .order('Published_At', { ascending: false })
                .limit(100);

            if (data) {
                // Group by date
                const groupedData = {};
                data.forEach(item => {
                    const date = new Date(item.Published_At).toISOString().split('T')[0];
                    if (!groupedData[date]) {
                        groupedData[date] = {
                            date,
                            questions: 0,
                            total_views: 0,
                            total_likes: 0,
                            total_bookmarks: 0,
                            users: new Set()
                        };
                    }
                    groupedData[date].questions += 1;
                    groupedData[date].total_views += item.total_views || 0;
                    groupedData[date].total_likes += item.total_likes || 0;
                    groupedData[date].total_bookmarks += item.total_bookmarks || 0;
                    groupedData[date].users.add(item.Q_User);
                });

                const chartData = Object.values(groupedData)
                    .map(day => ({
                        ...day,
                        users: day.users.size
                    }))
                    .slice(0, 7)
                    .reverse();

                setDailyActivity(chartData);
            }
        } catch (error) {
            console.error('Error fetching daily activity:', error);
        }
    };

    // Fetch category distribution
    const fetchCategoryData = async () => {
        try {
            const { data, error } = await supabase
                .from('qna_view')
                .select('*');

            if (data) {
                const categoryCount = {};
                data.forEach(item => {

                    const cat = item.Cat_Name || item.Cat_ID || 'دیگر';
                    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
                });

                const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];
                const chartData = Object.entries(categoryCount).map(([name, value], index) => ({
                    name,
                    value,
                    color: colors[index % colors.length]
                }));

                setCategoryData(chartData);
            }
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    };

    const fetchSubcategoryData = async () => {
        try {
            // Fetch all QnA data
            const { data: qnaData, error: qnaError } = await supabase
                .from('QnA')
                .select('Q_ID, Subcat_ID'); // Only fetch necessary columns

            // Fetch all views data
            const { data: viewsData, error: viewsError } = await supabase
                .from('Views')
                .select('Q_ID, session_id'); // Fetch views data

            // Fetch all subcategory data
            const { data: subcategoryData, error: subcategoryError } = await supabase
                .from('Subcategory')
                .select('Subcat_Name, Subcat_ID'); // Fetch subcategory data

            if (qnaError || viewsError || subcategoryError) {
                console.error('Error fetching data:', qnaError || viewsError || subcategoryError);
                return;
            }

            // Combine the data
            const subcategoryCount = {};

            qnaData.forEach(item => {
                const subcat = subcategoryData.find(sub => sub.Subcat_ID === item.Subcat_ID)?.Subcat_Name || 'دیگر';  // Find Subcategory name
                const views = viewsData.filter(view => view.Q_ID === item.Q_ID);
                const viewCount = views.length;  // Count the number of views for this Q_ID
                subcategoryCount[subcat] = (subcategoryCount[subcat] || 0) + viewCount;
            });

            // Sort and get the top 10 subcategories by view count
            const sortedData = Object.entries(subcategoryCount)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([name, value]) => ({ name, value }));

            setSubcategoryData(sortedData); // Set the data for display or further processing
        } catch (error) {
            console.error('Error fetching subcategory data:', error);
        }
    };



    // Fetch top questions
    const fetchTopQuestions = async () => {
        try {
            const { data, error } = await supabase
                .from('admin_dashboard_analytics')
                .select('Q_ID, Q_Heading, total_views, total_likes, total_bookmarks, category, Published_At, Q_User')
                .order('total_views', { ascending: false })
                .limit(10);

            if (data) {
                setTopQuestions(data);
            }
        } catch (error) {
            console.error('Error fetching top questions:', error);
        }
    };

    // Fetch user activity data
    const fetchUserActivity = async () => {
        try {
            const { data, error } = await supabase
                .from('qna_view')
                .select('Q_User, Published_At')
                .not('Q_User', 'is', null)
                .not('Published_At', 'is', null)
                .order('Published_At', { ascending: false })
                .limit(200);

            if (data) {
                // Group by user and count activity
                const userCount = {};
                data.forEach(item => {
                    const user = item.Q_User;
                    userCount[user] = (userCount[user] || 0) + 1;
                });

                const activityData = Object.entries(userCount)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([user, count]) => ({ user: user.substring(0, 20) + '...', questions: count }));

                setUserActivity(activityData);
            }
        } catch (error) {
            console.error('Error fetching user activity:', error);
        }
    };

    // Fetch session activity from user_interactions_view
    const fetchSessionActivity = async () => {
        try {
            const { data, error } = await supabase
                .from('Views')
                .select('session_id, created_at')
                .order('created_at', { ascending: false })
                .limit(100);

            if (data) {
                // Group by hour of day
                const hourlyCount = Array.from({ length: 24 }, (_, i) => ({ hour: i.toString().padStart(2, '0'), sessions: 0 }));

                data.forEach(session => {
                    const hour = new Date(session.created_at).getHours();
                    hourlyCount[hour].sessions += 1;
                });

                setSessionActivity(hourlyCount);
            }
        } catch (error) {
            console.error('Error fetching session activity:', error);
        }
    };

    // Fetch recent questions
    const fetchRecentQuestions = async () => {
        try {
            const { data, error } = await supabase
                .from('qna_view')
                .select('Q_ID, Q_Heading, Published_At, Cat_Name, Subcat_Name')
                .order('Q_ID', { ascending: false })
                .limit(5);

            if (data) {
                setRecentQuestions(data);
            }
        } catch (error) {
            console.error('Error fetching recent questions:', error);
        }
    };

    // Load all data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchOverviewStats(),
                fetchDailyActivity(),
                fetchCategoryData(),
                fetchSubcategoryData(),
                fetchTopQuestions(),
                fetchUserActivity(),
                fetchSessionActivity(),
                fetchRecentQuestions()
            ]);
            setLoading(false);
        };

        loadData();
    }, [timeRange]);

    const StatCard = ({ title, value, change, icon: Icon, color = "blue", loading = false }) => (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    {loading ? (
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{value?.toLocaleString() || 0}</p>
                    )}
                    {change && (
                        <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {change}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full bg-${color}-100`}>
                    <Icon className={`h-8 w-8 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-xl shadow-lg p-6 h-32"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">Real-time insights from your ALFarooqIRC platform</p>

                    {/* Time Range Selector */}
                    <div className="flex gap-2 mt-4">
                        {['24h', '7d', '30d', '90d'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Users"
                        value={analyticsData.totalUsers}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        title="Total Questions"
                        value={analyticsData.totalQuestions}
                        icon={BookOpen}
                        color="green"
                    />
                    <StatCard
                        title="Total Views"
                        value={analyticsData.totalViews}
                        icon={Eye}
                        color="purple"
                    />
                    <StatCard
                        title="Total Likes"
                        value={analyticsData.totalLikes}
                        icon={Heart}
                        color="red"
                    />
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Total Bookmarks"
                        value={analyticsData.totalBookmarks}
                        icon={Bookmark}
                        color="yellow"
                    />
                    <StatCard
                        title="Authenticated Users"
                        value={analyticsData.authenticatedUsers}
                        icon={UserCheck}
                        color="green"
                    />
                    <StatCard
                        title="Anonymous Users"
                        value={analyticsData.anonymousUsers}
                        icon={Users}
                        color="gray"
                    />
                </div>

                {/* Daily Activity Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Daily Activity Trends</h3>
                        <select
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="questions">Questions</option>
                            <option value="total_views">Views</option>
                            <option value="total_likes">Likes</option>
                            <option value="total_bookmarks">Bookmarks</option>
                            <option value="users">Active Users</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={dailyActivity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey={selectedMetric}
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution & User Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Category Distribution */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Category Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Most Active Users */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Most Active Users</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userActivity} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="user" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="questions" fill="#10B981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Session Activity & Subcategories */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Hourly Session Activity */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Hourly Session Activity</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={sessionActivity}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sessions" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Subcategories */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Top Subcategories</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={subcategoryData} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Questions Table */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Questions</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Question</th>
                                    {/* <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th> */}
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Views</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Likes</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Bookmarks</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topQuestions.map((question) => (
                                    <tr key={question.Q_ID} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-gray-900 truncate max-w-xs">
                                                {question.Q_Heading}
                                            </p>
                                        </td>
                                        {/* <td className="py-3 px-4 text-sm text-gray-600">
                                            {question.Q_User === 'system' ? 'System' : 'User'}
                                        </td> */}
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {question.category || 'عام'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{question.total_views || 0}</td>
                                        <td className="py-3 px-4 text-gray-600">{question.total_likes || 0}</td>
                                        <td className="py-3 px-4 text-gray-600">{question.total_bookmarks || 0}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {new Date(question.Published_At).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Questions</h3>
                    <div className="space-y-4">
                        {recentQuestions.map((question) => (
                            <div key={question.Q_ID} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 mb-1">{question.Q_Heading}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        {/* <span>By: {question.Q_User === 'system' ? 'System' : 'User'}</span> */}
                                        <span className='border border-[#FCE96A] bg-[#FDFDEA] text-gray-700 p-2 py-1.5 rounded-full'>{question.Cat_Name || ''}</span>
                                        <span className='border text-[#063] border-[#9FDCB4] bg-[#E7F6EC] px-2 py-1.5 rounded-full'>{question.Subcat_Name || ''}</span>
                                        <span>{new Date(question.Published_At).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MessageSquare className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">Q#{question.Q_ID}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;