import { create } from "zustand";
import { createBaseStore, type BaseStoreState } from "./BaseStore";
import { appSettingsService } from "@/services/appSettingsService";
import type { Database } from "@/types/database";

type AppSetting = Database["public"]["Tables"]["app_settings"]["Row"];
type AppSettingInsert = Database["public"]["Tables"]["app_settings"]["Insert"];
type AppSettingUpdate = Database["public"]["Tables"]["app_settings"]["Update"];

interface AppSettingsStore
  extends BaseStoreState<AppSetting, AppSettingInsert, AppSettingUpdate> {
  getSettingValue: <T>(key: string, defaultValue: T) => T;
  updateSettingValue: (
    key: string,
    value: any,
    userId: string
  ) => Promise<void>;
}

export const useAppSettingsStore = create<AppSettingsStore>(
  (set, get, store) => {
    const baseStore = createBaseStore<
      AppSetting,
      AppSettingInsert,
      AppSettingUpdate
    >(appSettingsService)(set, get, store);

    return {
      ...baseStore,

      getSettingValue: (key, defaultValue) => {
        const item = get().items.find((i) => i.key === key);
        return item ? (item.value as any) : defaultValue;
      },

      updateSettingValue: async (key, value, userId) => {
        // Optimistic
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.key === key);

        let newItems;
        if (existingIndex >= 0) {
          newItems = [...currentItems];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            value,
            updated_at: new Date().toISOString(),
          };
        } else {
          // Fake ID for generic optimistic creation not fully supported without ID logic,
          // but here we just need it in the list
          newItems = [
            ...currentItems,
            {
              key,
              value,
              id: "temp-" + key,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              updated_by: userId,
              description: null,
            },
          ];
        }

        set({ items: newItems });

        try {
          const updated = await appSettingsService.upsertByKey(
            key,
            value,
            userId
          );
          set((state) => ({
            items: state.items.map((i) => (i.key === key ? updated : i)),
          }));
          // If it was a new item with temp ID, the map above needs to handle key matching which it does.
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e));
          set({ items: currentItems, error: error.message });
        }
      },
    };
  }
);
