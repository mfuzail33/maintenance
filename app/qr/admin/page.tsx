export default function UnauthorizedAccess() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="mb-6">
            <svg 
              className="w-16 h-16 mx-auto text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
              <circle cx="12" cy="7" r="4" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 leading-relaxed">
            You're not authorized to access this info, only admin can view these details
          </p>
        </div>
      </div>
    );
  }