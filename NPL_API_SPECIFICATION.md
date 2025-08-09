# NPL Tables API Endpoint Specification

## Endpoint: `/api/npl-tables`

### Purpose
Fetch data directly from specific NPL database tables to display accurate NPL metrics with date filtering.

### Database Tables to Query
1. `airtel_npl_outstanding_balance_net_summary`
2. `airtel_npl_net_recovered_value_summary` 
3. `airtel_npl_unrecovered_percentage_summary`
4. `airtel_npl_arrears_volume_summary`

### Query Parameters
- `start_date` (optional): Start date for filtering (YYYY-MM-DD format)
- `end_date` (optional): End date for filtering (YYYY-MM-DD format)

### Expected SQL Queries

Based on your actual database data, you need to join multiple tables:

```sql
-- Join arrears volume with net recovered value to get complete data
SELECT 
    a.loan_type,
    a.total_balance,           -- Outstanding balance from arrears table
    a.within_tenure,           -- Current performing loans
    a.arrears_30_days,         -- Arrears buckets
    a.arrears_31_60_days,
    a.arrears_61_90_days,
    a.arrears_91_120_days,
    a.arrears_121_150_days,
    a.arrears_151_180_days,
    a.arrears_181_plus_days,
    r.net_recovered_value,     -- IMPORTANT: Net recovered from recovery table (e.g., 23,157,706 for 30 Days)
    u.unrecovered_percentage_net, -- Direct percentage if available
    a.report_date
FROM airtel_npl_arrears_volume_summary a
LEFT JOIN airtel_npl_net_recovered_value_summary r 
    ON a.loan_type = r.loan_type AND a.report_date = r.report_date
LEFT JOIN airtel_npl_unrecovered_percentage_summary u 
    ON a.loan_type = u.loan_type AND a.report_date = u.report_date
WHERE a.report_date BETWEEN ? AND ?
ORDER BY a.report_date DESC, a.loan_type;
```

### Key Field Corrections:
- **Outstanding Balance**: `total_balance` from arrears table
- **Net Recovered**: `net_recovered_value` from recovery table (**NOT** `within_tenure`)
- **Within Tenure**: Current performing loans (part of outstanding, not total recovered)
- **Total Recovered**: Should be `net_recovered_value` (e.g., 23,157,706 for 30 Days)
```

### Actual Database Schema Mapping
Based on your provided data (2025-08-07):

| loan_type    | total_balance | within_tenure | arrears_30_days | arrears_31_60_days | arrears_61_90_days | arrears_91_120_days | arrears_121_150_days | arrears_151_180_days | arrears_181_plus_days |
|-------------|---------------|---------------|-----------------|-------------------|-------------------|-------------------|---------------------|---------------------|---------------------|
| 7 Days Loan | 783,496.00    | 199,834.00    | 195,392.00      | 24,436.00         | 15,837.00         | 20,787.00         | 0                   | 0                   | 0                   |
| 14 Days Loan| 2,104,129.00  | 749,742.00    | 536,064.00      | 110,301.00        | 61,647.00         | 74,204.00         | 87,554.00           | 0                   | 0                   |
| 21 Days Loan| 690,414.00    | 294,942.00    | 83,465.00       | 31,293.00         | 10,804.00         | 5,930.00          | 14,132.00           | 20,444.00           | 229,404.00          |
| 30 Days Loan| 5,438,241.00  | 2,940,895.00  | 567,076.00      | 211,360.00        | 135,879.00        | 104,121.00        | 104,593.00          | 138,915.00          | 1,235,402.00        |
| Grand Total | 9,016,280.00  | 4,185,413.00  | 1,381,997.00    | 377,390.00        | 224,167.00        | 205,042.00        | 206,279.00          | 159,359.00          | 1,464,806.00        |
```

### Expected Response Format

```json
{
  "success": true,
  "data": [
    {
      "loan_type": "7 Days Loan",
      "total_balance": 783496.00,
      "within_tenure": 199834.00,
      "arrears_30_days": 195392.00,
      "arrears_31_60_days": 24436.00,
      "arrears_61_90_days": 15837.00,
      "arrears_91_120_days": 20787.00,
      "arrears_121_150_days": 0,
      "arrears_151_180_days": 0,
      "arrears_181_plus_days": 0,
      "report_date": "2025-08-07"
    },
    {
      "loan_type": "14 Days Loan",
      "total_balance": 2104129.00,
      "within_tenure": 749742.00,
      "arrears_30_days": 536064.00,
      "arrears_31_60_days": 110301.00,
      "arrears_61_90_days": 61647.00,
      "arrears_91_120_days": 74204.00,
      "arrears_121_150_days": 87554.00,
      "arrears_151_180_days": 0,
      "arrears_181_plus_days": 0,
      "report_date": "2025-08-07"
    },
    {
      "loan_type": "21 Days Loan", 
      "total_balance": 690414.00,
      "within_tenure": 294942.00,
      "arrears_30_days": 83465.00,
      "arrears_31_60_days": 31293.00,
      "arrears_61_90_days": 10804.00,
      "arrears_91_120_days": 5930.00,
      "arrears_121_150_days": 14132.00,
      "arrears_151_180_days": 20444.00,
      "arrears_181_plus_days": 229404.00,
      "report_date": "2025-08-07"
    },
    {
      "loan_type": "30 Days Loan",
      "total_balance": 5438241.00,
      "within_tenure": 2940895.00,
      "net_recovered_value": 23157706.00,  // CORRECTED: Actual net recovered value
      "arrears_30_days": 567076.00,
      "arrears_31_60_days": 211360.00,
      "arrears_61_90_days": 135879.00,
      "arrears_91_120_days": 104121.00,
      "arrears_121_150_days": 104593.00,
      "arrears_151_180_days": 138915.00,
      "arrears_181_plus_days": 1235402.00,
      "unrecovered_percentage_net": 19.02,
      "report_date": "2025-08-07"
    },
    {
      "loan_type": "Grand Total",
      "total_balance": 9016280.00,
      "within_tenure": 4185413.00,
      "arrears_30_days": 1381997.00,
      "arrears_31_60_days": 377390.00,
      "arrears_61_90_days": 224167.00,
      "arrears_91_120_days": 205042.00,
      "arrears_121_150_days": 206279.00,
      "arrears_151_180_days": 159359.00,
      "arrears_181_plus_days": 1464806.00,
      "report_date": "2025-08-07"
    }
  ]
}
```

### Implementation Notes

1. **Date Filtering**: If no dates provided, default to last 30 days
2. **Data Combination**: Combine results from all 4 tables into single response
3. **Loan Types**: Include data for loan types: 7, 14, 21, 30, and "Grand Total"
4. **Error Handling**: Return 404 if no data found for date range
5. **Performance**: Consider adding database indexes on report_date and loan_type columns

### Backend Implementation Location
- File: `C:\Users\basil\Videos\EmeraldPerfomance\EmeraldPerfBackend\src\routes\npl.js` (or similar)
- Controller: `C:\Users\basil\Videos\EmeraldPerfomance\EmeraldPerfBackend\src\controllers\nplController.js`

### Frontend Integration
Once this endpoint is implemented, update the frontend:
1. Change `useFetchFromAPI('npl-data')` to `useFetchFromAPI('npl-tables')`  
2. Remove fallback data and use actual database values
3. Test with date range picker functionality