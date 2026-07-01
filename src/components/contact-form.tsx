"use client";

export default function ContactForm() {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="eyebrow text-umber" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-2 w-full border-b hairline bg-transparent py-2 text-sm focus:border-cognac focus:outline-none"
          />
        </div>
        <div>
          <label className="eyebrow text-umber" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full border-b hairline bg-transparent py-2 text-sm focus:border-cognac focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="eyebrow text-umber" htmlFor="reason">
          Enquiry Type
        </label>
        <select
          id="reason"
          name="reason"
          className="mt-2 w-full border-b hairline bg-transparent py-2 text-sm focus:border-cognac focus:outline-none"
        >
          <option>Order &amp; Checkout</option>
          <option>Trade / Wholesale</option>
          <option>Custom Order</option>
          <option>Press</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="eyebrow text-umber" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 w-full border-b hairline bg-transparent py-2 text-sm focus:border-cognac focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-ink px-8 py-3 text-xs uppercase tracking-widest-plus text-cream transition hover:bg-cognac-dark"
      >
        Send Message
      </button>
    </form>
  );
}
