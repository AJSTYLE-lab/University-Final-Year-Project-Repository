create database mosquito_surveillance_db;
use mosquito_surveillance_db;
SELECT COUNT(*) FROM final_data_two;
select * from dengue_file_table;final_data_twofinal_data_two
/*************/
SELECT RegionName,ROUND(SUM(NumValue)) AS TotalReportedCases
FROM dengue_file_table
WHERE NumValue IS NOT NULL and time=2008 and Population='All cases'
GROUP BY RegionName
ORDER BY TotalReportedCases DESC;
/*****************************/
SELECT RegionName,ROUND(NumValue) AS AgeStandardizedRate
FROM dengue_file_table
WHERE Indicator = 'Age-standardized rate ' AND
    NumValue IS NOT NULL
ORDER BY AgeStandardizedRate DESC;
