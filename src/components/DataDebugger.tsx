import React from 'react';

interface DataDebuggerProps {
  data: any[];
  aggregatedData: any[];
  title: string;
  knownAccurateData?: {
    date: string;
    netLending: number;
    principalRecovered: number;
    serviceFeeRecovered: number;
  };
}

const DataDebugger: React.FC<DataDebuggerProps> = ({ data, aggregatedData, title, knownAccurateData }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  // Show sample raw data and aggregated results
  const sampleRawData = data.slice(0, 5);
  const sampleAggregated = aggregatedData.slice(0, 3);
  
  // Find Aug 6 data for comparison if available
  const aug6Data = aggregatedData.find(item => item.date === '2025-08-06');
  const aug6RawData = data.filter(item => item.date === '2025-08-06');
  
  // Detailed breakdown of Aug 6 data to identify discrepancies
  const aug6DetailedBreakdown = aug6RawData.reduce((acc, item) => {
    const key = `${item.loan_type}-${item.denom}-${item.telco}`;
    if (!acc[key]) {
      acc[key] = { count: 0, gross_lent: 0, principal_recovered: 0 };
    }
    acc[key].count++;
    acc[key].gross_lent += item.gross_lent || 0;
    acc[key].principal_recovered += item.principal_recovered || 0;
    return acc;
  }, {});
  
  // Calculate total from raw data to verify aggregation
  const aug6RawTotals = aug6RawData.reduce((acc, item) => {
    acc.gross_lent += item.gross_lent || 0;
    acc.principal_recovered += item.principal_recovered || 0;
    acc.service_fee_recovered += item.service_fee_recovered || 0;
    acc.late_fees_recovered += item.late_fees_recovered || 0;
    acc.lending_transactions += item.lending_transactions || 0;
    acc.recovery_transactions += item.recovery_transactions || 0;
    return acc;
  }, {
    gross_lent: 0,
    principal_recovered: 0,
    service_fee_recovered: 0,
    late_fees_recovered: 0,
    lending_transactions: 0,
    recovery_transactions: 0
  });
  
  // Analyze data by telco and loan type
  const telcoBreakdown = data.reduce((acc, item) => {
    const key = `${item.telco || 'Unknown'}`;
    if (!acc[key]) acc[key] = { count: 0, gross_lent: 0, principal_recovered: 0, service_fee_recovered: 0 };
    acc[key].count++;
    acc[key].gross_lent += item.gross_lent || 0;
    acc[key].principal_recovered += item.principal_recovered || 0;
    acc[key].service_fee_recovered += item.service_fee_recovered || 0;
    return acc;
  }, {});
  
  const loanTypeBreakdown = data.reduce((acc, item) => {
    const key = `${item.loan_type || 'Unknown'}`;
    if (!acc[key]) acc[key] = { count: 0, gross_lent: 0 };
    acc[key].count++;
    acc[key].gross_lent += item.gross_lent || 0;
    return acc;
  }, {});

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg text-xs border">
      <h4 className="font-semibold text-gray-800 mb-2">🔍 Debug: {title}</h4>
      
      {/* August 6 Comparison */}
      {aug6Data && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <h5 className="font-semibold text-red-800 mb-2">⚠️ August 6, 2025 - Data Comparison</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h6 className="font-medium text-red-700">Accurate Business Report (Aug 6):</h6>
              <div>Qualified Base: <strong>633,933</strong></div>
              <div>Unique Users: <strong>1,264</strong></div>
              <div>Lending Txns: <strong>1,271</strong></div>
              <div>Gross Lent: <strong>ZMW 288,920.22</strong></div>
              <div>Principal Lent: <strong>ZMW 241,901.00</strong></div>
              <div>Service Fee Lent: <strong>ZMW 47,019.22</strong></div>
              <div>Recovery Txns: <strong>1,114</strong></div>
              <div>Gross Recovered: <strong>ZMW 220,258.98</strong></div>
              <div>Principal Recovered: <strong>ZMW 181,897.21</strong></div>
              <div>Service Fee Recovered: <strong>ZMW 35,278.40</strong></div>
              <div>Late Fees Recovered: <strong>ZMW 3,083.37</strong></div>
            </div>
            <div>
              <h6 className="font-medium text-red-700">Our Calculation:</h6>
              <div>Qualified Base: <strong>{aug6Data.qualified_base?.toLocaleString()}</strong></div>
              <div>Unique Users: <strong>{aug6Data.unique_users?.toLocaleString()}</strong></div>
              <div>Lending Txns: <strong>{aug6Data.lending_transactions?.toLocaleString()}</strong></div>
              <div>Gross Lent: <strong>ZMW {aug6Data.gross_lent?.toLocaleString()}</strong></div>
              <div>Principal Lent: <strong>ZMW {aug6Data.principal_lent?.toLocaleString()}</strong></div>
              <div>Service Fee Lent: <strong>ZMW {aug6Data.service_fee_lent?.toLocaleString()}</strong></div>
              <div>Recovery Txns: <strong>{aug6Data.recovery_transactions?.toLocaleString()}</strong></div>
              <div>Gross Recovered: <strong>ZMW {aug6Data.gross_recovered?.toLocaleString()}</strong></div>
              <div>Principal Recovered: <strong>ZMW {aug6Data.principal_recovered?.toLocaleString()}</strong></div>
              <div>Service Fee Recovered: <strong>ZMW {aug6Data.service_fee_recovered?.toLocaleString()}</strong></div>
              <div>Late Fees Recovered: <strong>ZMW {aug6Data.late_fees_recovered?.toLocaleString()}</strong></div>
              <div>Raw Records: <strong>{aug6RawData.length} segments</strong></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Detailed Aug 6 Breakdown */}
      {aug6RawData.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h5 className="font-semibold text-yellow-800 mb-2">🔬 August 6 Detailed Breakdown ({aug6RawData.length} records)</h5>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h6 className="font-medium text-yellow-700 mb-2">Raw Data Totals (Before Aggregation):</h6>
              <div className="text-sm">
                <div>Gross Lent: <strong className="text-red-600">ZMW {aug6RawTotals.gross_lent.toLocaleString()}</strong> (Should be 288,920.22)</div>
                <div>Principal Recovered: <strong>ZMW {aug6RawTotals.principal_recovered.toLocaleString()}</strong> (Should be 181,897.21)</div>
                <div>Service Fee Recovered: <strong>ZMW {aug6RawTotals.service_fee_recovered.toLocaleString()}</strong> (Should be 35,278.40)</div>
                <div>Late Fees Recovered: <strong>ZMW {aug6RawTotals.late_fees_recovered.toLocaleString()}</strong> (Should be 3,083.37)</div>
                <div>Lending Txns: <strong>{aug6RawTotals.lending_transactions.toLocaleString()}</strong> (Should be 1,271)</div>
                <div>Recovery Txns: <strong>{aug6RawTotals.recovery_transactions.toLocaleString()}</strong> (Should be 1,114)</div>
              </div>
            </div>
            <div>
              <h6 className="font-medium text-yellow-700 mb-2">By Loan Type & Denomination:</h6>
              <div className="max-h-32 overflow-auto text-xs">
                {Object.entries(aug6DetailedBreakdown).map(([key, data]: [string, any]) => (
                  <div key={key} className="border-b py-1">
                    <strong>{key}</strong>: {data.count} records, 
                    Gross: {data.gross_lent.toLocaleString()}, 
                    Principal Rec: {data.principal_recovered.toLocaleString()}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-yellow-700">
            <strong>🔍 Investigation:</strong> If gross_lent total is {aug6RawTotals.gross_lent.toLocaleString()} instead of 288,920, 
            we have <strong className="text-red-600">{(aug6RawTotals.gross_lent - 288920.22).toLocaleString()}</strong> extra that shouldn't be included.
          </div>
        </div>
      )}
      
      {/* Telco Breakdown */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <h5 className="font-semibold text-blue-800 mb-2">📊 Data by Telco</h5>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(telcoBreakdown).map(([telco, data]: [string, any]) => (
            <div key={telco}>
              <strong>{telco}:</strong> {data.count} records, 
              Gross: {data.gross_lent?.toLocaleString()}, 
              Principal: {data.principal_recovered?.toLocaleString()}
            </div>
          ))}
        </div>
      </div>
      
      {/* Loan Type Breakdown */}
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
        <h5 className="font-semibold text-green-800 mb-2">🏦 Data by Loan Type</h5>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(loanTypeBreakdown).map(([loanType, data]: [string, any]) => (
            <div key={loanType}>
              <strong>{loanType}:</strong> {data.count} records, 
              Gross: {data.gross_lent?.toLocaleString()}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h5 className="font-medium text-gray-700 mb-1">Raw Data Sample ({data.length} total records)</h5>
          <div className="bg-white p-2 rounded max-h-32 overflow-auto">
            {sampleRawData.map((item, idx) => (
              <div key={idx} className="mb-2 pb-2 border-b">
                <div><strong>Date:</strong> {item.date}</div>
                <div><strong>Telco:</strong> {item.telco}</div>
                <div><strong>Loan Type:</strong> {item.loan_type}</div>
                <div><strong>Denom:</strong> {item.denom}</div>
                <div><strong>Gross Lent:</strong> {item.gross_lent?.toLocaleString()}</div>
                <div><strong>Principal Recovered:</strong> {item.principal_recovered?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-medium text-gray-700 mb-1">Aggregated Data ({aggregatedData.length} daily totals)</h5>
          <div className="bg-white p-2 rounded max-h-32 overflow-auto">
            {sampleAggregated.map((item, idx) => (
              <div key={idx} className="mb-2 pb-2 border-b">
                <div><strong>Date:</strong> {item.date}</div>
                <div><strong>Total Gross Lent:</strong> {item.gross_lent?.toLocaleString()}</div>
                <div><strong>Total Principal Recovered:</strong> {item.principal_recovered?.toLocaleString()}</div>
                <div><strong>Total Service Fee Recovered:</strong> {item.service_fee_recovered?.toLocaleString()}</div>
                <div><strong>Segments Count:</strong> {item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 text-gray-600">
        <strong>Investigation:</strong> Check if we're including MTN data, wrong loan types, or duplicate records.
      </div>
    </div>
  );
};

export default DataDebugger;