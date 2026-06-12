"use client";

import { useMemo, useState } from "react";

type OrderType = "glasses" | "contacts";
type NetworkStatus = "in" | "out";
type FindingLevel = "good" | "watch" | "alert";

type OptionItem = {
  id: string;
  label: string;
  member: number;
  retail: number;
  category: string;
  source: string;
  note?: string;
};

type LineItem = {
  label: string;
  group: string;
  retail: number;
  patient: number;
  source: string;
  note?: string;
};

type AuditFinding = {
  level: FindingLevel;
  title: string;
  detail: string;
  amount?: number;
};

type FormState = {
  orderType: OrderType;
  network: NetworkStatus;
  presetNote: string;
  customerName: string;
  claimNumber: string;
  collected: number;
  claimPaid: number;
  includeExam: boolean;
  retinalImaging: boolean;
  diabeticExam: boolean;
  includeFrame: boolean;
  frameRetail: number;
  frameCopay: number;
  frameInAllowance: number;
  frameOutAllowance: number;
  frameBenefitCount: number;
  lensCopay: number;
  baseLens: string;
  progressive: string;
  material: string;
  arCoating: string;
  photochromic: string;
  scratch: string;
  tint: string;
  selectedAddOns: string[];
  uvNeeded: boolean;
  safetyMaterialNeeded: boolean;
  contactRetail: number;
  contactAllowance: number;
  medicallyNecessaryContacts: boolean;
  contactFit: boolean;
  specialtyFit: boolean;
};

const source = "Versant Health PDF baseline";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const lensOptions: OptionItem[] = [
  {
    id: "none",
    label: "No base lens selected",
    member: 0,
    retail: 0,
    category: "Spectacle lens",
    source,
  },
  {
    id: "single",
    label: "Single vision",
    member: 20,
    retail: 120,
    category: "Spectacle lens",
    source,
    note: "Covered plan lens",
  },
  {
    id: "bifocal",
    label: "Bifocal",
    member: 20,
    retail: 165,
    category: "Spectacle lens",
    source,
    note: "Covered plan lens",
  },
  {
    id: "trifocal",
    label: "Trifocal",
    member: 20,
    retail: 190,
    category: "Spectacle lens",
    source,
    note: "Covered plan lens",
  },
  {
    id: "lenticular",
    label: "Lenticular",
    member: 20,
    retail: 240,
    category: "Spectacle lens",
    source,
    note: "Covered plan lens",
  },
];

const progressiveOptions: OptionItem[] = [
  {
    id: "none",
    label: "No progressive",
    member: 0,
    retail: 0,
    category: "Progressive",
    source,
  },
  {
    id: "standard",
    label: "Progressive standard",
    member: 55,
    retail: 155,
    category: "Progressive",
    source,
  },
  {
    id: "premium",
    label: "Progressive premium",
    member: 110,
    retail: 260,
    category: "Progressive",
    source,
  },
  {
    id: "ultra",
    label: "Progressive ultra",
    member: 150,
    retail: 340,
    category: "Progressive",
    source,
  },
  {
    id: "ultimate",
    label: "Progressive ultimate",
    member: 225,
    retail: 425,
    category: "Progressive",
    source,
  },
];

const materialOptions: OptionItem[] = [
  {
    id: "standard",
    label: "Standard plastic",
    member: 0,
    retail: 0,
    category: "Material",
    source,
  },
  {
    id: "poly",
    label: "Polycarbonate",
    member: 40,
    retail: 95,
    category: "Material",
    source,
  },
  {
    id: "hd-poly",
    label: "HD polycarbonate",
    member: 60,
    retail: 135,
    category: "Material",
    source,
  },
  {
    id: "high-167",
    label: "High index 1.67",
    member: 80,
    retail: 170,
    category: "Material",
    source,
  },
  {
    id: "high-174",
    label: "High index 1.74",
    member: 120,
    retail: 250,
    category: "Material",
    source,
  },
];

