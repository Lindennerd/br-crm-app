import { useIonRouter } from "@ionic/react";

export const useRouter = () => {
  const router = useIonRouter();

  function gotoHome() {
    router.push("/page/home", "forward", "push");
  }

  function gotoLogin() {
    router.push("/page/login", "forward", "push");
  }

  function gotoProcess(processId: string) {
    router.push(`/page/processo/${processId}`, 'forward', 'push');
  }

  function gotoProcesses() {
    router.push("/page/ProcessManagement", "forward", "push");
  }

  return {
    gotoHome,
    gotoLogin,
    gotoProcess,
    gotoProcesses,
  };
};
