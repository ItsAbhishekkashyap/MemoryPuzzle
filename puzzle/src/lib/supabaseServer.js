import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process .env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseRoleKey){
    console.warn("Missing Next_PUBLIC_SUPABASE_URL")
}

export const supabaseServer = createClient(supabaseUrl, supabaseRoleKey,{
    auth:{persistSession:false},
})

