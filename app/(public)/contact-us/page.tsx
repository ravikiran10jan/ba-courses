import type { Metadata } from "next";
import { Phone, Mail, MessageCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import { getSite, getContactPage } from "@/lib/content";

const site = getSite();
const cp = getContactPage();

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${site.name}. We are here to help you.`,
};

function TwitterIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const contactCards = [
  {
    icon: Phone,
    label: cp.phoneLabel,
    value: site.contact.phone,
    href: `tel:${site.contact.phoneRaw}`,
  },
  {
    icon: Mail,
    label: cp.emailLabel,
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
  },
  {
    icon: MessageCircle,
    label: cp.discordLabel,
    value: cp.discordCta,
    href: site.contact.discord,
  },
];

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white text-center">
          {cp.heading}
        </h1>
        <p className="mt-4 text-muted text-center max-w-xl mx-auto">
          {cp.subheading}
        </p>

        {/* Contact cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.label}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  card.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                <Card hover className="text-center h-full">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-accent/10 mb-4">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <p className="text-sm font-bold text-white">{card.label}</p>
                  <p className="text-xs text-muted mt-1 break-all">{card.value}</p>
                </Card>
              </a>
            );
          })}

          {/* Twitter card with custom icon */}
          <a
            href={site.contact.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card hover className="text-center h-full">
              <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-accent/10 mb-4">
                <span className="text-accent">
                  <TwitterIcon size={20} />
                </span>
              </div>
              <p className="text-sm font-bold text-white">{cp.twitterLabel}</p>
              <p className="text-xs text-muted mt-1">{cp.twitterHandle}</p>
            </Card>
          </a>
        </div>

        {/* Why Reach Out */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">
            {cp.whyReachOut.heading}
          </h2>
          <ul className="space-y-3">
            {cp.whyReachOut.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-muted">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
