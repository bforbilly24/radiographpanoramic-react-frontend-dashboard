import { z } from 'zod';
import { DetectionStatus } from './enum-data';

export const radiographSchema = z.object({
  id: z.number(),
  patient_name: z.string(),
  original_file: z.string(), // Renamed from 'original' to match RadiographResponse
  status_detection: z.enum([
    DetectionStatus.SUCCESS,
    DetectionStatus.IN_PROGRESS,
    DetectionStatus.FAILED,
  ]),
  mask_file: z.string().optional(), // Maps to mask_file
  overlay_file: z.string().optional(), // Maps to overlay_file
  detected_conditions: z.object({
    has_impaksi: z.boolean(),
    has_karies: z.boolean(),
    has_lesi_periapikal: z.boolean(),
    has_resorpsi: z.boolean(),
  }),
  task_id: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
});

export const uploadFormSchema = z.object({
  file: z
    .array(z.instanceof(File))
    .length(1, { message: 'Harap unggah tepat satu file.' })
    .refine(
      (files) =>
        files.every((file) =>
          ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
        ),
      'Hanya format file JPG, JPEG, atau PNG yang didukung.'
    )
    .refine(
      (files) =>
        files.every((file) => file.size <= 10 * 1024 * 1024), // 10MB
      'Ukuran file maksimal 10MB.'
    )
    .refine(
      (files) =>
        files.every((file) => file.size > 0),
      'File tidak boleh kosong.'
    ),
  patient_name: z
    .string()
    .min(1, 'Nama pasien harus diisi.')
    .min(2, 'Nama pasien minimal 2 karakter.')
    .max(100, 'Nama pasien maksimal 100 karakter.')
    .trim(),
});
export type Radiograph = z.infer<typeof radiographSchema>;
export type UploadForm = z.infer<typeof uploadFormSchema>;