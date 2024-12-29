import { NextResponse } from 'next/server';
import {parseSimulations} from "@/utils/simulation_folder_reader";
import fs from "fs";
import {createIcons} from "@/utils/misc";

export async function GET() {
    const parsedSimulations = parseSimulations('public/simulations')
    if (!fs.existsSync('public/layouts/')) {
        createIcons()
    }
    return NextResponse.json(parsedSimulations);
}
