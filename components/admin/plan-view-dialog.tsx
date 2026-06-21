"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPlan } from "@/app/actions/plans";
import { X, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PlanViewDialogProps {
  planId: string | null;
  onClose: () => void;
}

export function PlanViewDialog({ planId, onClose }: PlanViewDialogProps) {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (planId) {
      setLoading(true);
      getPlan(planId).then((result) => {
        if (result.success && result.plan) {
          setPlan(result.plan);
        }
        setLoading(false);
      });
    } else {
      setPlan(null);
    }
  }, [planId]);

  if (!planId) return null;

  return (
    <Dialog open={!!planId} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Plan Details</DialogTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" asChild>
                <Link href={`/hp-admin/plans/${planId}/edit`}>
                  <Edit className="size-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : plan ? (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Plan Name</label>
                <p className="text-lg font-semibold">{plan.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Plan Number</label>
                <p className="text-lg">#{plan.planNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Style</label>
                <p>{plan.style}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Base Price</label>
                <p className="text-lg font-semibold">KSh {Number(plan.basePrice).toLocaleString()}</p>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <label className="text-xs text-muted-foreground">Bedrooms</label>
                <p className="text-lg font-semibold">{plan.bedrooms}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Bathrooms</label>
                <p className="text-lg font-semibold">{plan.baths}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Floors</label>
                <p className="text-lg font-semibold">{plan.floors}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Square Feet</label>
                <p className="text-lg font-semibold">{plan.sqft}</p>
              </div>
            </div>

            {/* Description */}
            {plan.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <div 
                  className="prose prose-sm mt-2" 
                  dangerouslySetInnerHTML={{ __html: plan.description }}
                />
              </div>
            )}

            {/* Images */}
            {plan.images && plan.images.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Images</label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {plan.images.map((img: any) => (
                    <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={img.cloudinaryUrl}
                        alt={img.caption || plan.name}
                        fill
                        className="object-cover"
                      />
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Options */}
            {plan.options && plan.options.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Options</label>
                <div className="space-y-2 mt-2">
                  {plan.options.map((opt: any) => (
                    <div key={opt.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{opt.name}</p>
                          {opt.description && (
                            <p className="text-sm text-muted-foreground">{opt.description}</p>
                          )}
                        </div>
                        <p className="font-semibold">+KSh {Number(opt.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {plan.faqs && plan.faqs.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">FAQs</label>
                <div className="space-y-3 mt-2">
                  {plan.faqs.map((faq: any) => (
                    <div key={faq.id} className="p-3 border rounded-lg">
                      <p className="font-medium">{faq.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                plan.published 
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}>
                {plan.published ? "Published" : "Unpublished"}
              </span>
              {plan.featured && (
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  Featured
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">Plan not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
