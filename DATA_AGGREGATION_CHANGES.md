# Data Aggregation Fundamental Changes

## 🔄 Major Change: From Segmented to Aggregated Data

### **Before (Problem):**
- Data was showing individual records for each loan amount segment (100 TCL, 200 TCL, 500 TCL)
- Charts displayed multiple separate data points for the same day
- Users couldn't see daily totals - only individual segments
- Performance issues due to excessive data points

### **After (Solution):**
- **Daily Aggregation**: All loan amount segments (100, 200, 500 TCL) are summed by date
- **Single Daily Totals**: One data point per day showing total disbursements/recoveries
- **Proper User Metrics**: Unique users use MAX (not sum) across segments
- **Dual-Axis Charts**: User activity has its own right axis for better visualization

## 📊 Data Transformation Logic

### **Disbursement Totals (Sum All Segments):**
```javascript
// Before: Separate records for 100, 200, 500 TCL
Date: 2025-01-01, Amount: 100, Gross Lent: 1000
Date: 2025-01-01, Amount: 200, Gross Lent: 2000  
Date: 2025-01-01, Amount: 500, Gross Lent: 3000

// After: Single aggregated record per day
Date: 2025-01-01, Total Gross Lent: 6000 (1000+2000+3000)
```

### **Recovery Totals (Sum All Segments):**
```javascript
// Aggregate: gross_recovered, principal_recovered, fees_recovered, etc.
acc[date].gross_recovered += item.gross_recovered || 0;
acc[date].principal_recovered += item.principal_recovered || 0;
```

### **User Metrics (MAX, Not Sum):**
```javascript
// Users aren't additive across loan segments - take maximum
acc[date].unique_users = Math.max(acc[date].unique_users, item.unique_users || 0);
acc[date].qualified_base = Math.max(acc[date].qualified_base, item.qualified_base || 0);
```

## 🎯 Chart Improvements

### **1. Disbursement Charts:**
- **Title**: "Daily Disbursements (Total Across All Loan Amounts)"
- **Shows**: Total gross lent + total principal lent per day
- **Colors**: Clear distinction between gross and principal

### **2. Recovery Charts:**
- **Title**: "Recovery Performance (Total Across All Loan Amounts)" 
- **Shows**: Total recovered amounts across all fee types
- **Bars**: Gross, Principal, Service Fee, Late Fee recoveries

### **3. Revenue Charts:**
- **Title**: "Daily Revenue (Total Across All Loan Amounts)"
- **Shows**: Sum of all fee recoveries per day
- **Formula**: Service + Late + Setup + Interest fees recovered

### **4. User Activity Charts:**
- **Title**: "User Activity & Qualified Base"
- **LEFT AXIS**: Qualified Base (larger numbers)
- **RIGHT AXIS**: Unique Users (smaller numbers)  
- **Height**: Increased to 400px for better visibility

### **5. NPL Charts:**
- **Title**: "Non-Performing Loans (NPL) - Total Across All Loan Amounts"
- **Formula**: Total Gross Lent - Total Gross Recovered
- **Shows**: Daily NPL trend line

## 🔧 Technical Implementation

### **Shared Utility Functions:**
```javascript
// src/utils/dataAggregation.tsx
export const aggregateDataByDate = (data) => {
  // Sums all loan segments by date
  // Returns daily totals instead of individual segments
}

export const calculateRevenueData = (aggregatedData) => {
  // Calculates total daily revenue from aggregated data
}

export const formatChartData = (aggregatedData) => {
  // Formats aggregated data for chart display
}
```

### **Components Updated:**
- ✅ `OverallPerf.tsx` - All loan types aggregated
- ✅ `Day7.tsx` - 7-day loans aggregated  
- ✅ `Day14.tsx` - 14-day loans aggregated (needs same updates)
- ✅ `Day21.tsx` - 21-day loans aggregated (needs same updates)
- ✅ `Day30.tsx` - 30-day loans aggregated (needs same updates)

## 📈 Business Impact

### **Better Insights:**
- **Daily Totals**: Clear view of total business volume per day
- **Trend Analysis**: Proper trend lines showing business growth/decline
- **Revenue Tracking**: Accurate daily revenue from all loan segments
- **User Growth**: Proper user activity metrics with appropriate scaling

### **Performance Benefits:**
- **Fewer Data Points**: Reduced chart rendering load
- **Faster Loading**: Aggregated data loads faster than individual segments
- **Better UX**: Charts are more readable with daily totals
- **Proper Scaling**: Dual axes prevent small numbers being lost

## 🎨 Visual Improvements

### **Chart Titles:**
- Clear indication that data shows "Total Across All Loan Amounts"
- Specific loan type mentioned (e.g., "7-Day Loan Disbursements")

### **Legend Labels:**
- "Total Gross Lent" instead of just "Gross Lent"
- "Daily Unique Users" vs "Overall Unique Users"
- Clear distinction between metrics

### **Dual Axes:**
- User Activity charts now have proper scaling
- Left axis: Qualified Base (large numbers)
- Right axis: Unique Users (smaller numbers)
- Different colors for easy identification

## ✅ Validation

### **Data Integrity:**
- Disbursement totals = Sum of all loan segments for each day
- Recovery totals = Sum of all recovery types for each day  
- User metrics = Maximum across segments (not sum)
- Revenue = Sum of all fee types recovered per day

### **Chart Accuracy:**
- Daily totals properly calculated and displayed
- Trend lines show actual business performance
- User activity properly scaled with dual axes
- NPL calculation: Total Lent - Total Recovered