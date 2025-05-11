interface RadiographResponse {
  id: number
  patient_name: string
  status_detection: string
  original_file: string | null
  predicted_file: string | null
  image: string | null
  detected_conditions: {
    has_impaksi: boolean
    has_karies: boolean
    has_lesi_periapikal: boolean
    has_resorpsi: boolean
  }
  task_id: string
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
  predicted_file: string | null
  image: string | null
  detected_conditions: {
    has_impaksi: boolean
    has_karies: boolean
    has_lesi_periapikal: boolean
    has_resorpsi: boolean
  }
  task_id: string
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
  BulkDeleteResponse,
}
