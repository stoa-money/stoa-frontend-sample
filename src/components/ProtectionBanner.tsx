export function ProtectionBanner() {
  return (
    <div className="bg-purple-800 text-white p-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left section */}
          <div className="text-center space-y-4 md:border-r md:border-x-gray-300 pr-0 md:pr-8">
            <h2 className="text-3xl font-bold">Your money is safe with Stoa</h2>
            <p className="text-lg opacity-90">
              We've partnered with Griffin, a UK-regulated bank, so
              your money is held securely and protected.
            </p>
            
            {/* Griffin logo */}
            <div className="flex justify-center mt-6">
              <img src="/griffin.png" alt="Griffin Bank" className="h-12" />
            </div>
          </div>

          {/* Right section */}
          <div className="text-center space-y-4 pl-0 md:pl-8">
            <h2 className="text-3xl font-bold">Your deposit is FSCS protected</h2>
            <p className="text-lg opacity-90">
              Your eligible savings are protected up to £85,000 by
              the Financial Services Compensation Scheme.
            </p>
            
            {/* FSCS logo */}
            <div className="flex justify-center mt-6">
              <img src="/fscs.svg" alt="FSCS Protected" className="h-12 brightness-0 invert" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}