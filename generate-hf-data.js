/**
 * Hydraulic Fracturing Market Data Generator
 * Generates value.json and volume.json for the HF market dashboard
 */

const fs = require('fs')
const path = require('path')

// ============================================================
// YEARS
// ============================================================
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033]

// ============================================================
// GLOBAL MARKET TOTALS (USD Millions)
// ============================================================
const GLOBAL_VALUE = {
  2021: 38500, 2022: 44200, 2023: 50100,
  2024: 54800, 2025: 60200, 2026: 66800,
  2027: 74100, 2028: 82000, 2029: 90800,
  2030: 100500, 2031: 111200, 2032: 122800, 2033: 135500
}

// Global Volume (HF stages in thousands)
const GLOBAL_VOLUME = {
  2021: 5200, 2022: 5900, 2023: 6600,
  2024: 7200, 2025: 7900, 2026: 8700,
  2027: 9600, 2028: 10500, 2029: 11500,
  2030: 12600, 2031: 13800, 2032: 15000, 2033: 16300
}

// ============================================================
// GEOGRAPHY HIERARCHY & SHARES
// ============================================================
const GEO_HIERARCHY = {
  'North America': {
    share: 0.47,
    countries: {
      'United States': 0.82,
      'Canada': 0.18
    }
  },
  'South America': {
    share: 0.08,
    countries: {
      'Brazil': 0.35,
      'Mexico': 0.28,
      'Argentina': 0.25,
      'Rest of South America': 0.12
    }
  },
}

// Small growth variation per region (multiplier applied to growth year-over-year)
const REGION_GROWTH_VARIATION = {
  'North America': 1.00,
  'South America': 1.05
}

// ============================================================
// SEGMENT DEFINITIONS
// ============================================================

// By Offering - hierarchical with 3 levels for Products, 2 levels for Services
const BY_OFFERING = {
  'Products': {
    _share: 0.58,
    children: {
      'Frac Pumping Equipment': {
        _share: 0.30, // share of Products
        children: {
          'Frac Pump Units': 0.45,
          'Pump Fluid Ends': 0.25,
          'Pump Power Ends': 0.20,
          'Pump-Mounted Components': 0.10
        }
      },
      'High-Pressure Fluid Conveyance and Flow-Control Equipment': {
        _share: 0.18,
        children: {
          'Flowlines': 0.12,
          'Treating Iron': 0.10,
          'Frac Manifolds': 0.12,
          'Manifold Skids': 0.08,
          'Plug Valves': 0.10,
          'Gate Valves': 0.08,
          'Check Valves': 0.07,
          'Choke Valves': 0.09,
          'Pressure-Relief Valves': 0.06,
          'Swivel Joints': 0.08,
          'Others (Pup Joints, Integral Fittings, Hose Loops, High-Pressure Connectors, etc.)': 0.10
        }
      },
      'Fluid Preparation Equipment': {
        _share: 0.08,
        children: {
          'Blenders': 0.35,
          'Hydration Units': 0.25,
          'Chemical-Additive Units': 0.25,
          'Mixing Tanks': 0.15
        }
      },
      'Proppant Handling Equipment': {
        _share: 0.08,
        children: {
          'Sand Storage Systems': 0.40,
          'Sand Conveyance Systems': 0.35,
          'Proppant Feeding Systems': 0.25
        }
      },
      'Wellhead and Downhole Completion Equipment': {
        _share: 0.12,
        children: {
          'Frac Trees': 0.20,
          'Frac Plugs': 0.20,
          'Sliding Sleeves': 0.15,
          'Packers': 0.15,
          'Perforating Systems': 0.20,
          'Isolation Tools': 0.10
        }
      },
      'Water Management Equipment': {
        _share: 0.10,
        children: {
          'Water Storage Equipment': 0.30,
          'Water Treatment Equipment': 0.28,
          'Water Recycling Equipment': 0.22,
          'Water Transfer Infrastructure': 0.20
        }
      },
      'Monitoring and Control Products': {
        _share: 0.06,
        children: {
          'Sensors': 0.25,
          'Data Acquisition Hardware': 0.22,
          'Control Panels': 0.18,
          'Monitoring Hardware': 0.20,
          'Embedded Control Software': 0.15
        }
      },
      'Other Hydraulic Fracturing Products (Proppants, Base Fracturing Fluids, Chemical Additives, etc.)': {
        _share: 0.08,
        children: null
      }
    }
  },
  'Services': {
    _share: 0.42,
    children: {
      'Hydraulic Fracturing Execution Services': { _share: 0.35, children: null },
      'Fracture Design and Engineering Services': { _share: 0.12, children: null },
      'Wireline, Perforating and Plug-Setting Services': { _share: 0.14, children: null },
      'Proppant Logistics and Wellsite Handling Services': { _share: 0.10, children: null },
      'Flowback, Well Testing and Cleanup Services': { _share: 0.09, children: null },
      'Equipment Rental and Leasing Services': { _share: 0.08, children: null },
      'Inspection, Maintenance, Repair and Refurbishment Services': { _share: 0.07, children: null },
      'Other Hydraulic Fracturing Services (Digital Monitoring and Optimization Services, Water Management Services)': { _share: 0.05, children: null }
    }
  }
}

