// Utility functions for aggregating loan data across different segments (100, 200, 500 TCL)

export interface AggregatedData {
  date: string;
  // Disbursement totals (sum all segments)
  gross_lent: number;
  principal_lent: number;
  service_fee_lent: number;
  lending_transactions: number;
  
  // Recovery totals (sum all segments)
  gross_recovered: number;
  principal_recovered: number;
  service_fee_recovered: number;
  late_fees_recovered: number;
  setup_fees_recovered: number;
  interest_fees_recovered: number;
  recovery_transactions: number;
  
  // User activity (take max or sum as appropriate)
  unique_users: number;
  overall_unique_users: number;
  qualified_base: number;
  
  // Fees charged
  late_fees_charged: number;
  setup_fees_charged: number;
  interest_fees_charged: number;
  
  count: number;
}

/**
 * Filters data to match business reporting logic
 * Excludes any invalid or test transactions
 */
export const filterValidTransactions = (data: any[]): any[] => {
  return data.filter(item => {
    // Only include Airtel transactions for now (to match business report)
    if (item.telco && item.telco.toLowerCase() !== 'airtel') {
      console.log('🚫 Excluding non-Airtel:', item.telco, item.date, item.gross_lent);
      return false;
    }
    
    // Only include valid loan types (Nano products)
    if (item.loan_type && !item.loan_type.toLowerCase().includes('nano')) {
      console.log('🚫 Excluding non-Nano:', item.loan_type, item.date, item.gross_lent);
      return false;
    }
    
    // Exclude zero or negative amounts (possible reversals/cancellations)
    if ((item.gross_lent || 0) <= 0) {
      console.log('🚫 Excluding zero/negative:', item.gross_lent, item.date);
      return false;
    }
    
    // Only include valid denominations - updated to include all actual denoms from data
    const validDenoms = [100, 200, 300, 400, 500, 750, 1000];
    if (item.denom && !validDenoms.includes(parseInt(item.denom))) {
      console.log('🚫 Excluding invalid denom:', item.denom, item.date, item.gross_lent);
      return false;
    }
    
    // For Aug 6 debugging - log what we're including
    if (item.date === '2025-08-06') {
      console.log('✅ Including Aug 6:', item.loan_type, item.denom, item.telco, item.gross_lent);
    }
    
    return true;
  });
};

/**
 * Aggregates loan data by date, summing all loan amount segments (100, 200, 500 TCL) for each day.
 * This ensures we get daily totals instead of separate records for each loan amount.
 */
export const aggregateDataByDate = (data: any[]): AggregatedData[] => {
  // First filter the data to match business reporting logic
  const filteredData = filterValidTransactions(data);
  const grouped = filteredData.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = {
        date: date,
        // Disbursement totals (sum all segments)
        gross_lent: 0,
        principal_lent: 0,
        service_fee_lent: 0,
        lending_transactions: 0,
        
        // Recovery totals (sum all segments)
        gross_recovered: 0,
        principal_recovered: 0,
        service_fee_recovered: 0,
        late_fees_recovered: 0,
        setup_fees_recovered: 0,
        interest_fees_recovered: 0,
        recovery_transactions: 0,
        
        // User activity (take max or sum as appropriate)
        unique_users: 0,
        overall_unique_users: 0,
        qualified_base: 0,
        
        // Fees charged
        late_fees_charged: 0,
        setup_fees_charged: 0,
        interest_fees_charged: 0,
        
        count: 0
      };
    }
    
    // Sum disbursement amounts across all loan segments for the day
    acc[date].gross_lent += item.gross_lent || 0;
    acc[date].principal_lent += item.principal_lent || 0;
    acc[date].service_fee_lent += item.service_fee_lent || 0;
    acc[date].lending_transactions += item.lending_transactions || 0;
    
    // Sum recovery amounts across all loan segments for the day
    acc[date].gross_recovered += item.gross_recovered || 0;
    acc[date].principal_recovered += item.principal_recovered || 0;
    acc[date].service_fee_recovered += item.service_fee_recovered || 0;
    acc[date].late_fees_recovered += item.late_fees_recovered || 0;
    acc[date].setup_fees_recovered += item.setup_fees_recovered || 0;
    acc[date].interest_fees_recovered += item.interest_fees_recovered || 0;
    acc[date].recovery_transactions += item.recovery_transactions || 0;
    
    // Sum fees charged
    acc[date].late_fees_charged += item.late_fees_charged || 0;
    acc[date].setup_fees_charged += item.setup_fees_charged || 0;
    acc[date].interest_fees_charged += item.interest_fees_charged || 0;
    
    // For user metrics, take the maximum value (not sum, as users aren't additive across segments)
    acc[date].unique_users = Math.max(acc[date].unique_users, item.unique_users || 0);
    acc[date].overall_unique_users = Math.max(acc[date].overall_unique_users, item.overall_unique_users || 0);
    acc[date].qualified_base = Math.max(acc[date].qualified_base, item.qualified_base || 0);
    
    acc[date].count++;
    
    return acc;
  }, {});
  
  return Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculates daily revenue from aggregated data
 */
export const calculateRevenueData = (aggregatedData: AggregatedData[]) => {
  return aggregatedData.map((item) => ({
    Date: item.date,
    Revenue: 
      (item.service_fee_recovered || 0) + 
      (item.late_fees_recovered || 0) + 
      (item.setup_fees_recovered || 0) + 
      (item.interest_fees_recovered || 0),
  }));
};

/**
 * Calculates NPL (Non-Performing Loans) from aggregated data
 */
export const calculateNPLData = (aggregatedData: AggregatedData[]) => {
  return aggregatedData.map((item) => ({
    Date: item.date,
    NPL: (item.gross_lent || 0) - (item.gross_recovered || 0),
  }));
};

/**
 * Formats aggregated data for chart display
 */
export const formatChartData = (aggregatedData: AggregatedData[]) => {
  return aggregatedData.map((item) => ({
    Date: item.date,
    // Disbursement totals (sum of all 100, 200, 500 TCL segments)
    "Gross Lent": item.gross_lent || 0,
    "Principal Lent": item.principal_lent || 0,
    "Service Fee Lent": item.service_fee_lent || 0,
    "Lending Transactions": item.lending_transactions || 0,
    
    // Recovery totals (sum of all segments)
    "Gross Recovered": item.gross_recovered || 0,
    "Principal Recovered": item.principal_recovered || 0,
    "Service Fee Recovered": item.service_fee_recovered || 0,
    "Late Fees Recovered": item.late_fees_recovered || 0,
    "Setup Fees Recovered": item.setup_fees_recovered || 0,
    "Interest Fees Recovered": item.interest_fees_recovered || 0,
    "Recovery Transactions": item.recovery_transactions || 0,
    
    // User activity (max across segments, not additive)
    "Unique_Users": item.unique_users || 0,
    "Overall_Unique_Users": item.overall_unique_users || 0,
    "Qualified_Base": item.qualified_base || 0
  }));
};