import { UserInventory } from '$/data-access/handlers/inventories.handler';
import { getCategoryFromName, getSubcategoryFromName } from '$/lib/inventories';
import { create } from 'zustand';

type State = {
    inventory: UserInventory | null;
    selectedCategoryId: string | null;
    selectedSubcategoryId: string | null;
    activeInventoryId: string | null;
}

type Actions = {
    setInventory: (inventory: UserInventory, categoryName: string | null, subcategoryName: string | null) => void,
    setSelectedCategoryId: (categoryId: string) => void;
    setSelectedSubcategoryId: (subcategoryId: string) => void;
    setActiveInventoryId: (inventoryId: string | null) => void;
}

export const useInventoryStore = create<State & Actions>((set, get) => ({
    inventory: null,
    selectedCategoryId: null,
    selectedSubcategoryId: null,
    activeInventoryId: null,

    setInventory: (inventory: UserInventory, categoryName: string | null, subcategoryName: string | null) => {
        if (!categoryName || !subcategoryName) {
            set({ inventory });
            return;
        }

        const category = getCategoryFromName(inventory, categoryName)!;
        const subcategory = getSubcategoryFromName(category, subcategoryName)!;

        set({
            inventory,
            selectedCategoryId: category.id,
            selectedSubcategoryId: subcategory.id
        });
    },
    setSelectedCategoryId: (categoryId) => {
        const { selectedCategoryId, inventory } = get();
        if (categoryId === selectedCategoryId) {
            return;
        }

        const firstSubcategoryId = inventory!.categories.find((category) => category.id === categoryId)!.subcategories[0]?.id;
        set({ selectedCategoryId: categoryId, selectedSubcategoryId: firstSubcategoryId });
    },
    setSelectedSubcategoryId: (subcategoryId) => set({selectedSubcategoryId: subcategoryId}),
    setActiveInventoryId: (inventoryId) => set({activeInventoryId: inventoryId}),
}));
