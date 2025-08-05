import { useUser } from "@clerk/nextjs";

export function GreetingSection() {
  const { user } = useUser();
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-gray-900">
          Hi {user?.firstName || "there"},
        </h1>
        <p className="text-xl text-gray-600">
          Create a Pot and let your savings unlock benefits tailored to how you live.
        </p>
      </div>
    </div>
  );
}