import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useFetcher, useNavigate, useRouteError, isRouteErrorResponse } from 'react-router';
import { db } from '~/.server/db';
import { surveyResponses } from '~/.server/db/schema';
import type { Route } from './+types/Survey';
import { surveySchema, surveyFormConfig } from '~/types/survey';
import type { FormData } from '~/types/survey';

export async function action({request}: Route.ActionArgs) {
    let body = await request.json();
    const{userId='',...data}=body;
    const validatedData = surveySchema.safeParse(data);
   
    if (!validatedData.success) {
        return new Response(JSON.stringify({error: "Invalid data"}), {
            status: 400
        });
    }

    try {
        await db.insert(surveyResponses).values({
            userId,
            surveyId: 'health-finance-survey',
            response: validatedData.data,
        });

        return new Response(JSON.stringify({
            message: "Survey submitted successfully"
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({
            error: "Failed to save survey response"
        }), {
            status: 500
        });
    }
}

export function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    let errorMessage = "An unexpected error occurred.";
    let errorDetails = "";

    if (isRouteErrorResponse(error)) {
        if (error.status === 400) {
            errorMessage = "Invalid form submission";
            try {
                const data = JSON.parse(error.data);
                errorDetails = data.error;
            } catch {
                errorDetails = error.data;
            }
        } else if (error.status === 500) {
            errorMessage = "Server error";
            errorDetails = "Unable to save your survey response. Please try again later.";
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">{errorMessage}</h2>
                        {errorDetails && (
                            <p className="text-gray-600 mb-6">{errorDetails}</p>
                        )}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Survey() {
    const fetcher = useFetcher();
    let navigate = useNavigate();
    const { register, formState: { errors }, handleSubmit, trigger, getValues, setValue } = useForm<FormData>({
        resolver: zodResolver(surveySchema),
        defaultValues: {
            age: undefined,
            healthStatus: undefined,
            chronicConditions: [],
            annualIncome: undefined,
            retirementSavings: undefined
        },
        mode: "onChange"
    });

    const [step, setStep] = useState(0);
    const steps = Object.keys(surveyFormConfig) as Array<keyof FormData>;
    const currentStep = surveyFormConfig[steps[step]];

    useEffect(() => {
        const savedData = localStorage.getItem('formData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData) as { step: number; data: Partial<FormData> };
                setStep(parsedData.step || 0);
                if (parsedData.data && typeof parsedData.data === 'object') {
                    Object.entries(parsedData.data).forEach(([key, value]) => {
                        if (value !== undefined && value !== null) {
                            setValue(key as keyof FormData, value as any);
                        }
                    });
                }
            } catch (error) {
                console.error('Error parsing saved form data:', error);
                localStorage.removeItem('formData');
            }
        }
    }, [setValue]);

    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify({data:getValues(),step}));
    }, [step]);

    useEffect(() => {
        if (fetcher.state === 'idle' && !fetcher.data?.error) {
            if (fetcher.data?.message === "Survey submitted successfully") {
                localStorage.clear();
                navigate('/survey/review');
            }
        }
    }, [fetcher.state, fetcher.data, navigate]);

    async function toNextStep() {
        const isValid = await trigger(steps[step]);
        if (step < steps.length - 1 && isValid) {
            setStep(step + 1);
        }
    }

    function toPrevStep() {
        if (step > 0) {
            setStep(step - 1);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            {/* Back button */}
            <div className="max-w-4xl mx-auto mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Home
                </button>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 transition-shadow hover:shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Health & Financial Survey</h2>

                {/* Add error feedback */}
                {fetcher.data?.error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600">{fetcher.data.error}</p>
                        </div>
                    </div>
                )}

                <span className='text-slate-400 text-sm mb-2 block'>{`Step ${step + 1} of ${steps.length}`}</span>

                {currentStep && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">{currentStep.title}</h3>
                        <p className="text-sm text-slate-600">{currentStep.description}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(async(data) => {
                    await fetcher.submit({...data,userId:Math.floor(Math.random()*101)}, {
                        method: 'post',
                        encType: 'application/json',
                        action: '/survey'
                    });
                })} className="space-y-6">
                    <div className='h-[300px] overflow-y-auto'>
                        {currentStep?.input_type === 'checkbox' && (
                            <div className="grid sm:grid-cols-2 gap-3">
                                {currentStep.options?.map((option) => (
                                    <label key={option} className="flex items-center p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            value={option}
                                            {...register(steps[step])}
                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {currentStep?.input_type === 'radio' && (
                            <div className="grid sm:grid-cols-2 gap-3">
                                {currentStep.options?.map((option) => (
                                    <label key={option} className="flex items-center p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                                        <input
                                            type="radio"
                                            value={option}
                                            {...register(steps[step])}
                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {currentStep?.input_type === 'numeric' && (
                            <div className="relative rounded-md shadow-sm">
                                {currentStep.prefix && (
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">{currentStep.prefix}</span>
                                    </div>
                                )}
                                <input
                                    type="number"
                                    placeholder={currentStep.placeholder}
                                    {...register(steps[step], { valueAsNumber: true })}
                                    className={`block w-full rounded-md ${currentStep.prefix ? 'pl-7' : 'px-3'} py-2 border ${
                                        errors[steps[step]] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    } shadow-sm focus:outline-none focus:ring-1 sm:text-sm transition-colors`}
                                />
                            </div>
                        )}

                        {errors[steps[step]] && (
                            <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                                {errors[steps[step]]?.message?.toString()}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between mt-6">
                        {step > 0 && (
                            <button
                                type="button"
                                onClick={toPrevStep}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Previous
                            </button>
                        )}
                        {step < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={toNextStep}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={fetcher.state === 'submitting'}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                                {fetcher.state === 'submitting' ? 'Submitting...' : 'Submit'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Survey;