<template>
    <transition name="fade">
        <div v-if="showModal" class="modal-wrapper fixed inset-0 z-50">
            <!-- 遮罩 -->
            <div class="modal-mask absolute inset-0 bg-fill-t-3 backdrop-blur-[8px]" @click="close"></div>

            <!-- 主体内容 -->
            <div
                class="modal-content absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-2 rounded-2xl overflow-hidden h-[710px] w-[404px] 4md:w-[850px] flex content transition-all ease-in duration-200"
                :class="{ '!w-[404px]': !info.imageUrl }"
            >
                <div class="h-full hidden 4md:block shrink-0 relative">
                    <img :src="info.imageUrl" class="h-full object-cover" alt="" />
                    <div
                        class="creatorName py-1 px-3 rounded-lg bg-fill-t-1 backdrop-blur-lg absolute bottom-2 right-2 text-text-t-5 text-xs max-w-[320px] whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        <!-- By {{ info.creator }} -->
                        By @fanglanyan@gmail.com
                    </div>
                </div>
                <div class="min-h-full h-max p-10">
                    <div class="flex flex-col items-center text-sm w-full">
                        <!-- welcome -->
                        <div class="text-text-3 flex flex-col items-center gap-2 mb-8">
                            <VectorLogo class="w-9 h-9" />
                            <div v-show="componentId !== 'ForgotComp'" class="w-full">
                                <h2 class="font-bold text-center text-xl">
                                    {{ componentId === "SignUpComp" ? $t("ACC_SIGN_IN_SIGN_UP") : $t("PROFILE_ACCOUNT_WELCOME") }}
                                </h2>
                            </div>
                        </div>

                        <div class="w-full mx-auto sign-in-account">
                            <component :is="componentMap[componentId]" :btnStyle="btnStyle" @changeComponent="changeComponent" @success="signInSuccess" v-model:hasRemember="hasRemember" />
                        </div>

                        <fieldset class="w-full mt-8 text-sm text-center text-text-5 border-t border-border-1">
                            <legend class="px-6">{{ $t("PROFILE_ACCOUNT_CONTINUE_WITH") }}</legend>
                        </fieldset>

                        <div id="g_id_onload" :data-client_id="clientId" data-auto_prompt="false" data-callback="handleCredentialResponse"></div>

                        <div class="flex justify-center gap-2 items-center h-10 rounded-xl w-full bg-fill-btn-1 mt-4 text-text-2 relative cursor-pointer" @click="handleGoogleBtn">
                            <n-icon size="18">
                                <Google />
                            </n-icon>
                            <span>Google</span>
                            <div id="customBtn" class="w-full absolute top-0 left-0 right-0 bottom-0 opacity-0 z-50"></div>
                        </div>

                        <div class="flex justify-center gap-2 items-center h-10 rounded-xl w-full bg-fill-btn-1 mt-4 text-text-2 cursor-pointer" @click="exciteAppleAuth">
                            <n-icon size="24">
                                <IconApple />
                            </n-icon>
                            <span>Apple</span>
                        </div>
                    </div>

                    <div class="flex flex-wrap justify-center max-w-[80%] text-xs mt-10 text-text-5 mx-auto">
                        <span> By continuing, you agree to our </span>
                        <span class="underline cursor-pointer hover:text-text-3 ml-0.5" @click="toWp('/terms-of-use')">{{ $t("ACC_SIGN_IN_TERMS") }}</span>
                        <span class="ml-0.5"> and </span>
                        <span class="underline cursor-pointer hover:text-text-3 ml-0.5" @click="toWp('/privacy-policy')">{{ $t("ACC_SIGN_IN_POLICY") }}</span>
                    </div>
                </div>

                <!-- 关闭按钮 -->
                <div
                    class="w-8 h-8 rounded-full flex justify-center items-center bg-transparent hover:bg-fill-wd-1 absolute cursor-pointer text-text-2 hover:text-text-1 top-4 right-4 z-50"
                    @click="close"
                >
                    <n-icon size="24">
                        <Close />
                    </n-icon>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loginByThird, signInByAppleAuth, getLoginPopupImage } from "@/api";
import { useStorageType } from "@/hook/useStorageType";
import { useUserProfile } from "@/store/index";
// import Language from "@/components/Language.vue";
import SignInComp from "./components/SignIn.vue";
import SignUpComp from "./components/SignUp.vue";
import ForgotComp from "./components/Forgot.vue";

