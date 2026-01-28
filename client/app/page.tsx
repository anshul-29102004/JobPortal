"use client"
import { useGlobalContext } from "@/context/globalContext";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const {isAuthenticated}=useGlobalContext();
  return (
   <div>
    <Link href={"http:localhost:8000/login"}>
     Login
    </Link>
   </div>
  );
}
