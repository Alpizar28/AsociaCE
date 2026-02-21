export function middleware(request: any) {
    return new Response("OK", { status: 200 });
}

export const config = {
    matcher: ['/health-check-middleware'],
}
