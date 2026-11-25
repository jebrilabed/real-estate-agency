"use client";


import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client.next";
import { Button } from "@/components/ui/button";
export default function Reset() {
  const [recovery, setRecovery] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setRecovery(new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery");
  }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("كلمتا المرور غير متطابقتين");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(
      error ? "تعذر تحديث كلمة المرور، استخدم رابط استعادة جديد." : "تم تحديث كلمة المرور بنجاح",
    );
    setBusy(false);
  };
  return (
    <section className="auth-panel">
      <h1>كلمة مرور جديدة</h1>
      <p>اختر كلمة مرور آمنة لحسابك</p>
      {message && (
        <div role="status" className="success-message">
          {message}
        </div>
      )}
      {recovery ? (
        <form onSubmit={submit}>
          <label className="field">
            <span>كلمة المرور الجديدة</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="field">
            <span>تأكيد كلمة المرور</span>
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>
          <Button type="submit" disabled={busy}>
            حفظ كلمة المرور
          </Button>
        </form>
      ) : (
        <p>افتح هذه الصفحة من رابط استعادة كلمة المرور في بريدك.</p>
      )}
    </section>
  );
}
