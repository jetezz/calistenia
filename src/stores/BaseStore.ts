import type { StateCreator } from "zustand";

export interface BaseEntity {
  id: string;
}

export interface CrudService<T extends BaseEntity, TInsert, TUpdate> {
  getAll: () => Promise<T[]>;
  create: (data: TInsert) => Promise<T>;
  update: (id: string, data: TUpdate) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

export interface BaseStoreState<T extends BaseEntity, TInsert, TUpdate> {
  items: T[];
  currentItem: T | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  fetchAll: (force?: boolean) => Promise<void>;
  create: (data: TInsert) => Promise<void>;
  update: (id: string, data: TUpdate) => Promise<void>;
  delete: (id: string) => Promise<void>;

  // Setters manuales para flexibilidad/compatibilidad
  setCurrentItem: (item: T | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setItems: (items: T[]) => void;

  select: (id: string | null) => void; // Helper para seleccionar por ID
  reset: () => void;
}

/**
 * Creates a base store slice with CRUD functionality and Optimistic Updates.
 */
export const createBaseStore =
  <T extends BaseEntity, TInsert, TUpdate>(
    service: CrudService<T, TInsert, TUpdate>
  ): StateCreator<BaseStoreState<T, TInsert, TUpdate>> =>
  (set, get) => {
    let fetchPromise: Promise<void> | null = null;

    return {
      items: [],
      currentItem: null,
      isInitialized: false, // Nuevo flag
      isLoading: false,
      error: null,

      fetchAll: async (force = false) => {
        if (!force && get().isInitialized) return; // Evitar llamadas duplicadas

        // Deduplication logic: return existing promise if fetching
        if (fetchPromise) {
          return fetchPromise;
        }

        set({ isLoading: true, error: null });

        fetchPromise = (async () => {
          try {
            const items = await service.getAll();
            set({ items, isLoading: false, isInitialized: true });
          } catch (e) {
            const error = e instanceof Error ? e : new Error(String(e));
            set({ error: error.message, isLoading: false });
          } finally {
            fetchPromise = null;
          }
        })();

        return fetchPromise;
      },

      create: async (data: TInsert) => {
        const prevItems = get().items;
        const tempId = `temp-${Date.now()}`;
        // @ts-ignore
        const optimisticItem = { ...data, id: tempId } as T;
        set({ items: [optimisticItem, ...prevItems] });

        try {
          const newItem = await service.create(data);
          set((state) => ({
            items: state.items.map((i) => (i.id === tempId ? newItem : i)),
            error: null,
          }));
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e));
          set({ items: prevItems, error: error.message });
        }
      },

      update: async (id: string, data: TUpdate) => {
        const prevItems = get().items;
        set((state) => ({
          items: state.items.map((i) =>
            // @ts-ignore
            i.id === id ? { ...i, ...data } : i
          ),
        }));

        try {
          const updatedItem = await service.update(id, data);
          set((state) => ({
            items: state.items.map((i) => (i.id === id ? updatedItem : i)),
            error: null,
          }));
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e));
          set({ items: prevItems, error: error.message });
        }
      },

      delete: async (id: string) => {
        const prevItems = get().items;
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));

        try {
          await service.delete(id);
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e));
          set({ items: prevItems, error: error.message });
        }
      },

      // Implementación de setters manuales
      setCurrentItem: (item) => set({ currentItem: item }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setItems: (items) => set({ items }),

      select: (id: string | null) => {
        if (!id) {
          set({ currentItem: null });
          return;
        }
        const item = get().items.find((i) => i.id === id) || null;
        set({ currentItem: item });
      },

      reset: () => {
        set({
          items: [],
          currentItem: null,
          isLoading: false,
          error: null,
          isInitialized: false,
        });
      },
    };
  }; // closing brace for state creator, then closing paren for createBaseStore
