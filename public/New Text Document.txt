import pandas as pd

file_path = "Airtel_Zambia_NPL_report_25th_March_2025.csv"
df = pd.read_csv(file_path, encoding="ISO-8859-1")

# Remove BOM from column names
df.columns = df.columns.str.replace(r'^\ufeff', '', regex=True)

# Save cleaned file
df.to_csv("cleaned_Airtel_NPL_report.csv", index=False, encoding="utf-8")
