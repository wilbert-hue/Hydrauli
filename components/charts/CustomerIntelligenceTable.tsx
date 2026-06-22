'use client'

import { useState } from 'react'

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_CUSTOMERS = [
  {
    sno: 1,
    name: 'ProFrac Holding Corp.',
    overview: 'One of the largest pressure-pumping companies in North America, offering fully integrated frac services across major shale basins.',
    entityType: 'Hydraulic Fracturing & Pressure-Pumping Service Company',
    appFocus: 'High-horsepower frac pump fleets, fluid-end consumables, proppant logistics',
    revenue: '~$2,100M (2023)',
    scale: 'Large-cap; 40+ active frac fleets across Permian, Eagle Ford, DJ Basin',
    contactPerson: 'Matt Wilks',
    designation: 'Executive Chairman & CEO',
    email: 'm.wilks@profrac.com',
    phone: '+1 817-862-2000',
    linkedin: 'linkedin.com/company/profrac',
    website: 'www.profrac.com',
    purchaseCriteria: 'Fleet uptime, fluid-end life >3,000 hours, tier-4 DGB/electric pump compatibility',
    painPoints: 'Fluid-end erosion under high-sand slickwater jobs; plug milling NPT; logistics coordination',
    technicalComplexity: 'Operating 15k–20k psi treating pressures; real-time diverter chemistry optimization',
    riskExposure: 'Commodity price cyclicality; crew availability; supply-chain lead times for pump components',
    buyingTriggers: 'Fleet electrification capex cycle (2024-2026); new Permian pad contracts',
    budgetOwner: 'SVP Operations & VP Supply Chain',
    procurementModel: 'Competitive tender for OEM equipment; long-term MSA for consumables',
    vendorCriteria: 'ISO-certified supplier, North America warehouse stock, <72-hr critical-part delivery',
    engagementMode: 'In-person technical review + digital portal for repeat orders',
    deployment: 'On-site field service + 3-yr supply agreements',
    solutionType: 'Integrated product + service bundle (equipment + MRO + field support)',
    techRequirement: 'API 6A/11D1 compliant; integration with ProFrac SCADA; field-interchangeable fluid ends',
    perfExpectation: 'Fluid-end life >3,500 hrs; pump availability >94%; NPT <2%',
    benchmarkSummary: 'Tier-1 buyer with high strategic value; aggressive on TCO pricing; values single-source supply',
    cmiNotes: 'Active electrification pilot in Permian (Q3 2024); receptive to e-frac pump OEM partnerships',
  },
  {
    sno: 2,
    name: 'BJ Energy Solutions',
    overview: 'Independent pressure-pumping specialist re-launched post-BJ Services acquisition; focused on innovative well-completion technology.',
    entityType: 'Hydraulic Fracturing & Pressure-Pumping Service Company',
    appFocus: 'Natural-gas-powered frac fleets, dual-fuel pump technology, real-time frac monitoring',
    revenue: '~$850M (est. 2023)',
    scale: 'Mid-size; 12 active fleets, primarily Permian Basin & Haynesville',
    contactPerson: 'Warren Zemlak',
    designation: 'Chief Revenue Officer',
    email: 'w.zemlak@bjenergysoutions.com',
    phone: '+1 832-456-7890',
    linkedin: 'linkedin.com/company/bj-energy-solutions',
    website: 'www.bjenergysolutions.com',
    purchaseCriteria: 'Dual-fuel combustion efficiency, fluid-end interchangeability, blender reliability',
    painPoints: 'Wellsite gas supply variability; fluid-end failure during extended zipper jobs',
    technicalComplexity: 'Switching between diesel and field gas mid-job; continuous pump optimization',
    riskExposure: 'Gas fuel cost volatility; competition from electric-frac OEMs',
    buyingTriggers: 'Tier-4 DGB fleet refresh (2025); expansion into Eagle Ford',
    budgetOwner: 'COO & VP Equipment',
    procurementModel: 'Sole-source preferred vendor for pump components; project-based for capital equipment',
    vendorCriteria: 'Dual-fuel compatibility certification; 24/7 field support hotline',
    engagementMode: 'Technical workshops + quarterly business reviews',
    deployment: 'Field stocking program with dedicated BJ yard consignment',
    solutionType: 'Component supply + remote diagnostic subscription',
    techRequirement: 'NAT-GAS valve compatibility; plug-and-play fluid-end design',
    perfExpectation: 'Dual-fuel switch time <10 min; blender uptime >96%',
    benchmarkSummary: 'Growth-stage buyer; willing to co-develop custom fluid-end with suppliers',
    cmiNotes: 'Evaluating tier-4 DGB pump upgrade for 4 new fleets in H1 2025',
  },
  {
    sno: 3,
    name: 'Halliburton (Completion & Production Division)',
    overview: 'Global oilfield services giant; largest pressure-pumping provider worldwide with technology-driven well-completion offerings.',
    entityType: 'Integrated Oilfield Service & Completion Company',
    appFocus: 'Wireline, perforating systems, frac manifolds, digital frac monitoring, fluid chemistry',
    revenue: '~$23,000M (2023 total); C&P division ~$9,200M',
    scale: 'Large-cap; 200+ frac crews globally; dominant Permian & Canadian presence',
    contactPerson: 'Eric Carre',
    designation: 'EVP & CFO (C&P Division CPO)',
    email: 'procurement@halliburton.com',
    phone: '+1 713-759-2600',
    linkedin: 'linkedin.com/company/halliburton',
    website: 'www.halliburton.com',
    purchaseCriteria: 'Standardized API specs, global supply capability, digital integration readiness',
    painPoints: 'Scaling standardized fluid-end specs across multi-basin operations; supply-chain localisation',
    technicalComplexity: '18k–22k psi next-gen pump development; AI-driven frac optimization',
    riskExposure: 'Geopolitical supply-chain risk; skilled labor shortages in basin expansion',
    buyingTriggers: 'Zeus e-frac fleet ramp; OCTG procurement cycle; wireline gun system refresh',
    budgetOwner: 'Global Supply Chain VP & Divisional CPO',
    procurementModel: 'Global framework agreements; RFP for new product categories',
    vendorCriteria: 'ISO 9001/API Q1 mandatory; global logistics network; ESG compliance certification',
    engagementMode: 'Annual strategic supplier summits + digital procurement portal',
    deployment: 'Consignment inventory in Halliburton regional hubs',
    solutionType: 'OEM-qualified components integrated into Halliburton technology stack',
    techRequirement: 'Zeus e-frac compatible fluid ends; smart sensor-embedded manifolds',
    perfExpectation: 'Zero-defect delivery; fluid-end life >4,000 hrs for ultra-HPHT applications',
    benchmarkSummary: 'Strategic tier-1 account; long sales cycle; requires full API & internal qualification',
    cmiNotes: 'Zeus e-frac fleet expected to reach 25 units by end-2025; fluid-end demand ~$180M/yr',
  },
  {
    sno: 4,
    name: 'SLB (Schlumberger) – Well Construction & Production Systems',
    overview: 'World\'s largest oilfield services company; offers end-to-end completion solutions including perforating, fracturing, and digital platforms.',
    entityType: 'Integrated Oilfield Service & Completion Company',
    appFocus: 'Perforating systems, frac plug setting, high-pressure manifolds, OneStim frac platform',
    revenue: '~$33,100M (2023 total)',
    scale: 'Large-cap; global operations; 30,000+ completions engineers',
    contactPerson: 'Gavin Rennick',
    designation: 'President – Well Performance',
    email: 'suppliers@slb.com',
    phone: '+1 713-513-2000',
    linkedin: 'linkedin.com/company/slb',
    website: 'www.slb.com',
    purchaseCriteria: 'Digital-first supply; sustainability-rated components; ultra-HPHT performance',
    painPoints: 'Interoperability between legacy and digital frac control systems; decarbonisation pressure',
    technicalComplexity: 'Ultra-HPHT frac (22k+ psi); real-time sleeve activation; fibre-optic DTS integration',
    riskExposure: 'Carbon regulation risk; competition from tech-native frac companies',
    buyingTriggers: 'OneStim 2.0 platform rollout; ESG-linked supply-chain overhaul (2025-2026)',
    budgetOwner: 'CPO & Divisional VP Supply',
    procurementModel: 'Global preferred-supplier program (PSP); digital RFQ platform',
    vendorCriteria: 'Net-zero roadmap required; digital traceability of components; API Q2 for HPHT',
    engagementMode: 'Digital supplier portal + annual Supplier Innovation Summit',
    deployment: 'JIT delivery to SLB global hubs; RFID-tracked inventory',
    solutionType: 'Smart components with embedded diagnostics for OneStim integration',
    techRequirement: 'IIoT-ready sensors; CAN bus or MODBUS integration with OneStim; API 11D1',
    perfExpectation: 'Predictive failure alerting <48 hrs before failure; zero wellsite HSE incidents',
    benchmarkSummary: 'Most digitally advanced buyer; long qualification runway; high strategic value',
    cmiNotes: 'Pilot for smart fluid-end monitoring underway in Permian (Q4 2024); evaluating 3 vendors',
  },
  {
    sno: 5,
    name: 'Liberty Energy Inc.',
    overview: 'Technology-driven pressure-pumping company focused on next-generation electric frac and sustainable operations in North American shale.',
    entityType: 'Hydraulic Fracturing & Pressure-Pumping Service Company',
    appFocus: 'digiFrac electric pump fleet, Quiet Fleet gas-turbine frac, wireline integration',
    revenue: '~$1,100M (2023)',
    scale: 'Mid-cap; 10+ frac fleets; Permian, DJ Basin, Marcellus',
    contactPerson: 'Chris Wright',
    designation: 'CEO & Founder',
    email: 'info@libertyenergy.com',
    phone: '+1 303-515-2800',
    linkedin: 'linkedin.com/company/liberty-energy',
    website: 'www.libertyenergy.com',
    purchaseCriteria: 'Electric motor compatibility, low-maintenance power-end design, modular fluid-end',
    painPoints: 'High capex for e-frac infrastructure; grid-connection reliability at remote pads',
    technicalComplexity: 'High-voltage wellsite power management; fully variable-speed electric pump control',
    riskExposure: 'Capital cost of e-frac transition; customer willingness-to-pay premium',
    buyingTriggers: 'digiPrime 2.0 fleet build (2025); Permian operator demand for Tier-4 DGB',
    budgetOwner: 'SVP Technology & VP Operations',
    procurementModel: 'Direct OEM partnerships for capital equipment; spot-buy for consumables',
    vendorCriteria: 'E-frac motor/power-end compatibility; ATEX/UL-certified electrical components',
    engagementMode: 'Co-engineering sessions + quarterly performance reviews',
    deployment: 'On-site integration support during fleet commissioning',
    solutionType: 'Capital equipment supply + life-cycle performance contract',
    techRequirement: 'Variable-frequency drive (VFD) compatible fluid ends; IP67 electrical enclosures',
    perfExpectation: 'Pump availability >97%; zero Tier-4 emissions violation events',
    benchmarkSummary: 'Innovation-first buyer; receptive to co-development; strong ESG brand alignment required',
    cmiNotes: 'Seeking fluid-end OEM for digiPrime Gen-2 qualification by Q2 2025; RFQ expected Jan 2025',
  },
  {
    sno: 6,
    name: 'NexTier Oilfield Solutions',
    overview: 'Merged completion services company (C&J Energy + KLX Energy); integrated pressure-pumping, wireline, and completion tools platform.',
    entityType: 'Hydraulic Fracturing & Pressure-Pumping Service Company',
    appFocus: 'Frac pump fleets, wireline & perforating, wellsite chemical management',
    revenue: '~$970M (est. 2023)',
    scale: 'Mid-size; 11 active frac fleets; Permian, Haynesville, Eagle Ford',
    contactPerson: 'Kevin McDonald',
    designation: 'CEO',
    email: 'k.mcdonald@nextieroilfield.com',
    phone: '+1 281-231-3900',
    linkedin: 'linkedin.com/company/nextier-oilfield-solutions',
    website: 'www.nextieroilfield.com',
    purchaseCriteria: 'Cross-service compatibility, aftermarket support depth, total cost of ownership',
    painPoints: 'Integration complexity of merged legacy fleets; sub-optimal plug milling efficiency',
    technicalComplexity: 'Simultaneous zipper frac on multi-well pads; real-time rate/pressure management',
    riskExposure: 'Margin compression from E&P operator pricing pressure',
    buyingTriggers: 'Post-merger fleet standardization program; Tier-4 upgrade cycle',
    budgetOwner: 'COO & Director Supply Chain',
    procurementModel: 'Preferred vendor list + open competition for >$500K purchases',
    vendorCriteria: 'Aftermarket parts stock in Midland/Houston; certified repair facility',
    engagementMode: 'Regional sales rep + digital order portal',
    deployment: 'Consignment + emergency 24-hr delivery SLA',
    solutionType: 'OEM + aftermarket bundled package',
    techRequirement: 'Compatible with NexTier SCADA; quick-swap fluid-end design',
    perfExpectation: 'Parts fill-rate >98%; emergency delivery <12 hrs within Permian Basin',
    benchmarkSummary: 'Price-sensitive mid-tier; strong aftermarket opportunity; fleet standardisation underway',
    cmiNotes: 'Fluid-end standardization RFP expected Q1 2025; targeting 3-year MSA',
  },
  {
    sno: 7,
    name: 'Oil States International – Completion Products Division',
    overview: 'Diversified OFS manufacturer supplying wellhead, completion tools, and downhole equipment including frac plug systems.',
    entityType: 'Oilfield Equipment Distributor & Stockist',
    appFocus: 'Frac plugs, bridge plugs, frac trees, wellhead connectors, completion tool rentals',
    revenue: '~$540M (2023 total)',
    scale: 'Mid-size manufacturer/distributor; 12 US distribution centers',
    contactPerson: 'Cindy Taylor',
    designation: 'President & CEO',
    email: 'c.taylor@oilstates.com',
    phone: '+1 713-652-0582',
    linkedin: 'linkedin.com/company/oil-states-international',
    website: 'www.oilstates.com',
    purchaseCriteria: 'Plug reliability, API 11D1 compliance, fast-drill-out frac plugs, rental availability',
    painPoints: 'Lead-time pressure for frac plug inventory during high-activity periods',
    technicalComplexity: 'High-expansion frac plug setting in high-deviation laterals',
    riskExposure: 'Customer consolidation reducing distributor volumes; competition from direct OEM supply',
    buyingTriggers: 'Basin inventory replenishment cycle; new E&P operator contract wins',
    budgetOwner: 'VP Product Line & Regional Sales Director',
    procurementModel: 'OEM direct + third-party sub-component sourcing',
    vendorCriteria: 'API 11D1 / API 6A certified; rapid qualification support',
    engagementMode: 'Technical sales + regional distributor events',
    deployment: 'Hub-and-spoke distribution from regional warehouses',
    solutionType: 'Product distribution + rental fleet management',
    techRequirement: 'Fast drill-out (<45 min) composite frac plug; compatible with standard setting tools',
    perfExpectation: 'Plug set success rate >99.5%; zero wellbore obstruction incidents',
    benchmarkSummary: 'Strategic distribution channel partner; high volume; moderate margin; inventory depth key',
    cmiNotes: 'Evaluating composite frac plug suppliers for 2025 preferred vendor list; decision Q2 2025',
  },
  {
    sno: 8,
    name: 'Coterra Energy Inc.',
    overview: 'Large independent E&P operator with major positions in Permian, Marcellus, and Anadarko basins; high-volume frac buyer.',
    entityType: 'Upstream Oil & Gas E&P Operator / Shale E&P Company',
    appFocus: 'Completion design optimization, proppant procurement, frac water management, wireline',
    revenue: '~$7,600M (2023)',
    scale: 'Large-cap E&P; 1,500+ active wells; 250+ fracs/year',
    contactPerson: 'Tom Jorden',
    designation: 'President & CEO (Procurement: VP Drilling & Completions)',
    email: 'completions@coterra.com',
    phone: '+1 832-442-2400',
    linkedin: 'linkedin.com/company/coterra-energy',
    website: 'www.coterra.com',
    purchaseCriteria: 'Completion cost/ft, well productivity uplift, water recycling capability, ESG alignment',
    painPoints: 'Proppant cost inflation; produced water disposal capacity; completion design optimization at scale',
    technicalComplexity: 'Multi-basin completion design variability; simultaneous zipper fracs in Permian',
    riskExposure: 'Commodity price downturns impacting completions budget; water sourcing constraints',
    buyingTriggers: 'Annual completions program budget (Jan); proppant contract renewal (Q4)',
    budgetOwner: 'VP Completions Engineering & CFO',
    procurementModel: 'Competitive bid for service contracts; direct purchase for proppant & water services',
    vendorCriteria: 'Proven basin-specific track record; real-time data sharing capability; safety record',
    engagementMode: 'Semi-annual completion optimization workshops + digital data-sharing platforms',
    deployment: 'Wellsite-based service delivery + centralized data analytics integration',
    solutionType: 'Performance-based completions contracts + proppant supply agreements',
    techRequirement: 'Real-time frac diagnostics (DAS/DTS); proppant tracer capability; produced water treatment',
    perfExpectation: 'IP30 uplift >15% vs. offset wells; completion cost <$450/ft in Permian',
    benchmarkSummary: 'High-volume E&P; strong ESG buyer; performance contracting is key differentiator',
    cmiNotes: 'Permian completions budget ~$1.2B in 2025; evaluating lower-carbon proppant suppliers',
  },
  {
    sno: 9,
    name: 'PEMEX Exploración y Producción',
    overview: 'Mexico\'s national oil company; expanding unconventional resource development in Burgos and Tampico-Misantla basins.',
    entityType: 'Upstream Oil & Gas E&P Operator / Shale E&P Company',
    appFocus: 'Tight-gas hydraulic fracturing, well-completion services, frac equipment import logistics',
    revenue: '~$73,000M (2023 total revenue)',
    scale: 'Largest oil company in Latin America; 200+ frac stages/year and growing',
    contactPerson: 'Octavio Romero Oropeza',
    designation: 'CEO (Procurement: Director General de Abastecimiento)',
    email: 'proveedores@pemex.com',
    phone: '+52 55 1944-2500',
    linkedin: 'linkedin.com/company/pemex',
    website: 'www.pemex.com',
    purchaseCriteria: 'Compliance with PEMEX procurement regulations (Pemex-Compras); local content requirements',
    painPoints: 'Technology gap vs. US shale operators; logistics for imported equipment; local content mandate',
    technicalComplexity: 'Adapting US shale completion designs to Mexican tight-gas geology',
    riskExposure: 'Political/regulatory risk; budget volatility; PEMEX financial leverage constraints',
    buyingTriggers: 'Mexican energy reform implementation; CNH unconventional license rounds',
    budgetOwner: 'Subdirección de Exploración y Director de Abastecimiento',
    procurementModel: 'Public tender (licitación pública) for major equipment; direct assignment for services',
    vendorCriteria: 'PEMEX-approved vendor registry; local Mexican agent/JV; financing support',
    engagementMode: 'Formal procurement portal + in-person technical presentations in Mexico City',
    deployment: 'Customs clearance support + local Mexican partner integration',
    solutionType: 'Equipment supply + local content training package',
    techRequirement: 'NOM-compliant equipment; bilingual (ES/EN) documentation; local spare parts support',
    perfExpectation: 'On-time import customs clearance >95%; equipment availability >90% on first deployment',
    benchmarkSummary: 'Strategic long-term account; complex procurement but high volume upside post-reform',
    cmiNotes: 'PEMEX unconventional program targeting 5,000 frac stages/yr by 2030; vendor RFI expected mid-2025',
  },
  {
    sno: 10,
    name: 'Calfrac Well Services',
    overview: 'Canadian-headquartered international pressure-pumping company operating in Canada, USA, Argentina, and Russia.',
    entityType: 'Hydraulic Fracturing & Pressure-Pumping Service Company',
    appFocus: 'Conventional and unconventional frac services, fluid systems, pump equipment, coiled tubing',
    revenue: '~$615M (2023)',
    scale: 'Mid-size; 25 active frac crews across 4 countries',
    contactPerson: 'Pat Powell',
    designation: 'President & CEO',
    email: 'info@calfrac.com',
    phone: '+1 403-266-6000',
    linkedin: 'linkedin.com/company/calfrac-well-services',
    website: 'www.calfrac.com',
    purchaseCriteria: 'Cold-weather operability, multi-basin fleet standardization, Canadian content compliance',
    painPoints: 'Winter operability of pump fluid ends; cross-border logistics Canada-USA; Argentina forex risk',
    technicalComplexity: 'Arctic frac operations; deep Montney horizontal multi-stage completions',
    riskExposure: 'Currency risk in Argentina; Canadian energy regulatory changes (C-69)',
    buyingTriggers: 'Montney expansion capex cycle; Argentine YPF Vaca Muerta contract renewals',
    budgetOwner: 'COO & VP Equipment',
    procurementModel: 'Canadian procurement office as central hub; regional purchasing for Argentina',
    vendorCriteria: 'Canadian supply chain preferred; cold-temperature-rated seals and fluids',
    engagementMode: 'Calgary HQ meetings + digital procurement system (Ariba)',
    deployment: 'Calgary main depot + regional satellite yards (Grande Prairie, Edson)',
    solutionType: 'Equipment + cold-weather service kit + field training',
    techRequirement: 'Cold-rated fluid ends (-40°C); Canadian Standards Association (CSA)-certified electrical',
    perfExpectation: 'Cold-weather pump uptime >92%; cross-border delivery within 5 business days',
    benchmarkSummary: 'Key Canadian anchor account; cold-climate specialization creates strong product-fit story',
    cmiNotes: 'Fluid-end refresh program for Montney expansion: RFP expected Q3 2025; ~$15M opportunity',
  },
]

