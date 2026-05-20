import { z } from 'zod'

export const spotSchema = z.object({
  title:        z.string().min(1, 'Name is required'),
  region_id:    z.string(),
  category_ids: z.array(z.string()),
  map_url:      z.string().refine(
    v => !v || v.startsWith('http'),
    { message: 'Must be a valid URL starting with http' },
  ),
  address:      z.string(),
  description:  z.string(),
  notes:        z.string(),
})

export type SpotFormValues = z.infer<typeof spotSchema>
