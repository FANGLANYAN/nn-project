import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "@/lib/supabase/client"

export default defineEventHandler(async (event) => {
    const handler = await NextAuth(event, {
        providers: [
            CredentialsProvider({
                name: "Email/Password",
                credentials: {
                    email: { label: "Email", type: "email" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials) {
                    // 使用 Supabase 进行登录验证
                    const { data: user, error } = await supabase
                        .from('users')
                        .select('*')
                        .eq('email', credentials?.email)
                        .single()

                    if (!user || error) throw new Error('Invalid credentials')
                    // 这里可以验证密码
                    if (user.password !== credentials?.password) throw new Error('Invalid password')

                    return { id: user.id, email: user.email, name: user.name }
                }
            }),
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!
            })
        ],
        pages: {
            signIn: '/auth/login',
            error: '/auth/login'
        },
        session: {
            strategy: 'jwt'
        },
        callbacks: {
            async jwt({ token, user }) {
                if (user) token.user = user
                return token
            },
            async session({ session, token }) {
                session.user = token.user
                return session
            }
        }
    })

    return handler(event)
})
