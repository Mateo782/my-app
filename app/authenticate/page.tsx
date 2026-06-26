import AuthForm from "./AuthForm";

type Mode = "sign-in" | "sign-up";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AuthenticatePage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const mode: Mode = params.mode === "sign-up" ? "sign-up" : "sign-in";

  return <AuthForm key={mode} mode={mode} />;
}
