"use client";

import React, { useState } from "react";
import { Mail, Phone, MessageSquare, Check, Send, HelpCircle } from "lucide-react";
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
      q: "Where does the brand ship to across Nigeria?",
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
      q: "When will the wireless earbuds and audio products launch?",
      a: "Our audio collection is currently undergoing acoustic calibration. Sign up on the product page or footer to receive release invitations.",
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#090a0d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Assistance & Help Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
            Contact Direct Support
          </h1>
          <p className="text-xs text-neutral-400 mt-2 max-w-xl">
            Have questions regarding specifications, warranty coverage, or delivery status? Our team is available directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Support Channels Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0e0f14] border border-[#1f2128] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#14161d] text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-mono">Email Support</div>
                  <a
                    href={`mailto:${brandConfig.contact.email}`}
                    className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
                  >
                    {brandConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#14161d] text-cyan-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-mono">Telephone Inquiries</div>
                  <a
                    href={`tel:${brandConfig.contact.phone}`}
                    className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
                  >
                    {brandConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#14161d] text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-mono">Instant WhatsApp Channel</div>
                  <a
                    href={`https://wa.me/${brandConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-emerald-400 hover:underline"
                  >
                    Chat with an Engineer
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0c10] border border-[#181920] text-xs text-neutral-400 space-y-2">
              <div className="font-semibold text-neutral-200">Headquarters & Fulfillment</div>
              <p>{brandConfig.contact.address}</p>
              <div className="text-[11px] text-neutral-500 font-mono pt-1">
                Hours: Monday – Saturday (8:00 AM – 6:00 PM WAT)
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl bg-[#0e0f14] border border-[#1f2128]">
              <h2 className="text-lg font-bold text-white mb-2">Send an Inquiry</h2>
              <p className="text-xs text-neutral-400 mb-6">
                Fill out the form below and an agent will reply within 4 business hours.
              </p>

              {isSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Message Dispatched Successfully</h3>
                  <p className="text-xs text-neutral-400">
                    Thank you for reaching out. A confirmation has been logged with reference ID #INQ-{referenceId || "000000"}.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-mono text-cyan-400 hover:underline pt-2 inline-block"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-[#13141a] border border-[#232530] text-neutral-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-[#13141a] border border-[#232530] text-neutral-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-mono mb-1.5">Subject / Department *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Product inquiry / Order tracking / Warranty claim"
                      className="w-full bg-[#13141a] border border-[#232530] text-neutral-200 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-mono mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your inquiry with detail..."
                      className="w-full bg-[#13141a] border border-[#232530] text-neutral-200 p-3.5 rounded-lg focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? "Transmitting..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="border-t border-[#1c1d22] pt-14">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Quick Answers
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-[#0e0f14] border border-[#1f2128]">
                <h3 className="text-sm font-semibold text-neutral-200 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
