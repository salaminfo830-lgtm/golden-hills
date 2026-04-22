CREATE OR REPLACE FUNCTION public.confirm_user_email(target_user_id UUID)
RETURNS void AS $$
DECLARE
  caller_role TEXT;
BEGIN
  -- Check the role of the caller in the Profile table
  SELECT role INTO caller_role FROM public."Profile" WHERE id = auth.uid();
  
  IF caller_role = 'admin' THEN
    UPDATE auth.users
    SET email_confirmed_at = NOW(),
        confirmed_at = NOW()
    WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Unauthorized: Only admins can perform this action.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
