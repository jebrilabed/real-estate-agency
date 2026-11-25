"use client";

import { useState, type FormEvent } from "react";
import { useSession } from "./session";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client.next";
import { toast } from "sonner";
export function InquiryForm({
  propertyId,
  viewing = false,
}: {
  propertyId?: string;
  viewing?: boolean;
}) {
  const { user } = useSession();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const { error } =
      viewing && propertyId
        ? await supabase
            .from("viewing_appointments")
            .insert({
              property_id: propertyId,
              user_id: user.id,
              scheduled_at: new Date(String(f.get("date"))).toISOString(),
            })
        : await supabase
            .from("inquiries")
            .insert({
              property_id: propertyId || null,
              user_id: user.id,
              name: String(f.get("name")),
              phone: String(f.get("phone")),
              message: String(f.get("message")),
            });
    if (error) toast.error("تعذر إرسال الطلب. حاول مجدداً.");
    else setDone(true);
    setBusy(false);
  };
  if (!user)
    return (
      <div className="empty-list">
        <p>سجل الدخول لإرسال استفسار أو طلب معاينة.</p>
        <Button asChild>
          <Link href="/auth">تسجيل الدخول</Link>
        </Button>
      </div>
    );
  if (done)
    return (
      <div className="success-message" role="status">
        تم إرسال طلبك إلى المكتب بنجاح. تابع حالته من حسابك.
      </div>
    );
  return (
    <form onSubmit={submit}>
      {viewing ? (
        <label className="field">
          <span>موعد المعاينة المقترح</span>
          <input
            name="date"
            type="datetime-local"
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </label>
      ) : (
        <>
          <label className="field">
            <span>الاسم</span>
            <input name="name" required />
          </label>
          <label className="field">
            <span>رقم الهاتف</span>
            <input name="phone" type="tel" dir="ltr" required />
          </label>
          <label className="field">
            <span>رسالتك</span>
            <textarea
              name="message"
              required
              defaultValue={propertyId ? "أنا مهتم بهذا العقار وأرغب بمعرفة المزيد." : ""}
            />
          </label>
        </>
      )}
      <Button type="submit" disabled={busy}>
        {busy ? "جارٍ الإرسال…" : viewing ? "إرسال طلب المعاينة" : "إرسال الاستفسار"}
      </Button>
    </form>
  );
}
