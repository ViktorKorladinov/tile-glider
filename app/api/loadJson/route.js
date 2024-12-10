import { NextResponse } from 'next/server';
import { loadJsonFiles } from '@/utils/loadJsonFiles';

export async function GET(request) {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const data = await loadJsonFiles(id);
    return NextResponse.json(data);
}
