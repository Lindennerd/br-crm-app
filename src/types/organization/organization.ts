import { Licensing } from "./Licensing";
import { Theme } from "./Theme";

export type Organization = {
  name: string;
  logo: string;
  theme: Theme | undefined;
  licensing: Licensing;
};
