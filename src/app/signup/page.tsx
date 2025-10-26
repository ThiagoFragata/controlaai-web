"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingInput } from "@/components/floating-input";
import { IOSButton } from "@/components/ios-button";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) return setError("Erro ao criar conta");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) return setError("Erro ao autenticar após cadastro");

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Erro interno");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4 flex-col">
      {/* HERO */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-[#111]">
          ControlaAi
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Sua vida financeira, leve 🍃
        </p>
      </div>

      <Card className="w-full max-w-md border border-[#E5E7EB] shadow-sm bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Criar Conta
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <p className="text-red-600 text-center text-sm mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FloatingInput
              label="Nome"
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FloatingInput
              label="Email"
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FloatingInput
              label="Senha"
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <IOSButton type="submit">Criar Conta</IOSButton>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Já tem conta?{" "}
            <a href="/signin" className="text-[#007AFF] hover:underline">
              Entrar
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
