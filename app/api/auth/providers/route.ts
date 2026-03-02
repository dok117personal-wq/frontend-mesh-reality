import { NextResponse } from "next/server";

export type EnabledProviders = {
  google: boolean;
  apple: boolean;
  phone: boolean;
};

export async function GET() {
  const hasBackend = !!process.env.NEXT_PUBLIC_API_URL;

  const enabled: EnabledProviders = {
    google: hasBackend,
    apple: hasBackend,
    phone: hasBackend,
  };

  return NextResponse.json(enabled);
}
