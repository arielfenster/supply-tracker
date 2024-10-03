import { create } from 'zustand';

type State = {
	pending: boolean;
};

type Actions = {
	setPending: (pending: boolean) => void;
};

export const useFormStore = create<State & Actions>((set) => ({
	pending: false,
	setPending: (pending) => set({ pending }),
}));
