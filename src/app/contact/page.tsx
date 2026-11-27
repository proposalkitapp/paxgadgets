"use client";

import React, { useState } from "react";
import { Mail, Phone, MessageSquare, Check, Send } from "lucide-react";
import { brandConfig } from "@/config/brand";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ref = Date.now().toString().slice(-6);
    setTimeout(() => {
      setIsSubmitting(false);
      setReferenceId(ref);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 800);
  };

  const faqs = [
    {
      q: "Where does PAX ship across Nigeria?",
      a: "We fulfill direct orders to all 36 Nigerian states and the FCT. Deliveries within Lagos typically arrive within 24 hours; other states take 48-72 hours.",
    },
    {
      q: "How does the 12-month manufacturer warranty work?",
      a: "Every product includes an official warranty certificate with a verifiable QR code. In case of any technical defect, our service hub provides testing, repairs, or immediate device replacement.",
    },
    {
      q: "Can I inspect the power bank before completing payment?",
      a: "Orders placed via card, bank transfer, or USSD are verified instantly. All shipments arrive in factory-sealed, tamper-evident security packaging.",
    },
    {
      q: "What certifications do PAX batteries carry?",
      a: "Every unit features genuine Grade-A lithium-polymer cells with multi-stage overcharge, short-circuit, and thermal surge protection certified for international aviation travel.",
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#fafafa] min-h-screen text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Assistance & Help Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-1">
            Contact Direct Support
          </h1>
          <p className="text-xs text-neutral-500 mt-2 max-w-xl font-light leading-relaxed">
            Have questions regarding specifications, warranty coverage, or delivery status? Our engineering team is available directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Support Channels Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-neutral-100 text-neutral-900">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-mono">Email Support</div>
                  <a
                    href={`mailto:${brandConfig.contact.email}`}
                    className="text-sm font-semibold text-neutral-900 hover:underline transition-colors"
                  >
                    {brandConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-neutral-100 text-neutral-900">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-mono">Telephone Inquiries</div>
                  <a
                    href={`tel:${brandConfig.contact.phone}`}
                    className="text-sm font-semibold text-neutral-900 hover:underline transition-colors"
                  >
                    {brandConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-neutral-100 text-neutral-900">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-mono">Instant WhatsApp Channel</div>
                  <a
                    href={`https://wa.me/${brandConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-neutral-900 hover:underline"
                  >
                    Chat with an Engineer
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-600 space-y-2 shadow-sm">
              <div className="font-semibold text-neutral-900">Headquarters & Fulfillment Hub</div>
              <p>{brandConfig.contact.address}</p>
              <div className="text-[11px] text-neutral-500 font-mono pt-1">
                Hours: Monday – Saturday (8:00 AM – 6:00 PM WAT)
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-6">
                Send Direct Message
              </h2>

              {isSubmitted ? (
                <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">Message Dispatched</h3>
                  <p className="text-xs text-neutral-600">
                    Your inquiry has been assigned reference{" "}
                    <span className="font-mono font-bold text-neutral-900">#{referenceId}</span>. A representative will respond within 4 business hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2 text-xs font-mono text-neutral-900 underline font-semibold"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-neutral-600 font-medium mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-neutral-200 text-neutral-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-900 transition-colors"
                        placeholder="e.g. Tunde Adeyemi"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-neutral-600 font-medium mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-neutral-200 text-neutral-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-900 transition-colors"
                        placeholder="tunde@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-neutral-600 font-medium mb-1.5">
                      Subject Matter *
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-neutral-200 text-neutral-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-900 transition-colors"
                      placeholder="e.g. Bulk order inquiry / Warranty registration"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-neutral-600 font-medium mb-1.5">
                      Message Details *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-neutral-200 text-neutral-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-neutral-900 transition-colors resize-none"
                      placeholder="Explain your inquiry in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? "Transmitting..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="border-t border-neutral-200 pt-16">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-2">
                <h3 className="text-sm font-bold text-neutral-900">{faq.q}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