const arOptions: OptionItem[] = [
  {
    id: "none",
    label: "No AR coating",
    member: 0,
    retail: 0,
    category: "AR coating",
    source,
  },
  {
    id: "standard",
    label: "AR standard",
    member: 50,
    retail: 95,
    category: "AR coating",
    source,
  },
  {
    id: "premium",
    label: "AR premium",
    member: 70,
    retail: 130,
    category: "AR coating",
    source,
  },
  {
    id: "ultra",
    label: "AR ultra",
    member: 85,
    retail: 160,
    category: "AR coating",
    source,
  },
  {
    id: "ultimate",
    label: "AR ultimate",
    member: 120,
    retail: 220,
    category: "AR coating",
    source,
  },
];

const photochromicOptions: OptionItem[] = [
  {
    id: "none",
    label: "No transitions",
    member: 0,
    retail: 0,
    category: "Photochromic",
    source,
  },
  {
    id: "single",
    label: "Transitions single vision",
    member: 80,
    retail: 165,
    category: "Photochromic",
    source,
  },
  {
    id: "multi",
    label: "Transitions multifocal",
    member: 80,
    retail: 175,
    category: "Photochromic",
    source,
  },
  {
    id: "single-glass",
    label: "Transitions single vision glass",
    member: 65,
    retail: 140,
    category: "Photochromic",
    source,
  },
  {
    id: "multi-glass",
    label: "Transitions multifocal glass",
    member: 75,
    retail: 155,
    category: "Photochromic",
    source,
  },
];

const scratchOptions: OptionItem[] = [
  {
    id: "none",
    label: "No scratch coating",
    member: 0,
    retail: 0,
    category: "Scratch coating",
    source,
  },
  {
    id: "standard",
    label: "Scratch resistant",
    member: 15,
    retail: 35,
    category: "Scratch coating",
    source,
  },
  {
    id: "premium",
    label: "Scratch resistant premium",
    member: 30,
    retail: 65,
    category: "Scratch coating",
    source,
  },
];

const tintOptions: OptionItem[] = [
  {
    id: "none",
    label: "No tint",
    member: 0,
    retail: 0,
    category: "Tint",
    source,
  },
  {
    id: "solid",
    label: "Tint",
    member: 15,
    retail: 45,
    category: "Tint",
    source,
  },
  {
    id: "gradient",
    label: "Tint gradient",
    member: 18,
    retail: 55,
    category: "Tint",
    source,
  },
  {
    id: "polarized",
    label: "Polarized single vision",
    member: 75,
    retail: 150,
    category: "Tint",
    source,
  },
  {
    id: "mirror",
    label: "Mirror solid or gradient",
    member: 86,
    retail: 175,
    category: "Tint",
    source,
  },
];

const addOnOptions: OptionItem[] = [
  {
    id: "uv",
    label: "UV coat",
    member: 12,
    retail: 30,
    category: "Lens option",
    source,
  },
  {
    id: "blue-light",
    label: "Blue light filtering EBS",
    member: 15,
    retail: 50,
    category: "Lens option",
    source,
  },
  {
    id: "intermediate",
    label: "Intermediate vision",
    member: 30,
    retail: 80,
    category: "Lens option",
    source,
  },
  {
    id: "edge-polish",
    label: "Edge polish",
    member: 22,
    retail: 55,
    category: "Lens option",
    source,
  },
  {
    id: "high-luster",
    label: "High luster edge polish",
    member: 70,
    retail: 130,
    category: "Lens option",
    source,
  },
  {
    id: "rimless-drill",
    label: "Rimless drill",
    member: 66,
    retail: 110,
    category: "Lens option",
    source,
  },
  {
    id: "roll-polish",
    label: "Roll polish",
    member: 16,
    retail: 35,
    category: "Lens option",
    source,
  },
  {
    id: "roll-edge",
    label: "Roll edge",
    member: 24,
    retail: 45,
    category: "Lens option",
    source,
  },
  {
    id: "slab-off",
    label: "Slab off",
    member: 186,
    retail: 275,
    category: "Lens option",
    source,
  },
  {
    id: "specialty",
    label: "Specialty lenses",
    member: 206,
    retail: 325,
    category: "Lens option",
    source,
  },
  {
    id: "glass-single",
    label: "Glass single vision",
    member: 76,
    retail: 140,
    category: "Glass lens",
    source,
  },
  {
    id: "glass-multi",
    label: "Glass bifocal or trifocal",
    member: 137,
    retail: 220,
    category: "Glass lens",
    source,
  },
];

