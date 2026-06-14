import { Bath, Bed, Building, Heart, Home, Square, Star } from "lucide-react";
const RecentCard = () => {
  return (
    <div className="w-72 overflow-hidden rounded-t-2xl  bg-background shadow-lg cursor-pointer ">
      {/* IMAGE SECTION */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src="/herobg/hbg-1.jpg"
          alt="house plan"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Heart Icon */}
        <button className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60 cursor-pointer">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* INFO SECTION */}
      <div className="space-y-3 p-3">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold">Modern Family House</h3>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>4.8 (120)</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-base font-bold text-green-600">$120,000</div>

        {/* Features */}
        <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{`${1} Bd(s)`}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{`${1} Ba(s)`}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Square className="h-4 w-4" />
            <span>220m²</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Building className="h-4 w-4" />
            <span>{`${1} Fl(s)`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentCard;
