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
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    if (originalEndpoint.includes('npl') || originalEndpoint.includes('NPL')) {
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
            arrears_30_days: item.arrears_30_days || 0,
            arrears_181_plus_days: item.arrears_181_plus_days || 0,
            arrears_percentage: item.arrears_percentage || 0,
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
    days: 30,
    ...options
  });
};

// Specific hook for NPL data
export const useFetchNPLData = () => {
  const { data, loading, error } = useFetchFromAPI('npl-data');
  
  // Transform NPL data to match the expected format for the NPL component
  const transformedData = {
    loanTypeData: data.filter(item => item.loan_type !== 'Grand Total').map(item => ({
      name: item.loan_type,
      outstandingBalance: item.total_balance || 0,
      totalRecovered: item.within_tenure || 0, // This might need adjustment based on actual NPL schema
      unrecoveredPercentage: item.arrears_percentage || 0
    })),
    arrearsOverTimeData: data.length > 0 && data[0].loan_type === 'Grand Total' ? [
      { name: 'Within Tenure', amount: data[0].within_tenure || 0 },
      { name: '30 days in arrears', amount: data[0].arrears_30_days || 0 },
      { name: '181+ days in arrears', amount: data[0].arrears_181_plus_days || 0 }
      // Add more buckets as needed based on your NPL schema
    ] : []
  };

  return { 
    loanTypeData: transformedData.loanTypeData,
    arrearsOverTimeData: transformedData.arrearsOverTimeData,
    loading,
    error 
  };
};

export default useFetchFromAPI;