const initialForm: FormState = {
  orderType: "glasses",
  network: "in",
  presetNote: "",
  customerName: "Walk-in order",
  claimNumber: "",
  collected: 0,
  claimPaid: 0,
  includeExam: false,
  retinalImaging: false,
  diabeticExam: false,
  includeFrame: false,
  frameRetail: 285,
  frameCopay: 20,
  frameInAllowance: 260,
  frameOutAllowance: 130,
  frameBenefitCount: 1,
  lensCopay: 20,
  baseLens: "none",
  progressive: "none",
  material: "standard",
  arCoating: "none",
  photochromic: "none",
  scratch: "none",
  tint: "none",
  selectedAddOns: [],
  uvNeeded: false,
  safetyMaterialNeeded: false,
  contactRetail: 360,
  contactAllowance: 260,
  medicallyNecessaryContacts: false,
  contactFit: false,
  specialtyFit: false,
};

const handwrittenExample: FormState = {
  ...initialForm,
  presetNote:
    "Example: frame $292, split $260 allowance across 2 yearly frame benefits, plus $20 copay, $15 tint, and $40 poly.",
  customerName: "Example calculation",
  claimNumber: "Frame split",
  frameRetail: 292,
  includeFrame: true,
  frameBenefitCount: 2,
  lensCopay: 0,
  baseLens: "none",
  material: "poly",
  arCoating: "none",
  scratch: "none",
  tint: "solid",
  selectedAddOns: [],
  uvNeeded: false,
  safetyMaterialNeeded: true,
};

function findOption(items: OptionItem[], id: string) {
  return items.find((item) => item.id === id) ?? items[0];
}

