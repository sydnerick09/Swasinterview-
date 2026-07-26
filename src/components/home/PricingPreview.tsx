import { PRICING_TABLE, formatMoney } from "@/lib/pricing";

export function PricingPreview() {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">Application fees by country</h2>
        <p className="mt-3 text-muted">
          Your one-time application fee is calculated automatically from the country you select and
          shown in your local currency.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--card)] text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Country</th>
              <th className="px-5 py-3 text-right font-semibold">Fee</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_TABLE.map((row, i) => {
              const isDefault = row.label === "All other countries";
              return (
                <tr
                  key={row.label}
                  className={
                    isDefault
                      ? "bg-brand-50 dark:bg-brand-950/40"
                      : i % 2 === 0
                        ? "bg-transparent"
                        : "bg-[var(--card)]/60"
                  }
                >
                  <td className={`px-5 py-2.5 ${isDefault ? "font-medium" : ""}`}>{row.label}</td>
                  <td
                    className={`px-5 py-2.5 text-right tabular-nums ${
                      isDefault ? "font-bold" : "font-semibold"
                    }`}
                  >
                    {formatMoney(row.price.amount, row.price.currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
