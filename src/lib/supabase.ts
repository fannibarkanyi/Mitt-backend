import {createClient} from "@supabase/supabase-js"
import type { Database } from "./supabase_tyres"
export const supabase = createClient<Database>("https://cerwqlawyfimcldfwvkm.supabase.co", "sb_publishable_7FlbLSRotUx0AJ5vxldEvg_jRCuGVVx")