// ─── Column Definitions ───────────────────────────────────────────────────────

interface ColDef {
  key: keyof typeof DEMO_CUSTOMERS[0]
  header: string
  group?: string
  width?: string
}

const PROP1_COLS: ColDef[] = [
  { key: 'sno', header: 'S.No.', width: 'w-10' },
  { key: 'name', header: 'Customer / Company Name', group: 'Customer Information', width: 'w-40' },
  { key: 'overview', header: 'Business Overview', group: 'Customer Information', width: 'w-64' },
  { key: 'entityType', header: 'HF Customer Entity Type', group: 'Customer Information', width: 'w-48' },
  { key: 'appFocus', header: 'HF Application / Equipment Focus', group: 'Customer Information', width: 'w-56' },
  { key: 'revenue', header: 'Annual Revenue (US$M) / Frac Budget Signal', group: 'Customer Information', width: 'w-40' },
  { key: 'scale', header: 'Size / Operating Scale', group: 'Customer Information', width: 'w-48' },
  { key: 'contactPerson', header: 'Key Contact Person', group: 'Contact Details', width: 'w-36' },
  { key: 'designation', header: 'Designation / Decision-Maker Role', group: 'Contact Details', width: 'w-48' },
  { key: 'email', header: 'Email Address', group: 'Contact Details', width: 'w-48' },
  { key: 'phone', header: 'Telephone / WhatsApp', group: 'Contact Details', width: 'w-40' },
  { key: 'linkedin', header: 'LinkedIn Profile', group: 'Contact Details', width: 'w-44' },
  { key: 'website', header: 'Website', group: 'Contact Details', width: 'w-40' },
]

