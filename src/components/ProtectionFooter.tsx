export function ProtectionFooter() {
  return (
    <div className="bg-purple-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">FSCS protected</h2>
            <p className="text-lg md:text-xl opacity-90">
              Your eligible savings are protected up to £85,000 by the Financial Services Compensation Scheme.
            </p>
          </div>
          
          {/* FSCS logo */}
          <div className="flex-shrink-0">
            <img src="/fscs.svg" alt="FSCS Protected" className="h-12 brightness-0 invert" />
          </div>
        </div>
      </div>
    </div>
  );
}