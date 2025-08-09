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
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

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
      return `${API_BASE_URL}/npl-tables?${queryParams}`;
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
        console.log(`Fetching data from: ${apiEndpoint}`);

        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Handle different response formats
        let fetchedData: TelcoData[] = [];
        
        if (result.data) {
          // Standard loan data response
          fetchedData = result.data;
        } else if (result.npl_data) {
          // NPL data response - transform to match expected format
          fetchedData = result.npl_data.map((item: any) => ({
            date: item.report_date || '',
            telco: 'Airtel', // NPL data is Airtel-specific
            country: 'Zambia',
            loan_type: item.loan_type || '',
            total_balance: item.total_balance || 0,
            within_tenure: item.within_tenure || 0,
            // All arrears buckets for proper NPL calculation
            arrears_30_days: item.arrears_30_days || 0,
            arrears_31_60_days: item.arrears_31_60_days || 0,
            arrears_61_90_days: item.arrears_61_90_days || 0,
            arrears_91_120_days: item.arrears_91_120_days || 0,
            arrears_121_150_days: item.arrears_121_150_days || 0,
            arrears_151_180_days: item.arrears_151_180_days || 0,
            arrears_181_plus_days: item.arrears_181_plus_days || 0,
            arrears_percentage: item.arrears_percentage || 0,
            unrecovered_percentage_net: item.unrecovered_percentage_net || 0,
            net_recovered_value: item.net_recovered_value || 0,
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
  // Use existing NPL endpoint for now until npl-tables endpoint is created
  const { data, loading, error } = useFetchFromAPI(`npl-data`);
  
  // Transform NPL data from specific database tables
  // Data will come from:
  // - airtel_npl_outstanding_balance_net_summary 
  // - airtel_npl_net_recovered_value_summary 
  // - airtel_npl_unrecovered_percentage_summary 
  // - airtel_npl_arrears_volume_summary
  
  const transformedData = {
    loanTypeData: (() => {
      // Use actual database data
      if (data && data.length > 0) {
        console.log('Loan Type Data received:', data); // Debug log
        
        const loanTypes = ['7', '14', '21', '30'];
        
        return loanTypes.map((loanType) => {
          const dbData = data.find(item => 
            item.loan_type === loanType || 
            item.loan_type === `${loanType} Days Loan`
          );
          
          console.log(`Data for ${loanType} Days:`, dbData); // Debug log
          
          if (dbData) {
            const result = {
              name: `${loanType} Days Loan`,
              outstandingBalance: dbData.total_balance || 0,
              totalRecovered: dbData.net_recovered_value || 0,
              unrecoveredPercentage: dbData.unrecovered_percentage_net || 0
            };
            
            console.log(`Transformed data for ${loanType} Days:`, result); // Debug log
            return result;
          }
          
          // Return zero values if loan type not found in database
          return {
            name: `${loanType} Days Loan`,
            outstandingBalance: 0,
            totalRecovered: 0,
            unrecoveredPercentage: 0
          };
        });
      }
      
      // If no data available, return empty structure
      return [
        { name: '7 Days Loan', outstandingBalance: 0, totalRecovered: 0, unrecoveredPercentage: 0 },
        { name: '14 Days Loan', outstandingBalance: 0, totalRecovered: 0, unrecoveredPercentage: 0 },
        { name: '21 Days Loan', outstandingBalance: 0, totalRecovered: 0, unrecoveredPercentage: 0 },
        { name: '30 Days Loan', outstandingBalance: 0, totalRecovered: 0, unrecoveredPercentage: 0 }
      ];
    })(),
    
    arrearsOverTimeData: (() => {
      // Try to use database data if available
      if (data && data.length > 0) {
        console.log('NPL Data received:', data); // Debug log
        
        // Look for Grand Total with more flexible matching
        const grandTotalData = data.find(item => 
          item.loan_type === 'Grand Total' || 
          item.loan_type?.toLowerCase().includes('grand') ||
          item.loan_type?.toLowerCase().includes('total')
        );
        
        console.log('Grand Total data found:', grandTotalData); // Debug log
        
        if (grandTotalData) {
          const arrearsData = [
            { name: 'Within Tenure', amount: grandTotalData.within_tenure || 0 },
            { name: '30 days in arrears', amount: grandTotalData.arrears_30_days || 0 },
            { name: '31-60 days in arrears', amount: grandTotalData.arrears_31_60_days || 0 },
            { name: '61-90 days in arrears', amount: grandTotalData.arrears_61_90_days || 0 },
            { name: '91-120 days in arrears', amount: grandTotalData.arrears_91_120_days || 0 },
            { name: '121-150 days in arrears', amount: grandTotalData.arrears_121_150_days || 0 },
            { name: '151-180 days in arrears', amount: grandTotalData.arrears_151_180_days || 0 },
            { name: '181+ days in arrears', amount: grandTotalData.arrears_181_plus_days || 0 }
          ];
          
          console.log('Arrears data being returned:', arrearsData); // Debug log
          return arrearsData;
        }
        
        // If no Grand Total, try to aggregate from all loan types
        console.log('No Grand Total found, aggregating from individual loan types');
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
      }
      
      // If no database data available, return empty structure
      return [
        { name: 'Within Tenure', amount: 0 },
        { name: '30 days in arrears', amount: 0 },
        { name: '31-60 days in arrears', amount: 0 },
        { name: '61-90 days in arrears', amount: 0 },
        { name: '91-120 days in arrears', amount: 0 },
        { name: '121-150 days in arrears', amount: 0 },
        { name: '151-180 days in arrears', amount: 0 },
        { name: '181+ days in arrears', amount: 0 }
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