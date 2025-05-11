// src/features/radiographs/data/schema.ts
import { z } from 'zod';
import { DetectionStatus } from './enum-data';

export const radiographSchema = z.object({
  id: z.number(),
  tasks: z.string(),
  patient_name: z.string(),
  original: z.string(),
  status_detection: z.enum([
    DetectionStatus.SUCCESS,
    DetectionStatus.IN_PROGRESS,
    DetectionStatus.FAILED,
  ]),
  predicted: z.string(),
  has_lesi_periapikal: z.boolean(),
  has_resorpsi: z.boolean(),
  has_karies: z.boolean(),
  has_impaksi: z.boolean(),
  created_at: z.string().datetime(), // Validasi ISO 8601
  updated_at: z.string().datetime(), // Validasi ISO 8601
});

export type Radiograph = z.infer<typeof radiographSchema>;