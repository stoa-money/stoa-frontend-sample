import { StepActionButton } from '@/components/StepActionButton';
import { StepProps } from '@/types/workflow';
import { FSCSDisclaimer } from '@/components/FSCSDisclaimer';

export function AcceptTermsStep({ isLoading, onAction }: StepProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-left">Terms & Conditions</h1>
        
        {/* Scrollable container for terms content */}
        <div className="max-h-[48vh] overflow-y-auto borderrounded-lg pt-6 bg-gray-50">
          <h4 className="font-semibold mb-3 text-lg">Stoa Savings Account Terms & Conditions</h4>
          
          <div className="space-y-4">
            <section>
              <h5 className="font-medium mb-2">1. Account Opening and Eligibility</h5>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                To open a savings account with Stoa, you must be at least 18 years of age and a resident of the United Kingdom. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </section>

            <section>
              <h5 className="font-medium mb-2">2. Deposits and Minimum Balance</h5>
              <p className="text-gray-700">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                The minimum initial deposit required is £100. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
                officia deserunt mollit anim id est laborum. Account holders must maintain a minimum balance of £50 at all times.
              </p>
            </section>

            <section>
              <h5 className="font-medium mb-2">3. Interest Rates and Calculations</h5>
              <p className="text-gray-700">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. 
                Interest is calculated daily and paid monthly on the last business day of each month. 
                Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </section>

            <section>
              <h5 className="font-medium mb-2">4. Withdrawals and Access</h5>
              <p className="text-gray-700">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos. 
                Withdrawals can be made at any time through online banking or by contacting customer service. 
                Qui ratione voluptatem sequi nesciunt neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
              </p>
            </section>

            <section>
              <h5 className="font-medium mb-2">5. Fees and Charges</h5>
              <p className="text-gray-700">
                Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. 
                No monthly maintenance fees apply to this account. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis 
                suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
              </p>
            </section>

            <section>
              <h5 className="font-medium mb-2">6. Account Security and Privacy</h5>
              <p className="text-gray-700">
                Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. 
                Your account information is protected by industry-standard encryption and security measures. 
                Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus.
              </p>
            </section>

            <section>
              <h5 className="font-medium mb-2">7. Account Closure</h5>
              <p className="text-gray-700">
                Qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate. 
                Either party may close this account with 30 days written notice. Non provident, similique sunt in culpa qui officia deserunt 
                mollitia animi, id est laborum et dolorum fuga.
              </p>
            </section>

            <section>
              <h5 className="font-medium mb-2">8. Changes to Terms</h5>
              <p className="text-gray-700">
                Et harum quidem rerum facilis est et expedita distinctio nam libero tempore. Stoa reserves the right to modify these terms 
                with 60 days prior written notice. Cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat 
                facere possimus, omnis voluptas assumenda est.
              </p>
            </section>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-300">
              <p className="text-xs text-gray-500">
                Last updated: January 2024. Version 1.2.3
              </p>
            </div>
          </div>
        </div>
              {/* Accept Button */}
      <div className="flex justify-center mb-12">
        <StepActionButton
          onClick={onAction}
          isLoading={isLoading}
          loadingText="Confirming..."
          actionText="Accept & Continue"
        />
      </div>
      
      {/* FSCS Protection Notice */}
      <FSCSDisclaimer />
      </div>
  )

}