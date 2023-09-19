import { useAuthContext } from "../../context/AuthContext";
import { NotLoggedInHomePage } from "./NotLoggedInHomePage";
import { ProcessListSlider } from "../../components/Process/ProcessListSlider";

import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';

export const HomePage = () => {
  const { user } = useAuthContext();



  if (user)
    return (
      <>
        <ProcessListSlider slidesPerView={5} />
      </>
    );

  if (!user)
    return (
      <>
        <NotLoggedInHomePage />
      </>
    );
};