const PROP2_EXTRA_COLS: ColDef[] = [
  { key: 'purchaseCriteria', header: 'Frac Equipment Purchase Criteria', group: 'Buy Drivers', width: 'w-56' },
  { key: 'painPoints', header: 'Operations / Fleet Maintenance Pain Points', group: 'Buy Drivers', width: 'w-56' },
  { key: 'technicalComplexity', header: 'Pressure / HSE / Technical Complexity', group: 'Buy Drivers', width: 'w-56' },
  { key: 'riskExposure', header: 'Risk Exposure', group: 'Buy Drivers', width: 'w-48' },
  { key: 'buyingTriggers', header: 'Buying Triggers', group: 'Buy Drivers', width: 'w-48' },
]

const PROP3_EXTRA_COLS: ColDef[] = [
  { key: 'budgetOwner', header: 'Budget Owner', group: 'Procurement Behaviour', width: 'w-44' },
  { key: 'procurementModel', header: 'Procurement Model', group: 'Procurement Behaviour', width: 'w-48' },
  { key: 'vendorCriteria', header: 'Vendor Selection Criteria', group: 'Procurement Behaviour', width: 'w-56' },
  { key: 'engagementMode', header: 'Preferred Engagement Mode', group: 'Procurement Behaviour', width: 'w-48' },
  { key: 'deployment', header: 'Preferred Deployment / Service Contract', group: 'Procurement Behaviour', width: 'w-48' },
  { key: 'solutionType', header: 'Preferred Solution Type', group: 'Procurement Behaviour', width: 'w-48' },
  { key: 'techRequirement', header: 'Integration / Technical / Service Requirement', group: 'Solution Requirement', width: 'w-56' },
  { key: 'perfExpectation', header: 'Performance Expectation', group: 'Solution Requirement', width: 'w-48' },
  { key: 'benchmarkSummary', header: 'Benchmark Summary', group: 'CMI Insights', width: 'w-56' },
  { key: 'cmiNotes', header: 'Additional CMI Notes', group: 'CMI Insights', width: 'w-56' },
]