function formatMoney(value: number) {
  return money.format(Math.round((value + Number.EPSILON) * 100) / 100);
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function effectiveFrameAllowance(form: FormState) {
  const allowance =
    form.network === "in" ? form.frameInAllowance : form.frameOutAllowance;
  return allowance / Math.max(1, form.frameBenefitCount);
}

function makeLine(option: OptionItem): LineItem | null {
  if (option.member === 0 && option.retail === 0) {
    return null;
  }

  return {
    label: option.label,
    group: option.category,
    retail: option.retail,
    patient: option.member,
    source: option.source,
    note: option.note,
  };
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);

  const setField = <Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleAddOn = (id: string) => {
    setForm((current) => {
      const exists = current.selectedAddOns.includes(id);
      return {
        ...current,
        selectedAddOns: exists
          ? current.selectedAddOns.filter((item) => item !== id)
          : [...current.selectedAddOns, id],
      };
    });
  };

  const summary = useMemo(() => {
    const lines: LineItem[] = [];

    if (form.includeExam) {
      lines.push({
        label: "Routine exam",
        group: "Exam",
        retail: 125,
        patient: 20,
        source,
        note: "Every plan year",
      });
    }

    if (form.retinalImaging) {
      lines.push({
        label: "Retinal imaging",
        group: "Exam",
        retail: 39,
        patient: 39,
        source,
        note: "OD or MD baseline",
      });
    }

    if (form.diabeticExam) {
      lines.push({
        label: "Diabetic exam",
        group: "Medical necessity",
        retail: 125,
        patient: 20,
        source,
        note: "OD or MD baseline",
      });
    }

    if (form.orderType === "glasses") {
      if (form.includeFrame) {
        const allowance = effectiveFrameAllowance(form);
        const overage = Math.max(0, form.frameRetail - allowance);
        const patient = Math.min(form.frameRetail, form.frameCopay + overage);
        const splitNote =
          form.frameBenefitCount > 1
            ? `split from ${formatMoney(
                form.network === "in"
                  ? form.frameInAllowance
                  : form.frameOutAllowance,
              )} across ${form.frameBenefitCount} frame benefits`
            : "full allowance";

        lines.push({
          label: "Frame",
          group: "Frame",
          retail: form.frameRetail,
          patient,
          source,
          note: `${formatMoney(form.frameCopay)} copay, ${formatMoney(
            allowance,
          )} allowance (${splitNote})`,
        });
      }

      const baseLens = findOption(lensOptions, form.baseLens);
      if (baseLens.id !== "none") {
        lines.push({
          label: baseLens.label,
          group: "Spectacle lens",
          retail: baseLens.retail,
          patient: form.lensCopay,
          source,
          note: "Base spectacle lens copay",
        });
      }

      [
        findOption(progressiveOptions, form.progressive),
        findOption(materialOptions, form.material),
        findOption(arOptions, form.arCoating),
        findOption(photochromicOptions, form.photochromic),
        findOption(scratchOptions, form.scratch),
        findOption(tintOptions, form.tint),
      ].forEach((option) => {
        const line = makeLine(option);
        if (line) {
          lines.push(line);
        }
      });

      addOnOptions
        .filter((option) => form.selectedAddOns.includes(option.id))
        .forEach((option) => lines.push(makeLine(option)!));
    } else {
      if (form.medicallyNecessaryContacts) {
        lines.push({
          label: "Medically necessary contact lenses",
          group: "Contact lens",
          retail: form.contactRetail,
          patient: 0,
          source,
          note: "Covered baseline",
        });
      } else {
        const overage = Math.max(0, form.contactRetail - form.contactAllowance);
        lines.push({
          label: "Contact lenses",
          group: "Contact lens",
          retail: form.contactRetail,
          patient: overage,
          source,
          note: `${formatMoney(form.contactAllowance)} allowance`,
        });
      }

      if (form.contactFit) {
        lines.push({
          label: "Contact lens evaluation fitting",
          group: "Contact fitting",
          retail: 75,
          patient: 30,
          source,
          note: "Every plan year",
        });
      }

      if (form.specialtyFit) {
        lines.push({
          label: "Specialty contact lens fit",
          group: "Contact fitting",
          retail: 120,
          patient: 30,
          source,
          note: "$50 plan baseline allowance",
        });
      }
    }

    const retailTotal = lines.reduce((sum, line) => sum + line.retail, 0);
    const patientTotal = lines.reduce((sum, line) => sum + line.patient, 0);
    const expectedPlanShare = Math.max(0, retailTotal - patientTotal);
    const patientBalance = patientTotal - form.collected;
    const claimGap = expectedPlanShare - form.claimPaid;
    const actualRevenue = form.collected + form.claimPaid;
    const revenueVariance = actualRevenue - retailTotal;

    return {
      lines,
      retailTotal,
      patientTotal,
      expectedPlanShare,
      patientBalance,
      claimGap,
      actualRevenue,
      revenueVariance,
    };
  }, [form]);

  const auditFindings = useMemo<AuditFinding[]>(() => {
    const findings: AuditFinding[] = [];

    if (
      form.orderType === "glasses" &&
      form.uvNeeded &&
      !form.selectedAddOns.includes("uv")
    ) {
      findings.push({
        level: "alert",
        title: "UV charge missing",
        detail: "UV coat is marked needed but is not on the order.",
        amount: 12,
      });
    }

    if (
      form.orderType === "glasses" &&
      form.safetyMaterialNeeded &&
      form.material === "standard"
    ) {
      findings.push({
        level: "alert",
        title: "Safety material not selected",
        detail: "A polycarbonate, HD polycarbonate, or high-index material may need to be added.",
        amount: 40,
      });
    }

    if (
      form.orderType === "contacts" &&
      !form.medicallyNecessaryContacts &&
      !form.contactFit &&
      !form.specialtyFit
    ) {
      findings.push({
        level: "watch",
        title: "Fitting fee not selected",
        detail: "Contact lens orders often need the evaluation or specialty fitting line.",
        amount: 30,
      });
    }

    if (summary.patientBalance > 0.009) {
      findings.push({
        level: "alert",
        title: "Patient balance due",
        detail: "Collected amount is below expected out-of-pocket responsibility.",
        amount: summary.patientBalance,
      });
    } else if (summary.patientBalance < -0.009) {
      findings.push({
        level: "watch",
        title: "Possible overcollection",
        detail: "Collected amount is higher than expected patient responsibility.",
        amount: Math.abs(summary.patientBalance),
      });
    }

    if (form.claimPaid > 0 && summary.claimGap > 0.009) {
      findings.push({
        level: "watch",
        title: "Claim paid below target",
        detail: "Actual claim payment is lower than the expected plan share.",
        amount: summary.claimGap,
      });
    }

    if (
      form.orderType === "glasses" &&
      form.includeFrame &&
      form.frameRetail >
        effectiveFrameAllowance(form)
    ) {
      findings.push({
        level: "good",
        title: "Frame overage captured",
        detail:
          form.frameBenefitCount > 1
            ? "Frame allowance is split across the yearly frame benefits before calculating overage."
            : "Frame retail exceeds the selected allowance, so the overage is included.",
        amount: form.frameRetail - effectiveFrameAllowance(form),
      });
    }

    if (findings.length === 0) {
      findings.push({
        level: "good",
        title: "No missed-charge flags",
        detail: "Selected order lines match the current plan assumptions.",
      });
    }

    return findings;
  }, [form, summary]);

  const balanceTone =
    Math.abs(summary.patientBalance) < 0.01
      ? "settled"
      : summary.patientBalance > 0
        ? "due"
        : "credit";

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="brand-logo"
            src="/optic-eyewear-logo.png"
            alt="Optic Eyewear Shop TX"
          />
          <div>
            <p>Optic Eyewear Shop TX</p>
            <h1>Automatic claim reconciliation</h1>
          </div>
        </div>
        <div className="top-actions no-print">
          <button
            className="ghost-button"
            type="button"
            onClick={() => setForm(handwrittenExample)}
            title="Load handwritten example"
          >
            Load $237 example
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => setForm(initialForm)}
            title="Reset calculator"
          >
            Reset
          </button>
          <button
            className="solid-button"
            type="button"
            onClick={() => window.print()}
            title="Print reconciliation"
          >
            Print
          </button>
        </div>
      </header>

      <div className="workspace">
        <section className="panel input-panel">
          <div className="panel-heading">
            <p>Order inputs</p>
            <h2>Claim setup</h2>
          </div>
          {form.presetNote ? (
            <div className="example-note">
              <strong>Loaded example</strong>
              <span>{form.presetNote}</span>
            </div>
          ) : null}

          <div className="field-row">
            <label>
              Customer
              <input
                value={form.customerName}
                onChange={(event) =>
                  setField("customerName", event.target.value)
                }
              />
            </label>
            <label>
              Claim ID
              <input
                value={form.claimNumber}
                onChange={(event) =>
                  setField("claimNumber", event.target.value)
                }
                placeholder="Optional"
              />
            </label>
          </div>

          <div className="control-group">
            <span className="group-label">Order type</span>
            <div className="segmented">
              <button
                type="button"
                className={form.orderType === "glasses" ? "active" : ""}
                onClick={() => setField("orderType", "glasses")}
              >
                Eyeglasses
              </button>
              <button
                type="button"
                className={form.orderType === "contacts" ? "active" : ""}
                onClick={() => setField("orderType", "contacts")}
              >
                Contacts
              </button>
            </div>
          </div>

          <div className="control-group">
            <span className="group-label">Network</span>
            <div className="segmented">
              <button
                type="button"
                className={form.network === "in" ? "active" : ""}
                onClick={() => setField("network", "in")}
              >
                In network
              </button>
              <button
                type="button"
                className={form.network === "out" ? "active" : ""}
                onClick={() => setField("network", "out")}
              >
                Out of network
              </button>
            </div>
          </div>

          <div className="section-divider" />

          <div className="field-row">
            <label>
              Collected from patient
              <span className="money-field">
                <span>$</span>
                <input
                  type="number"
                  min="0"
                  value={form.collected}
                  onChange={(event) =>
                    setField("collected", toNumber(event.target.value))
                  }
                />
              </span>
            </label>
            <label>
              Claim paid
              <span className="money-field">
                <span>$</span>
                <input
                  type="number"
                  min="0"
                  value={form.claimPaid}
                  onChange={(event) =>
                    setField("claimPaid", toNumber(event.target.value))
                  }
                />
              </span>
            </label>
          </div>

          <div className="check-grid compact">
            <label>
              <input
                type="checkbox"
                checked={form.includeExam}
                onChange={(event) =>
                  setField("includeExam", event.target.checked)
                }
              />
              Routine exam
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.retinalImaging}
                onChange={(event) =>
                  setField("retinalImaging", event.target.checked)
                }
              />
              Retinal imaging
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.diabeticExam}
                onChange={(event) =>
                  setField("diabeticExam", event.target.checked)
                }
              />
              Diabetic exam
            </label>
          </div>

          {form.orderType === "glasses" ? (
            <div className="calculator-section">
              <div className="panel-heading small">
                <p>Eyeglasses</p>
                <h2>Frame and lenses</h2>
              </div>

              <div className="check-grid compact">
                <label>
                  <input
                    type="checkbox"
                    checked={form.includeFrame}
                    onChange={(event) =>
                      setField("includeFrame", event.target.checked)
                    }
                  />
                  Frame order
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.uvNeeded}
                    onChange={(event) =>
                      setField("uvNeeded", event.target.checked)
                    }
                  />
                  UV needed
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.safetyMaterialNeeded}
                    onChange={(event) =>
                      setField("safetyMaterialNeeded", event.target.checked)
                    }
                  />
                  Safety material needed
                </label>
              </div>

              <div className="field-row three">
                <label>
                  Frame retail
                  <span className="money-field">
                    <span>$</span>
                    <input
                      type="number"
                      min="0"
                      value={form.frameRetail}
                      onChange={(event) =>
                        setField("frameRetail", toNumber(event.target.value))
                      }
                    />
                  </span>
                </label>
                <label>
                  Frame copay
                  <span className="money-field">
                    <span>$</span>
                    <input
                      type="number"
                      min="0"
                      value={form.frameCopay}
                      onChange={(event) =>
                        setField("frameCopay", toNumber(event.target.value))
                      }
                    />
                  </span>
                </label>
                <label>
                  Lens copay
                  <span className="money-field">
                    <span>$</span>
                    <input
                      type="number"
                      min="0"
                      value={form.lensCopay}
                      onChange={(event) =>
                        setField("lensCopay", toNumber(event.target.value))
                      }
                    />
                  </span>
                </label>
              </div>

              <div className="field-row three">
                <label>
                  In-network allowance
                  <span className="money-field">
                    <span>$</span>
                    <input
                      type="number"
                      min="0"
                      value={form.frameInAllowance}
                      onChange={(event) =>
                        setField(
                          "frameInAllowance",
                          toNumber(event.target.value),
                        )
                      }
                    />
                  </span>
                </label>
                <label>
                  Out-of-network allowance
                  <span className="money-field">
                    <span>$</span>
                    <input
                      type="number"
                      min="0"
                      value={form.frameOutAllowance}
                      onChange={(event) =>
                        setField(
                          "frameOutAllowance",
                          toNumber(event.target.value),
                        )
                      }
                    />
                  </span>
                </label>
                <label>
                  Frame benefits
                  <span className="money-field">
                    <span>#</span>
                    <input
                      type="number"
                      min="1"
                      value={form.frameBenefitCount}
                      onChange={(event) =>
                        setField(
                          "frameBenefitCount",
                          Math.max(1, toNumber(event.target.value)),
                        )
                      }
                    />
                  </span>
                </label>
              </div>
              <div className="allowance-note">
                Effective frame allowance:{" "}
                <strong>{formatMoney(effectiveFrameAllowance(form))}</strong>
                {form.frameBenefitCount > 1
                  ? " after splitting the yearly allowance"
                  : ""}
              </div>

              <div className="field-row">
                <label>
                  Base lens
                  <select
                    value={form.baseLens}
                    onChange={(event) => setField("baseLens", event.target.value)}
                  >
                    {lensOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Progressive
                  <select
                    value={form.progressive}
                    onChange={(event) =>
                      setField("progressive", event.target.value)
                    }
                  >
                    {progressiveOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="field-row">
                <label>
                  Material
                  <select
                    value={form.material}
                    onChange={(event) => setField("material", event.target.value)}
                  >
                    {materialOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  AR coating
                  <select
                    value={form.arCoating}
                    onChange={(event) =>
                      setField("arCoating", event.target.value)
                    }
                  >
                    {arOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="field-row">
                <label>
                  Photochromic
                  <select
                    value={form.photochromic}
                    onChange={(event) =>
                      setField("photochromic", event.target.value)
                    }
                  >
                    {photochromicOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Scratch coating
                  <select
                    value={form.scratch}
                    onChange={(event) => setField("scratch", event.target.value)}
                  >
                    {scratchOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Tint or sunglass treatment
                <select
                  value={form.tint}
                  onChange={(event) => setField("tint", event.target.value)}
                >
                  {tintOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="option-list">
                {addOnOptions.map((option) => (
                  <label key={option.id}>
                    <input
                      type="checkbox"
                      checked={form.selectedAddOns.includes(option.id)}
                      onChange={() => toggleAddOn(option.id)}
                    />
                    <span>
                      <strong>{option.label}</strong>
                      <small>{formatMoney(option.member)} member charge</small>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="calculator-section">
              <div className="panel-heading small">
                <p>Contacts</p>
                <h2>Lens and fitting</h2>
              </div>

              <div className="check-grid compact">
                <label>
                  <input
                    type="checkbox"
                    checked={form.medicallyNecessaryContacts}
                    onChange={(event) =>
                      setField(
                        "medicallyNecessaryContacts",
                        event.target.checked,
                      )
                    }
                  />
                  Medically necessary
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.contactFit}
                    onChange={(event) =>
                      setField("contactFit", event.target.checked)
                    }
                  />
                  Evaluation fitting
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.specialtyFit}
                    onChange={(event) =>
                      setField("specialtyFit", event.target.checked)
                    }
                  />
                  Specialty fit
                </label>
              </div>

              <div className="field-row">
                <label>
                  Contact lens retail
                  <span className="money-field">
                    <span>$</span>
                    <input
                      type="number"
                      min="0"
                      value={form.contactRetail}
                      onChange={(event) =>
                        setField("contactRetail", toNumber(event.target.value))
                      }
                    />
                  </span>
                </label>
                <label>
                  Contact allowance
                  <span className="money-field">
                    <span>$</span>
                    <input
                      type="number"
                      min="0"
                      value={form.contactAllowance}
                      onChange={(event) =>
                        setField(
                          "contactAllowance",
                          toNumber(event.target.value),
                        )
                      }
                    />
                  </span>
                </label>
              </div>
            </div>
          )}
        </section>

        <section className="results-column">
          <section className="panel total-panel">
            <div className="selected-product">
              <span>{form.orderType === "glasses" ? "Eyeglasses" : "Contacts"}</span>
              <strong>{form.customerName || "Customer order"}</strong>
              {form.claimNumber ? <em>Claim {form.claimNumber}</em> : null}
            </div>

            <div className="starting-cost">
              <span>Starting retail</span>
              <strong>{formatMoney(summary.retailTotal)}</strong>
              <small>before plan benefits</small>
            </div>

            <div className="summary-rows">
              <div>
                <span>Expected plan share</span>
                <strong>-{formatMoney(summary.expectedPlanShare)}</strong>
              </div>
              <div>
                <span>Patient responsibility</span>
                <strong>{formatMoney(summary.patientTotal)}</strong>
              </div>
              <div>
                <span>Collected from patient</span>
                <strong>{formatMoney(form.collected)}</strong>
              </div>
            </div>

            <div className={`balance-bubble ${balanceTone}`}>
              <span>
                {balanceTone === "settled"
                  ? "Patient settled"
                  : balanceTone === "due"
                    ? "Balance due"
                    : "Patient credit"}
              </span>
              <strong>{formatMoney(Math.abs(summary.patientBalance))}</strong>
            </div>

            <div className="mini-grid">
              <div>
                <span>Claim target</span>
                <strong>{formatMoney(summary.expectedPlanShare)}</strong>
              </div>
              <div>
                <span>Claim paid</span>
                <strong>{formatMoney(form.claimPaid)}</strong>
              </div>
              <div>
                <span>Claim gap</span>
                <strong>{formatMoney(summary.claimGap)}</strong>
              </div>
              <div>
                <span>Revenue variance</span>
                <strong>{formatMoney(summary.revenueVariance)}</strong>
              </div>
            </div>
          </section>

          <section className="panel audit-panel">
            <div className="panel-heading row">
              <div>
                <p>Audit</p>
                <h2>Missed-charge check</h2>
              </div>
              <span className="source-pill">{source}</span>
            </div>
            <div className="audit-list">
              {auditFindings.map((finding) => (
                <article className={`audit-item ${finding.level}`} key={finding.title}>
                  <span aria-hidden="true" />
                  <div>
                    <strong>{finding.title}</strong>
                    <p>{finding.detail}</p>
                  </div>
                  {typeof finding.amount === "number" ? (
                    <em>{formatMoney(finding.amount)}</em>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="panel line-panel">
            <div className="panel-heading row">
              <div>
                <p>Reconciliation</p>
                <h2>Order lines</h2>
              </div>
              <span>{summary.lines.length} lines</span>
            </div>

            <div className="line-header">
              <span>Item</span>
              <span>Retail</span>
              <span>Patient</span>
            </div>
            <div className="line-list">
              {summary.lines.map((line, index) => (
                <article className="line-item" key={`${line.label}-${index}`}>
                  <div>
                    <strong>{line.label}</strong>
                    <small>
                      {line.group}
                      {line.note ? ` | ${line.note}` : ""}
                    </small>
                  </div>
                  <span>{formatMoney(line.retail)}</span>
                  <span>{formatMoney(line.patient)}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel baseline-panel">
            <div className="panel-heading">
              <p>Baseline plan values</p>
              <h2>Quick reference</h2>
            </div>
            <dl className="baseline-grid">
              <div>
                <dt>Routine exam</dt>
                <dd>$20 copay</dd>
              </div>
              <div>
                <dt>Frame</dt>
                <dd>$20 copay, $260/$130 allowance, split if 2 benefits</dd>
              </div>
              <div>
                <dt>Spectacle lens</dt>
                <dd>$20 copay</dd>
              </div>
              <div>
                <dt>UV coat</dt>
                <dd>$12 member charge</dd>
              </div>
              <div>
                <dt>AR coating</dt>
                <dd>$50 to $120</dd>
              </div>
              <div>
                <dt>Progressives</dt>
                <dd>$55 to $225</dd>
              </div>
              <div>
                <dt>Poly/high index</dt>
                <dd>$40 to $120</dd>
              </div>
              <div>
                <dt>Contact lenses</dt>
                <dd>$260 allowance</dd>
              </div>
            </dl>
          </section>
        </section>
      </div>
    </main>
  );
}
