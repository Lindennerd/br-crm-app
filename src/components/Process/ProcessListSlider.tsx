import { documentAttachOutline, documentAttachSharp, filter, rocketSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { IonButton, IonIcon, IonLabel, IonList, IonListHeader, useIonToast } from "@ionic/react";
import { useProcessApi } from "../../api/useProcessApi";
import { useLoadingContext } from "../../context/LoadingContext";
import { Process, ProcessFilter } from "../../types/app.types";
import { ProcessCard } from "./ProcessCard";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';

export const ProcessListSlider = ({
  slidesPerView,
}: {
  slidesPerView: number;
}) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const { user } = useAuthContext();
  const { filter } = useProcessApi();
  const { setLoading } = useLoadingContext();
  const [presetToast] = useIonToast();

  const initialFilter: Partial<ProcessFilter> = {
    page: 1,
    pageSize: 20,
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      filter(initialFilter)
        .then((result) => {
          setProcesses(result);
        })
        .catch((error) => {
          presetToast({
            message: error.message,
            duration: 3000,
            color: "danger",
            position: "top",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  return <>
          <IonList>
          <IonListHeader>
            <IonIcon icon={documentAttachOutline} size="large" style={{marginRight: "1em"}} />
            <IonLabel>
              <h1>Processos</h1>
            </IonLabel>
            <IonButton>Ver todos</IonButton>
          </IonListHeader>
        </IonList>
        <Swiper slidesPerView={slidesPerView} loop={true} mousewheel={true}>
          {processes.map((process) => (
            <SwiperSlide key={process.id}>
              <ProcessCard process={process} />
            </SwiperSlide>
          ))}
        </Swiper>
  </>
};