const PROP2_COLS: ColDef[] = [...PROP1_COLS, ...PROP2_EXTRA_COLS]
const PROP3_COLS: ColDef[] = [...PROP1_COLS, ...PROP2_EXTRA_COLS, ...PROP3_EXTRA_COLS]

// ─── Group Header colours ─────────────────────────────────────────────────────

const GROUP_COLOURS: Record<string, string> = {
  'Customer Information': 'bg-blue-600',
  'Contact Details': 'bg-teal-600',
  'Buy Drivers': 'bg-amber-600',
  'Procurement Behaviour': 'bg-purple-600',
  'Solution Requirement': 'bg-rose-600',
  'CMI Insights': 'bg-emerald-700',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildGroupSpans(cols: ColDef[]) {
  const spans: { group: string; span: number; colour: string }[] = []
  for (const col of cols) {
    const g = col.group || ''
    if (spans.length && spans[spans.length - 1].group === g) {
      spans[spans.length - 1].span++
    } else {
      spans.push({ group: g, span: 1, colour: GROUP_COLOURS[g] || 'bg-gray-500' })
    }
  }
  return spans
}

// ─── Table Component ──────────────────────────────────────────────────────────

function PropositionTable({ cols }: { cols: ColDef[] }) {
  const [search, setSearch] = useState('')
  const groupSpans = buildGroupSpans(cols)

  const filtered = DEMO_CUSTOMERS.filter(c =>
    Object.values(c).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  )

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search customers, entity type, contact..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <span className="text-xs text-gray-500">{filtered.length} records</span>
      </div>

      {/* Scrollable table wrapper */}
      <div className="overflow-auto rounded-lg border border-gray-200 shadow-sm max-h-[600px]">
        <table className="min-w-full text-[11px] border-collapse">
          <thead className="sticky top-0 z-10">
            {/* Group header row */}
            <tr>
              {groupSpans.map((g, i) => (
                <th
                  key={i}
                  colSpan={g.span}
                  className={`${g.colour} text-white text-center py-1.5 px-2 text-[10px] font-semibold tracking-wide border-r border-white/30 last:border-r-0`}
                >
                  {g.group || ''}
                </th>
              ))}
            </tr>
            {/* Column header row */}
            <tr className="bg-gray-800">
              {cols.map((col, i) => (
                <th
                  key={i}
                  className={`text-white text-left py-2 px-2 font-medium whitespace-nowrap border-r border-gray-700 last:border-r-0 ${col.width}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, ri) => (
              <tr
                key={ri}
                className={`${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
              >
                {cols.map((col, ci) => (
                  <td
                    key={ci}
                    className={`py-2 px-2 border-r border-gray-100 last:border-r-0 align-top border-b border-gray-100 ${col.width}`}
                  >
                    {col.key === 'sno' ? (
                      <span className="font-semibold text-gray-600">{row[col.key]}</span>
                    ) : col.key === 'name' ? (
                      <span className="font-semibold text-blue-700">{row[col.key]}</span>
                    ) : col.key === 'linkedin' ? (
                      <a href={`https://${row[col.key]}`} target="_blank" rel="noreferrer"
                        className="text-blue-500 hover:underline truncate block max-w-[160px]">
                        {row[col.key]}
                      </a>
                    ) : col.key === 'website' ? (
                      <a href={`https://${row[col.key]}`} target="_blank" rel="noreferrer"
                        className="text-blue-500 hover:underline">
                        {row[col.key]}
                      </a>
                    ) : col.key === 'email' ? (
                      <a href={`mailto:${row[col.key]}`} className="text-teal-600 hover:underline">
                        {row[col.key]}
                      </a>
                    ) : (
                      <span className="leading-relaxed text-gray-700 block max-w-xs">
                        {String(row[col.key])}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function CustomerIntelligenceTable() {
  const [prop, setProp] = useState<1 | 2 | 3>(1)

  const tabs = [
    { id: 1 as const, label: 'Proposition 1 – Basic', badge: '13 fields', colour: 'blue' },
    { id: 2 as const, label: 'Proposition 2 – Advanced', badge: '+5 Buy Driver fields', colour: 'amber' },
    { id: 3 as const, label: 'Proposition 3 – Premium', badge: '+10 Procurement & CMI fields', colour: 'purple' },
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 text-white">
        <h2 className="text-base font-bold">Americas Hydraulic Fracturing Market — Customer Database</h2>
        <p className="text-xs text-gray-300 mt-1">
          Verified directory and insight on customers (Hydraulic Fracturing and Pressure-Pumping Service Companies,
          Integrated Oilfield Service and Completion Companies, Oilfield Equipment Distributors and Stockists,
          Upstream Oil and Gas Operators / Shale E&amp;P Companies, etc.)
        </p>
        <div className="flex gap-4 mt-3 text-[11px] text-gray-400">
          <span>📋 {DEMO_CUSTOMERS.length} Companies</span>
          <span>🌎 North America &amp; South America</span>
          <span>🏭 5 Entity Types</span>
        </div>
      </div>

      {/* Proposition tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setProp(t.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
              prop === t.id
                ? t.colour === 'blue'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : t.colour === 'amber'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            {t.label}
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-normal ${
              prop === t.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
            }`}>
              {t.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Proposition description */}
      {prop === 1 && (
        <p className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded px-3 py-2">
          <strong>Basic Package:</strong> Customer profile, entity type, equipment focus, size/revenue, and complete contact details (email, phone, LinkedIn, website).
        </p>
      )}
      {prop === 2 && (
        <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          <strong>Advanced Package:</strong> Everything in Basic plus Buy Drivers — purchase criteria, operational pain points, technical complexity, risk exposure, and buying triggers.
        </p>
      )}
      {prop === 3 && (
        <p className="text-xs text-gray-500 bg-purple-50 border border-purple-200 rounded px-3 py-2">
          <strong>Premium Package:</strong> Everything in Advanced plus Procurement Behaviour Metrics (budget ownership, vendor criteria, engagement preferences), Solution Requirements, and proprietary CMI Insights (benchmark summary &amp; analyst notes).
        </p>
      )}

      {/* Table */}
      {prop === 1 && <PropositionTable cols={PROP1_COLS} />}
      {prop === 2 && <PropositionTable cols={PROP2_COLS} />}
      {prop === 3 && <PropositionTable cols={PROP3_COLS} />}
    </div>
  )
}
