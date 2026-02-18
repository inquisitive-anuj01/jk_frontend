import { useState } from "react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What makes your service different from competitors?",
    answer:
      "We obsess over performance and simplicity. Where others stack features, we refine existing ones until they become invisible. Every interaction is benchmarked, every pixel intentional. The result is a product that feels effortless — because we did the hard work so you don't have to.",
    tag: "Philosophy",
  },
  {
    question: "How do you handle data privacy and GDPR compliance?",
    answer:
      "Data privacy is built into our architecture from day one — not bolted on as an afterthought. We are fully GDPR and CCPA compliant. Data processing agreements are available on request, and you can export or permanently delete your data at any time via the account dashboard.",
    tag: "Privacy",
  },
  {
    question: "What integrations do you offer out of the box?",
    answer:
      "We connect natively with Slack, Notion, Linear, GitHub, Figma, Jira, Salesforce, and 60+ other tools. Our Zapier and Make integrations extend this to thousands more. Custom webhooks and a REST API are available on all paid plans.",
    tag: "Integrations",
  },
  {
    question: "Is onboarding support included in all plans?",
    answer:
      "Starter plans include self-serve resources and community forum access. Pro includes two dedicated onboarding sessions with a product specialist. Enterprise clients receive a named Customer Success Manager and a bespoke 30-60-90 day success plan.",
    tag: "Support",
  },
  {
    question: "Can I change or cancel my plan at any time?",
    answer:
      "Yes — always. Upgrade, downgrade, or cancel from your account settings in seconds. No phone calls, no penalty fees, no dark patterns. If you cancel, your data stays accessible for 30 days and you receive a prorated refund for unused time.",
    tag: "Billing",
  },
  {
    question: "Do you offer a free trial or sandbox environment?",
    answer:
      "Every account starts with a 14-day free trial of our Pro plan — no credit card required. We also provide a persistent sandbox environment with synthetic data so your team can test integrations and workflows without touching production.",
    tag: "Trial",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="bg-[var(--color-dark)] py-20 px-6 md:px-8 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--color-primary)' }}
          >
            FAQs
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl md:text-3xl lg:text-4xl font-light text-white"
          >
            FREQUENTLY ASKED{' '}
            <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
              QUESTIONS
            </span>
          </motion.h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-0">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`group grid grid-cols-[72px_1fr] gap-0 md:gap-8 border-t border-b border-white/10 cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-[var(--color-primary)]/30 ${isOpen ? "open" : ""
                  }`}
                style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => toggle(i)}
                role="button"
                aria-expanded={isOpen}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && toggle(i)}
              >
                {/* Background tint */}
                <div
                  className="absolute inset-0 bg-[var(--color-primary)]/5 z-0 transition-transform duration-500 ease-out"
                  style={{
                    transform: isOpen || undefined ? "translateX(0)" : "translateX(-100%)",
                  }}
                />

                {/* Number */}
                <div
                  className={`text-5xl font-bold leading-none relative z-10 pt-7 transition-colors duration-300 select-none ${isOpen ? "text-[var(--color-primary)]" : "text-white/15 group-hover:text-[var(--color-primary)]"
                    }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Content */}
                <div className="relative z-10 py-7 pr-8 md:pr-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[0.6rem] font-medium tracking-[0.2em] uppercase text-[var(--color-primary)]">
                      {faq.tag}
                    </span>
                    <div className="w-6 h-px bg-[var(--color-primary)]/40" />
                  </div>
                  <h3
                    className={`text-lg md:text-xl font-semibold text-white leading-snug transition-colors duration-300 pr-10 group-hover:text-[var(--color-primary)]`}
                  >
                    {faq.question}
                  </h3>

                  {/* Animated answer */}
                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="text-lg text-white/60 leading-relaxed pb-7 pt-3 pr-10 border-t border-white/10 mt-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`absolute right-0 top-7 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isOpen || undefined
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                        : "border-white/20 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)]"
                      }`}
                  >
                    <div
                      className={`absolute bg-white/60 rounded transition-all duration-300 ${isOpen || undefined ? "bg-[var(--color-dark)]" : "group-hover:bg-[var(--color-dark)]"
                        }`}
                      style={{ width: "10px", height: "1px" }}
                    />
                    <div
                      className={`absolute bg-white/60 rounded transition-all duration-300 ${isOpen ? "opacity-0 rotate-90" : ""
                        } ${isOpen || undefined ? "bg-[var(--color-dark)]" : "group-hover:bg-[var(--color-dark)]"}`}
                      style={{ width: "1px", height: "10px" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="flex items-center gap-4 mt-12 pt-8 border-t border-white/10">
          <p className="text-white/50 text-lg">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-[var(--color-primary)] border-b border-[var(--color-primary)] pb-0.5 transition-opacity hover:opacity-70"
          >
            Contact our team →
          </a>
        </div>
      </div>
      {/* Bottom Border - gradient fade (Desktop only, brighter in center) */}
      <div className="hidden md:flex justify-center mt-10">
        <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
    </section>
  );
}
