# Exact Field Mapping - August 6, 2025 Data

## 🎯 Accurate Business Data (Ground Truth)

Based on your complete August 6, 2025 data:

| Field | Accurate Value | Description |
|-------|----------------|-------------|
| **Qualified Base** | 633,933 | Total eligible users |
| **Unique Users** | 1,264 | Daily active users |
| **Overall Unique Users** | 1,263 | Cumulative unique users |
| **Lending Txns** | 1,271 | Total lending transactions |
| **Gross Lent** | 288,920.22 | Total amount including fees |
| **Principal Lent** | 241,901.00 | Actual loan amount to customers |
| **Service Fee Lent** | 47,019.22 | Service fees charged |
| **Recovery Txns** | 1,114 | Total recovery transactions |
| **Gross Recovered** | 220,258.98 | Total amount recovered |
| **Principal Recovered** | 181,897.21 | Principal amount recovered |
| **Service Fee Recovered** | 35,278.40 | Service fees recovered |
| **Late Fees Recovered** | 3,083.37 | Late fees recovered |

## 🔧 Key Field Mapping Corrections

### **1. Principal vs Gross Distinction**
```javascript
// WRONG - Using same field for both
principal_lent: parseFloat(row.gross_lent) || 0, // This was wrong!

// CORRECT - Use separate fields
gross_lent: parseFloat(row.gross_lent) || 0,      // 288,920.22 (includes fees)
principal_lent: parseFloat(row.principal_lent) || 0, // 241,901.00 (loan only)
```

**Why this matters:**
- **Gross Lent**: Total disbursed amount including all fees (288k)
- **Principal Lent**: Actual loan amount given to customers (241k) 
- **Difference**: Service fees and other charges (47k)

### **2. Recovery Amount Breakdown**
```javascript
// Correct recovery calculation
gross_recovered: (parseFloat(row.principal_recovered) || 0) +    // 181,897.21
                (parseFloat(row.sfee_recovered) || 0) +          // 35,278.40  
                (parseFloat(row.late_fees_recovered) || 0) +     // 3,083.37
                // Total should equal 220,258.98
```

### **3. Transaction Count Validation**
```javascript
// Should match exactly
lending_transactions: 1,271 // Total lending transactions
recovery_transactions: 1,114 // Total recovery transactions
```

## 📊 Expected Dashboard Results

With correct field mapping, the dashboard should show:

### **August 6 Daily Totals:**
- **Daily Disbursements Chart**: 288,920 ZMW (Gross) + 241,901 ZMW (Principal)
- **Recovery Performance Chart**: 220,259 ZMW total, broken down by type
- **Daily Revenue Chart**: 35,278 ZMW (service fees) + 3,083 ZMW (late fees)
- **User Activity Chart**: 1,264 unique users, 633,933 qualified base

### **Transaction Metrics:**
- **Lending Volume**: 1,271 transactions
- **Recovery Volume**: 1,114 transactions  
- **Success Rate**: ~87.6% recovery rate by transaction count

## ✅ Validation Checklist

The dashboard is correctly configured when:

1. **✅ August 6 Comparison Shows**:
   - Gross Lent: 288,920.22 (matches exactly)
   - Principal Lent: 241,901.00 (matches exactly) 
   - Principal Recovered: 181,897.21 (matches exactly)
   - Service Fee Recovered: 35,278.40 (matches exactly)

2. **✅ Charts Display Realistic Amounts**:
   - No more millions (304k was too high)
   - Proper separation of gross vs principal
   - Accurate fee breakdowns

3. **✅ Transaction Counts Make Sense**:
   - ~1,271 lending transactions per day (reasonable)
   - ~1,114 recovery transactions per day (reasonable)
   - User counts in thousands, not millions

4. **✅ Data Source Validation**:
   - Only Airtel Zambia data included
   - Only Nano loan products included
   - Valid denominations only (100, 200, 300, 500)

## 🚨 Red Flags to Watch For

If you still see discrepancies, check for:

1. **Database Schema Issues**:
   - Missing `principal_lent` column (fallback to calculation)
   - Different field names than expected
   - Data type mismatches

2. **Date/Time Zone Issues**:
   - August 6 data might be split across dates
   - UTC vs local time differences
   - Business day vs calendar day differences

3. **Business Logic Differences**:
   - Manual adjustments in business reports
   - Exclusions not captured in our filters
   - Different calculation methodologies

The debug panel will show exact comparisons to help identify any remaining issues.