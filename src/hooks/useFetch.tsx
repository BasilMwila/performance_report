import { useState, useEffect } from "react";
import Papa from "papaparse";

// Define type for the data we expect
type TelcoData = {
  date: string;
  telco: string;
  country: string;
  qualified_base: number;
  active_base?: number;
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

const useFetch = (filePath: string) => {
  const [data, setData] = useState<TelcoData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Determine if this is the new or old format based on headers
  const isNewFormat = (headers: string[]): boolean => {
    // Check for new columns unique to the new format
    return headers.some(header => 
      header.toLowerCase().includes("unique_users") || 
      header.toLowerCase().includes("setup_fees") ||
      header.toLowerCase().includes("date level aggregation")
    );
  };

  const sanitizeColumns = (rawData: any[], headers: string[]) => {
    const isNew = isNewFormat(headers);
    
    return rawData.map((item: any) => {
      const trimmedItem: any = {};
      
      // First normalize all keys
      Object.keys(item).forEach((key) => {
        const trimmedKey = key.trim().toLowerCase().replace(/(\s|-|_)+/g, '_');
        trimmedItem[trimmedKey] = item[key];
      });

      // Handle value parsing with different strategies based on data format
      if (isNew) {
        // New format mapping
        return {
          // Common fields
          "date": String(trimmedItem.date_level_aggregation || trimmedItem.date || ""),
          "telco": String(trimmedItem.telco || ""),
          "country": String(trimmedItem.country || ""),
          "qualified_base": parseInt(String(trimmedItem.qualified_base || "").replace(/,/g, ""), 10) || 0,
          
          // Fields that exist only in the new format
          "unique_users": parseInt(String(trimmedItem.unique_users || "").replace(/,/g, ""), 10) || 0,
          "overall_unique_users": parseInt(String(trimmedItem.overall_unique_users || "").replace(/,/g, ""), 10) || 0,
          
          // Renamed or modified fields
          "lending_transactions": parseInt(String(trimmedItem.lending_txns || trimmedItem.lending_transactions || "").replace(/,/g, ""), 10) || 0,
          "gross_lent": parseFloat(String(trimmedItem.gross_lent || "").replace(/,/g, "")) || 0,
          "principal_lent": parseFloat(String(trimmedItem.principal_lent || trimmedItem.net_lent || "").replace(/,/g, "")) || 0,
          "service_fee_lent": parseFloat(String(trimmedItem.sfee_lent || trimmedItem.service_fee_lent || "").replace(/,/g, "")) || 0,
          "late_fees_charged": parseFloat(String(trimmedItem.late_fees_charged || "").replace(/,/g, "")) || 0,
          
          // New fee fields
          "setup_fees_charged": parseFloat(String(trimmedItem.setup_fees_charged || "").replace(/,/g, "")) || 0,
          "interest_fees_charged": parseFloat(String(trimmedItem.interest_fees_charged || "").replace(/,/g, "")) || 0,
          
          // Transaction counts
          "recovery_transactions": parseInt(String(trimmedItem.recovery_txns || trimmedItem.recovery_transactions || "").replace(/,/g, ""), 10) || 0,
          
          // Recovery amounts
          "gross_recovered": parseFloat(String(trimmedItem.gross_rec || trimmedItem.gross_recovered || "").replace(/,/g, "")) || 0,
          "principal_recovered": parseFloat(String(trimmedItem.principal_rec || trimmedItem.principal_recovered || "").replace(/,/g, "")) || 0,
          "service_fee_recovered": parseFloat(String(trimmedItem.sfee_rec || trimmedItem.service_fee_recovered || "").replace(/,/g, "")) || 0,
          "late_fees_recovered": parseFloat(String(trimmedItem.late_fees_rec || trimmedItem.late_fees_recovered || "").replace(/,/g, "")) || 0,
          
          // New recovery fee fields
          "setup_fees_recovered": parseFloat(String(trimmedItem.setup_fees_rec || "").replace(/,/g, "")) || 0,
          "interest_fees_recovered": parseFloat(String(trimmedItem.interest_fees_rec || "").replace(/,/g, "")) || 0,
          
          // Exchange rate
          "fx_rate": parseFloat(String(trimmedItem.exchange_rate || trimmedItem.fx_rate || "")) || 0.0
        };
      } else {
        // Original format mapping
        return {
          "date": String(trimmedItem.date || ""),
          "telco": String(trimmedItem.telco_country || "").split(" ")[0] || "",
          "country": String(trimmedItem.telco_country || "").split(" ")[1] || "",
          "qualified_base": parseInt(String(trimmedItem.qualified_base || "").replace(/,/g, ""), 10) || 0,
          "active_base": parseInt(String(trimmedItem.active_base || "").replace(/,/g, ""), 10) || 0,
          "lending_transactions": parseInt(String(trimmedItem.lending_transactions || "").replace(/,/g, ""), 10) || 0,
          "gross_lent": parseInt(String(trimmedItem.gross_lent || "").replace(/,/g, ""), 10) || 0,
          "principal_lent": parseInt(String(trimmedItem.net_lent || "").replace(/,/g, ""), 10) || 0,
          "service_fee_lent": parseInt(String(trimmedItem.service_fee_lent || "").replace(/,/g, ""), 10) || 0,
          "late_fees_charged": parseInt(String(trimmedItem.late_fees_charged || "").replace(/,/g, ""), 10) || 0,
          "recovery_transactions": parseInt(String(trimmedItem.recovery_transactions || "").replace(/,/g, ""), 10) || 0,
          "gross_recovered": parseInt(String(trimmedItem.gross_recovered || "").replace(/,/g, ""), 10) || 0,
          "principal_recovered": parseInt(String(trimmedItem.principal_recovered || "").replace(/,/g, ""), 10) || 0,
          "service_fee_recovered": parseInt(String(trimmedItem.service_fee_recovered || "").replace(/,/g, ""), 10) || 0,
          "late_fees_recovered": parseInt(String(trimmedItem.late_fees_recovered || "").replace(/,/g, ""), 10) || 0,
          "fx_rate": parseFloat(String(trimmedItem.fx_rate || "")) || 0.0,
          
          // Set default values for fields that only exist in the new format
          "unique_users": 0,
          "overall_unique_users": 0,
          "setup_fees_charged": 0,
          "interest_fees_charged": 0,
          "setup_fees_recovered": 0,
          "interest_fees_recovered": 0
        };
      }
    });
  };

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch(filePath);
        const reader = response.body!.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        let csvString = decoder.decode(result.value!);

        // Remove BOM if present and clean the string
        csvString = csvString.replace(/^\uFEFF/, '').replace(/\u0000/g, '');

        Papa.parse(csvString, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          // Try to auto-detect the delimiter instead of forcing tab
          delimitersToGuess: ['\t', ','],
          encoding: "UTF-8",
          complete: (parsedResult) => {
            const { data, meta } = parsedResult;
            const sanitizedData = sanitizeColumns(data, meta.fields || []);
            setData(sanitizedData);
          },
          error: (error) => {
            setError(error.message);
          }
        });
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchCsvData();
  }, [filePath]);

  return { data, error };
};

export default useFetch;