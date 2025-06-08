import type { Route } from "./+types/home";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Health & Financial Survey" },
    { name: "description", content: "Take our comprehensive health and financial survey" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Welcome to Our Survey Platform
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Help us understand your health and financial needs better
        </p>

        <div 
          onClick={() => navigate("/survey")}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden transform hover:-translate-y-1"
        >
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Health & Financial Survey
                </h2>
                <p className="text-gray-600">
                  Take our comprehensive survey to help us assess your long-term care needs and financial readiness.
                </p>
              </div>
              <div className="hidden sm:block">
                <svg 
                  className="h-12 w-12 text-blue-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-6 flex items-center text-sm text-blue-600">
              <span>Start Survey</span>
              <svg 
                className="ml-2 w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4 border-t">
            <div className="flex items-center text-sm text-gray-600">
              <svg 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Takes approximately 5-10 minutes to complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
