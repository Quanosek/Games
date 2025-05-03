import { NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";

import db from "@/utils/db";
import UserSession from "./user-session";

// create new user account
export async function POST(req: Request) {
  const data = await req.json();

  UserSession();

  try {
    // email taken
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Podany adres e-mail jest już zajęty" },
        { status: 409 }
      );
    }

    // create new user account
    const hashPassword = await hash(data.password, 12);
    const user = await db.user.create({
      data: { email: data.email, password: hashPassword },
    });

    // return response
    return NextResponse.json(
      { message: "Pomyślnie utworzono nowe konto", user },
      { status: 201 }
    );
  } catch (error) {
    // error response
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}

// update user account data
export async function PUT(req: Request) {
  const data = await req.json();

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

    // username taken
    if (data.username) {
      const usernameExists = await db.user.findUnique({
        where: { username: data.username },
      });

      if (usernameExists && usernameExists.id !== id) {
        return NextResponse.json(
          { message: "Nazwa użytkownika jest już zajęta" },
          { status: 406 }
        );
      }
    }

    let newData = { ...data };

    if (data.password) {
      // new password must be different
      if (existingUser.password) {
        const passwordMatch = await compare(
          data.password,
          existingUser.password
        );

        if (passwordMatch) {
          return NextResponse.json(
            { message: "Nowe hasło musi się różnić od obecnego" },
            { status: 406 }
          );
        }
      }

      // secure password
      const hashPassword = await hash(data.password, 12);
      newData = { ...data, password: hashPassword };
    }

    // update user account data
    const user = await db.user.update({ where: { id }, data: newData });

    // return response
    return NextResponse.json(
      { message: "Dane konta zostały zaktualizowane", user },
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

// delete user account
export async function DELETE(req: Request) {
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

    // delete all user saved games
    await db.game.deleteMany({ where: { userId: id } });

    // delete user account
    await db.user.delete({ where: { id } });

    // return response
    return NextResponse.json(
      { message: "Konto zostało usunięte", user: existingUser },
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
