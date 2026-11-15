"use client";

import { useEffect } from "react";
import Shell from "@/components/Shell";

// Ancienne adresse /fiche?id=… : redirection vers /champignons/… (le serveur redirige déjà ; ceci couvre les autres cas)
export default function AncienneFiche() {
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    window.location.replace(id ? `/champignons/${encodeURIComponent(id)}` : "/");
  }, []);
  return <Shell tab="especes"><p className="empty">Redirection…</p></Shell>;
}
