import { gameMessages } from "./gameevents";
import { netMessages } from "./net";

export const messages = { ...gameMessages, ...netMessages } as const;