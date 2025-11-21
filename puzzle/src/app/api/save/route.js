import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { player_name, state } = await req.json();
    
    // FIX: Remove the () brackets here too
    const supabase = supabaseServer;

    // NOTE: For upsert to work, 'player_name' must be marked as UNIQUE in Supabase
    // or you must include the 'id' in the payload if updating an existing row.
    const { error } = await supabase
      .from("game_saves")
      .upsert({ player_name, state }, { onConflict: 'player_name' });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}