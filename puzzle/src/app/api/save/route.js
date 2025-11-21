import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req){
    try {

        const {player_name,state} = await req.json();

        const supabase = supabaseServer;
        const{error} = await supabase
        .from("game_saves")
        .upsert({player_name,state},{onConflict: 'player_name'})
        if(error) throw error;
        return NextResponse.json({success:true})
        
    } catch (err) {
        console.error("Save Error:");
        return NextResponse.json({ error: "Failed to save game data." }, { status: 500 });
    }
}