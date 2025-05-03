import { useState } from "react";
import Image from "next/image";

import styles from "@/styles/auth.module.scss";

export default function PasswordInputComponent({
  function: register,
  name,
  autocomplete,
}: {
  function: any;
  name: string;
  autocomplete?: "current-password" | "new-password" | "off";
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className={styles.passwordInput}>
      <input
        {...register(name)}
        type={passwordVisible ? "text" : "password"}
        autoComplete={autocomplete}
        maxLength={65}
      />

      <button
        tabIndex={-1}
        type="button"
        name="toggle"
        className={styles.eyeIcon}
        onClick={() => setPasswordVisible(!passwordVisible)}
      >
        <Image
          className="icon"
          alt=""
          src={`/icons/${passwordVisible ? "eye" : "eye-slash"}.svg`}
          width={24}
          height={24}
          draggable={false}
        />
      </button>
    </div>
  );
}
