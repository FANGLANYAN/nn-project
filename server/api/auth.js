// /server/api/auth.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
    providers: [
        // Google OAuth 登录
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        // 邮箱密码登录
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const user = await verifyUser(credentials.email, credentials.password);
                if (user) {
                    return user; // 返回用户信息
                }
                return null; // 如果没有找到用户，返回 null
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.uid = token.uid; // 确保 UID 在 session 中
            return session;
        },
    },
});

async function verifyUser(email, password) {
    // 这里与数据库连接，验证用户邮箱和密码
    // 例如：在 Supabase 中查找用户，并验证密码
    const user = await findUserInDatabase(email, password);
    return user;
}

async function findUserInDatabase(email, password) {
    // 假设这是与数据库交互的函数，找到用户并验证密码
    // 这里只是一个简单的示例，可以根据您的需求进行修改
    return { email, uid: 'unique-uid-1234' }; // 返回一个用户对象（示例）
}
