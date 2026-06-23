import MessagesInbox from "@/components/admin/messages-inbox";
import { getAllMessages } from "@/app/actions/messages";

export const metadata = {
  title: "Messages | KEPlans Admin",
  description: "Manage customer messages",
};

export const revalidate = 0;

export default async function MessagesPage() {
  const result = await getAllMessages();
  const messages = result.success ? result.messages : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Customer inquiries and support</p>
      </div>

      <MessagesInbox messages={messages} />
    </div>
  );
}
