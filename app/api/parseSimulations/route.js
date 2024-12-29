import { NextResponse } from 'next/server';
import {parseSimulations} from "@/utils/simulation_folder_reader";

export async function GET() {
    const parsedSimulations = parseSimulations('public/simulations')

    return NextResponse.json(parsedSimulations);
}
