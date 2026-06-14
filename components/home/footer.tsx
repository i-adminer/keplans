import { ArrowUpRight } from "lucide-react";
import Logo from "../logo";

function PinterestIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 text-foreground"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M12.2 7.2c-2.3 0-3.7 1.6-3.7 3.5 0 1.1.4 1.9 1.1 2.3.2.1.3 0 .4-.2.1-.2.4-1.1.4-1.3 0-.2-.1-.4-.1-.7 0-1.3.9-2.4 2.3-2.4 1.3 0 2.1.8 2.1 1.9 0 1.4-.6 2.5-1.6 2.5-.6 0-1.1-.5-.9-1.1.2-.7.6-1.5.6-2 0-.5-.3-.9-.9-.9-.7 0-1.3.7-1.3 1.7 0 .6.2 1 .2 1l-.8 3.4c-.2 1 .1 2.5.1 2.6 0 .1.1.2.2.1.1 0 .7-.9.9-1.8l.5-2c.3.5 1 .9 1.8.9 2.4 0 4.1-2.1 4.1-4.9 0-2.3-1.9-4.4-5-4.4Z"
        fill="var(--background)"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 text-foreground"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M13.4 8.2h1.5V6.1h-1.8c-1.8 0-2.9 1.1-2.9 3v1.5H8.7v2.1h1.5V18h2.2v-5.3h1.7l.3-2.1h-2V9.4c0-.7.4-1.2 1-1.2Z"
        fill="var(--background)"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 text-foreground"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <rect
        x="7"
        y="7"
        width="10"
        height="10"
        rx="3"
        fill="none"
        stroke="var(--background)"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="2.2" fill="var(--background)" />
      <circle cx="16.2" cy="7.8" r="1" fill="var(--background)" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 text-foreground"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <rect
        x="7.2"
        y="8"
        width="9.6"
        height="8"
        rx="2"
        fill="var(--background)"
      />
      <path d="M11 10.2 14.2 12 11 13.8Z" fill="currentColor" />
    </svg>
  );
}

const Footer = () => {
  return (
    <footer className="w-full  text-foreground bg-cream dark:bg-cream/10">
      <div className="mx-auto max-w-360 px-6 pb-0 pt-10 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-10 border-b border-border pb-10 lg:gap-12">
          <div className="flex items-start justify-between gap-6">
            <Logo />
          </div>

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-5 xl:gap-8">
            <section>
              <h2 className="text-2xl font-medium">Shop</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>Most Popular</li>
                <li>By Style</li>
                <li>By Region</li>
                <li>By Size</li>
                <li>Shop All Plans</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium">Company</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>About Us</li>
                <li>How It Works</li>
                <li>Exclusive Designers</li>
                <li className="flex items-center gap-1">
                  <span>New Home Source</span>
                  <ArrowUpRight className="size-4" />
                </li>
                <li className="flex items-center gap-1">
                  <span>Builder Magazine</span>
                  <ArrowUpRight className="size-4" />
                </li>
                <li className="flex items-center gap-1">
                  <span>Journal of Light Construction</span>
                  <ArrowUpRight className="size-4" />
                </li>
                <li className="flex items-center gap-1">
                  <img
                    src="https://www.seamlessit.co.ke/logo.png"
                    alt="Seamless IT"
                    className="h-7 w-auto"
                  />
                  <ArrowUpRight className="size-4" />
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium">Resources</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>Builder Advantage Program</li>
                <li>Plan Modification Guide</li>
                <li>Residential Construction Guide</li>
                <li>Publish Plans</li>
                <li>Affiliate Program</li>
                <li>Blog</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium">Support</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>Contact Us</li>
                <li>FAQs</li>
                <li>1-800-913-2350</li>
              </ul>
            </section>

            <section className="xl:pl-4">
              <h2 className="text-2xl font-medium">Get Our Newsletter</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Be the first to see new plans, special offers, and more.
              </p>

              <div className="mt-5 flex max-w-md flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="h-10 rounded-[4px] border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
                />
                <button
                  type="button"
                  className="h-10 rounded-[6px] bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Sign Up
                </button>
              </div>

              <label className="mt-4 flex max-w-md items-start gap-2 text-xs leading-5 text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border-input"
                />
                <span>
                  By signing up for our newsletter, you agree to our Terms &amp;
                  Conditions and Privacy Policy, for an account
                </span>
              </label>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-foreground">
                  <PinterestIcon />
                  <FacebookIcon />
                  <InstagramIcon />
                  <YoutubeIcon />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="bg-foreground text-background">
        <div className="mx-auto flex max-w-360 flex-col gap-4 px-6 py-5 text-sm sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="h-8 w-px bg-background/40" />
            <div className="text-xs font-playfair">Designed & Developed by</div>
            <a
              href="https://www.seamlessit.co.ke/"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Seamless IT"
              className="inline-flex items-center"
            >
              <img
                src="https://www.seamlessit.co.ke/logo.png"
                alt="Seamless IT"
                className="h-7 w-auto"
              />
            </a>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 font-playfair">
            <a href="#" className="transition-opacity hover:opacity-80">
              Privacy Policy
            </a>
            <a href="#" className="transition-opacity hover:opacity-80">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
