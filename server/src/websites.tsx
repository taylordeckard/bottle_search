import { z } from 'zod';

export const websites = [
  "caskcartel",
  "caskers",
  "cleverwine",
  "flask",
  "kegnbottle",
  "saratogawine",
  "seelbachs",
  "sharedpour",
  "sipwhiskey",
] as const;

export const zWebsites = z.enum(websites);

export type Website = z.TypeOf<typeof zWebsites>;
