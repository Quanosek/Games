"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "next-auth";
import { signIn } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

import styles from "@/styles/dashboard.module.scss";

export default function AccountProviders({ user }: { user: User | undefined }) {
  const [providers, setProviders] = useState<string[]>([]);
  useEffect(() => {
    if (!user) return;

    axios
      .get("/api/user/account", { params: { id: user.id } })
      .then((response) => {
        const providers = response.data.providers.map(
          ({ provider }: { provider: string }) => {
            return provider;
          }
        );
        setProviders(providers);
      })
      .catch((error) => toast.error(error.response.data.message));
  }, [user]);

  const HandleProvider = ({ name }: { name: string }) => {
    const provider = name.toLowerCase();

    return (
      <button
        className={`${providers.includes(provider) || styles.notConnected}`}
        onClick={async () => {
          if (!user) return;

          if (providers.includes(provider)) {
            if (!confirm("Czy na pewno chcesz usunąć to połączenie?")) return;

            // remove provider
            await axios
              .delete("/api/user/account", {
                params: { id: user.id },
                data: { name },
              })
              .then((response) => {
                toast.success(response.data.message);

                const providers = response.data.providers.map(
                  ({ provider }: { provider: string }) => {
                    return provider;
                  }
                );
                setProviders(providers);
              })
              .catch((error) => toast.error(error.response.data.message));
          } else {
            // add provider
            await signIn(provider, { redirect: false });
          }
        }}
      >
        <div>
          <Image
            className="icon"
            alt=""
            src={`/icons/socials/${provider}.svg`}
            width={40}
            height={40}
            draggable={false}
          />
          <h3>{name}</h3>
        </div>

        <div>
          <p>{providers.includes(provider) ? "Połączono" : "Nie połączono"}</p>
          <Image
            className="icon"
            alt=""
            src="/icons/link.svg"
            width={32}
            height={32}
            draggable={false}
          />
        </div>
      </button>
    );
  };

  return (
    <div className={styles.accountProviders}>
      <HandleProvider name="Google" />
      {/* <HandleProvider name="Facebook" /> */}
      <HandleProvider name="GitHub" />
      <HandleProvider name="Discord" />
    </div>
  );
}
