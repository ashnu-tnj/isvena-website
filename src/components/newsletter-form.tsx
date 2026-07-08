"use client";

export default function NewsletterForm() {
  return (
    <form
      className="mt-5 flex border-b border-cream/25 transition-colors focus-within:border-gold-soft"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        required
        placeholder="Email address"
        className="w-full bg-transparent py-2.5 text-sm placeholder:text-cream/40 focus:outline-none"
      />
      <button
        type="submit"
        className="link-line shrink-0 text-xs uppercase tracking-widest-plus text-gold-soft"
      >
        Join
      </button>
    </form>
  );
}
