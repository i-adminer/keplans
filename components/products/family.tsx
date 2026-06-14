import {
  Bath,
  Bed,
  Building,
  Heart,
  Square,
  Star,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

interface FamilyCardProps {
  title: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  floors: number;
  image: string;
  familyTag: string;
  memberCount: number;
}

const FamilyCard = ({
  title,
  price,
  beds,
  baths,
  area,
  floors,
  image,
  familyTag,
  memberCount,
}: FamilyCardProps) => {
  return (
    <Link href="/product/modern-1">
      <div className="group relative w-full max-w-xs overflow-hidden rounded-tl-2xl rounded-br-2xl bg-background shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
        {/* Family Badge - Unique to Family Card */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-linear-to-r from-green-500 to-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
          <Users className="h-3 w-3" />
          <span>Family Pick</span>
        </div>

        {/* Member Count Badge */}
        <div className="absolute top-3 right-12 z-10 rounded-full bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm flex justify-center items-center gap-1">
          <Users className="size-4" /> <span>{memberCount} members</span>
        </div>

        {/* IMAGE SECTION */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Heart Icon */}
          <button className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur transition-all hover:bg-black/60 hover:scale-110 cursor-pointer">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold">Modern Family House</h3>

            {/* Enhanced Rating Section */}
            <div className="flex items-center gap-1.5 rounded-full  px-2 py-0.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-700">4.9</span>
              <span className="text-xs text-muted-foreground">(2.3k)</span>
            </div>
          </div>
          {/* Price */}
          <div>
            <span className="text-xl font-bold text-green-600">{price}</span>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors ">
              <Bed className="h-4 w-4" />
              <span className="font-medium">{beds} Bd(s)</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors ">
              <Bath className="h-4 w-4" />
              <span className="font-medium">{baths} Ba(s)</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors ">
              <Square className="h-4 w-4" />
              <span className="font-medium">{area}</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors ">
              <Building className="h-4 w-4" />
              <span className="font-medium">{floors} Fl(s)</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FamilyCard;
