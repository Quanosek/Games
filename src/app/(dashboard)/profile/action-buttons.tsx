"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

import styles from "@/styles/dashboard.module.scss";

export default function ActionButtons({ user }: { user: User | undefined }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const deleteAccount = () => {
    try {
      setSubmitting(true);

      if (!confirm("Czy na pewno chcesz usunąć konto?")) return;

      axios
        .delete("/api/user", { params: { id: user?.id } })
        .then(async (response) => {
          toast.success(response.data.message);
          await signOut({ redirect: false });
          router.push("/");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      toast.error("Wystąpił nieoczekiwany błąd, spróbuj ponownie");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.actionButtons}>
      <button type="button" onClick={async () => await signOut()}>
        <p>Wyloguj się</p>
      </button>

      <button type="button" onClick={deleteAccount} disabled={submitting}>
        <p>{submitting ? "Ładowanie..." : "Usuń konto"}</p>
      </button>
    </div>
  );
}
