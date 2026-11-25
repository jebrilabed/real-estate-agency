"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client.next";
import { lovable } from "@/integrations/lovable/next";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
export default function Auth() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      if (mode === "forgot") {
        const r = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (r.error) throw r.error;
        setSuccess("إذا كان البريد مسجلاً، ستصلك رسالة لإعادة تعيين كلمة المرور.");
      } else if (mode === "signup") {
        const r = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name, account_type: role },
          },
        });
        if (r.error) throw r.error;
        if (r.data.session) router.push("/dashboard");
        else setSuccess("تحقق من بريدك الإلكتروني وأكّد حسابك قبل تسجيل الدخول.");
      } else {
        const r = await supabase.auth.signInWithPassword({ email, password });
        if (r.error) throw r.error;
        router.push("/dashboard");
      }
    } catch {
      setError("تعذر إتمام الطلب. تحقق من البيانات وتأكيد البريد ثم حاول مجدداً.");
    } finally {
      setBusy(false);
    }
  };
  const social = async (provider: "google" | "lovable") => {
    const r = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (r.error) setError("تعذر تسجيل الدخول، حاول مرة أخرى.");
    else if (!r.redirected) router.push("/dashboard");
  };
  return (
    <section className="auth-panel">
      <h1>
        {mode === "login"
          ? "أهلاً بعودتك"
          : mode === "signup"
            ? "بداية جديدة مع دار فلسطين"
            : "استعادة كلمة المرور"}
      </h1>
      <p>
        {mode === "signup"
          ? "أنشئ حسابك وابدأ رحلتك العقارية"
          : "مساحتك الخاصة لإدارة رحلتك العقارية"}
      </p>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      {success ? (
        <div className="success-message" role="status">
          {success}
        </div>
      ) : (
        <>
          {mode !== "forgot" && (
            <>
              <Button variant="outline" className="auth-provider" onClick={() => social("google")}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                المتابعة مع Google
              </Button>
              <Button variant="outline" className="auth-provider" onClick={() => social("lovable")}>
                <LovableMark />
                المتابعة مع Lovable
              </Button>
              <div className="auth-divider">أو باستخدام البريد الإلكتروني</div>
            </>
          )}
          <form onSubmit={submit}>
            {mode === "signup" && (
              <>
                <label className="field">
                  <span>الاسم الكامل</span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </label>
                <label className="field">
                  <span>نوع الحساب</span>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="buyer">باحث عن عقار</option>
                    <option value="owner">مالك عقار</option>
                  </select>
                </label>
              </>
            )}
            <label className="field">
              <span>البريد الإلكتروني</span>
              <input
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>
            {mode !== "forgot" && (
              <label className="field">
                <span>كلمة المرور</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </label>
            )}
            {mode === "login" && (
              <Button
                variant="link"
                type="button"
                className="mb-4 px-0"
                onClick={() => setMode("forgot")}
              >
                نسيت كلمة المرور؟
              </Button>
            )}
            <Button type="submit" className="w-full h-11" disabled={busy}>
              {busy
                ? "جارٍ الإرسال…"
                : mode === "login"
                  ? "تسجيل الدخول"
                  : mode === "signup"
                    ? "إنشاء الحساب"
                    : "إرسال رابط الاستعادة"}
            </Button>
          </form>
        </>
      )}
      <div className="auth-footer">
        <Button
          variant="link"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
            setSuccess("");
          }}
        >
          {mode === "login" ? "ليس لديك حساب؟ أنشئ حساباً" : "العودة لتسجيل الدخول"}
        </Button>
      </div>
      <Button variant="link" asChild className="w-full">
        <Link href="/properties">متابعة التصفح دون حساب</Link>
      </Button>
    </section>
  );
}
