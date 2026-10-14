/**
 * Centralized Contact & Support Configuration for MARJAD
 * Synchronized across Contact Page, Profile Contact Tab, and Invoice PDF Generator.
 */

export const DEFAULT_CONTACT_PHONE = "+212 6 61 24 58 90";
export const DEFAULT_CONTACT_PHONE_RAW = "212661245890";
export const DEFAULT_CONTACT_EMAIL = "contact.marjad@gmail.com";
export const DEFAULT_ATELIER_PHONE = "+212 6 61 24 58 90";

/**
 * Returns the current active contact/WhatsApp phone number.
 * Prioritizes user customization saved in localStorage.
 */
export function getContactPhone(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("marjad_contact_phone");
      if (saved && saved.trim()) return saved.trim();
    } catch {
      // fallback
    }
  }
  return DEFAULT_CONTACT_PHONE;
}

/**
 * Updates the contact phone number in localStorage and triggers a custom event.
 */
export function setContactPhone(phone: string): void {
  if (typeof window !== "undefined") {
    try {
      const clean = phone.trim();
      localStorage.setItem("marjad_contact_phone", clean);
      window.dispatchEvent(new CustomEvent("marjad_contact_updated", { detail: { phone: clean } }));
    } catch (e) {
      console.warn("Could not save contact phone to localStorage:", e);
    }
  }
}

/**
 * Returns the active contact email address.
 */
export function getContactEmail(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("marjad_contact_email");
      if (saved && saved.trim()) return saved.trim();
    } catch {
      // fallback
    }
  }
  return DEFAULT_CONTACT_EMAIL;
}

/**
 * Updates the contact email in localStorage.
 */
export function setContactEmail(email: string): void {
  if (typeof window !== "undefined") {
    try {
      const clean = email.trim();
      localStorage.setItem("marjad_contact_email", clean);
      window.dispatchEvent(new CustomEvent("marjad_contact_updated", { detail: { email: clean } }));
    } catch (e) {
      console.warn("Could not save contact email to localStorage:", e);
    }
  }
}
