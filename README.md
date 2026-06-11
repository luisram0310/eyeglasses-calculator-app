# Optical Claim Reconciliation

A practice web app for calculating eyeglasses and contact lens insurance
reconciliations. It uses a Versant Health-style baseline for common member
charges, allowances, and lens add-ons, then compares expected patient
responsibility against collected patient payment and claim payment.

## What It Does

- Calculates out-of-pocket responsibility for eyeglasses and contact orders.
- Includes frame allowance, frame copay, base lens copay, UV, AR, scratch,
  progressive, material, tint, contact lens, and fitting lines.
- Flags likely missed charges such as UV, safety material, fitting fees, patient
  balances, overcollection, and claim underpayment.
- Shows retail total, expected plan share, patient responsibility, claim gap,
  revenue variance, and printable line items.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

Open `http://localhost:3000/` after starting the dev server.

## Main Files

- `app/page.tsx`: calculator workflow and reconciliation logic
- `app/globals.css`: responsive visual design and print styles
- `.openai/hosting.json`: Sites hosting configuration

## Baseline Notes

The starting values are editable assumptions based on the supplied Versant
Health PDF, including $20 routine exam and spectacle lens copays, $20 frame
copay, $260 in-network frame/contact allowance, $130 out-of-network frame
allowance, $12 UV, AR tiers, progressive tiers, poly/high-index tiers, and
contact fitting lines.
