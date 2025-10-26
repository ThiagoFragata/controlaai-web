"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const router = useRouter();

  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // SIGNUP STATE
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciais inválidas");
    } else {
      router.push("/dashboard");
    }
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

    if (result?.error) {
      setError("Erro ao autenticar após cadastro");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LADO ESQUERDO — HERO */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-12 flex-col justify-between">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight drop-shadow-md">
            Bem-vindo ao ControlaAi
          </h1>
          <p className="text-lg opacity-90 max-w-sm">
            Controle suas finanças de forma simples, rápida e inteligente.
          </p>
        </div>

        <p className="opacity-80 text-sm">
          © {new Date().getFullYear()} • ControlaAi
        </p>
      </div>

      {/* LADO DIREITO — CARD DE LOGIN/CADASTRO */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <Tabs defaultValue="login" className="w-full max-w-md">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Criar Conta</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <Card className="backdrop-blur-lg bg-white/70 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-center">Acessar Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && <p className="text-red-600 text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button className="w-full" type="submit">
                    Entrar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIGNUP */}
          <TabsContent value="signup">
            <Card className="backdrop-blur-lg bg-white/70 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-center">Criar Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && <p className="text-red-600 text-center">{error}</p>}

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    type="submit"
                  >
                    Criar Conta
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
