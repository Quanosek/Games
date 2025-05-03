"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Providers from "../providers";

import { LoginUserInput, loginUserSchema } from "@/utils/zod";
import PasswordInput from "@/components/password-input";
import styles from "@/styles/auth.module.scss";

export default function LoginForm() {
  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const [submitting, setSubmitting] = useState(false);

  async function formSubmit({ email, password }: LoginUserInput) {
    try {
      setSubmitting(true);

      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        reset({ password: "" });
        toast.error("Wprowadzono niepoprawny adres e-mail lub hasło");
        console.error(response.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Wystąpił nieoczekiwany błąd, spróbuj ponownie");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(formSubmit)}>
        <label>
          <p>E-mail</p>
          <input {...register("email")} autoComplete="email" maxLength={65} />
          {errors.email && <span>{errors.email.message}</span>}
        </label>

        <label>
          <p>Hasło</p>
          <PasswordInput
            function={register}
            name="password"
            autocomplete="current-password"
          />
          {errors.password && <span>{errors.password.message}</span>}
        </label>

        {/* <div className={styles.forgotPassword}>
          <button onClick={() => {}} type="button">
            <p>Nie pamiętasz hasła?</p>
          </button>
        </div> */}

        <button
          className={styles.submitButton}
          type="submit"
          disabled={submitting}
        >
          <p>{submitting ? "Ładowanie..." : "Zaloguj się"}</p>
        </button>
      </form>

      <Providers redirectTo="/" />
    </div>
  );
}
