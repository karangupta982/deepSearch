export type Model = {
    name: string;
    key: string;
    description: string;
};

export const MODELS: { [key: string]: Model } = {
    "gemini/pro": {
        name: "Gemini Pro",
        key: "gemini-1.0-pro",
        description: "Fast and capable",
    },
    "gemini/ultra": {
        name: "Gemini Ultra",
        key: "gemini-1.0-ultra",
        description: "Most advanced model",
    },
};
