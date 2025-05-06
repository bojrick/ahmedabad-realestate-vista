
-- Function to get total project value
CREATE OR REPLACE FUNCTION get_total_project_value()
RETURNS double precision AS $$
BEGIN
  RETURN (SELECT SUM(total_unit_consideration) FROM gujrera_projects_detailed_summary);
END;
$$ LANGUAGE plpgsql;

-- Function to get average booking percentage
CREATE OR REPLACE FUNCTION get_avg_booking_percentage()
RETURNS double precision AS $$
BEGIN
  RETURN (
    SELECT AVG(booking_percentage) 
    FROM gujrera_projects_detailed_summary 
    WHERE booking_percentage IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get average project progress
CREATE OR REPLACE FUNCTION get_avg_project_progress()
RETURNS double precision AS $$
BEGIN
  RETURN (
    SELECT AVG(CAST(projectprogress AS double precision)) 
    FROM gujrera_projects_detailed_summary 
    WHERE projectprogress IS NOT NULL AND projectprogress ~ '^[0-9]+(\.[0-9]+)?$'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get total received amount
CREATE OR REPLACE FUNCTION get_total_received_amount()
RETURNS double precision AS $$
BEGIN
  RETURN (SELECT SUM(total_received_amount) FROM gujrera_projects_detailed_summary);
END;
$$ LANGUAGE plpgsql;

-- Function to get total area of land
CREATE OR REPLACE FUNCTION get_total_area_of_land()
RETURNS double precision AS $$
BEGIN
  RETURN (SELECT SUM(totareaofland) FROM gujrera_projects_detailed_summary);
END;
$$ LANGUAGE plpgsql;

-- Function to get total project count
CREATE OR REPLACE FUNCTION get_total_projects_count()
RETURNS integer AS $$
BEGIN
  RETURN (SELECT COUNT(DISTINCT projectregid) FROM gujrera_projects_detailed_summary);
END;
$$ LANGUAGE plpgsql;
