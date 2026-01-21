-- Ensure the handle_new_user function exists (it was defined in remote_schema but let's be safe and explicit about the trigger)
-- The function definition is already in remote_schema.sql, but we need to attach the trigger to auth.users.

-- Drop the trigger if it exists to avoid errors on potential re-runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
