import type { DbRegion } from './database.types'

export type Region = DbRegion

export interface RegionFormData {
  name: string
  country: string
}
