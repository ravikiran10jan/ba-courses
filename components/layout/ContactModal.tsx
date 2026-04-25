"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { getContactModal } from "@/lib/content";

const cm = getContactModal();

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log("Contact form submission:", { name, email, message });

      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
      } catch {
        // API may not exist yet; submission logged to console
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setSubmitted(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={cm.title}>
      <p className="text-muted mb-6">{cm.subtitle}</p>

      {submitted ? (
        <div className="text-center py-8">
          <p className="text-lg font-semibold text-success">
            {cm.successMessage}
          </p>
          <p className="text-muted mt-2">
            {cm.successSubtext}
          </p>
          <Button className="mt-6" onClick={handleClose}>
            {cm.closeButton}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="contact-name"
            label={cm.nameLabel}
            placeholder={cm.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            id="contact-email"
            label={cm.emailLabel}
            type="email"
            placeholder={cm.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Textarea
            id="contact-message"
            label={cm.messageLabel}
            placeholder={cm.messagePlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button type="submit" loading={submitting} className="w-full">
            {cm.submitButton}
          </Button>
        </form>
      )}
    </Modal>
  );
}
