
-- View for yearly project data analysis
CREATE OR REPLACE VIEW yearly_projects_summary AS
SELECT
  EXTRACT(YEAR FROM (TO_TIMESTAMP(projectapprovedate, 'MM/DD/YYYY'))) AS year,
  COUNT(*) AS projects_approved,
  AVG(total_unit_consideration) AS avg_unit_consideration,
  projectstatus,
  projecttype,
  distname
FROM gujrera_projects_detailed_summary
WHERE 
  projectapprovedate IS NOT NULL 
  AND projectapprovedate ~ '[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}'
  AND EXTRACT(YEAR FROM (TO_TIMESTAMP(projectapprovedate, 'MM/DD/YYYY'))) BETWEEN 2010 AND EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY 
  EXTRACT(YEAR FROM (TO_TIMESTAMP(projectapprovedate, 'MM/DD/YYYY'))),
  projectstatus,
  projecttype, 
  distname
ORDER BY year;

-- View for project status summary
CREATE OR REPLACE VIEW project_status_summary AS
SELECT
  COUNT(*) as total_projects,
  SUM(CASE WHEN projectprogress ~ '^[0-9]+(\.[0-9]+)?$' AND CAST(projectprogress AS DECIMAL) < 100 AND CAST(projectprogress AS DECIMAL) >= 0 THEN 1 ELSE 0 END) as active_projects,
  SUM(CASE WHEN projectprogress ~ '^[0-9]+(\.[0-9]+)?$' AND CAST(projectprogress AS DECIMAL) = 100 THEN 1 ELSE 0 END) as completed_projects,
  SUM(CASE WHEN projectprogress ~ '^[0-9]+(\.[0-9]+)?$' AND CAST(projectprogress AS DECIMAL) < 0 THEN 1 ELSE 0 END) as delayed_projects,
  SUM(CASE WHEN projectprogress IS NULL OR projectprogress = '' OR NOT (projectprogress ~ '^[0-9]+(\.[0-9]+)?$') THEN 1 ELSE 0 END) as unreported_projects,
  SUM(total_unit_consideration) as total_value,
  SUM(totalcostincurredandpaid) as total_spend,
  AVG(NULLIF(booking_percentage, 0)) as avg_booking_percentage,
  AVG(NULLIF(payment_collection_percentage, 0)) as avg_collection_percentage,
  AVG(CASE WHEN projectprogress ~ '^[0-9]+(\.[0-9]+)?$' THEN CAST(projectprogress AS DECIMAL) ELSE NULL END) as avg_progress
FROM gujrera_projects_detailed_summary;

-- View for project types aggregation
CREATE OR REPLACE VIEW project_types_summary AS
SELECT
  projecttype,
  COUNT(*) as count
FROM gujrera_projects_detailed_summary
GROUP BY projecttype
ORDER BY count DESC;

-- View for project locations aggregation
CREATE OR REPLACE VIEW project_locations_summary AS
SELECT
  distname as location,
  COUNT(*) as count,
  AVG(NULLIF(booking_percentage, 0)) as avg_booking_percentage
FROM gujrera_projects_detailed_summary
WHERE distname IS NOT NULL AND distname <> ''
GROUP BY distname
ORDER BY count DESC;

-- View for promoter types aggregation
CREATE OR REPLACE VIEW promoter_types_summary AS
SELECT
  promotertype,
  COUNT(*) as count
FROM gujrera_projects_detailed_summary
WHERE promotertype IS NOT NULL
GROUP BY promotertype
ORDER BY count DESC;

-- View for top promoters
CREATE OR REPLACE VIEW top_promoters_summary AS
SELECT
  promotername,
  COUNT(*) as count
FROM gujrera_projects_detailed_summary
WHERE promotername IS NOT NULL AND promotername <> ''
GROUP BY promotername
ORDER BY count DESC
LIMIT 10;
