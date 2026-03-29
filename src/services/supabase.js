import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wivcujqalmwqiwyiuver.supabase.co"
const supabaseKey = "sb_publishable_Ej20pq3_lq8Ugabz-MHTgg_vq1teZc0"

export const supabase = createClient(supabaseUrl, supabaseKey)