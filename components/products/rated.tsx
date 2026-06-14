import {
  Bath,
  Bed,
  Building,
  Heart,
  Square,
  Star,
  Trophy,
  TrendingUp,
  Award,
} from "lucide-react";

const TopRatedCard = () => {
  return (
    <div className="w-72 overflow-hidden rounded-t-2xl bg-background shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] relative group">
      {/* IMAGE SECTION */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src="/herobg/hbg-2.jpg"
          alt="house plan"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Heart Icon */}
        <button className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60 cursor-pointer transition-all hover:scale-110">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* INFO SECTION */}
      <div className="space-y-3 p-3">
        {/* Top row with enhanced rating display */}
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold">Modern Family House</h3>

          {/* Enhanced Rating Section */}
          <div className="flex items-center gap-1.5 rounded-full  px-2 py-0.5">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-700">4.9</span>
            <span className="text-xs text-muted-foreground">(2.3k)</span>
          </div>
        </div>

        {/* Price with premium indicator */}
        <div className="flex items-baseline gap-2">
          <div className="text-base font-bold text-green-600">$120,000</div>
          <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-green-600">+15% this week</span>
          </div>
        </div>

        {/* Features Grid - Same structure but with hover effects */}
        <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
          <div className="flex flex-col items-center gap-1 rounded-md p-1 transition-colors ">
            <Bed className="h-4 w-4" />
            <span>{`${3} Bd(s)`}</span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-md p-1 transition-colors ">
            <Bath className="h-4 w-4" />
            <span>{`${2} Ba(s)`}</span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-md p-1 transition-colors ">
            <Square className="h-4 w-4" />
            <span>320m²</span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-md p-1 transition-colors ">
            <Building className="h-4 w-4" />
            <span>{`${2} Fl(s)`}</span>
          </div>
        </div>

        {/* Additional Rating Badge - Unique to Top Rated */}
        <div className="mt-2 flex items-center justify-between border-t pt-2">
          <div className="flex items-center gap-1 text-xs">
            <Award className="h-3 w-3 text-yellow-500" />
            <span className="text-muted-foreground">Premium Pick</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">
              Verified by 500+ buyers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopRatedCard;
