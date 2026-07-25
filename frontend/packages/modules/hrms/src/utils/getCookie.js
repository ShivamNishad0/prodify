"use server";
import { cookies } from "next/headers";

export async function getNextCookies(name) {
  const cookieStore = cookies();
  const getData = cookieStore.get(name);
  return getData ? getData.value : null;
}
