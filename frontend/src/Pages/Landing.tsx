import { Ghost, Video, FileText, PenTool } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col items-center text-white">
      {/* Navbar */}
      

      {/* Hero Section */}
      <section className="w-full max-w-5xl text-center py-20 px-4 relative">
        <div className="absolute inset-0 blur-3xl bg-indigo-900/10 rounded-full transform -translate-y-1/2"></div>
        <div className="relative">
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 text-sm">
            <Ghost className="h-4 w-4 mr-2" />
            Meet the future of meetings
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            AI-Powered Meeting Assistant
          </h1>
          <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
            Phantom AI joins your meetings, records conversations, generates
            transcripts, and provides concise summaries with advanced AI technology.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={()=>navigate('/login')} className="px-8 py-4 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300 font-medium flex items-center justify-center">
              <Ghost className="h-5 w-5 mr-2" />
              Get Started
            </button>
          </div>
        </div>
      </section>
      
      {/* Stats */}
      <div className="w-full max-w-5xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {[
            { value: "100+", label: "Enterprise Clients" },
            { value: "5,000+", label: "Meetings Analyzed" },
            { value: "98%", label: "Accuracy Rate" }
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="w-full max-w-5xl py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Phantom AI leverages cutting-edge technology to enhance your meeting experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Video className="h-6 w-6 text-indigo-400" />,
              title: "Auto Recording",
              desc: "Seamless meeting recording for future reference with intelligent noise cancellation."
            },
            {
              icon: <PenTool className="h-6 w-6 text-indigo-400" />,
              title: "AI-Powered Summaries",
              desc: "Get concise insights from long discussions with key points and action items highlighted."
            },
            {
              icon: <FileText className="h-6 w-6 text-indigo-400" />,
              title: "Accurate Transcripts",
              desc: "Turn spoken words into precise text with speaker recognition and formatting."
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 hover:border-indigo-500/50 hover:bg-gray-800/60 transition-all duration-300 group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-900/40 mb-4 group-hover:bg-indigo-800/60 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* How it works section */}
      <section id="how-it-works" className="w-full max-w-5xl py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How Phantom AI Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our simple 3-step process makes meetings more productive
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Connect",
              desc: "Invite Phantom AI to your meeting with a simple link or integration."
            },
            {
              step: "02",
              title: "Capture",
              desc: "Phantom AI silently records and processes your meeting in real-time."
            },
            {
              step: "03",
              title: "Analyze",
              desc: "Review AI-generated summaries, transcripts, and action items after your meeting."
            },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="p-6 bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 hover:border-indigo-500/50 hover:bg-gray-800/60 transition-all duration-300">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center bg-indigo-600 text-white font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mt-4 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-gray-600">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      
      
      {/* Footer */}
      
    </div>
  );
};

export default LandingPage;