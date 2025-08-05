export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-stoa-gray py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <img src="/stoa.svg" alt="Stoa" className="h-6" />
          </div>
          
          <div className="text-gray-600 text-center md:text-right text-sm">
            © {currentYear} Stoa Corporation Limited. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}