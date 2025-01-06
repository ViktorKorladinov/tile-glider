import { NextResponse } from 'next/server';
import {parseSimulations} from "@/utils/simulationsFolderReader";
import fs from "fs";
import {createIcons} from "@/utils/iconCreator";

export async function GET() {
    const parsedSimulations = parseSimulations('public/simulations')
    if (!fs.existsSync('public/layouts/')) {
        createIcons()
    }
    return NextResponse.json(parsedSimulations);
}
