import { generateUserToken } from "@/actions";
import App from "./App";

export default async function Home() {
  const usageToken = await generateUserToken();
  console.log(usageToken.token);
  return (
      <div className="grid items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
        <App usageToken={usageToken.token} />
      </div>
  );
}
