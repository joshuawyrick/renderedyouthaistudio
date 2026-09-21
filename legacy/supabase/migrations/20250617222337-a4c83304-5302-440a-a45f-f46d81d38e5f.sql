
-- Update the designs table status constraint to include 'consumed'
ALTER TABLE public.designs 
  DROP CONSTRAINT IF EXISTS designs_status_check;

ALTER TABLE public.designs 
  ADD CONSTRAINT designs_status_check 
  CHECK (status IN ('pending_review', 'mockups_ready', 'selected', 'published', 'rejected', 'consumed'));
