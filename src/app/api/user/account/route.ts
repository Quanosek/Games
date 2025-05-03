import { NextResponse } from "next/server";

import db from "@/utils/db";
import UserSession from "../user-session";

// get user account providers data
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  UserSession();

  try {
    // id required
    if (!id) throw new Error("Nie podano id użytkownika");

    // user not found
    const existingUser = await db.user.findUnique({ where: { id } });

    if (!existingUser) {
      return NextResponse.json(
        { message: "Nie znaleziono konta użytkownika" },
        { status: 404 }
      );
    }

    // get user account providers
    const providers = await db.account.findMany({ where: { userId: id } });

    // return response
    return NextResponse.json(
      { message: "Połączone konta", providers },
      { status: 200 }
    );
  } catch (error) {
    // error response
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}

// delete account provider connection
export async function DELETE(req: Request) {
  const data = await req.json();
  const provider = data.name.toLowerCase();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  UserSession();

  try {
    // id required
    if (!id) throw new Error("Nie podano id użytkownika");

    // user not found
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "Nie znaleziono konta użytkownika" },
        { status: 404 }
      );
    }

    // update account providers
    await db.account.deleteMany({ where: { userId: id, provider } });
    const providers = await db.account.findMany({ where: { userId: id } });

    // return response
    return NextResponse.json(
      { message: `Rozłączono z kontem ${data.name}`, providers },
      { status: 200 }
    );
  } catch (error) {
    // error response
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}
