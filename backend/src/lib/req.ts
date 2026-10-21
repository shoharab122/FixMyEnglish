// Small helpers so route files don't depend on how `req.user` is typed.
type MaybeUser = { user?: { id: string; name?: string } };

/** Id of the authenticated user. Only call after requireAuth. */
export function uid(req: unknown): string {
  return (req as MaybeUser).user!.id;
}

/** Id of the user if a valid token was sent (optionalAuth routes). */
export function optUid(req: unknown): string | undefined {
  return (req as MaybeUser).user?.id;
}

/** Display name of the authenticated user. */
export function uname(req: unknown): string {
  return (req as MaybeUser).user?.name ?? '';
}
