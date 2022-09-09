import { createContext } from "react";

export type Reloads = {
	reloadUsers: () => Promise<void>;
	reloadRooms: () => Promise<void>
}

export const ReloadContext = createContext<Reloads>({} as Reloads);