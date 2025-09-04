<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-indigo-700 p-4"
  >
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
      <h2 class="text-3xl font-extrabold text-center text-gray-800 mb-6">
        Welcome Back!
      </h2>

      <!-- 登录方式选择 -->
      <div class="space-y-6">
        <!-- 邮箱 + 密码 登录 -->
        <div v-if="mode === 'password'">
          <form @submit.prevent="loginWithPassword" class="space-y-4">
            <div>
              <label
                for="email"
                class="block text-sm font-semibold text-gray-700"
                >Email Address</label
              >
              <input
                id="email"
                type="email"
                v-model="email"
                placeholder="Enter your email"
                required
                class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label
                for="password"
                class="block text-sm font-semibold text-gray-700"
                >Password</label
              >
              <input
                id="password"
                type="password"
                v-model="password"
                placeholder="Enter your password"
                required
                class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {{ loading ? "Logging in..." : "Login with Email & Password" }}
            </button>
          </form>
        </div>

        <!-- 邮箱 + Magic Link 登录 -->
        <div v-if="mode === 'otp'">
          <form @submit.prevent="loginWithMagicLink" class="space-y-4">
            <div>
              <label
                for="otp-email"
                class="block text-sm font-semibold text-gray-700"
                >Email Address</label
              >
              <input
                id="otp-email"
                type="email"
                v-model="email"
                placeholder="Enter your email"
                required
                class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {{ loading ? "Sending Magic Link..." : "Send Magic Link" }}
            </button>
          </form>
        </div>

        <!-- Google 登录 -->
        <div>
          <button
            @click="loginWithGoogle"
            :disabled="loading"
            class="w-full py-3 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400"
          >
            {{ loading ? "Redirecting..." : "Login with Google" }}
          </button>
        </div>

        <!-- 切换登录方式 -->
        <div class="mt-4 text-center text-sm text-gray-600 space-x-2">
          <button
            @click="switchMode('password')"
            class="text-indigo-600 hover:underline"
          >
            Login with Email & Password
          </button>
          <span>|</span>
          <button
            @click="switchMode('otp')"
            class="text-indigo-600 hover:underline"
          >
            Login with Magic Link
          </button>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="text-red-500 text-center text-sm mt-2">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signIn } from "next-auth/react";

const router = useRouter();
const email = ref("");
const password = ref("");
const mode = ref<"password" | "otp">("password");
const loading = ref(false);
const error = ref("");

const switchMode = (newMode: "password" | "otp") => {
  mode.value = newMode;
  error.value = "";
};

// 邮箱 + 密码登录
const loginWithPassword = async () => {
  loading.value = true;
  error.value = "";
  try {
    const res = await signIn("credentials", {
      email: email.value,
      password: password.value,
      redirect: false,
    });
    if (res?.ok) router.push("/");
    else error.value = res?.error || "Invalid credentials";
  } catch (e: any) {
    error.value = e.message || "Login failed";
  } finally {
    loading.value = false;
  }
};

// 邮箱 + Magic Link 登录
const loginWithMagicLink = async () => {
  loading.value = true;
  error.value = "";
  try {
    const res = await signIn("magiclink", {
      email: email.value,
      redirect: false,
    });
    if (res?.ok) {
      alert("Magic link sent to your email!");
    } else {
      error.value = res?.error || "Failed to send magic link";
    }
  } catch (e: any) {
    error.value = e.message || "Login failed";
  } finally {
    loading.value = false;
  }
};

// Google 登录
const loginWithGoogle = async () => {
  loading.value = true;
  error.value = "";
  try {
    await signIn("google");
  } catch (e: any) {
    error.value = e.message || "Google login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 背景渐变 */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, #4c6ef5, #6779f1, #8f66e4);
}
</style>
