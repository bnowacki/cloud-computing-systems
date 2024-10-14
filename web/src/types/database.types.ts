import { MergeDeep } from 'type-fest'

import { Database as DatabaseGenerated, Json } from './database-generated.types'
import { UserProfile } from './models'

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Views: {
        user_profile: {
          Row: UserProfile
        }
      }
    }
  }
>
