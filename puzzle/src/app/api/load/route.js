import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req){
    try {

        const {player_name} = await req.json();

        const supabase = supabaseServer;
        const{data, error} = await supabase
        .from("game_saves")
        .select("*")
        .eq("player_name", player_name)
        .single();
        if(error && error.code !== "PGRST116") throw error;
        return NextResponse.json({success:true, data});
        
    } catch (err) {
        console.error("Load Error:");
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}