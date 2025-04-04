import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { Ghost, Link, ExternalLink, AlertCircle } from "lucide-react";

export function AddMeetingLink() {
  const [user] = useAuthState(auth);
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!link) {
      toast.error("Please enter a meeting link");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/create-bot",
        {
          meetLink: link,
        },
        {
          headers: {
            Authorization: `Bearer ${await user?.getIdToken()}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Bot creation request created successfully!");
        setLink("");
      }
    } catch (error) {
      toast.error("Failed to add bot to the meeting. Please try again.");
      console.error("Error adding bot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-700/70 relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="flex items-center mb-6">
              <img src="/phantom2.svg" alt="logo" className="size-10 mx-5"/>
              <h2 className="text-2xl font-bold text-white">Add Meeting Bot</h2>
            </div>
            
            {/* Info panel */}
            <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  Enter the meeting link to add the Phantom AI bot. The bot will join the meeting soon. 
                  <span className="block mt-2 text-blue-300 font-medium">
                    Please remember to admit the bot when prompted.
                  </span>
                </p>
              </div>
            </div>
            
            {/* Form */}
            <div className="mb-6">
              <label htmlFor="meetingLink" className="block text-gray-300 mb-2 font-medium flex items-center">
                <Link className="h-4 w-4 mr-2 text-indigo-400" />
                Meeting Link
              </label>
              <div className="relative">
                <input
                  id="meetingLink"
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-700/70 border border-gray-600/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
                <ExternalLink className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
           
            
            {/* Button */}
            <button
              onClick={handleClick}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-700/20"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Bot...
                </>
              ) : (
                <>
                  <Ghost className="h-5 w-5 mr-2" />
                  Add Phantom Bot
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Security note */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Phantom AI never stores or shares your meeting content without permission</p>
        </div>
      </div>

      {/* Toast Container with Dark Theme */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}