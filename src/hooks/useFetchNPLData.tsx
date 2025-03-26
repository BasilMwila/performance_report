import { useState, useEffect } from "react";
import Papa from "papaparse";

const useFetchNPLData = (filePath: string) => {
  const [loanTypeData, setLoanTypeData] = useState<any[]>([]);
  const [arrearsOverTimeData, setArrearsOverTimeData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sanitizeColumns = (data: any[]) => {
    const loanTypes = [
      { key: '7 Days Loan', column: 'Total Balance', arrearKey: '7 Days Loan' },
      { key: '14 Days Loan', column: 'Total Balance', arrearKey: '14 Days Loan' },
      { key: '21 Days Loan', column: 'Total Balance', arrearKey: '21 Days Loan' },
      { key: '30 Days Loan', column: 'Total Balance', arrearKey: '30 Days Loan' }
    ];

    const arrearsBuckets = [
      { name: 'Within Tenure', column: 'Within Tenure' },
      { name: '30 days in arrears', column: '30 days in arrears' },
      { name: '31-60 days in arrears', column: '31-60 days in arrears' },
      { name: '61-90 days in arrears', column: '61-90 days in arrears' },
      { name: '91-120 days in arrears', column: '91-120 days in arrears' },
      { name: '121-150 days in arrears', column: '121-150 days in arrears' },
      { name: '151-180 days in arrears', column: '151-180 days in arrears' },
      { name: '181+ days in arrears', column: '181+ days in arrears' }
    ];

    const processedLoanTypeData = loanTypes.map(loan => {
      const row = data.find(r => r[''] === loan.arrearKey);
      return row ? {
        name: loan.key,
        outstandingBalance: parseInt(row['Outstanding Balance (Gross)'].replace(/,/g, ''), 10),
        totalRecovered: parseInt(row['Net Recovered Value'].replace(/,/g, ''), 10),
        unrecoveredPercentage: parseFloat(row['Unrecovered % (Net)'].replace('%', ''))
      } : null;
    }).filter(Boolean);

    const processedArrearsData = arrearsBuckets.map(bucket => {
      const row = data.find(r => r[''] === 'Grand Total');
      return row ? {
        name: bucket.name,
        amount: parseInt(row[bucket.column].replace(/,/g, ''), 10)
      } : null;
    }).filter(Boolean);

    return { loanTypeData: processedLoanTypeData, arrearsOverTimeData: processedArrearsData };
  };

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch(filePath);
        const reader = response.body!.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        let csvString = decoder.decode(result.value!);

        // Remove BOM if present
        csvString = csvString.replace(/^\uFEFF/, '');

        Papa.parse<string>(csvString, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (parsedResult) => {
            const { data } = parsedResult;
            const { loanTypeData, arrearsOverTimeData } = sanitizeColumns(data);
            setLoanTypeData(loanTypeData);
            setArrearsOverTimeData(arrearsOverTimeData);
          },
        });
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchCsvData();
  }, [filePath]);

  return { loanTypeData, arrearsOverTimeData, error };
};

export default useFetchNPLData;