import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Account } from "../types";
import { store } from "../lib/store";

type AuthCtx = {
  user: Account | null;
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
  isAdmin: boolean;
  reload: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(() => store.current());

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      login: (email, password) => {
        const acc = store.login(email, password);
        if (!acc) return "Email hoặc mật khẩu không đúng, hoặc tài khoản bị khóa.";
        setUser(acc);
        return null;
      },
      register: (name, email, password) => {
        const err = store.register(name, email, password);
        if (err) return err;
        setUser(store.current());
        return null;
      },
      logout: () => {
        store.logout();
        setUser(null);
      },
      isAdmin: user?.role === "admin",
      reload: () => setUser(store.current()),
    }),
    [user],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside provider");
  return v;
}
