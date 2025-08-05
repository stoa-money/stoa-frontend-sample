export function FSCSDisclaimer() {
  return (
    <div className="flex items-start gap-3 text-sm text-gray-600 border-gray-300 pt-8">
      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
      </svg>
      <p>
        Griffin securely manages your money, which is protected by the Financial Services Compensation Scheme (FSCS), covering up to £85,000 per person.
      </p>
    </div>
  );
}