"use client";

import { Star, StarHalf, Users, Award, CheckCircle } from "lucide-react";
import Marquee from "react-fast-marquee";

interface Review {
  id: number;
  name: string;
  location?: string;
  rating: number;
  text: string;
  isVerified: boolean;
  date: string;
}

const dummyReviews: Review[] = [
  {
    id: 1,
    name: "Brian K.",
    location: "Nairobi",
    rating: 5,
    text: "This is my second plan purchase, and they always deliver! The attention to detail and local building codes is impressive. Highly recommend for anyone building in Kenya.",
    isVerified: true,
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Stacey M.",
    location: "Mombasa",
    rating: 5,
    text: "Stacey was very kind, patient, and knowledgeable. The order process was smooth, and she helped me choose the perfect plan for my coastal plot.",
    isVerified: true,
    date: "3 days ago",
  },
  {
    id: 3,
    name: "Eric Richards",
    location: "Kisumu",
    rating: 5,
    text: "Great plans, good price, and very complete. We are submitting for county approval next week. The team provided excellent technical support.",
    isVerified: true,
    date: "4 days ago",
  },
  {
    id: 4,
    name: "PAIGE DURHAM",
    location: "Nakuru",
    rating: 5,
    text: "Super nice sales guy and always very helpful. Answered all my questions about modifications and helped me understand the construction timeline.",
    isVerified: true,
    date: "June 4",
  },
  {
    id: 5,
    name: "Geoff LeGallais",
    location: "Nairobi",
    rating: 5,
    text: "Easy to work with Geoff LeGallais and pleasant. The team provided detailed drawings that made it easy for my contractor to understand.",
    isVerified: true,
    date: "June 2",
  },
  {
    id: 6,
    name: "Maia W.",
    location: "Eldoret",
    rating: 5,
    text: "Excellent customer service! They helped me modify the bedroom layout to fit my family's needs. Will definitely purchase again.",
    isVerified: true,
    date: "1 week ago",
  },
  {
    id: 7,
    name: "John M.",
    location: "Thika",
    rating: 4.5,
    text: "Very professional team. The plans are comprehensive and include everything needed for construction. Minor delay in delivery but they communicated well.",
    isVerified: true,
    date: "2 weeks ago",
  },
  {
    id: 8,
    name: "Sarah N.",
    location: "Nyeri",
    rating: 5,
    text: "Best investment I made for my dream home. The 3D renders helped me visualize everything before construction started.",
    isVerified: true,
    date: "3 weeks ago",
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="mx-3 w-80 shrink-0  p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h4 className="font-semibold text-foreground ">{review.name}</h4>
            {review.location && (
              <p className="text-xs text-muted-foreground">{review.location}</p>
            )}
          </div>
        </div>
        {review.isVerified && (
          <div className="flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-50/10 px-2 py-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-green-600">Verified</span>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mt-3">
        <StarRating rating={review.rating} />
      </div>

      {/* Review Text */}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        &quot;{review.text}&quot;
      </p>

      {/* Date */}
      <p className="mt-3 text-xs text-gray-400">{review.date}</p>
    </div>
  );
};

export default function ReviewsSection() {
  return (
    <section className="relative overflow-hidden py-16">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-green-100/30 dark:bg-green-100/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-yellow-50 dark:bg-yellow-50/10 px-3 py-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-700">
                Rated 4.8 / 5
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-50/10 px-3 py-1">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                715+ reviews
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-playfair">
            What Our <span className="text-green-500">Homeowners</span> Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Join hundreds of happy families who built their dream homes with our
            plans
          </p>

          {/* Trustpilot Badge */}
          <div className="mt-4 flex items-center justify-center ">
            <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-100/10 px-3 py-1.5">
              <Award className="h-4 w-4 text-yellow-600" />
              <span className="text-xs font-medium text-foreground">
                Top Rated 2026
              </span>
            </div>
          </div>
        </div>

        {/* Continuous Scrolling Marquee */}
        <div className="relative ">
          {/* linear Overlays for smooth edges */}
          <div className="absolute left-0 top-0 z-10 h-full w-20 bg-linear-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 z-10 h-full w-20 bg-linear-to-l from-background to-transparent pointer-events-none" />

          <Marquee
            speed={40}
            pauseOnHover={true}
            direction="left"
            loop={0}
            autoFill={true}
          >
            {dummyReviews.map((review) => (
              <div key={review.id} className="py-3">
                <ReviewCard review={review} />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
