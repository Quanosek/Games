import Image from "next/image";
import { signIn } from "next-auth/react";

import styles from "@/styles/auth.module.scss";

export default function AuthProviders({ redirectTo }: { redirectTo: string }) {
  const options = {
    redirectTo,
  };

  return (
    <div className={styles.providers}>
      <button
        title="Google"
        onClick={async () => await signIn("google", options)}
      >
        <Image
          className="icon"
          alt="Google"
          src="/icons/socials/google.svg"
          width={34}
          height={34}
        />
      </button>

      {/* <button
        title="Facebook"
        onClick={async () => await signIn("facebook", options)}
      >
        <Image
          className="icon"
          alt="Facebook"
          src="/icons/socials/facebook.svg"
          width={34}
          height={34}
        />
      </button> */}

      <button
        title="Github"
        onClick={async () => await signIn("github", options)}
      >
        <Image
          className="icon"
          alt="Github"
          src="/icons/socials/github.svg"
          width={34}
          height={34}
        />
      </button>

      <button
        title="Discord"
        onClick={async () => await signIn("discord", options)}
      >
        <Image
          className="icon"
          alt="Discord"
          src="/icons/socials/discord.svg"
          width={34}
          height={34}
        />
      </button>
    </div>
  );
}
