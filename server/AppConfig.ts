export const getAppConfig = () => {
    return {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
        JWT_SECRET: process.env.JWT_SECRET || '',
        MONGODB_URI: process.env.MONGODB_URI || '',
    }
}
