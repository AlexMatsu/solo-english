/**
 * Autenticação de protótipo (client-side, via localStorage).
 *
 * ⚠️ Apenas para estudo de UX/UI: guarda contas no navegador do usuário.
 * Não use em produção — não há servidor, e o "hash" só evita texto puro,
 * não é segurança real. Para produção: NextAuth/Auth.js + banco de dados.
 */

const USERS_KEY = "solo_english_users";
const SESSION_KEY = "solo_english_session";

export interface StoredUser {
  name: string;
  email: string;
  passHash: string;
  level: number;
  createdAt: number;
}

export interface Session {
  name: string;
  email: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
}

/** Hash leve (djb2) só para não armazenar a senha em texto puro. */
function hash(value: string): string {
  let h = 5381;
  for (let i = 0; i < value.length; i++) {
    h = (h * 33) ^ value.charCodeAt(i);
  }
  return (h >>> 0).toString(16);
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/** Cria uma conta e já abre a sessão. */
export function register(
  name: string,
  email: string,
  password: string
): AuthResult {
  const users = readUsers();
  const normEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === normEmail)) {
    return { ok: false, error: "Este e-mail já tem uma conta. Tente entrar." };
  }

  const user: StoredUser = {
    name: name.trim(),
    email: normEmail,
    passHash: hash(password),
    level: 1,
    createdAt: Date.now(),
  };
  users.push(user);
  writeUsers(users);
  setSession({ name: user.name, email: user.email });
  return { ok: true };
}

/** Confere as credenciais e abre a sessão. */
export function login(email: string, password: string): AuthResult {
  const users = readUsers();
  const normEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normEmail);

  if (!user || user.passHash !== hash(password)) {
    return {
      ok: false,
      error: "E-mail ou senha incorretos. Confira e tente de novo.",
    };
  }

  setSession({ name: user.name, email: user.email });
  return { ok: true };
}

/** Retorna a sessão atual, ou null se ninguém estiver logado. */
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

/** Encerra a sessão (continua existindo a conta cadastrada). */
export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
