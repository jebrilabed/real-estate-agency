"use client";


import { useQuery } from "@tanstack/react-query";
import { publicOptions } from "@/lib/queries";
import { InquiryForm } from "@/components/marketplace/inquiry-form";
export default function Contact() {
  const { data, isError } = useQuery(publicOptions);
  if (!data)
    return (
      <div className="container loading">
        {isError ? "تعذر تحميل بيانات الصفحة حالياً." : "جارٍ تحميل الصفحة…"}
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div className="container">
          <h1>لنجد لك المكان المناسب</h1>
          <p>فريق دار فلسطين هنا للإجابة عن استفساراتك</p>
        </div>
      </div>
      <section className="container page-body agency-layout">
        <div>
          <h2 className="text-2xl mb-5">تواصل مع دار فلسطين</h2>
          <p>أرسل رسالتك، وسيتابع فريق المكتب طلبك.</p>
          {data.settings.phone && (
            <p>
              <a href={"tel:" + data.settings.phone}>{data.settings.phone}</a>
            </p>
          )}
          {data.settings.email && (
            <p>
              <a href={"mailto:" + data.settings.email}>{data.settings.email}</a>
            </p>
          )}
          {data.settings.address && <p>{data.settings.address}</p>}
        </div>
        <InquiryForm />
      </section>
    </>
  );
}
