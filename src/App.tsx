import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
  useIonToast,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu/Menu";
import Page from "./pages/Page";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Theme variables */
import "./theme/variables.css";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider, useQueryClient } from "react-query";
import { LoadingContextProvider, useLoadingContext } from "./context/LoadingContext";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthContextProvider } from "./context/AuthContext";
import { ResponseCacheContextProvider } from "./context/CacheContext";
import { CurrentClientContextProvider } from "./context/CurrentClientContext";
import { MenuContextProvider } from "./context/MenuContext";
import { useState } from "react";
import { BussinessError } from "./types/app.types";

setupIonicReact();

const App: React.FC = () => {
  const [presentToast] = useIonToast();
  const { loading, setLoading } = useLoadingContext();

  const mutationCache = new MutationCache({
    onError: (error) => {
      setLoading(false);
      presentError((error as BussinessError).title);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setLoading(false);
    }
  });

  const queryCache = new QueryCache({
    onError: (error) => {
      setLoading(false);
      presentError((error as BussinessError).title);
    },
    onSuccess: () => {
      setLoading(false);
    },
  });
  
  const presentError = (message: string) => {
    presentToast({
      message,
      duration: 3000,
      color: "danger",
      position: "top",
    });
  };
  
  const [queryClient] = useState(() => new QueryClient({
    mutationCache, queryCache, defaultOptions: {
      queries: {
        staleTime: 30000,
        refetchInterval: 1000 * 60 * 5,
        behavior: {
          onFetch: (context) => {
            setLoading(true);
          }
        }
      }
    }
  }))
  
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingContextProvider>
        <ResponseCacheContextProvider>
          <MenuContextProvider>
            <AuthContextProvider>
              <CurrentClientContextProvider>
                <IonApp>
                  <IonReactRouter>
                    <IonSplitPane contentId="main">
                      <Menu />
                      <IonRouterOutlet id="main">
                        <Route path="/" exact={true}>
                          <Redirect to="/page/home" />
                        </Route>
                        <Route path="/page/processo/:name">
                          <Page></Page>
                        </Route>
                        <Route path="/page/:name" exact={true}>
                          <Page></Page>
                        </Route>
                      </IonRouterOutlet>
                    </IonSplitPane>
                  </IonReactRouter>
                </IonApp>
              </CurrentClientContextProvider>
            </AuthContextProvider>
          </MenuContextProvider>
        </ResponseCacheContextProvider>
      </LoadingContextProvider>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
};

export default App;
