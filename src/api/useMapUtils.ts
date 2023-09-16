import { Client } from "../types/app.types";

export const useMapUtils = () => {
  return {
    mapToObject<T>(map: Map<string, any> | null | undefined): T {
      if (!map) return {} as T;
      return Object.fromEntries(map.entries()) as T;
    },

    objectToMap<T>(obj: any): Map<string, T> {
      if (!obj) return new Map<string, T>();
      return new Map<string, T>(Object.entries(obj));
    },

    getFirstValue(client: Client): string {
      if (!client.fieldValues) return "";
      const value = new Map<string, string>(Object.entries(client.fieldValues))
        .entries()
        .next().value;
      return `${value[0]}: ${value[1]}`;
    },
  };
};
