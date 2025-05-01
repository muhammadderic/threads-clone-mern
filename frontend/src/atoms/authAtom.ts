import { atom } from "jotai";

type AuthScreen = "login" | "signup";

export const authScreenAtom = atom<AuthScreen>("login");