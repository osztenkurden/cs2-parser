import { gameMessages } from './gameevents.js';
import { netMessages } from './net.js';

export const messages = { ...gameMessages, ...netMessages } as const;
