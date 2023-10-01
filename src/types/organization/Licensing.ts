import { Module } from "./Module";

export type Licensing = {
  active: boolean;
  availableModules: { modules: Module[] };
};
