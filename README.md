# Optic Eyewear Claim Reconciliation App

An Optic Eyewear Shop TX web app for calculating eyeglasses and contact lens
insurance reconciliations. It helps the team estimate patient responsibility,
check claim payment expectations, and catch missed charges before an order loses
money.

## What It Does

- Calculates out-of-pocket responsibility for eyeglasses and contact orders.
- Uses editable insurance plan defaults for frame allowance, frame copay, base
  lens copay, UV, AR, scratch, progressive, material, tint, contact lens, and
  fitting lines.
- Flags likely missed charges such as UV, safety material, fitting fees, patient
  balances, overcollection, and claim underpayment.
- Supports splitting frame allowance across multiple yearly frame benefits, so
  "2 every plan year" can be calculated as half the listed allowance per order.
- Includes a one-click `$237` handwritten example preset using frame `$292`,
  split `$260` allowance, `$20` frame copay, `$15` tint, and `$40` poly.
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
- `public/optic-eyewear-logo.png`: Optic Eyewear logo asset
- `.openai/hosting.json`: Sites hosting configuration
- `infra/terraform/oci-compute/`: OCI Compute VM deployment stack

## OCI Deployment

The included Terraform stack can host the app on an OCI Compute VM with a public
IP restricted to approved source IPs only.

Defaults and guardrails:

- Shape: `VM.Standard.A1.Flex`
- OCPUs: pinned to `1`
- Memory: pinned to `8` GB
- Allowed source IPs: your `home_ip_cidr` plus `166.205.97.28/32`
- Allowed ports: `22`, `80`, and `443`

See `infra/terraform/oci-compute/README.md` for setup and apply steps.

## Baseline Notes

The starting values are editable plan assumptions for Optic Eyewear’s insurance
order workflow, including routine exam and spectacle lens copays, frame copay,
frame/contact allowances, UV, AR tiers, progressive tiers, poly/high-index
tiers, and contact fitting lines. When a plan allows 2 frame benefits in the
year, the app can split the allowance across those benefits before calculating
the frame overage.
