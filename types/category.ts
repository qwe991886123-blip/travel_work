import type { DbCategory } from './database.types'

export type Category = DbCategory

export interface CategoryFormData {
  name: string
  icon: string
}
