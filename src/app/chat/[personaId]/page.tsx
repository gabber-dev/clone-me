import { generateUserToken } from "@/actions";
import { ChatPage } from "@/app/components/ChatPage";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ personaId: string }> 
}) {
  const resolvedParams = await params;
  const usageToken = await generateUserToken();
  
  return (
    <div className="h-screen">
      <ChatPage 
        personaId={resolvedParams.personaId} 
        persona={{
          id: resolvedParams.personaId,
          name: "AI Assistant",
          description: "",
          gender: "female",
          voiceId: "0b6c25ce-cc8d-4558-844e-4f61c00cc264"
        }} 
        usageToken={usageToken.token} 
      />
    </div>
  );
} 