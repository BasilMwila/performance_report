// src/hooks/useFetchFromAPI.tsx
import { useState, useEffect } from "react";

// Define type for the data we expect from the API
type TelcoData = {
  date: string;
  telco: string;
  country: string;
  qualified_base: number;
  unique_users?: number;
  overall_unique_users?: number;
  lending_transactions: number;
  gross_lent: number;
  principal_lent: number;
  service_fee_lent: number;
  late_fees_charged: number;
  setup_fees_charged?: number;
  interest_fees_charged?: number;
  recovery_transactions: number;
  gross_recovered: number;
  principal_recovered: number;
  service_fee_recovered: number;
  late_fees_recovered: number;
  setup_fees_recovered?: number;
  interest_fees_recovered?: number;
  fx_rate: number;
  [key: string]: any; // Allow for dynamic properties
};

// Configuration for API base URL
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

interface FetchOptions {
  loanType?: string;
  telco?: string;
  days?: number;
  startDate?: string;
  endDate?: string;
}

const useFetchFromAPI = (endpoint: string, options: FetchOptions = {}) => {
  const [data, setData] = useState<TelcoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Map loan type from route to API format
  const mapLoanTypeFromRoute = (route: string): string | undefined => {
    const routeMapping: { [key: string]: string } = {
      'Day7': '7',
      'Day14': '14', 
      'Day21': '21',
      'Day30': '30',
      'OverallPerf': 'all'
    };
    
    // Extract component name from route if it's a file path
    const componentName = route.split('/').pop()?.replace('.csv', '') || route;
    return routeMapping[componentName];
  };

  // Build query parameters
  const buildQueryParams = (opts: FetchOptions): string => {
    const params = new URLSearchParams();
    
    if (opts.loanType && opts.loanType !== 'all') {
      params.append('loan_type', opts.loanType);
    }
    if (opts.telco) {
      params.append('telco', opts.telco);
    }
    if (opts.days) {
      params.append('days', opts.days.toString());
    }
    if (opts.startDate) {
      params.append('start_date', opts.startDate);
    }
    if (opts.endDate) {
      params.append('end_date', opts.endDate);
    }

    return params.toString();
  };

  // Determine API endpoint based on the original endpoint parameter
  const getApiEndpoint = (originalEndpoint: string, opts: FetchOptions): string => {
    // Handle CSV file mappings to API endpoints
    if (originalEndpoint.includes('DataNew')) {
      const loanType = mapLoanTypeFromRoute(originalEndpoint);
      
      if (loanType && loanType !== 'all') {
        // Use specific loan type endpoint
        const queryParams = buildQueryParams(opts);
        return `${API_BASE_URL}/loan-data/${loanType}?${queryParams}`;
      } else {
        // Use general loan data endpoint
        const queryParams = buildQueryParams(opts);
        return `${API_BASE_URL}/loan-data?${queryParams}`;
      }
    }
    
    // Handle NPL endpoints
    if (originalEndpoint.includes('npl-tables')) {
      // New endpoint for specific NPL database tables
      const queryParams = buildQueryParams(opts);
      return `${API_BASE_URL}/npl-tables${queryParams ? `?${queryParams}` : ''}`;
    } else if (originalEndpoint.includes('npl') || originalEndpoint.includes('NPL')) {
      return `${API_BASE_URL}/npl-data`;
    }
    
    // Default to general loan data
    const queryParams = buildQueryParams(opts);
    return `${API_BASE_URL}/loan-data?${queryParams}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiEndpoint = getApiEndpoint(endpoint, options);
        console.log(`Fetching NPL data from: ${apiEndpoint}`);
        console.log('Request options:', options);

        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Raw API Response:', result);
        
        // Handle different response formats
        let fetchedData: TelcoData[] = [];
        
        if (result.data) {
          // Standard loan data response
          fetchedData = result.data;
          console.log('Using result.data, length:', fetchedData.length);
        } else if (result.npl_data || result.npl_tables_data) {
          // NPL data response - transform to match expected format
          const nplData = result.npl_data || result.npl_tables_data;
          console.log('Using NPL data, length:', nplData.length);
          console.log('First NPL item:', nplData[0]);
          fetchedData = nplData.map((item: any) => ({
            date: item.report_date || '',
            telco: 'Airtel', // NPL data is Airtel-specific
            country: 'Zambia',
            loan_type: item.loan_type || '',
            
            // Map fields based on EXACT database schema from airtel_npl_outstanding_balance_net_summary
            total_balance: item.total_balance || 0,
            
            // Arrears data using the exact column names from your schema
            within_tenure: item.within_tenure || 0,
            arrears_30_days: item.arrears_30_days || 0,
            arrears_31_60_days: item.arrears_31_60_days || 0,
            arrears_61_90_days: item.arrears_61_90_days || 0,
            arrears_91_120_days: item.arrears_91_120_days || 0,
            arrears_121_150_days: item.arrears_121_150_days || 0,
            arrears_151_180_days: item.arrears_151_180_days || 0,
            arrears_181_plus_days: item.arrears_181_plus_days || 0,
            
            arrears_percentage: item.arrears_percentage || 0,
            // These will come from other tables that need to be joined
            unrecovered_percentage_net: item.unrecovered_percentage || item.unrecovered_percentage_net || 0,
            net_recovered_value: item.net_recovered_value || item.recovered_amount || 0,
            // Default values for missing fields
            qualified_base: 0,
            unique_users: 0,
            overall_unique_users: 0,
            lending_transactions: 0,
            gross_lent: 0,
            principal_lent: 0,
            service_fee_lent: 0,
            late_fees_charged: 0,
            setup_fees_charged: 0,
            interest_fees_charged: 0,
            recovery_transactions: 0,
            gross_recovered: 0,
            principal_recovered: 0,
            service_fee_recovered: 0,
            late_fees_recovered: 0,
            setup_fees_recovered: 0,
            interest_fees_recovered: 0,
            fx_rate: 1.0
          }));
        } else {
          // Fallback - use result directly if it's an array
          fetchedData = Array.isArray(result) ? result : [];
          console.log('Using fallback array, length:', fetchedData.length);
          console.log('Result keys:', Object.keys(result));
        }

        setData(fetchedData);
        console.log(`Successfully fetched ${fetchedData.length} records`);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('API fetch error:', errorMessage);
        setError(errorMessage);
        setData([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(options)]); // Include options in dependency array

  return { data, loading, error };
};

// Compatibility hook that mimics the original useFetch interface
export const useFetch = (filePath: string) => {
  // Extract loan type from file path for backward compatibility
  const getLoanTypeFromPath = (path: string): string | undefined => {
    if (path.includes('DataNew7')) return '7';
    if (path.includes('DataNew14')) return '14';
    if (path.includes('DataNew21')) return '21';
    if (path.includes('DataNew30')) return '30';
    if (path.includes('DataNew.csv')) return 'all';
    return undefined;
  };

  const loanType = getLoanTypeFromPath(filePath);
  const options: FetchOptions = {
    loanType,
    telco: 'both', // Default to both telcos
    days: 30 // Default to last 30 days
  };

  const { data, loading, error } = useFetchFromAPI(filePath, options);

  // Return in the same format as the original hook
  return { 
    data, 
    loading, 
    error 
  };
};

// Enhanced hook with more options
export const useFetchLoanData = (options: FetchOptions = {}) => {
  return useFetchFromAPI('loan-data', {
    telco: 'both',
    days: 7, // Default to smaller dataset for better performance
    ...options
  });
};

// Enhanced hook for NPL data with date filtering
export const useFetchNPLData = (options: { startDate?: string; endDate?: string } = {}) => {
  // Build query parameters for date filtering
  const buildNPLQueryParams = (opts: { startDate?: string; endDate?: string }): string => {
    const params = new URLSearchParams();
    
    if (opts.startDate) {
      params.append('start_date', opts.startDate);
    }
    if (opts.endDate) {
      params.append('end_date', opts.endDate);
    }

    return params.toString();
  };

  const queryParams = buildNPLQueryParams(options);
  // Use existing npl-data endpoint
  const { data, loading, error } = useFetchFromAPI(`npl-data${queryParams ? `?${queryParams}` : ''}`);
  
  // Transform NPL data from specific database tables
  // Data will come from:
  // - airtel_npl_outstanding_balance_net_summary 
  // - airtel_npl_net_recovered_value_summary 
  // - airtel_npl_unrecovered_percentage_summary 
  // - airtel_npl_arrears_volume_summary
  
  // Debug: Log all received data and errors
  console.log('=== NPL DATABASE DEBUG START ===');
  console.log('useFetchNPLData - Raw API Response:', { data, loading, error });
  console.log('useFetchNPLData - Data length:', data ? data.length : 'No data');
  
  if (data && data.length > 0) {
    console.log('=== FULL DATABASE STRUCTURE ===');
    data.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, item);
      console.log(`  Available fields:`, Object.keys(item));
      console.log(`  loan_type field:`, item.loan_type);
    });
    console.log('=== END DATABASE STRUCTURE ===');
  }

  const transformedData = {
    loanTypeData: (() => {
      // Add detailed debugging before throwing error
      if (!data || data.length === 0) {
        console.error('NPL Data Error - No data received:', { 
          dataExists: !!data, 
          dataLength: data ? data.length : 'null/undefined',
          loadingState: loading,
          errorState: error 
        });
        // Instead of throwing error, return empty array and let component handle it
        return [];
      }
      
      console.log('NPL Database Data received:', data);
      
      const loanTypes = ['7', '14', '21', '30'];
      
      const loanTypesData = loanTypes.map((loanType) => {
        console.log(`\n=== SEARCHING FOR ${loanType} DAYS LOAN ===`);
        
        const dbData = data.find(item => 
          item.loan_type === loanType || 
          item.loan_type === `${loanType} Days Loan` ||
          item.loan_type === `${loanType}` ||
          (item.loan_type && item.loan_type.toString().includes(loanType))
        );
        
        if (!dbData) {
          console.warn(`❌ Database data missing for ${loanType} Days Loan`);
          console.warn(`Available loan types:`, data.map(item => item.loan_type));
          
          return {
            name: `${loanType} Days Loan`,
            outstandingBalance: 0,
            totalRecovered: 0,
            unrecoveredPercentage: 0
          };
        }
        
        console.log(`✅ Found data for ${loanType} Days Loan:`, dbData);
        console.log(`  Available fields in this record:`, Object.keys(dbData));
        
        // Use exact field mappings from the database schema
        const outstandingBalance = dbData.total_balance || 0;
        // NOTE: total_recovered and unrecovered_percentage are NOT in airtel_npl_outstanding_balance_net_summary
        // These need to come from other tables (airtel_npl_net_recovered_value_summary, airtel_npl_unrecovered_percentage_summary)
        const totalRecovered = dbData.net_recovered_value || dbData.recovered_amount || 0;
        const unrecoveredPercentage = dbData.unrecovered_percentage_net || dbData.unrecovered_percentage || 0;
        
        console.log(`  Field mapping results:`);
        console.log(`    total_balance: ${dbData.total_balance}, outstanding_balance: ${dbData.outstanding_balance} → ${outstandingBalance}`);
        console.log(`    net_recovered_value: ${dbData.net_recovered_value}, recovered_amount: ${dbData.recovered_amount} → ${totalRecovered}`);
        console.log(`    unrecovered_percentage_net: ${dbData.unrecovered_percentage_net}, unrecovered_percentage: ${dbData.unrecovered_percentage} → ${unrecoveredPercentage}`);
        
        return {
          name: `${loanType} Days Loan`,
          outstandingBalance,
          totalRecovered,
          unrecoveredPercentage
        };
      });
      
      // Calculate total balance row from actual data - EXACTLY as in manual calculations
      const totalOutstanding = loanTypesData.reduce((sum, item) => sum + item.outstandingBalance, 0);
      const totalRecovered = loanTypesData.reduce((sum, item) => sum + item.totalRecovered, 0);
      
      // EXACT formula from NPL copy.tsx verification: outstanding / (outstanding + recovered) * 100
      // Expected: 9088782 / (9088782 + 48904082) * 100 = 15.67%
      const totalUnrecoveredPercentage = totalOutstanding > 0 ? 
        ((totalOutstanding / (totalOutstanding + totalRecovered)) * 100) : 0;
      
      console.log('Total Balance Calculation Debug:');
      console.log('  Total Outstanding:', totalOutstanding, '(expected: 9088782)');
      console.log('  Total Recovered:', totalRecovered, '(expected: 48904082)');
      console.log('  Calculated Unrecovered %:', totalUnrecoveredPercentage.toFixed(2), '(expected: 15.67)');
      console.log('  Formula: ', totalOutstanding, '/ (', totalOutstanding, '+', totalRecovered, ') * 100');
      
      loanTypesData.push({
        name: 'Total Balance',
        outstandingBalance: totalOutstanding,
        totalRecovered: totalRecovered,
        unrecoveredPercentage: totalUnrecoveredPercentage
      });
      
      return loanTypesData;
    })(),
    
    arrearsOverTimeData: (() => {
      // Add debugging for arrears data
      if (!data || data.length === 0) {
        console.error('NPL Arrears Data Error - No data received');
        // Return empty array instead of throwing error
        return [];
      }
      
      console.log('\n=== ARREARS DATA TRANSFORMATION DEBUG ===');
      console.log('NPL Arrears Data received:', data);
      
      // Look for Grand Total or aggregate data
      console.log('🔍 Searching for Grand Total record...');
      data.forEach((item, index) => {
        console.log(`  Item ${index + 1} loan_type: "${item.loan_type}"`);
      });
      
      let grandTotalData = data.find(item => 
        item.loan_type === 'Grand Total' || 
        item.loan_type?.toLowerCase().includes('grand') ||
        item.loan_type?.toLowerCase().includes('total') ||
        item.loan_type === 'Total'
      );
      
      console.log('Grand Total search result:', grandTotalData ? '✅ Found' : '❌ Not found');
      
      if (grandTotalData) {
        console.log('✅ Using Grand Total data:', grandTotalData);
        console.log('Available fields in Grand Total:', Object.keys(grandTotalData));
        
        // Use EXACT column names from airtel_npl_outstanding_balance_net_summary schema
        const arrearsMapping = [
          { name: 'Within Tenure', fields: ['within_tenure'] },
          { name: '30 days in arrears', fields: ['arrears_30_days'] },
          { name: '31-60 days in arrears', fields: ['arrears_31_60_days'] },
          { name: '61-90 days in arrears', fields: ['arrears_61_90_days'] },
          { name: '91-120 days in arrears', fields: ['arrears_91_120_days'] },
          { name: '121-150 days in arrears', fields: ['arrears_121_150_days'] },
          { name: '151-180 days in arrears', fields: ['arrears_151_180_days'] },
          { name: '181+ days in arrears', fields: ['arrears_181_plus_days'] }
        ];
        
        const result = arrearsMapping.map(mapping => {
          let amount = 0;
          for (const field of mapping.fields) {
            if (grandTotalData[field]) {
              amount = grandTotalData[field];
              console.log(`  ${mapping.name}: found in field "${field}" = ${amount}`);
              break;
            }
          }
          if (amount === 0) {
            console.log(`  ❌ ${mapping.name}: no data found in fields ${mapping.fields.join(', ')}`);
          }
          return { name: mapping.name, amount };
        });
        
        console.log('Final arrears result from Grand Total:', result);
        return result;
      }
      
      // Aggregate from individual loan types if no total found
      const aggregated = {
        within_tenure: 0,
        arrears_30_days: 0,
        arrears_31_60_days: 0,
        arrears_61_90_days: 0,
        arrears_91_120_days: 0,
        arrears_121_150_days: 0,
        arrears_151_180_days: 0,
        arrears_181_plus_days: 0
      };
      
      data.forEach(item => {
        if (item.loan_type && !item.loan_type.toLowerCase().includes('total')) {
          // Use exact column names from the database schema
          aggregated.within_tenure += item.within_tenure || 0;
          aggregated.arrears_30_days += item.arrears_30_days || 0;
          aggregated.arrears_31_60_days += item.arrears_31_60_days || 0;
          aggregated.arrears_61_90_days += item.arrears_61_90_days || 0;
          aggregated.arrears_91_120_days += item.arrears_91_120_days || 0;
          aggregated.arrears_121_150_days += item.arrears_121_150_days || 0;
          aggregated.arrears_151_180_days += item.arrears_151_180_days || 0;
          aggregated.arrears_181_plus_days += item.arrears_181_plus_days || 0;
        }
      });
      
      // Validate that we have meaningful data
      const totalAmount = Object.values(aggregated).reduce((sum, val) => sum + val, 0);
      if (totalAmount === 0) {
        console.warn('No valid arrears data found in database - all values are zero');
        // Return structure with zeros instead of throwing error
      }
      
      return [
        { name: 'Within Tenure', amount: aggregated.within_tenure },
        { name: '30 days in arrears', amount: aggregated.arrears_30_days },
        { name: '31-60 days in arrears', amount: aggregated.arrears_31_60_days },
        { name: '61-90 days in arrears', amount: aggregated.arrears_61_90_days },
        { name: '91-120 days in arrears', amount: aggregated.arrears_91_120_days },
        { name: '121-150 days in arrears', amount: aggregated.arrears_121_150_days },
        { name: '151-180 days in arrears', amount: aggregated.arrears_151_180_days },
        { name: '181+ days in arrears', amount: aggregated.arrears_181_plus_days }
      ];
    })()
  };

  return { 
    loanTypeData: transformedData.loanTypeData,
    arrearsOverTimeData: transformedData.arrearsOverTimeData,
    loading,
    error 
  };
};

export default useFetchFromAPI;