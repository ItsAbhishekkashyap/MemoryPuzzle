import {createClient } from "@supabase/supabase-js";

const supabaseUrl = <process className="env NEXT_PUBLIC_SUPABASE">-URL</process>
const supabaseAnonKey= process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if(!supabaseUrl || !supabaseAnonKey){
    console.warn("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

export const supabase = createClient(supabase, supabaseAnonKey);
export default supabase;