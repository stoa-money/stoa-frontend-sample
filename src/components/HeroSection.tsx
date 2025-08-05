import { StepActionButton } from "@/components/StepActionButton";

interface HeroSectionProps {
  onBrowsePots: () => void;
}

export function HeroSection({ onBrowsePots }: HeroSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            Turn your savings into everyday perks.
          </h1>
          <h2 className="text-5xl lg:text-6xl font-bold text-slate-900">
            Instantly.
          </h2>
          
          <div className="space-y-4 text-lg text-slate-600">
            <p>
              Stoa is a smarter way to save.
            </p>
            <p>
              Put money aside and unlock full-year perks instantly, like Netflix,
              Spotify, Amazon and more and we'll send you the full value
              upfront.
            </p>
            <p>
              No fees. No monthly charges. Just the power of your savings,
              working harder for you.
            </p>
          </div>

          <StepActionButton
            onClick={onBrowsePots}
            variant="primary"
            className="rounded-full"
          >
            Browse Pots
          </StepActionButton>
        </div>

        {/* Right content - Hero image */}
        <div className="relative flex items-center justify-center overflow-visible p-6">
          <img src="/hero.svg" alt="Stoa rewards" className="w-full max-w-4xl h-auto scale-115" />
        </div>
      </div>
    </div>
  );
}