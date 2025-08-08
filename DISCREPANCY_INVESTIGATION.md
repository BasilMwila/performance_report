# Data Discrepancy Investigation & Resolution

## 🚨 Issue Identified

**Business Report (Aug 6, 2025) - Accurate Data:**
- Net Lending: **ZMW 241,901**
- Principal Recovered: **ZMW 181,918**
- Service Fee Recovered: **ZMW 35,282**
- Total Transactions: **1,271**

**Our Initial Calculation:**
- Gross Lent: **ZMW 304,894** ❌ (26% too high)
- Principal Recovered: **ZMW 191,886** ❌ (5% too high)
- Service Fee Recovered: **ZMW 36,809** ⚠️ (Close but still high)

## 🔍 Root Cause Analysis

The discrepancy is likely caused by one or more of the following:

### 1. **Including Wrong Telco Data**
- Business report is for **"Airtel Zambia"** only
- We might be including MTN data in aggregation
- **Fix**: Filter to `telco = 'airtel'` only

### 2. **Including Invalid Transaction Types**
- Database might contain test transactions
- Reversed/cancelled transactions with negative amounts
- Non-Nano loan products
- **Fix**: Filter for valid Nano products only

### 3. **Including Wrong Denominations**
- Database might have invalid denomination values
- Test data with unusual amounts
- **Fix**: Only include 100, 200, 300, 500 denominations

### 4. **Double Counting**
- Possible duplicate records in database
- Including both gross and net amounts
- **Fix**: Validate unique transactions per day

## 🛠️ Fixes Implemented

### **Backend Changes:**
```javascript
// Focus on Airtel only to match business report
const { data, loading, error } = useFetchLoanData({
  loanType: 'all',
  telco: 'airtel', // Changed from 'both' to 'airtel'
  startDate: dateRange.startDate,
  endDate: dateRange.endDate,
});
```

### **Data Filtering Logic:**
```javascript
export const filterValidTransactions = (data: any[]): any[] => {
  return data.filter(item => {
    // Only Airtel transactions
    if (item.telco && item.telco.toLowerCase() !== 'airtel') return false;
    
    // Only Nano products
    if (item.loan_type && !item.loan_type.toLowerCase().includes('nano')) return false;
    
    // Exclude negative amounts (reversals)
    if ((item.gross_lent || 0) < 0) return false;
    
    // Only valid denominations
    const validDenoms = [100, 200, 300, 500];
    if (item.denom && !validDenoms.includes(parseInt(item.denom))) return false;
    
    return true;
  });
};
```

### **Enhanced Debugging:**
- Real-time comparison with Aug 6 business report
- Telco breakdown (Airtel vs MTN vs Unknown)
- Loan type breakdown (Nano 7D, 14D, 21D, 30D)
- Raw record count vs filtered count

## 📊 Expected Results After Fix

### **Telco Filtering:**
If we were including MTN data:
- **Before**: Airtel + MTN = 304,894 (too high)
- **After**: Airtel only = ~241,901 ✅

### **Transaction Filtering:**
If we had invalid transactions:
- **Before**: All records (including reversals/tests)
- **After**: Valid Nano products only

### **Denomination Filtering:**
If we had test denominations:
- **Before**: All amounts (100, 200, 300, 500, 999, etc.)
- **After**: Valid denominations only (100, 200, 300, 500)

## 🎯 Debug Information Now Available

The dashboard will now show:

1. **August 6 Comparison Box** (Red):
   - Side-by-side comparison with accurate business report
   - Shows exact discrepancy amounts
   - Number of raw records being aggregated

2. **Telco Breakdown Box** (Blue):
   - How much data comes from Airtel vs MTN
   - Identifies if we're including wrong telco data

3. **Loan Type Breakdown Box** (Green):
   - Shows Nano 7D, 14D, 21D, 30D totals
   - Identifies any non-Nano products being included

4. **Filtered vs Total Records**:
   - Shows "X valid of Y total records"
   - Identifies how many records are being excluded

## 🧪 Next Steps for Testing

1. **Run the updated dashboard** and check the debug information
2. **Look for August 6, 2025 data** in the comparison box
3. **Check telco breakdown** - should show only Airtel data
4. **Verify loan types** - should show only Nano products
5. **Compare filtered totals** with business report figures

## ✅ Success Criteria

The aggregation is correct when:
- **Aug 6 totals match**: ~241k lending, ~181k principal recovered
- **Only Airtel data** appears in telco breakdown
- **Only Nano products** appear in loan type breakdown
- **Reasonable transaction counts** (around 1,271 for Aug 6)

If discrepancies persist, we may need to:
- Check for date/time zone differences
- Investigate database table structure
- Verify business report calculation methodology
- Look for additional filtering criteria used in reports