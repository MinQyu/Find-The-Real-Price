import Image from "next/image";
import styles from "@/app/styles/home.module.css";

export const metadata = {};

export default function Home() {
  return (
    <main className={styles.main}>
      <form>
        검색어를 입력해주세요
        <input></input>
      </form>
    </main>
  );
}
