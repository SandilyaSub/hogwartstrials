CREATE OR REPLACE FUNCTION public.add_house_points(p_house_id text, p_points integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_house text;
BEGIN
  -- Require authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Validate points range (per-call cap)
  IF p_points <= 0 OR p_points > 1000 THEN
    RAISE EXCEPTION 'Invalid points value';
  END IF;

  -- Caller must belong to the house they're awarding points to
  SELECT house_id INTO v_user_house
  FROM public.game_profiles
  WHERE user_id = auth.uid();

  IF v_user_house IS NULL OR v_user_house != p_house_id THEN
    RAISE EXCEPTION 'Cannot add points to a different house';
  END IF;

  UPDATE public.house_leaderboard
  SET total_points = total_points + p_points, updated_at = now()
  WHERE house_id = p_house_id;
END;
$function$;