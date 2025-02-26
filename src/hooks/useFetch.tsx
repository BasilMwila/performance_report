import { useState, useEffect } from "react";
import Papa from "papaparse";

const useFetch = (filePath: string) => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sanitizeColumns = (data: any) => {
    return data.map((item: any) => {
      const trimmedItem: any = {};
      
      Object.keys(item).forEach((key) => {
        const trimmedKey = key.trim().toLowerCase().replace(/(\s|-)+/g, '_');
        trimmedItem[trimmedKey] = item[key];
      });

      return {
        "Date": String(trimmedItem.date || ""),
        "Telco Country": String(trimmedItem.telco_country || ""),
        "Qualified Base": parseInt(String(trimmedItem.qualified_base || "").replace(/,/g, ""), 10) || 0,
        "Active Base": parseInt(String(trimmedItem.active_base || "").replace(/,/g, ""), 10) || 0,
        "Lending Transactions": parseInt(String(trimmedItem.lending_transactions || "").replace(/,/g, ""), 10) || 0,
        "Gross Lent": parseInt(String(trimmedItem.gross_lent || "").replace(/,/g, ""), 10) || 0,
        "Net Lent": parseInt(String(trimmedItem.net_lent || "").replace(/,/g, ""), 10) || 0,
        "Service Fee Lent": parseInt(String(trimmedItem.service_fee_lent || "").replace(/,/g, ""), 10) || 0,
        "Late Fees Charged": parseInt(String(trimmedItem.late_fees_charged || "").replace(/,/g, ""), 10) || 0,
        "Recovery Transactions": parseInt(String(trimmedItem.recovery_transactions || "").replace(/,/g, ""), 10) || 0,
        "Gross Recovered": parseInt(String(trimmedItem.gross_recovered || "").replace(/,/g, ""), 10) || 0,
        "Principal Recovered": parseInt(String(trimmedItem.principal_recovered || "").replace(/,/g, ""), 10) || 0,
        "Service Fee Recovered": parseInt(String(trimmedItem.service_fee_recovered || "").replace(/,/g, ""), 10) || 0,
        "Late Fees Recovered": parseInt(String(trimmedItem.late_fees_recovered || "").replace(/,/g, ""), 10) || 0,
        "FX Rate": parseFloat(String(trimmedItem.fx_rate || "")) || 0.0
      };
    });
  };

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch(filePath);
        const reader = response.body!.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-16');
        let csvString = decoder.decode(result.value!);

        // Remove BOM if present
        csvString = csvString.replace(/^\uFEFF/, '').replace(/\u0000/g, '');

        Papa.parse<string>(csvString, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          delimiter: '\t',
          encoding: "UTF-16",
          complete: (parsedResult) => {
            const { data } = parsedResult;
            const sanitizedData = sanitizeColumns(data);
            setData(sanitizedData);
          },
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
