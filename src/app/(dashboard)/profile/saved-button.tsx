"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "next-auth";
import axios from "axios";
import toast from "react-hot-toast";

import styles from "@/styles/dashboard.module.scss";

export default function SavedButton({ user }: { user: User | undefined }) {
  const [loading, setLoading] = useState(true);
  const [gamesList, setGamesList] = useState([]);

  useEffect(() => {
    if (!user) return;

    axios
      .get("/api/game/saved", { params: { userId: user.id } })
      .then((res) => setGamesList(res.data.games))
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return null;

  if (gamesList.length) {
    return (
      <Link className={styles.savedButton} href={"/saved"}>
        <p>
          Zapisane gry [{gamesList.length > 100 ? "99+" : gamesList.length}]
        </p>
      </Link>
    );
  } else {
    return (
      <Link className={styles.savedButton} href={"/"}>
        <p>Stwórz nową grę!</p>
      </Link>
    );
  }
}
