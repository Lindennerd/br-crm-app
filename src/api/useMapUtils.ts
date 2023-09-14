export const useMapUtils = () => {
    return {
        mapToObject<T>(map: Map<string, any> | null | undefined): T {
            if (!map) return {} as T;
            return Object.fromEntries(map.entries()) as T;
        },

        objectToMap<T>(obj: any): Map<string, T> {
            if (!obj) return new Map<string, T>();
            return new Map<string, T>(Object.entries(obj));
        }
    }
}