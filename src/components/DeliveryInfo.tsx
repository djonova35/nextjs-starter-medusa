"use client"

// ── DELIVERY DATE CALCULATOR ──
function getBusinessDays(startDate: Date, daysToAdd: number): Date {
  let count = 0
  const date = new Date(startDate)
  while (count < daysToAdd) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) {
      count++
    }
  }
  return date
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
  })
}

function getUKNow(): Date {
  const ukTime = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/London" })
  )
  return ukTime
}

function getDeliveryDates(minDays: number, maxDays: number): string {
  const today = getUKNow()
  const earliest = getBusinessDays(today, minDays)
  const latest = getBusinessDays(today, maxDays)
  return `Est. Delivery: ${formatDate(earliest)} – ${formatDate(latest)}`
}

export default function DeliveryInfo() {
  return (
    <>
      <style>{`
        .dj-delivery-strip {
          display: flex;
          align-items: flex-start;
          gap: 32px;
          padding: 20px 24px;
          background: #fff;
          border: 1px solid #E2DCF5;
          border-radius: 16px;
          flex-wrap: wrap;
          margin-top: 16px;
          margin-bottom: 16px;
        }
        .dj-delivery-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          flex: 1;
          min-width: 180px;
        }
        .dj-delivery-icon {
          font-size: 22px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .dj-delivery-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .dj-delivery-title {
          font-weight: 600;
          font-size: 13px;
          color: #18162B;
        }
        .dj-delivery-est {
          font-size: 11px;
          color: #8A82A8;
          letter-spacing: 0.02em;
        }
        .dj-delivery-free {
          font-size: 11px;
          color: #22c55e;
          font-weight: 500;
        }
        .dj-delivery-divider {
          width: 1px;
          background: #E2DCF5;
          align-self: stretch;
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .dj-delivery-strip { gap: 16px; padding: 16px; }
          .dj-delivery-divider { display: none; }
        }
      `}</style>

      <div className="dj-delivery-strip">
        {/* UK Delivery */}
        <div className="dj-delivery-item">
          <div className="dj-delivery-icon">🇬🇧</div>
          <div className="dj-delivery-text">
            <span className="dj-delivery-title">UK Standard Delivery</span>
            <span className="dj-delivery-est">{getDeliveryDates(5, 9)}</span>
            <span className="dj-delivery-free">Free on orders over £40</span>
          </div>
        </div>

        {/* Divider */}
        <div className="dj-delivery-divider" />

        {/* International Delivery */}
        <div className="dj-delivery-item">
          <div className="dj-delivery-icon">✈️</div>
          <div className="dj-delivery-text">
            <span className="dj-delivery-title">International Delivery</span>
            <span className="dj-delivery-est">{getDeliveryDates(7, 15)}</span>
          </div>
        </div>
      </div>
    </>
  )
}
