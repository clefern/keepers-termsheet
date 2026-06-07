/** An authenticated user. */
export interface User {
  username: string;
  displayName: string;
}

/** Login form payload. */
export interface Credentials {
  username: string;
  password: string;
}

/** Persisted session returned on a successful login. */
export interface Session {
  user: User;
  token: string;
}
