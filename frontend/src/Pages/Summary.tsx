import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function Summary() {
    const [searchParams] = useSearchParams();
    const [videoInfo, setVideoInfo] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("summary");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    
    const videoId = searchParams.get("videoId");

    async function fetchVideoData() {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:3000/getVideo", {
                videoId: videoId
            });
            setVideoInfo(res.data.data);
            setError(null);
        } catch (err) {
            setError("Failed to load video data. Please try again later.");
            console.error("Error fetching video:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (videoId) {
            fetchVideoData();
        } else {
            setError("No video ID provided");
            setLoading(false);
        }
    }, [videoId]);

    const parseXML = (xmlString: string | null) => {
        if (!xmlString) return { sections: [], todos: [] }; // Prevents null/undefined issues
    
        const headingRegex = /<heading>(.*?)<\/heading>/gs;
        const textRegex = /<text>(.*?)<\/text>/gs;
        const pointRegex = /<point>(.*?)<\/point>/gs;
        const todoRegex = /<todo>(.*?)<\/todo>/gs;
    
        const sections: any[] = [];
        const matches = xmlString.match(/<summary>(.*?)<\/summary>/gs);
    
        if (matches) {
            matches.forEach((match) => {
                const heading = (headingRegex.exec(match) || [])[1] || "";
                const text = [...match.matchAll(textRegex)].map(m => m[1]);
                const points = [...match.matchAll(pointRegex)].map(m => m[1]);
                sections.push({ heading, text, points });
            });
        }
    
        const todos = [...xmlString.matchAll(todoRegex)].map(m => m[1]);
    
        return { sections, todos };
    };
    

    const handleShareClick = () => {
        if (videoInfo?.videoLink) {
            navigator.clipboard.writeText(videoInfo.videoLink);
            setShowShareTooltip(true);
            setTimeout(() => {
                setShowShareTooltip(false);
            }, 2000);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-6">
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-700 dark:text-gray-300 font-inter">Loading meeting data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-6 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <div className="text-red-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 font-inter">Error</h2>
                    <p className="text-gray-600 dark:text-gray-300 font-inter">{error}</p>
                    <button 
                        onClick={fetchVideoData}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-inter"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!videoInfo) return null;

    const { sections, todos } = parseXML(videoInfo.summary);
    const meetingDate = new Date(videoInfo.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    const meetingTime = new Date(videoInfo.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-sm p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-inter">Meeting Summary</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 font-inter">
                                {meetingDate} at {meetingTime}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium font-inter">
                                ID: {videoInfo.videoId.substring(0, 8)}
                            </span>
                        </div>
                    </div>
                </div>

                
                <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                       
                        <div className="lg:w-2/5 border-r border-gray-200 dark:border-gray-700">
                           
                            <div className="bg-gray-900 relative">
                                <video controls className="w-full h-auto object-contain">
                                    <source src={videoInfo?.videoLink} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div className="absolute top-4 right-4">
                                    <div className="relative">
                                        <button 
                                            onClick={handleShareClick}
                                            className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md transition-all"
                                            aria-label="Share video"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                            </svg>
                                        </button>
                                        {showShareTooltip && (
                                            <div className="absolute right-0 top-full mt-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                Video link copied!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white font-inter">Action Items</h3>
                                    <button 
                                        onClick={handleShareClick}
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                        </svg>
                                        Share
                                    </button>
                                </div>
                                {todos.length > 0 ? (
                                    <ul className="space-y-3">
                                        {todos.map((todo, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="size-3 rounded-full bg-blue-200 mx-5 shrink-0 my-2"></span>
                                                <span className="text-gray-700 dark:text-gray-200 font-inter leading-relaxed">{todo}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 italic font-inter">No action items for this meeting</p>
                                )}
                            </div>
                            
                            
                            <div className="p-6 pt-0">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-inter mb-3">Meeting Details</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">Created</p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 font-inter">
                                                {new Date(videoInfo.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">Last Updated</p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 font-inter">
                                                {new Date(videoInfo.updated_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">Video Link</p>
                                                <button 
                                                    onClick={handleShareClick}
                                                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    Copy Link
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 font-inter truncate">
                                                {videoInfo.videoLink}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                        <div className="lg:w-3/5">
                            
                            <div className="flex border-b border-gray-200 dark:border-gray-700">
                                <button 
                                    className={`flex-1 py-4 px-6 font-medium focus:outline-none font-inter ${
                                        activeTab === "summary" 
                                            ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400" 
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                                    onClick={() => setActiveTab("summary")}
                                >
                                    Summary
                                </button>
                                <button 
                                    className={`flex-1 py-4 px-6 font-medium focus:outline-none font-inter ${
                                        activeTab === "transcript" 
                                            ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400" 
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                                    onClick={() => setActiveTab("transcript")}
                                >
                                    Transcript
                                </button>
                                <div className="flex items-center px-4">
                                    <button 
                                        onClick={handleShareClick}
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                        title="Share video link"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                        </svg>
                                        Share
                                    </button>
                                </div>
                            </div>
                            
                            {/* Content Area */}
                            <div className="p-6 overflow-y-auto max-h-screen">
                                {activeTab === "summary" && (
                                    <div className="space-y-8">
                                        {sections.map((section, index) => (
                                            <div key={index} className="pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 font-inter">{section.heading}</h2>
                                                {section.text.map((t: string, i: number) => (
                                                    <p key={i} className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed font-inter">{t}</p>
                                                ))}
                                                {section.points.length > 0 && (
                                                    <ul className="mt-4 space-y-2">
                                                        {section.points.map((p: string, i: number) => (
                                                            <li key={i} className="flex items-start">
                                                                <span className="inline-flex items-center justify-center w-6 h-6 mr-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full flex-shrink-0 text-sm">
                                                                    {i + 1}
                                                                </span>
                                                                <span className="text-gray-700 dark:text-gray-200 font-inter">{p}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {activeTab === "transcript" && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 font-inter">Full Transcript</h3>
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-inter">{videoInfo.transcript}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}