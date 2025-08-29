import { createApp, h, ref } from "vue";
import MessageBox from "@/components/common/dialog/index.vue";

const isVueComponent = (component) => {
    return typeof component !== "string";
};

let singleton = null;
export const useModal = () => {
    if (singleton) return singleton;
    const activeInstances = new Set(); // 用于跟踪活动的实例

    const showMessage = (option) => {
        return new Promise((resolve, reject) => {
            const container = document.createElement("div");
            const parent = document.querySelector("#app_content") || document.body;
            parent.appendChild(container);
            const show = ref(true);

            const app = createApp({
                setup() {
                    return () => {
                        const closeDialog = (val) => {
                            show.value = val;
                            app.unmount();
                            container.remove();
                            activeInstances.delete(app); // 从活动实例列表中移除
                        };
                        const { content, icon, title, confirmBtn, cancelBtn, style, onPositiveClick, ...pro } = option;
                        let contentComponent = null;
                        if (isVueComponent(content)) {
                            contentComponent = h(content, {
                                ...pro,
                                // "onUpdate:show": closeDialog,
                                onConfirm: (_) => {
                                    closeDialog(false);
                                    resolve(_);
                                },
                                onCancel: (_) => {
                                    closeDialog(false);
                                    reject(_);
                                },
                            });
                        } else {
                            contentComponent = h("div", null, content);
                        }
                        return h(
                            MessageBox,
                            {
                                show: show.value,
                                style,
                                ...pro,
                                onConfirm: async (val) => {
                                    if (onPositiveClick && typeof onPositiveClick === "function") {
                                        await onPositiveClick();
                                    }
                                    closeDialog(val);
                                    resolve(val);
                                },
                                onCancel: (val) => {
                                    closeDialog(val);
                                    reject();
                                },
                            },
                            {
                                icon: icon ? () => h(icon) : null,
                                title: title ? () => h("div", null, title) : null,
                                default: () => contentComponent,
                                "confirm-btn": () => h("span", null, confirmBtn),
                                "cancel-btn": cancelBtn && (() => h("span", null, cancelBtn)),
                            }
                        );
                    };
                },
            });

            app.mount(container);
            activeInstances.add(app); // 将实例添加到活动列表
        });
    };

    const clearMessageBox = () => {
        // 清理所有活动的实例
        activeInstances.forEach((app) => {
            app.unmount(); // 触发生命周期钩子
        });
        activeInstances.clear();
        // document.querySelector("#app_content").innerHTML = '';
    };
    singleton = {
        showMessage,
        clearMessageBox,
    };

    return singleton;
};
