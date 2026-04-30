
REVOKE EXECUTE ON FUNCTION public.search_users_by_username(TEXT) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.search_users_by_username(TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_usernames(UUID[]) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_usernames(UUID[]) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_conversation_member(UUID, UUID) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_conversation_member(UUID, UUID) TO authenticated;
