// src/modules/order/components/return-request/index.tsx
// -----------------------------------------------------
// Displays the 14-day return countdown timer and
// the refund request form for a specific order
// -----------------------------------------------------

"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { submitRefundRequest } from "@lib/data/returns"

type Props = {
  order: HttpTypes.StoreOrder
}

// -----------------------------------------------------
// Calculate days remaining in the 14-day return window
// -----------------------------------------------------
function calculateDaysRemaining(deliveredAt: string): number {
  const delivered = new Date(deliveredAt)
  const expiry = new Date(delivered)
  expiry.setDate(expiry.getDate() + 14)

  const now = new Date()
  const msRemaining = expiry.getTime() - now.getTime()
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24))

  return daysRemaining
}

// -----------------------------------------------------
// Format the exact return deadline as a readable date
// -----------------------------------------------------
function formatDeadline(deliveredAt: string): string {
  const delivered = new Date(deliveredAt)
  const deadline = new Date(delivered)
  deadline.setDate(deadline.getDate() + 14)

  return deadline.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function ReturnRequest({ order }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // -----------------------------------------------
  // Get delivery date from order metadata
  // -----------------------------------------------
  const deliveredAt = (order.metadata as any)?.delivered_at as string | undefined
  const refundStatus = (order.metadata as any)?.refund_status as string | undefined
  const refundReason = (order.metadata as any)?.refund_reason as string | undefined
  const refundRequestedAt = (order.metadata as any)?.refund_requested_at as string | undefined

  // -----------------------------------------------
  // If order not delivered yet, show nothing
  // -----------------------------------------------
  if (!deliveredAt) {
    return null
  }

  const daysRemaining = calculateDaysRemaining(deliveredAt)
  const deadline = formatDeadline(deliveredAt)
  const isExpired = daysRemaining <= 0

  // -----------------------------------------------
  // Handle refund form submission
  // -----------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const result = await submitRefundRequest(order.id, reason)

    if (result.success) {
      setSuccess(true)
      setShowForm(false)
    } else {
      setError(result.error || "Failed to submit request")
    }

    setSubmitting(false)
  }

  // -----------------------------------------------
  // If refund already requested, show status
  // -----------------------------------------------
  if (refundStatus) {
    return (
      <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Refund Request</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                refundStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : refundStatus === "approved"
                  ? "bg-green-100 text-green-800"
                  : refundStatus === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {refundStatus.charAt(0).toUpperCase() + refundStatus.slice(1)}
            </span>
          </div>
          {refundRequestedAt && (
            <p className="text-sm text-gray-600">
              Requested on:{" "}
              {new Date(refundRequestedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          {refundReason && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Reason:</p>
              <p className="text-sm bg-white p-3 rounded border border-gray-200">
                {refundReason}
              </p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-4">
            We will review your request and get back to you within 3-5
            business days.
          </p>
        </div>
      </div>
    )
  }

  // -----------------------------------------------
  // If success message showing after submission
  // -----------------------------------------------
  if (success) {
    return (
      <div className="mt-6 p-6 border border-green-200 rounded-lg bg-green-50">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ✓ Refund Request Submitted
        </h3>
        <p className="text-sm text-green-700">
          Your request is now pending review. We will get back to you within
          3-5 business days.
        </p>
      </div>
    )
  }

  // -----------------------------------------------
  // If return window expired
  // -----------------------------------------------
  if (isExpired) {
    return (
      <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Return Window Closed</h3>
        <p className="text-sm text-gray-600">
          The 14-day return window for this order has expired. If you have any
          issues, please contact our support team.
        </p>
      </div>
    )
  }

  // -----------------------------------------------
  // Default: Show timer + refund button
  // -----------------------------------------------
  return (
    <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-3">Return Window</h3>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {daysRemaining}
          </span>
          <span className="text-gray-600">
            {daysRemaining === 1 ? "day" : "days"} remaining
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Return deadline: {deadline}
        </p>
      </div>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Request Refund
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for refund
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              minLength={10}
              maxLength={500}
              placeholder="Please describe why you want to return this order (minimum 10 characters)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {reason.length} / 500 characters
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || reason.trim().length < 10}
              className="flex-1 sm:flex-none px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setReason("")
                setError(null)
              }}
              disabled={submitting}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
