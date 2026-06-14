import { ArrowRight, House } from "lucide-react";

const Cta = () => {
  return (
    <section className=" bg-linear-to-br from-green-300 dark:from-green-300/10 to-cyan-300 dark:to-cyan-300/50 max-sm:p-5 py-5">
      <div className="relative overflow-hidden rounded-xl text-foreground  sm:px-10 lg:px-12 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="max-w-xl">
            <p className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.8rem] lg:leading-tight">
              Need help turning ideas into a plan?
            </p>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              Tell us what you want to build and we’ll help shape a plan that
              feels right for your space, budget, and style.
            </p>

            <button
              type="button"
              className="mt-6 inline-flex h-11 items-center gap-2 cursor-pointer rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Plan Help
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="relative flex items-center justify-center lg:min-h-65 lg:justify-end">
            <img src="/imgs/planning.png" alt="plan" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
