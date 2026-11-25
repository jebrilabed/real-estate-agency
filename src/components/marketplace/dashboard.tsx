"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Heart,
  MessageCircle,
  CalendarDays,
  Wallet,
  Users,
  ChartNoAxesCombined,
  Settings,
  Bell,
  UserRound,
  Plus,
  Check,
  X,
  Pencil,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client.next";
import { dashboardOptions, publicOptions } from "@/lib/queries";
import { labels, money, commission, type Property } from "@/lib/marketplace";
import { PropertyCard } from "./property-card";
import { PropertyForm } from "./property-form";
import { toast } from "sonner";
export function Dashboard() {
  const { data: d, isError } = useQuery(dashboardOptions);
  const { data: pub, isError: publicError } = useQuery(publicOptions);
  const qc = useQueryClient();
  const admin = d?.role === "admin";
  const owner = d?.role === "owner";
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [edit, setEdit] = useState<Property | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [agreement, setAgreement] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<string | null>(null);
  const [payment, setPayment] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [reject, setReject] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!d || !pub)
    return (
      <div className="container loading">
        {isError
          ? "تعذر تحميل حسابك. سجّل الدخول مجدداً."
          : publicError
            ? "تعذر تحميل العقارات حالياً."
            : "جارٍ تحميل حسابك…"}
      </div>
    );
  const refresh = async () => {
    await qc.invalidateQueries();
  };
  const reportError = (error: unknown) => {
    if (error) toast.error("تعذر حفظ التغيير. تحقق من البيانات والصلاحيات.");
    else {
      toast.success("تم حفظ التغيير");
      void refresh();
    }
  };
  const props = admin
    ? d.properties
    : owner
      ? d.properties.filter((p) => p.owner_id === d.userId)
      : [];
  const filtered = props.filter(
    (p) =>
      (!search || `${p.title} ${p.city}`.includes(search)) &&
      (!filter || p.approval === filter || p.status === filter),
  );
  const nav = admin
    ? [
        ["overview", "نظرة عامة", ChartNoAxesCombined],
        ["properties", "إدارة العقارات", Building2],
        ["owners", "أصحاب العقارات", Users],
        ["leads", "العملاء والاستفسارات", MessageCircle],
        ["appointments", "مواعيد المعاينة", CalendarDays],
        ["commissions", "العمولات", Wallet],
        ["reports", "التقارير", ChartNoAxesCombined],
        ["settings", "إعدادات الموقع", Settings],
        ["notifications", "الإشعارات", Bell],
        ["profile", "الملف الشخصي", UserRound],
      ]
    : owner
      ? [
          ["overview", "نظرة عامة", ChartNoAxesCombined],
          ["properties", "عقاراتي", Building2],
          ["leads", "الاستفسارات", MessageCircle],
          ["notifications", "الإشعارات", Bell],
          ["profile", "الملف الشخصي", UserRound],
        ]
      : [
          ["overview", "حسابي", UserRound],
          ["favorites", "العقارات المفضلة", Heart],
          ["leads", "استفساراتي", MessageCircle],
          ["appointments", "مواعيد المعاينة", CalendarDays],
          ["notifications", "الإشعارات", Bell],
          ["profile", "الملف الشخصي", UserRound],
        ];
  const totalCommission = d.transactions.reduce((s, t) => s + t.commission, 0);
  const paid = d.payments.reduce((s, p) => s + p.amount, 0);
  const title = nav.find((n) => n[0] === tab)?.[1] || "حسابي";
  const saveAgreement = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreement) return;
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const { error } = await supabase
      .from("commission_agreements")
      .upsert(
        {
          property_id: agreement,
          kind: String(f.get("kind")),
          rate: Number(f.get("rate")),
          terms: String(f.get("terms")),
        },
        { onConflict: "property_id" },
      );
    reportError(error);
    if (!error) setAgreement(null);
    setBusy(false);
  };
  const confirmTransaction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!transaction) return;
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.rpc("confirm_transaction", {
      p_property: transaction,
      p_amount: Number(f.get("amount")),
    });
    reportError(error);
    if (!error) setTransaction(null);
    setBusy(false);
  };
  const savePayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payment) return;
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const { error } = await supabase
      .from("commission_payments")
      .insert({
        agreement_id: payment,
        amount: Number(f.get("amount")),
        paid_at: String(f.get("date")),
        notes: String(f.get("notes")),
      });
    reportError(error);
    if (!error) setPayment(null);
    setBusy(false);
  };
  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: String(f.get("name")),
        phone: String(f.get("phone")),
        updated_at: new Date().toISOString(),
      })
      .eq("id", d.userId);
    reportError(error);
  };
  const saveSettings = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { error } = await supabase
      .from("website_settings")
      .upsert(
        Array.from(f.entries()).map(([key, value]) => ({
          key,
          value: String(value),
          updated_at: new Date().toISOString(),
        })),
      );
    reportError(error);
  };
  const exportReport = () => {
    const rows = [
      ["property", "currency", "amount", "commission", "date"],
      ...d.transactions.map((t) => {
        const p = d.properties.find((p) => p.id === t.property_id);
        return [
          p?.title || "",
          p?.currency || "",
          String(t.amount),
          String(t.commission),
          t.completed_at.slice(0, 10),
        ];
      }),
    ];
    const csv =
      "\uFEFF" +
      rows.map((r) => r.map((v) => '"' + v.replace(/"/g, '""') + '"').join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "commission-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const chart = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 5 + i);
    const month = date.toISOString().slice(0, 7);
    return {
      month: new Intl.DateTimeFormat("ar", { month: "short" }).format(date),
      count: d.properties.filter((p) => p.created_at.startsWith(month)).length,
    };
  });
  return (
    <div className="container page-body dashboard-layout">
      <aside className="dashboard-nav">
        <h3>{labels[d.role]}</h3>
        <p>{d.profile?.display_name || "أهلاً بك في دار فلسطين"}</p>
        {nav.map(([key, text, Icon]) => {
          const I = Icon as typeof Building2;
          return (
            <Button
              key={String(key)}
              variant="ghost"
              className={tab === key ? "active" : ""}
              onClick={() => setTab(String(key))}
            >
              <I />
              {String(text)}
            </Button>
          );
        })}
      </aside>
      <section className="dashboard-section min-w-0">
        <div className="dashboard-heading">
          <div>
            <h1>{String(title)}</h1>
            <p>
              أهلاً {d.profile?.display_name || "بك"}،{" "}
              {admin
                ? "تابع أعمال مكتبك من مكان واحد"
                : owner
                  ? "تابع إعلاناتك واستفسارات المهتمين"
                  : "مساحتك الخاصة لرحلتك العقارية"}
            </p>
          </div>
          {(admin || owner) && (
            <Button asChild>
              <Link href="/publish">
                <Plus /> أضف عقاراً
              </Link>
            </Button>
          )}
        </div>
        {tab === "overview" && (
          <>
            <div className="stats-grid">
              {(admin
                ? [
                    [d.properties.length, "إجمالي العقارات", Building2],
                    [
                      d.properties.filter(
                        (p) => p.status === "available" && p.approval === "approved",
                      ).length,
                      "العقارات المتاحة",
                      Building2,
                    ],
                    [
                      d.properties.filter((p) => p.approval === "pending").length,
                      "بانتظار المراجعة",
                      Bell,
                    ],
                    [d.inquiries.length, "الاستفسارات", MessageCircle],
                  ]
                : owner
                  ? [
                      [props.length, "عقاراتك", Building2],
                      [props.filter((p) => p.approval === "pending").length, "قيد المراجعة", Bell],
                      [d.inquiries.length, "الاستفسارات", MessageCircle],
                      [props.reduce((s, p) => s + p.views, 0), "المشاهدات", Eye],
                    ]
                  : [
                      [d.favorites.length, "العقارات المحفوظة", Heart],
                      [d.inquiries.length, "استفساراتك", MessageCircle],
                      [d.appointments.length, "مواعيدك", CalendarDays],
                      [d.notifications.filter((n) => !n.read).length, "إشعارات جديدة", Bell],
                    ]
              ).map(([value, label, Icon]) => {
                const I = Icon as typeof Building2;
                return (
                  <div className="stat-card" key={String(label)}>
                    <I />
                    <strong>{String(value)}</strong>
                    <small>{String(label)}</small>
                  </div>
                );
              })}
            </div>
            {admin && (
              <>
                <h2>الإعلانات خلال الأشهر الأخيرة</h2>
                <div className="chart-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chart}>
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        name="العقارات"
                        fill="var(--primary)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="stats-grid">
                  <div className="stat-card">
                    <strong>{props.filter((p) => p.status === "sold").length}</strong>
                    <small>عقارات مباعة</small>
                  </div>
                  <div className="stat-card">
                    <strong>{props.filter((p) => p.status === "rented").length}</strong>
                    <small>عقارات مؤجرة</small>
                  </div>
                  <div className="stat-card">
                    <strong>{d.profiles.length}</strong>
                    <small>الحسابات المسجلة</small>
                  </div>
                  <div className="stat-card">
                    <strong>{d.agreements.length}</strong>
                    <small>اتفاقيات عمولة</small>
                  </div>
                </div>
              </>
            )}
            {!admin && (
              <div className="empty-list">
                <Building2 />
                <h3>{owner ? "كل عقاراتك في مكان واحد" : "لنكتشف المكان الذي يشبهك"}</h3>
                <Button asChild>
                  <Link href={owner ? "/publish" : "/properties"}>
                    {owner ? "أضف عقارك الأول" : "استعرض العقارات"}
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
        {tab === "properties" && (
          <>
            <div className="listing-toolbar">
              <input
                className="control"
                aria-label="بحث العقارات"
                placeholder="ابحث بالعنوان أو المدينة"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="control"
                aria-label="حالة العقار"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">كل الحالات</option>
                {["pending", "approved", "rejected", "available", "reserved", "sold", "rented"].map(
                  (s) => (
                    <option value={s} key={s}>
                      {labels[s]}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>العقار</th>
                    <th>السعر</th>
                    <th>المراجعة</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.title}</strong>
                        <div className="text-muted-foreground mt-1">
                          {p.city} · {p.category}
                        </div>
                        {p.rejection_reason && (
                          <div className="text-destructive mt-1">{p.rejection_reason}</div>
                        )}
                      </td>
                      <td>{money(p.price, p.currency)}</td>
                      <td>
                        <Status value={p.approval} />
                      </td>
                      <td>
                        {admin ? (
                          <select
                            className="control"
                            value={p.status}
                            onChange={async (e) => {
                              if (["sold", "rented"].includes(e.target.value)) {
                                toast.info("سجّل المعاملة من قسم العمولات لتأكيد الإتمام");
                                return;
                              }
                              const { error } = await supabase
                                .from("properties")
                                .update({ status: e.target.value })
                                .eq("id", p.id);
                              reportError(error);
                            }}
                          >
                            {["available", "reserved", "sold", "rented"].map((s) => (
                              <option value={s} key={s}>
                                {labels[s]}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Status value={p.status} />
                        )}
                      </td>
                      <td>
                        <div className="row-actions">
                          {admin && p.approval === "pending" && (
                            <>
                              <Button
                                size="icon"
                                variant="outline"
                                title="اعتماد"
                                onClick={async () => {
                                  const { error } = await supabase
                                    .from("properties")
                                    .update({ approval: "approved" })
                                    .eq("id", p.id);
                                  reportError(error);
                                }}
                              >
                                <Check />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                title="رفض"
                                onClick={() => setReject(p.id)}
                              >
                                <X />
                              </Button>
                            </>
                          )}
                          <Button
                            size="icon"
                            variant="outline"
                            title="تعديل"
                            onClick={() => setEdit(p)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            title="حذف"
                            onClick={() => setDeleteId(p.id)}
                          >
                            <Trash2 />
                          </Button>
                          {admin && (
                            <Button
                              size="icon"
                              variant="outline"
                              title="اتفاقية العمولة"
                              onClick={() => setAgreement(p.id)}
                            >
                              <Wallet />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!filtered.length && <Empty text="لا توجد عقارات مطابقة" />}
          </>
        )}
        {tab === "favorites" && (
          <>
            {d.favorites.length ? (
              <div className="properties-grid">
                {pub.properties
                  .filter((p) => d.favorites.some((f) => f.property_id === p.id))
                  .map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
              </div>
            ) : (
              <Empty text="لم تحفظ أي عقار بعد" />
            )}
          </>
        )}
        {tab === "leads" && (
          <>
            {d.inquiries.length ? (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>العميل</th>
                      <th>العقار / الرسالة</th>
                      <th>الحالة</th>
                      {admin && <th>الملاحظات</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {d.inquiries.map((i) => (
                      <tr key={i.id}>
                        <td>
                          {i.name}
                          <a className="block text-primary mt-1" href={"tel:" + i.phone}>
                            {i.phone}
                          </a>
                        </td>
                        <td>
                          {d.properties.find((p) => p.id === i.property_id)?.title || "استفسار عام"}
                          <p className="text-muted-foreground mt-2">{i.message}</p>
                        </td>
                        <td>
                          {admin ? (
                            <select
                              className="control"
                              value={i.status}
                              onChange={async (e) => {
                                const { error } = await supabase
                                  .from("inquiries")
                                  .update({
                                    status: e.target.value,
                                    updated_at: new Date().toISOString(),
                                  })
                                  .eq("id", i.id);
                                reportError(error);
                              }}
                            >
                              {[
                                "new",
                                "contacted",
                                "viewing",
                                "negotiating",
                                "successful",
                                "lost",
                              ].map((s) => (
                                <option key={s} value={s}>
                                  {labels[s]}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Status value={i.status} />
                          )}
                        </td>
                        {admin && (
                          <td>
                            {d.notes
                              .filter((n) => n.inquiry_id === i.id)
                              .map((n) => (
                                <p key={n.id} className="mb-2">
                                  {n.note}
                                </p>
                              ))}
                            <Button
                              size="icon"
                              variant="outline"
                              title="إضافة ملاحظة"
                              onClick={() => setNote(i.id)}
                            >
                              <Plus />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty text="لا توجد استفسارات بعد" />
            )}
          </>
        )}
        {tab === "appointments" && (
          <>
            {d.appointments.length ? (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>العقار</th>
                      <th>الموعد المقترح</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.appointments.map((a) => (
                      <tr key={a.id}>
                        <td>
                          {d.properties.find((p) => p.id === a.property_id)?.title ||
                            "عقار غير متاح"}
                        </td>
                        <td>{new Date(a.scheduled_at).toLocaleString("ar")}</td>
                        <td>
                          {admin ? (
                            <select
                              className="control"
                              value={a.status}
                              onChange={async (e) => {
                                const { error } = await supabase
                                  .from("viewing_appointments")
                                  .update({ status: e.target.value })
                                  .eq("id", a.id);
                                reportError(error);
                              }}
                            >
                              {["requested", "confirmed", "cancelled", "completed"].map((s) => (
                                <option value={s} key={s}>
                                  {labels[s]}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Status value={a.status} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty text="لا توجد مواعيد معاينة" />
            )}
          </>
        )}
        {tab === "owners" && admin && (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>الهاتف</th>
                  <th>العقارات</th>
                  <th>التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {d.profiles
                  .filter((u) => d.properties.some((p) => p.owner_id === u.id))
                  .map((u) => (
                    <tr key={u.id}>
                      <td>{u.display_name || "بدون اسم"}</td>
                      <td>{u.phone || "غير محدد"}</td>
                      <td>{d.properties.filter((p) => p.owner_id === u.id).length}</td>
                      <td>
                        <Button variant="outline" onClick={() => setOwnerId(u.id)}>
                          عرض النشاط
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!d.profiles.some((u) => d.properties.some((p) => p.owner_id === u.id)) && (
              <Empty text="لا يوجد أصحاب عقارات لديهم إعلانات" />
            )}
          </div>
        )}
        {tab === "commissions" && admin && (
          <>
            <FinancialSummary
              properties={d.properties}
              transactions={d.transactions}
              payments={d.payments}
            />
            <Button variant="outline" onClick={exportReport}>
              <Download /> تنزيل تقرير
            </Button>
            <h2>اتفاقيات العمولة</h2>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>العقار</th>
                    <th>العمولة المتفق عليها</th>
                    <th>الحالة</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {d.agreements.map((a) => (
                    <tr key={a.id}>
                      <td>
                        {d.properties.find((p) => p.id === a.property_id)?.title}
                        <p className="text-muted-foreground mt-2">{a.terms}</p>
                      </td>
                      <td>
                        {a.kind === "percentage"
                          ? a.rate + "%"
                          : money(
                              a.rate,
                              d.properties.find((p) => p.id === a.property_id)?.currency,
                            )}
                      </td>
                      <td>
                        <Status value={a.status} />
                      </td>
                      <td>
                        <div className="flex gap-2 flex-wrap">
                          {!d.transactions.some((t) => t.agreement_id === a.id) &&
                            a.status !== "cancelled" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setTransaction(a.property_id)}
                              >
                                تأكيد المعاملة
                              </Button>
                            )}
                          {a.status === "due" && (
                            <Button size="sm" onClick={() => setPayment(a.id)}>
                              تسجيل دفعة
                            </Button>
                          )}
                          {!d.transactions.some((t) => t.agreement_id === a.id) &&
                            a.status !== "cancelled" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  const { error } = await supabase
                                    .from("commission_agreements")
                                    .update({ status: "cancelled" })
                                    .eq("id", a.id);
                                  reportError(error);
                                }}
                              >
                                إلغاء الاتفاق
                              </Button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!d.agreements.length && <Empty text="أضف اتفاقية عمولة من إدارة العقارات" />}
            <h2>المعاملات المؤكدة</h2>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>العقار</th>
                    <th>قيمة المعاملة</th>
                    <th>العمولة</th>
                    <th>التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {d.transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{d.properties.find((p) => p.id === t.property_id)?.title}</td>
                      <td>
                        {money(
                          t.amount,
                          d.properties.find((p) => p.id === t.property_id)?.currency,
                        )}
                      </td>
                      <td>
                        {money(
                          t.commission,
                          d.properties.find((p) => p.id === t.property_id)?.currency,
                        )}
                      </td>
                      <td>{t.completed_at.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2>الدفعات المسجلة</h2>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>المبلغ</th>
                    <th>التاريخ</th>
                    <th>ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {d.payments.map((p) => (
                    <tr key={p.id}>
                      <td>{p.amount}</td>
                      <td>{p.paid_at}</td>
                      <td>{p.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "reports" && admin && (
          <>
            <FinancialSummary
              properties={d.properties}
              transactions={d.transactions}
              payments={d.payments}
            />
            <Button variant="outline" onClick={exportReport}>
              <Download /> تنزيل التقرير المالي
            </Button>
            <h2>أداء العقارات</h2>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>العقار</th>
                    <th>المشاهدات</th>
                    <th>الاستفسارات</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {[...d.properties]
                    .sort((a, b) => b.views - a.views)
                    .map((p) => (
                      <tr key={p.id}>
                        <td>{p.title}</td>
                        <td>{p.views}</td>
                        <td>{d.inquiries.filter((i) => i.property_id === p.id).length}</td>
                        <td>
                          <Status value={p.status} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <h2>العمولات الشهرية</h2>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>الشهر</th>
                    <th>العملة</th>
                    <th>العمولات</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set(d.transactions.map((t) => t.completed_at.slice(0, 7)))).map(
                    (month) =>
                      ["USD", "ILS", "JOD"].map((currency) => {
                        const sum = d.transactions
                          .filter(
                            (t) =>
                              t.completed_at.startsWith(month) &&
                              d.properties.find((p) => p.id === t.property_id)?.currency ===
                                currency,
                          )
                          .reduce((s, t) => s + t.commission, 0);
                        return sum ? (
                          <tr key={month + currency}>
                            <td>{month}</td>
                            <td>{currency}</td>
                            <td>{money(sum, currency)}</td>
                          </tr>
                        ) : null;
                      }),
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "settings" && admin && (
          <>
            <form className="form-max" onSubmit={saveSettings}>
              <div className="form-grid">
                {([
                  ["phone", "هاتف المكتب"],
                  ["email", "البريد الإلكتروني"],
                  ["whatsapp", "رقم واتساب مع رمز الدولة"],
                  ["address", "عنوان المكتب"],
                  ["cover", "رابط صورة الغلاف"],
                ] as const).map(([key, label]) => (
                  <label className="field" key={key}>
                    <span>{label}</span>
                    <input
                      name={key}
                      type={key === "email" ? "email" : key === "cover" ? "url" : "text"}
                      defaultValue={pub.settings[key]}
                    />
                  </label>
                ))}
                <label className="field wide">
                  <span>نبذة عن المكتب</span>
                  <textarea name="about" defaultValue={pub.settings.about} />
                </label>
              </div>
              <Button type="submit">حفظ الإعدادات</Button>
            </form>
            <h2>العقارات المميزة</h2>
            {d.properties
              .filter((p) => p.approval === "approved")
              .map((p) => (
                <label className="field flex-row items-center" key={p.id}>
                  <input
                    type="checkbox"
                    checked={p.featured}
                    onChange={async (e) => {
                      const { error } = await supabase
                        .from("properties")
                        .update({ featured: e.target.checked })
                        .eq("id", p.id);
                      reportError(error);
                    }}
                  />
                  {p.title}
                </label>
              ))}
          </>
        )}
        {tab === "notifications" && (
          <>
            {d.notifications.length ? (
              d.notifications.map((n) => (
                <div key={n.id} className="flex gap-3 border-b border-border py-4 items-center">
                  <Bell className="text-primary" size={18} />
                  <div className="flex-1 text-sm">
                    {n.message}
                    <small className="block text-muted-foreground mt-2">
                      {new Date(n.created_at).toLocaleDateString("ar")}
                    </small>
                  </div>
                  {!n.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="وضع علامة مقروء"
                      onClick={async () => {
                        const { error } = await supabase
                          .from("notifications")
                          .update({ read: true })
                          .eq("id", n.id);
                        reportError(error);
                      }}
                    >
                      <Check />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <Empty text="لا توجد إشعارات" />
            )}
          </>
        )}
        {tab === "profile" && (
          <form className="form-max" onSubmit={saveProfile}>
            <label className="field">
              <span>الاسم الكامل</span>
              <input name="name" required defaultValue={d.profile?.display_name} />
            </label>
            <label className="field">
              <span>رقم الهاتف</span>
              <input name="phone" type="tel" defaultValue={d.profile?.phone} />
            </label>
            <div className="field">
              <span>نوع حسابك</span>
              <p>{labels[d.role]}</p>
            </div>
            <Button type="submit">حفظ الملف الشخصي</Button>
          </form>
        )}
      </section>
      <Dialog open={!!edit} onOpenChange={() => setEdit(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogTitle>تعديل العقار</DialogTitle>
          <DialogDescription>تحديث تفاصيل الإعلان</DialogDescription>
          {edit && <PropertyForm property={edit} admin={admin} onDone={() => setEdit(null)} />}
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent dir="rtl">
          <DialogTitle>حذف العقار؟</DialogTitle>
          <DialogDescription>
            سيُحذف الإعلان وصوره المرتبطة. لا يمكن التراجع عن الحذف.
          </DialogDescription>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={async () => {
                if (!deleteId) return;
                const { error } = await supabase.from("properties").delete().eq("id", deleteId);
                reportError(error);
                if (!error) setDeleteId(null);
              }}
            >
              تأكيد الحذف
            </Button>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              إلغاء
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!reject} onOpenChange={() => setReject(null)}>
        <DialogContent dir="rtl">
          <DialogTitle>رفض الإعلان</DialogTitle>
          <DialogDescription>سيظهر سبب الرفض للمالك.</DialogDescription>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!reject) return;
              const reason = new FormData(e.currentTarget).get("reason");
              const { error } = await supabase
                .from("properties")
                .update({ approval: "rejected", rejection_reason: String(reason) })
                .eq("id", reject);
              reportError(error);
              if (!error) setReject(null);
            }}
          >
            <label className="field">
              <span>سبب الرفض</span>
              <textarea name="reason" required />
            </label>
            <Button type="submit">رفض الإعلان</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!agreement} onOpenChange={() => setAgreement(null)}>
        <DialogContent dir="rtl">
          <DialogTitle>اتفاقية العمولة</DialogTitle>
          <DialogDescription>تسجيل الاتفاق مع مالك العقار، دون تحصيل تلقائي.</DialogDescription>
          <form onSubmit={saveAgreement}>
            <label className="field">
              <span>نوع العمولة</span>
              <select
                name="kind"
                defaultValue={d.agreements.find((a) => a.property_id === agreement)?.kind}
              >
                <option value="percentage">نسبة مئوية</option>
                <option value="fixed">مبلغ ثابت بعملة العقار</option>
              </select>
            </label>
            <label className="field">
              <span>النسبة أو المبلغ</span>
              <input
                name="rate"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={d.agreements.find((a) => a.property_id === agreement)?.rate}
              />
            </label>
            <label className="field">
              <span>شروط الاتفاق</span>
              <textarea
                name="terms"
                required
                defaultValue={d.agreements.find((a) => a.property_id === agreement)?.terms}
              />
            </label>
            <Button type="submit" disabled={busy}>
              حفظ الاتفاقية
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!transaction} onOpenChange={() => setTransaction(null)}>
        <DialogContent dir="rtl">
          <DialogTitle>تأكيد إتمام المعاملة</DialogTitle>
          <DialogDescription>
            بتأكيدك ستُسجل المعاملة وسيُحدّث العقار إلى مباع أو مؤجر وتُحسب العمولة.
          </DialogDescription>
          <form onSubmit={confirmTransaction}>
            <label className="field">
              <span>القيمة النهائية بعملة العقار</span>
              <input name="amount" type="number" min="1" step="0.01" required />
            </label>
            <label className="field flex-row items-center">
              <input type="checkbox" required />
              أؤكد أن البيع أو الإيجار تم فعلياً
            </label>
            <Button type="submit" disabled={busy}>
              تأكيد الإتمام وحساب العمولة
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!payment} onOpenChange={() => setPayment(null)}>
        <DialogContent dir="rtl">
          <DialogTitle>تسجيل دفعة عمولة</DialogTitle>
          <DialogDescription>سجل دفعة تم استلامها فعلياً خارج المنصة.</DialogDescription>
          <form onSubmit={savePayment}>
            <label className="field">
              <span>المبلغ</span>
              <input name="amount" type="number" required min="0.01" step="0.01" />
            </label>
            <label className="field">
              <span>تاريخ الدفع</span>
              <input name="date" type="date" required />
            </label>
            <label className="field">
              <span>ملاحظات</span>
              <textarea name="notes" />
            </label>
            <Button type="submit" disabled={busy}>
              تسجيل الدفعة
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!note} onOpenChange={() => setNote(null)}>
        <DialogContent dir="rtl">
          <DialogTitle>ملاحظة داخلية</DialogTitle>
          <DialogDescription>متاحة لإدارة المكتب فقط.</DialogDescription>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!note) return;
              const f = new FormData(e.currentTarget);
              const { error } = await supabase
                .from("lead_notes")
                .insert({ inquiry_id: note, note: String(f.get("note")) });
              reportError(error);
              if (!error) setNote(null);
            }}
          >
            <label className="field">
              <span>الملاحظة</span>
              <textarea name="note" required />
            </label>
            <Button type="submit">حفظ الملاحظة</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!ownerId} onOpenChange={() => setOwnerId(null)}>
        <DialogContent dir="rtl">
          <DialogTitle>عقارات المالك ونشاطه</DialogTitle>
          <DialogDescription>
            {d.profiles.find((p) => p.id === ownerId)?.display_name}
          </DialogDescription>
          {d.properties
            .filter((p) => p.owner_id === ownerId)
            .map((p) => (
              <div key={p.id} className="border-b border-border py-3">
                <strong>{p.title}</strong>
                <p className="text-sm text-muted-foreground mt-2">
                  {p.created_at.slice(0, 10)} · {labels[p.approval]} · {labels[p.status]}
                </p>
                <p className="text-xs mt-2">
                  {d.agreements.find((a) => a.property_id === p.id)?.terms ||
                    "لم تُسجل اتفاقية عمولة"}
                </p>
              </div>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
function Status({ value }: { value: string }) {
  return <span className={"status status-" + value}>{labels[value] || value}</span>;
}
function Empty({ text }: { text: string }) {
  return (
    <div className="empty-list">
      <Building2 />
      <h3>{text}</h3>
    </div>
  );
}
function FinancialSummary({
  properties,
  transactions,
  payments,
}: {
  properties: Property[];
  transactions: { property_id: string; agreement_id: string; commission: number }[];
  payments: { agreement_id: string; amount: number }[];
}) {
  return (
    <div className="stats-grid">
      {["USD", "ILS", "JOD"].map((currency) => {
        const tx = transactions.filter(
          (t) => properties.find((p) => p.id === t.property_id)?.currency === currency,
        );
        const sum = tx.reduce((s, t) => s + t.commission, 0);
        const paid = payments
          .filter((p) => tx.some((t) => t.agreement_id === p.agreement_id))
          .reduce((s, p) => s + p.amount, 0);
        return (
          <div className="stat-card" key={currency}>
            <Wallet />
            <strong className="text-lg">{money(sum, currency)}</strong>
            <small>إجمالي العمولات</small>
            <p className="text-xs mt-3">مدفوع: {money(paid, currency)}</p>
            <p className="text-xs mt-2">مستحق: {money(Math.max(0, sum - paid), currency)}</p>
          </div>
        );
      })}
    </div>
  );
}
