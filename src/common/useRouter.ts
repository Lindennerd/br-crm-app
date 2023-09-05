import { useIonRouter } from "@ionic/react";

export const useRouter = () => {
  const router = useIonRouter();

  function gotoHome() {
    router.push("/page/home", "forward", "push");
  }

  function gotoLogin() {
    router.push("/page/login", "forward", "push");
  }

  return {
    gotoHome,
    gotoLogin,
  };
};
