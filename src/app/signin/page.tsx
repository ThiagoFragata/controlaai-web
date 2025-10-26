"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingInput } from "@/components/floating-input";
import { IOSButton } from "@/components/ios-button";
import { AnimatedTabContent } from "@/components/animated-tab-content";
import { SegmentedTabs } from "@/components/segmented-tabs";

export default function AuthPage() {
  const router = useRouter();

  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");

  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // SIGNUP STATE
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });

    if (result?.error) setError("Credenciais inválidas");
    else router.push("/dashboard");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      }),
    });

    if (!res.ok) return setError("Erro ao criar conta");

    const result = await signIn("credentials", {
      email: signupEmail,
      password: signupPassword,
      redirect: false,
    });

    if (result?.error) setError("Erro ao autenticar após cadastro");
    else router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-[#F5F5F7]">
      {/* HERO */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-[#111]">
          ControlaAi
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Sua vida financeira, leve 🍃
        </p>
      </div>

      {/* SEGMENTED TABS iOS */}
      <div className="flex flex-col gap-6 w-full items-center">
        <SegmentedTabs
          tabs={[
            { label: "Entrar", value: "login" },
            { label: "Criar Conta", value: "signup" },
          ]}
          defaultValue="login"
          onChange={setTab}
        />

        <div className="relative w-full max-w-lg min-h-[420px]">
          {/* LOGIN */}
          <AnimatedTabContent value="login" current={tab}>
            <Card className="mt-6 border border-[#E5E7EB] shadow-sm bg-white/90 backdrop-blur-sm w-full">
              <CardHeader>
                <CardTitle className="text-center">Acessar conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <p className="text-red-600 text-center text-sm">{error}</p>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <FloatingInput
                    label="Email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />

                  <FloatingInput
                    label="Senha"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />

                  <IOSButton type="submit">Entrar</IOSButton>
                </form>
              </CardContent>
            </Card>
          </AnimatedTabContent>

          {/* SIGNUP */}
          <AnimatedTabContent value="signup" current={tab}>
            <Card className="mt-6 border border-[#E5E7EB] shadow-sm bg-white/90 backdrop-blur-sm w-full">
              <CardHeader>
                <CardTitle className="text-center">Criar Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <p className="text-red-600 text-center text-sm">{error}</p>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
                  <FloatingInput
                    label="Nome"
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />

                  <FloatingInput
                    label="Email"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />

                  <FloatingInput
                    label="Senha"
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />

                  <IOSButton type="submit">Criar Conta</IOSButton>
                </form>
              </CardContent>
            </Card>
          </AnimatedTabContent>
        </div>
      </div>
    </div>
  );
}
