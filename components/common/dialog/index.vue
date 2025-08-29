<template>
    <n-config-provider :theme="isDark ? darkTheme : lightTheme" :theme-overrides="isDark ? naiveUIConfig.dark : naiveUIConfig.light">
        <div
            v-if="show"
            class="fixed md:z-50 left-0 top-0 right-0 bottom-0 flex items-center justify-center z-[9999]"
            :class="[raw ? 'bg-transparent' : ' bg-fill-t-3 backdrop-blur']"
            :style="{
                zIndex: zIndex ? zIndex : '',
            }"
            @click.prevent.stop
        >
            <template v-if="showLeftTopCloseBtn">
                <!-- 弹出框式组件，左上角的关闭按钮， 可参考KontextModel组件-->
                <div class="size-10 rounded-full border re-create__close bg-fill-dw-4 absolute top-6 left-6 flex items-center justify-center cursor-pointer" @click="handleCancel">
                    <IconsClose class="size-6 text-text-2" />
                </div>
            </template>

            <div class="modal-content max-md:!w-11/12" :class="isPc && 'overflow-hidden'" :style="style" v-if="!raw">
                <div v-if="$slots.icon || $slots.title" class="flex gap-2.5 items-center mb-3">
                    <div v-if="$slots.icon" class="text-text-1 leading-none">
                        <slot name="icon">
                            <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                                <n-icon size="24" class="text-text-white">
                                    <IconsClose />
                                </n-icon>
                            </div>
                        </slot>
                    </div>

                    <div v-if="$slots.title" class="text-text-1">
                        <slot name="title">
                            <p class="leading-6">{{ t("TOAST_TITLE_WARNING") }}</p>
                        </slot>
                    </div>
                </div>
                <div
                    v-if="showCloseBtn"
                    class="absolute top-4 right-4 p-4 flex items-center justify-center size-8 cursor-pointer rounded-full transition-colors text-text-2 hover:bg-fill-wd-1"
                    @click="handleCancel"
                >
                    <n-icon size="20">
                        <IconsClose />
                    </n-icon>
                </div>

                <div class="leading-6 text-sm font-medium text-text-1">
                    <slot>
                        <p>{{ t("TOAST_DEL_CONFIRM_CONTENT") }}</p>
                    </slot>
                </div>

                <div class="mt-4 flex md:justify-end gap-3 flex-wrap" v-if="showCancel || showConfirm">
                    <Button v-if="showCancel" type="secondary" class="max-md:w-full min-w-32" @click="handleCancel">
                        <slot name="cancel-btn">{{ t("COMMON_BTN_CANCEL") }}</slot>
                    </Button>

                    <Button v-if="showConfirm" type="primary" class="max-md:w-full min-w-32" :loading="reqStatus" @click="handleOk">
                        <slot name="confirm-btn">{{ t("COMMON_BTN_CONTINUE") }}</slot>
                    </Button>
                </div>
            </div>
            <slot v-else></slot>
        </div>
    </n-config-provider>
</template>

<script setup>
import { naiveUIConfig } from "@/utils/common";
import { darkTheme, lightTheme } from "naive-ui";
import { useTheme } from "@/hook/system";
const { isDark } = useTheme();
import { t } from "@/utils/i18n-util";
import { useThemeStore } from "@/stores/system-config";
const { isPc } = storeToRefs(useThemeStore());

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
        default: true,
    },
    showCloseBtn: {
        type: Boolean,
        required: false,
        default: false,
    },
    showLeftTopCloseBtn: { type: Boolean, required: false, default: false }, //展示左上角关闭按钮 absolute 强制定位
    showCancel: {
        type: Boolean,
        default: true,
    },
    showConfirm: {
        type: Boolean,
        default: true,
    },
    style: {
        type: Object,
        default: () => ({}),
    },
    raw: {
        type: Boolean,
        default: false,
    },
    escCloseable: {
        type: Boolean,
        default: false,
    },
    zIndex: {
        type: Number,
        default: 9999,
    },
});
const reqStatus = ref(false);
const emits = defineEmits(["update:show", "confirm", "cancel"]);
const handleOk = () => {
    reqStatus.value = true;
    emits("confirm", false);
    emits("update:show", false);
};
const handleCancel = () => {
    emits("cancel", false);
    emits("update:show", false);
};

// ESC key close logic
const handleKeydown = (event) => {
    console.log("000000");
    if (event.key === "Escape" && props.show && props.escCloseable) {
        handleCancel();
    }
};

// Lifecycle hooks to manage event listeners
onMounted(() => {
    if (!props.escCloseable) return;
    window.addEventListener("keydown", handleKeydown, true);
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown, true);
});
</script>

<style lang="scss" scoped>
.modal-content {
    @apply rounded-xl p-4 bg-bg-2 text-base font-bold border border-solid border-border-t-1 relative;
    width: 474px;
    box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.1);
}
</style>
