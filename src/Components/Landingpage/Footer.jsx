function Footer() {
  return (
    <footer className="bg-black">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="text-teal-400">
            <svg className="h-8" viewBox="0 0 118 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              {/* Logo SVG content */}
            </svg>
          </div>

          <ul className="mt-8 flex justify-start gap-6 sm:mt-0 sm:justify-end">
            {["Facebook", "Instagram", "Twitter", "GitHub", "Dribbble"].map((name, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-300 transition hover:opacity-75"
                >
                  <span className="sr-only">{name}</span>
                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {/* Corresponding SVG Path */}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-gray-700 pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:pt-16">
          <div>
            <p className="font-medium text-white">Services</p>
            <ul className="mt-6 space-y-4 text-sm">
              {["Auction", "Dashboard", "Create Auction"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 transition hover:opacity-75">{item}</a>
                </li>
              ))}
            </ul>
          </div>
<div>
  <p className="font-medium text-white">Socials</p>
  <ul className="mt-6 space-y-4 text-sm">
    {[
      { name: "LinkedIn", url: "https://www.linkedin.com/in/ianshpwr" },
      { name: "GitHub", url: "https://github.com/ianshpwr" },
      { name: "Instagram", url: "https://instagram.com/ianshpwr" },
    ].map((item, i) => (
      <li key={i}>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="text-gray-400 transition hover:opacity-75"
        >
          {item.name}
        </a>
      </li>
    ))}
  </ul>
</div>


          <div>
            <p className="font-medium text-white">Contacts</p>
            <ul className="mt-6 space-y-4 text-sm">
              {["+91 8571851175", "ianshpwr@gmail.com","Delhi NCR"].map((item, i) => (
                <li key={i}>
                  <a className="text-gray-400 transition hover:opacity-75">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-medium text-white">Legal</p>
            <ul className="mt-6 space-y-4 text-sm">
              {["Accessibility", "Returns Policy", "Refund Policy", "Hiring-3 Statistics"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 transition hover:opacity-75">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-xm text-gray-500">&copy; 2025 BidCarrot. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
