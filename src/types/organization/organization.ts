import { Licensing } from "./Licensing";
import { Theme } from "./Theme";

export type Organization = {
  id: string;
  name: string;
  logo: string;
  theme: Theme | undefined;
  licensing: Licensing;
};
