
-- Insert a profile for the user who has designs but no profile
INSERT INTO public.profiles (id, first_name, last_name, created_at, updated_at)
VALUES (
  '220a45d0-71aa-4300-8de4-b1493c1f6843',
  'Test',
  'Creator',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
