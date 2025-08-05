import React from 'react';

const InfoBanner: React.FC = () => (
  <section className="py-16 flex justify-center -mx-8">
    <div className="bg-white/80 backdrop-blur-sm rounded-sm shadow-md max-w-6xl w-full px-6 py-12 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-brand">Your money is safe with Stoa</h2>
      <p className="text-brand-lighter text-sm max-w-4xl mx-auto">
        We've partnered with Griffin, a UK bank that provides the infrastructure behind Stoa's saving
        experience. That means your money sits securely, with a regulated bank, so you get the same
        level of protection you'd expect from any UK bank.
      </p>

      <div className="h-px bg-brand-lighter/30 my-10 mx-auto w-4/5" />

      <h3 className="text-xl font-semibold mb-2 text-brand">FSCS protected</h3>
      <p className="text-brand-lighter text-sm max-w-4xl mx-auto">
        Your eligible savings are protected up to £85,000 by the Financial Services Compensation Scheme.
      </p>
    </div>
  </section>
);

export default InfoBanner;