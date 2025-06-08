import { desc } from 'drizzle-orm';
import { useLoaderData } from 'react-router';
import { db } from '~/.server/db'
import { surveyResponses } from '~/.server/db/schema';
import type { FormData } from '~/types/survey';

export async function loader() {
    try {
        const latestSubmission = await db.query.surveyResponses.findFirst({
            orderBy: [desc(surveyResponses.createdAt)],
        });

        if (!latestSubmission) {
            return { error: "No submissions found" };
        }

        return { submission: latestSubmission };
    } catch (error) {
        console.error('Database error:', error);
        return { error: "Failed to fetch submission" };
    }
}

function Review() {
    const { submission, error } = useLoaderData<typeof loader>();

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
                    <div className="flex items-center justify-center h-40">
                        <p className="text-red-600 text-lg">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const response = submission?.response ? (submission.response as unknown as FormData) : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white">Survey Response Summary</h2>
                        <p className="text-blue-100 text-sm mt-1">Submitted on {submission?.createdAt ? new Date(submission.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : 'Unknown date'}</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                        {response ? (
                            <div className="divide-y divide-gray-200">
                                {/* Demographics Section */}
                                <section className="py-6 first:pt-0">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographics</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Age</p>
                                                <p className="mt-1 text-lg text-gray-900">{response.age} years old</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Health Status Section */}
                                <section className="py-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Current Health Status</p>
                                            <div className="mt-1">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    response.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' :
                                                    response.healthStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                                                    response.healthStatus === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {response.healthStatus}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Chronic Conditions</p>
                                            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {response.chronicConditions.map(condition => (
                                                    <div key={condition} className="flex items-center space-x-2">
                                                        <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-gray-700">{condition}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Financial Information Section */}
                                <section className="py-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Annual Income Range</p>
                                            <p className="mt-1 text-lg text-gray-900">{response.annualIncome}</p>
                                        </div>

                                        {response.retirementSavings && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Retirement Savings</p>
                                                <p className="mt-1 text-lg text-gray-900">
                                                    ${response.retirementSavings.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-40">
                                <p className="text-gray-500 text-lg">No survey response found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Review;