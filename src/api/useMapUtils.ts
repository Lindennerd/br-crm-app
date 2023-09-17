import { Client } from "../types/app.types";

export const useMapUtils = () => {
  function mapToObject<T>(map: Map<string, any> | null | undefined): T {
    if (!map) return {} as T;
    return Object.fromEntries(map.entries()) as T;
  }

  function objectToMap<T>(obj: any): Map<string, T> {
    if (!obj) return new Map<string, T>();
    return ensureItsMap(obj);
  }

  function getFirstValue(client: Client): string {
    if (!client.fieldValues) return "";
    const fieldValues = ensureItsMap(client.fieldValues);
    if(fieldValues.size <= 0) return "";
    const [field, value] = fieldValues
      .entries()
      .next().value;
    return  `${field}: ${value}`;
  }

  function ensureItsMap(object: any) {
    if (object instanceof Map) return object;
    return new Map<string, string>(Object.entries(object));
  }


  return {
    mapToObject,
    objectToMap,
    getFirstValue,
    ensureItsMap
  };
};
