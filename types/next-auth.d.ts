import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phoneNumber?: string;
      email?: string;
      name?: string;
      image?: string;
    };
    firebase?: {
      accessToken: string;
      providerId: string;
    };
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phoneNumber?: string;
    firebase?: {
      accessToken: string;
      providerId: string;
    };
  }
}