const emits = defineEmits(["update:visible"]);
const props = defineProps({
    show: Boolean,
    callback: Function,
});

const showModal = ref(props.show);
// const currentYear = new Date().getFullYear();
const componentId = ref("SignInComp");
const hasRemember = ref(true);
const clientId = "765522450246-gt8mqu2k3o2r2adm5nj269smgomeg12n.apps.googleusercontent.com";
const userProfile = useUserProfile();

const componentMap = { SignInComp, SignUpComp, ForgotComp };

const btnStyle = {
    "--n-text-color": "#fff",
    "--n-text-color-focus": "#fff",
    "--n-text-color-pressed": "#fff",
    "--n-text-color-hover": "#fff",
    "--n-color-hover": "#8961FF",
    "--n-color": "#7B57E5",
    "--n-color-pressed": "#6a4bc6",
    "--n-color-focus": "#8961FF",
    "--n-color-disabled": "#5804a5",
    "--n-text-color-disabled": "#fff",
    "--n-opacity-disabled": 0.8,
};

const toWp = (path) => window.open(window.location.origin + path, "_blank");
const changeComponent = (id) => (componentId.value = id);
const loadScript = (src) =>
    new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = res;
        s.onerror = rej;
        document.body.appendChild(s);
    });

const initializeGoogleSignIn = async (res) => {
    const token = res.credential;
    const { status, data, message } = await loginByThird({ user: { platform: "google", access_token: token } });
    if (status !== 0) return window.toast.error(message);
    trackEvent("Sign", { el: "sign_success_method=google" });
    signInSuccess(data);
};
const registerAppleSDK = () => {
    const redirectURI = window.location.origin + "/app/";
    AppleID.auth.init({
        clientId: "com.piclumen.sign", // 服务 ID
        scope: "name email",
        redirectURI, // 回调 URL
        state: "random_string", // 用于防止 CSRF 攻击的状态字符串
        usePopup: true, // 启用弹出窗口登录
    });
};
registerAppleSDK();

const exciteAppleAuth = async () => {
    trackEvent("Sign", { el: "sign_in_by_apple" });
    const response = await AppleID.auth.signIn();
    console.log(response, "response");
    const token = response.authorization.id_token;
    const email = response.user?.email;
    const name = response.user?.name ? `${response.user.name.firstName}${response.user.name.lastName}` : email;
    const { status, message, data } = await signInByAppleAuth({ identityToken: token, userName: name });
    if (status === 0) {
        trackEvent("Sign", { el: "sign_success_method=apple" });
        signInSuccess(data);
    } else window.toast.error(message);
};

const handleGoogleBtn = () => trackEvent("Sign", { el: "sign_in_by_google" });
let success = false;
const signInSuccess = (data = null) => {
    const { setStorageType } = useStorageType();
    const type = hasRemember.value ? "localStorage" : "sessionStorage";
    localStorage.setItem("storageTypeText", type);
    setStorageType(type);
    data && userProfile.setUser(data);
    success = true;
    close();
};
const handleKeydown = (event) => {
    if (event.key === "Escape" && props.show) {
        close();
    }
};
const info = ref({
    imageUrl: "",
    creator: "",
});
const getImage = async () => {
    const res = await getLoginPopupImage();
    info.value.imageUrl = res?.data || "";
    const img = new Image();
    img.src = res?.data;
    img.onload = () => {
        console.log("图片加载成功");
    };
};
onMounted(async () => {
    getImage();
    window.addEventListener("keydown", handleKeydown);
    window.handleCredentialResponse = initializeGoogleSignIn;
    await loadScript("https://accounts.google.com/gsi/client");
    window.google.accounts.id.initialize({ client_id: clientId, callback: initializeGoogleSignIn });
    window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            window.google.accounts.id.renderButton(document.getElementById("customBtn"), {
                theme: "outline",
                width: "320px",
                height: "52px",
                language: "en",
            });
        }
    });
});
onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown);
});
const open = async () => {
    showModal.value = true;
};
const close = () => {
    showModal.value = false;
    if (success) {
        console.log("登录成功");
    } else {
        console.log("用户关闭了登录弹窗");
    }
    props.callback?.(success);
    emits("update:visible", false);
};

defineExpose({ open, close, showModal });
</script>
<style lang="scss"></style>
