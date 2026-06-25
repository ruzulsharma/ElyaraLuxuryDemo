import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Elyara by Sweety. Visit our atelier in Noida, call us, or send a message. We're happy to assist with custom orders, styling, and more.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#faf8f4] min-h-screen">
      {/* Header */}
      <div className="bg-[#1a2744] py-16 px-6 text-center">
        <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">Reach Out</p>
        <h1 className="text-4xl font-serif font-light text-white mb-3">Contact Us</h1>
        <p className="text-white/50 text-sm max-w-sm mx-auto">
          We&apos;d love to hear from you. For custom orders, styling advice, or just to say hello.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-serif font-light text-[#1a2744] mb-6">Visit the Atelier</h2>
            <div className="space-y-6">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  title: "Address",
                  content: "DLF Mall of India, Sector 18\nNoida, Uttar Pradesh, India",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Hours",
                  content: "Monday – Saturday: 11:00 – 20:00 IST\nSunday: By Appointment",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  title: "Phone",
                  content: "+91 8796134073",
                  href: "tel:+8796134073",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: "Email",
                  content: "elyarabysweety@gmail.com",
                  href: "mailto:elyarabysweety@gmail.com",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="text-[#c9a96e] flex-shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#1a2744]/50 font-medium mb-1">{item.title}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-[#1a2744] hover:text-[#c9a96e] transition-colors">
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-sm text-[#1a2744] whitespace-pre-line">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map embed placeholder */}
          <div className="bg-[#e8e0d0] aspect-[4/3] flex items-center justify-center relative overflow-hidden">
            <a
              href="https://maps.google.com/?q=DLF+Mall+of+India+Noida"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-6 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#c9a96e] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#1a2744] transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#1a2744] group-hover:text-[#c9a96e] transition-colors">
                View on Google Maps →
              </p>
              <p className="text-xs text-[#1a2744]/50 mt-1">DLF Mall of India, Noida</p>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-serif font-light text-[#1a2744] mb-6">Send a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
