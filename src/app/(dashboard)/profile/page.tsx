import Image from "next/image";
import Link from "next/link";

import AccountProviders from "./account-providers";
import ActionButtons from "./action-buttons";
import SavedButton from "./saved-button";
import UserData from "./user-data";

import { auth } from "@/utils/auth";
import { Role } from "@/utils/enums";
import styles from "@/styles/dashboard.module.scss";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  const admin = user?.role === Role.ADMIN;

  return (
    <div className={styles.profileContainer}>
      <h1>Twój profil</h1>

      <div className={styles.profileLayout}>
        <div className={styles.accountInfo}>
          <Image
            style={{
              borderColor: admin ? "var(--gold)" : "var(--white)",
            }}
            alt=""
            src={user?.image ?? "/icons/profile.svg"}
            width={150}
            height={150}
            draggable={false}
          />

          <div className={styles.params}>
            <div>
              {admin && (
                <Link className={styles.roleBadge} href={"/admin"}>
                  <p>Administrator</p>
                </Link>
              )}
            </div>

            <SavedButton user={user} />
          </div>
        </div>

        <hr />

        <div>
          <h2>Uzupełnij swoje dane</h2>
          <UserData user={user} />
        </div>

        <hr />

        <div>
          <h2>Połączone konta</h2>
          <AccountProviders user={user} />
        </div>

        <hr />

        <div>
          <h2>Operacje na koncie</h2>
          <ActionButtons user={user} />
        </div>
      </div>
    </div>
  );
}
