interface RadiographResponse {
  id: number
  patient_name: string
  status_detection: string
  original_file: string
  mask_file?: string
  overlay_file: string
  detected_conditions: {
    has_impaksi: boolean
    has_karies: boolean
    has_lesi_periapikal: boolean
    has_resorpsi: boolean
  }
  task_id: string
  created_at: string
}

interface PaginatedRadiographResponse {
  data: RadiographResponse[]
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

interface PredictRequest {
  file: File
  patient_name: string
}

interface PredictResponse {
  message: string
  patient_name: string
  status_detection: string
  original_file: string | null
  mask_file: string | null
  overlay_file: string | null
  image: string | null
  detected_conditions: {
    has_impaksi: boolean
    has_karies: boolean
    has_lesi_periapikal: boolean
    has_resorpsi: boolean
  }
  task_id: string
  created_at: string
}

interface FilterRadiographRequest {
  radiograph_id: number
  selected_categories: string[]
}

interface FilterRadiographResponse {
  message: string
  radiograph_id: number
  filtered_image: string
  filtered_file: string
  selected_categories: string[]
}

interface BulkDeleteResponse {
  message: string
  deleted_count: number
  non_existent_ids: number[] | null
}

export type {
  RadiographResponse,
  PaginatedRadiographResponse,
  PredictRequest,
  PredictResponse,
  FilterRadiographRequest,
  FilterRadiographResponse,
  BulkDeleteResponse,
}
