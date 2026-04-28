// app/api/midtrans/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch('https://api.sandbox.midtrans.com/v2/charge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Masukkan Auth Header dari cURL kamu di sini
                'Authorization': 'Basic TWlkLXNlcnZlci1GN2VEN1VhVzEwcjMtQ0ZhQzE2T0JzNFU6',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: "Server Error", error }, { status: 500 });
    }
}