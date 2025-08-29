/**
 * 打开登录弹窗有两种方式 如果需要接收回调函数对应做出处理
 * 1、const res = await window.$openLogin?.open()（无上下文环境只能使用此方式 如：http等js文件中）
 * 2、import {open} from '@/hook/useLoginModal  引入hook 
 * const res = await open()
 * 
 */
import { h } from 'vue';
import LoginModal from '@/components/common/login-modal/index.vue'; // 登录 modal 路径

export function useLoginModal() {
  const { showMessage } = useModal();
  const openLogin = ({
    onError = null,
    onSuccess = null
  }) => {
    showMessage({
      style: { width: "800px", padding: 0 },
      showCancel: false,
      showConfirm: false,
      content: h(LoginModal),
    })
      .then(async () => {
        if (onSuccess) {
          onSuccess(); // 调用外部传入的成功回调
        }
      })
      .catch((error) => {
        if (onError) {
          onError(error); // 调用外部传入的错误回调
        }
      });
  };

  return { openLogin };
}
