"use client";

export default function NewsletterForm() {
  return (
    <form
      className="mt-4 flex border-b border-cream/30 focus-within:border-cognac"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        required
        placeholder="Email address"
        className="w-full bg-transparent py-2 text-sm placeholder:text-cream/40 focus:outline-none"
      />
      <button type="submit" className="shrink-0 text-xs uppercase tracking-widest-plus text-cognac">
        Join
      </button>
    </form>
  );
}