// Flat segment definitions (name -> share of total)
const BY_SALES_CHANNEL = {
  'OEM': 0.65,
  'Aftermarket': 0.35
}

const BY_WELL_ORIENTATION = {
  'Horizontal Wells': 0.78,
  'Vertical Wells': 0.22
}

const BY_RESERVOIR_TYPE = {
  'Shale Oil': 0.28,
  'Tight Oil': 0.12,
  'Shale Gas': 0.22,
  'Tight Gas': 0.08,
  'Coalbed Methane': 0.05,
  'Conventional Oil and Gas Reservoirs': 0.18,
  'Other Unconventional Reservoirs': 0.07
}

const BY_END_USER = {
  'Oil and Gas E&P Operators': 0.40,
  'Pressure-Pumping and Fracturing Service Providers': 0.30,
  'Equipment Rental and Fleet Operators': 0.12,
  'Equipment OEMs and System Integrators': 0.10,
  'Oilfield Equipment Distributors': 0.08
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function round2(val) {
  return Math.round(val * 100) / 100
}

/**
 * Generate a time series given a base total map, a share, and optional slight variation
 * @param {Object} globalTotals - { year: value }
 * @param {number} share - fraction of global market
 * @param {number} variation - slight variation factor (1.0 = exact share, 1.05 = 5% above average share)
 */
function makeTimeSeries(globalTotals, share, variation = 1.0) {
  const result = {}
  const baseYear = 2026

  // Apply slight variation that grows with the forecast period
  for (const year of YEARS) {
    const yearDeviation = 1 + (year - baseYear) * 0.004 * (variation - 1)
    const adjustedShare = share * yearDeviation
    result[year] = round2(globalTotals[year] * adjustedShare)
  }
  return result
}

/**
 * Build flat segment data for a geography
 */
function buildFlatSegment(globalTotals, geoShare, segmentDef, geoVariation = 1.0) {
  const result = {}
  for (const [segName, segShare] of Object.entries(segmentDef)) {
    const series = makeTimeSeries(globalTotals, geoShare * segShare, geoVariation)
    result[segName] = series
  }
  return result
}

/**
 * Build By Offering hierarchical data for a geography
 */
function buildByOffering(globalTotals, geoShare, geoVariation = 1.0) {
  const result = {}

  for (const [l1Name, l1Def] of Object.entries(BY_OFFERING)) {
    const l1Share = geoShare * l1Def._share
    const l1Series = makeTimeSeries(globalTotals, l1Share, geoVariation)

    const l1Node = { ...l1Series, _level: 1, _aggregated: true }

    for (const [l2Name, l2Def] of Object.entries(l1Def.children)) {
      const l2Share = l1Share * l2Def._share
      const l2Series = makeTimeSeries(globalTotals, l2Share, geoVariation)

      if (l2Def.children) {
        // Level 2 is an aggregation with leaf children
        const l2Node = { ...l2Series, _level: 2, _aggregated: true }

        for (const [l3Name, l3Share] of Object.entries(l2Def.children)) {
          const l3Series = makeTimeSeries(globalTotals, l2Share * l3Share, geoVariation)
          l2Node[l3Name] = l3Series
        }

        l1Node[l2Name] = l2Node
      } else {
        // Level 2 is a leaf
        l1Node[l2Name] = l2Series
      }
    }

    result[l1Name] = l1Node
  }

  return result
}

/**
 * Build "By Region" hierarchical segment for a REGIONAL geography
 * Structure: { "RegionName": { _level:1, _aggregated:true, ...years, "Country1": {...years}, ... } }
 */
function buildByRegionForRegion(regionName, globalTotals, regionShare, countryShares, regionVariation = 1.0) {
  const regionSeries = makeTimeSeries(globalTotals, regionShare, regionVariation)
  const regionNode = { ...regionSeries, _level: 1, _aggregated: true }
  for (const [country, cShare] of Object.entries(countryShares)) {
    regionNode[country] = makeTimeSeries(globalTotals, regionShare * cShare, regionVariation)
  }
  return { [regionName]: regionNode }
}

/**
 * Build "By Region" for a COUNTRY geography — just the country itself as a flat entry
 */
function buildByRegionForCountry(countryName, globalTotals, countryShare, variation = 1.0) {
  return { [countryName]: makeTimeSeries(globalTotals, countryShare, variation) }
}

/**
 * Build a full geography entry (all segment types)
 */
function buildGeoEntry(globalTotals, geoShare, variation, regionName = null, countryShares = null, countryName = null) {
  const entry = {}

  entry['By Offering'] = buildByOffering(globalTotals, geoShare, variation)
  entry['By Sales Channel'] = buildFlatSegment(globalTotals, geoShare, BY_SALES_CHANNEL, variation)
  entry['By Well Orientation'] = buildFlatSegment(globalTotals, geoShare, BY_WELL_ORIENTATION, variation)
  entry['By Reservoir Type'] = buildFlatSegment(globalTotals, geoShare, BY_RESERVOIR_TYPE, variation)
  entry['By End User'] = buildFlatSegment(globalTotals, geoShare, BY_END_USER, variation)

  if (regionName && countryShares) {
    // Regional geography: hierarchical By Region with all countries
    entry['By Region'] = buildByRegionForRegion(regionName, globalTotals, geoShare, countryShares, variation)
  } else if (countryName) {
    // Country geography: By Region with just this country
    entry['By Region'] = buildByRegionForCountry(countryName, globalTotals, geoShare, variation)
  }

  return entry
}

// ============================================================
// GENERATE DATA
// ============================================================

function generateMarketData(globalTotals) {
  const data = {}

  // Regional geographies
  for (const [region, regionDef] of Object.entries(GEO_HIERARCHY)) {
    const variation = REGION_GROWTH_VARIATION[region]
    // Region entry: pass regionName + countryShares so it gets hierarchical "By Region"
    data[region] = buildGeoEntry(globalTotals, regionDef.share, variation, region, regionDef.countries, null)

    // Country geographies
    for (const [country, cShare] of Object.entries(regionDef.countries)) {
      const countryGeoShare = regionDef.share * cShare
      // Country entry: pass countryName so it gets a flat "By Region" with itself
      data[country] = buildGeoEntry(globalTotals, countryGeoShare, variation, null, null, country)
    }
  }

  return data
}

// ============================================================
// WRITE FILES
// ============================================================

const outputDir = path.join(__dirname, 'public', 'data')

console.log('Generating Hydraulic Fracturing market value data...')
const valueData = generateMarketData(GLOBAL_VALUE)
fs.writeFileSync(
  path.join(outputDir, 'value.json'),
  JSON.stringify(valueData, null, 2)
)
console.log('✓ value.json written')

console.log('Generating Hydraulic Fracturing market volume data...')
const volumeData = generateMarketData(GLOBAL_VOLUME)
fs.writeFileSync(
  path.join(outputDir, 'volume.json'),
  JSON.stringify(volumeData, null, 2)
)
console.log('✓ volume.json written')

// Print summary
const geoCount = Object.keys(valueData).length
const sampleNA = valueData['North America']
const segTypes = Object.keys(sampleNA)
const byRegionKeys = Object.keys(sampleNA['By Region'])
const naRegionChildren = Object.keys(sampleNA['By Region'][byRegionKeys[0]]).filter(k => !['_level','_aggregated'].includes(k) && !/^\d{4}$/.test(k))
console.log(`\nSummary:`)
console.log(`  Geographies: ${geoCount}`)
console.log(`  North America segment types: ${segTypes.join(', ')}`)
console.log(`  United States segment types: ${Object.keys(valueData['United States']).join(', ')}`)
console.log(`  By Region > North America countries: ${naRegionChildren.join(', ')}`)
console.log(`  North America 2026 total (By Offering): USD ${
  Object.entries(sampleNA['By Offering']).reduce((sum, [k, v]) => {
    if (k === 'Products' || k === 'Services') sum += v[2026] || 0
    return sum
  }, 0).toFixed(0)
}M`)
