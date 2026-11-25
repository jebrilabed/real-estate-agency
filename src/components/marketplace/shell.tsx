"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  Plus,
  Menu,
  X,
  LogOut,
  ArrowUpLeft,
  MapPin,
  Mail,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "./session";
import { supabase } from "@/integrations/supabase/client.next";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { publicOptions } from "@/lib/queries";
export function Brand() {
  return (
    <Link href="/" className="brand">
      <span className="brand-icon">
        <Building2 size={27} />
      </span>
      <span>
        دار فلسطين<small>DAR PALESTINE</small>
      </span>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useSession();
  const qc = useQueryClient();
  const router = useRouter();
  const logout = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.replace("/auth");
  };
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>
            <MapPin size={13} /> وجهتك العقارية في فلسطين
          </span>
          <span>
            مساحات جديدة، بدايات أجمل <span className="topbar-divider">|</span> العربية
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className={open ? "main-nav is-open" : "main-nav"} onClick={() => setOpen(false)}>
            <Link href="/">
              الرئيسية
            </Link>
            <Link href="/properties">العقارات</Link>
            <Link href="/about">من نحن</Link>
            <Link href="/contact">تواصل معنا</Link>
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">
                    <Heart /> حسابي
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" title="تسجيل الخروج" onClick={logout}>
                  <LogOut />
                </Button>
              </>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/auth">تسجيل الدخول</Link>
              </Button>
            )}
            <Button asChild className="add-property">
              <Link href="/publish">
                <Plus /> أضف عقارك
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              aria-label="القائمة"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  const { data } = useQuery(publicOptions);
  if (!data) return null;
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Brand />
          <p>
            عقارك القادم، أقرب مما تتخيل.
            <br />
            نرافقك في رحلة البحث عن المكان الذي يشبهك.
          </p>
          <span className="footer-country">
            <MapPin size={16} /> فلسطين
          </span>
        </div>
        <div>
          <h4>اكتشف دار فلسطين</h4>
          <Link href="/properties">جميع العقارات</Link>
          <Link href="/properties?purpose=sale">
            عقارات للبيع
          </Link>
          <Link href="/properties?purpose=rent">
            عقارات للإيجار
          </Link>
        </div>
        <div>
          <h4>روابط تهمك</h4>
          <Link href="/about">عن دار فلسطين</Link>
          <Link href="/publish">أضف عقارك</Link>
          <Link href="/contact">تواصل معنا</Link>
        </div>
        <div>
          <h4>لنجد لك المكان المناسب</h4>
          <p>للاستفسارات وطلبات المعاينة</p>
          {data.settings.email && (
            <a href={"mailto:" + data.settings.email}>
              <Mail size={16} />
              {data.settings.email}
            </a>
          )}
          <Button variant="outline" asChild>
            <Link href="/contact">
              تواصل مع فريقنا <ArrowUpLeft />
            </Link>
          </Button>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 دار فلسطين. جميع الحقوق محفوظة.</span>
        <span>
          <ShieldCheck size={15} /> إعلانات تُراجع بعناية
        </span>
      </div>
    </footer>
  );
}
