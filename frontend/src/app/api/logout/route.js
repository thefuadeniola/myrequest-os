import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
    const domain = process.env.AUTH0_DOMAIN
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${domain}/v2/logout`,
            headers: { }
        };

        axios.request(config)
        .then((response) => {
        return NextResponse.json({ response })
        })
        .catch((error) => {
        return NextResponse.json({ error: `Logout failed here: ${error}` })
        });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Logout failed' }, { status: 401 })
    }

}