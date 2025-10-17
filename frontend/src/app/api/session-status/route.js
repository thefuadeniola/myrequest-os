
import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = await auth0.getSession(); 

    if (session) {
      return NextResponse.json({ session: true, user: session.user.name }, { status: 200 });
    } else {
      return NextResponse.json({ session: false }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    // Return an error status
    return NextResponse.json({ error: 'Authentication check failed' }, { status: 401 });
  }
}
