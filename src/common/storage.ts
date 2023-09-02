import { Drivers, Storage } from "@ionic/storage";

var storage: Storage | null = null;

export const createStore = (name = "__mydb") => {
  storage = new Storage({
    name,
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
  });

  storage.create();
};

export const set = (key: string, val: any) => {
  if (storage) storage.set(key, val);
};

export const get = async (key: string) => {
  if (storage) {
    const val = await storage.get(key);
    return val;
  }
};

export const remove = async (key: string) => {
  if (storage) await storage.remove(key);
};

export const clear = async () => {
  if (storage) await storage.clear();
};

export const setObject = async (key: string, id: number, val: any) => {
  if (!storage) return;
  const all = await storage.get(key);
  const objIndex = await all.findIndex((a: number) => a === id);

  all[objIndex] = val;
  set(key, all);
};

export const removeObject = async (key: string, id: number) => {
  if (!storage) return;
  const all = await storage.get(key);
  const objIndex = await all.findIndex((a: number) => a === id);

  all.splice(objIndex, 1);
  set(key, all);
};

export const getObject = async (key: string, id: number) => {
  if (!storage) return;
  const all = await storage.get(key);
  const obj = await all.filter((a: { id: number }) => a.id === id)[0];
  return obj;
};
