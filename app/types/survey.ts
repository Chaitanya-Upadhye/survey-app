import { z } from 'zod';

export const surveySchema = z.object({
    // Demographic information
    age: z.number()
        .min(18, "Must be at least 18 years old")
        .max(120, "Please enter a valid age")
        .refine(value => !isNaN(value), {
            message: "Please enter a valid age"
        }),

    // Health information
    healthStatus: z.enum(["Excellent", "Good", "Fair", "Poor"], {
        required_error: "Please select your current health status"
    }),

    chronicConditions: z.array(z.enum([
        "Diabetes",
        "Heart Disease",
        "Arthritis",
        "High Blood Pressure",
        "Asthma",
        "Cancer",
        "Depression",
        "Chronic Pain",
        "None of the above"
    ]))
        .min(1, "Please select at least one option")
        .max(5, "Please select up to 5 conditions"),

    // Financial information
    annualIncome: z.enum([
        "Less than $30,000",
        "$30,000 - $50,000",
        "$50,001 - $75,000",
        "$75,001 - $100,000",
        "$100,001 - $150,000",
        "$150,001 - $200,000",
        "More than $200,000"
    ], {
        required_error: "Please select your annual income range"
    }),

    retirementSavings: z.number()
        .min(0, "Retirement savings cannot be negative")
        .optional(),
});

export type FormField = {
    title: string;
    description: string;
    input_type: 'numeric' | 'radio' | 'checkbox';
    required: boolean;
    placeholder?: string;
    prefix?: string;
    options?: string[];
    maxSelect?: number;
}

export type FormConfig = {
    [K in keyof typeof surveySchema._type]: FormField;
}

export type FormData = z.infer<typeof surveySchema>;

export const surveyFormConfig: FormConfig = {
    age: {
        title: "Age",
        description: "Please enter your current age",
        input_type: "numeric",
        placeholder: "Enter age (18-120)",
        required: true
    },
    healthStatus: {
        title: "Current Health Status",
        description: "How would you rate your overall health?",
        input_type: "radio",
        options: ["Excellent", "Good", "Fair", "Poor"],
        required: true
    },
    chronicConditions: {
        title: "Chronic Health Conditions",
        description: "Select all conditions that apply to you (up to 5)",
        input_type: "checkbox",
        options: [
            "Diabetes",
            "Heart Disease",
            "Arthritis",
            "High Blood Pressure",
            "Asthma",
            "Cancer",
            "Depression",
            "Chronic Pain",
            "None of the above"
        ],
        required: true,
        maxSelect: 5
    },
    annualIncome: {
        title: "Annual Income Range",
        description: "Select your approximate annual household income",
        input_type: "radio",
        options: [
            "Less than $30,000",
            "$30,000 - $50,000",
            "$50,001 - $75,000",
            "$75,001 - $100,000",
            "$100,001 - $150,000",
            "$150,001 - $200,000",
            "More than $200,000"
        ],
        required: true
    },
    retirementSavings: {
        title: "Retirement Savings",
        description: "Enter your total retirement savings across all accounts",
        input_type: "numeric",
        placeholder: "Enter amount in USD",
        required: false,
        prefix: "$"
    }
};