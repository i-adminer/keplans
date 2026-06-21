"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import { createPlan, updatePlan } from "@/app/actions/plans";
import {
  Home,
  Images,
  FileText,
  DollarSign,
  Settings,
  Save,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  X,
  FileCheck,
  FilePlus,
} from "lucide-react";

type ImageItem = {
  file: File | null;
  category: string;
  caption: string;
  previewUrl?: string;
};

type DocItem = {
  file: File | null;
  type: string;
  description: string;
  previewUrl?: string;
};

const STEPS = [
  { id: 1, title: "Basic Info", icon: Home },
  { id: 2, title: "Specifications", icon: FileText },
  { id: 3, title: "Images", icon: Images },
  { id: 4, title: "Documents", icon: FileCheck },
  { id: 5, title: "Pricing", icon: DollarSign },
  { id: 6, title: "Details", icon: Settings },
];

const HOUSE_STYLES = [
  "Modern",
  "Contemporary",
  "Traditional",
  "Modern Farmhouse",
  "Farmhouse",
  "Bungalow",
  "Cabin",
  "Country",
  "Mediterranean",
  "Victorian",
];

const IMAGE_CATEGORIES = ["exterior", "interior", "floor", "3d"];

const DOCUMENT_TYPES = [
  { value: "pdf", label: "PDF Set" },
  { value: "cad", label: "CAD Files (.dwg)" },
  { value: "revit", label: "Revit Files (.rvt)" },
  { value: "sketchup", label: "SketchUp (.skp)" },
  { value: "3d-model", label: "3D Model" },
  { value: "material-list", label: "Material List" },
  { value: "electrical", label: "Electrical Plans" },
  { value: "plumbing", label: "Plumbing Plans" },
  { value: "structural", label: "Structural Plans" },
];

interface PlanCreationFormProps {
  mode?: "create" | "edit";
  planId?: string;
  initialData?: Partial<typeof defaultFormData>;
}

const defaultFormData = {
  name: "",
  planNumber: "",
  summary: "",
  description: "",
  style: "",
  bedrooms: "",
  baths: "",
  floors: "",
  garages: "",
  sqft: "",
  width: "",
  depth: "",
  mainFloorArea: "",
  basementArea: "",
  porchArea: "",
  images: [] as ImageItem[],
  planDocuments: [] as DocItem[],
  basePrice: "",
  pdfPrice: "",
  cadPrice: "",
  unlimitedBuildPrice: "",
  foundationOptions: [] as Array<{
    label: string;
    price: string;
    description: string;
  }>,
  addOns: [] as Array<{ label: string; price: string; description: string }>,
  fullSpecsAndFeatures: "",
  includedItemsHTML: "",
  badge: "",
  featured: false,
  trending: false,
  topRated: false,
  familyPick: false,
  faqs: [] as Array<{ question: string; answer: string }>,
};

function ImagePreview({ image }: { image: ImageItem }) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (image.file) {
      const url = URL.createObjectURL(image.file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image.file]);

  const src = image.file ? objectUrl : image.previewUrl;

  if (!src) return <p className="text-xs text-muted-foreground">No preview</p>;

  return (
    <>
      {/* Thumbnail */}
      <div
        onClick={() => setIsFullscreen(true)}
        className="relative group cursor-pointer flex justify-center items-center"
      >
        <img
          src={src}
          alt={image.caption || "Plan image"}
          className="w-32 h-32 object-cover rounded-md border group-hover:opacity-90 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">
            Click to expand
          </span>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="size-8" />
          </button>
          <img
            src={src}
            alt={image.caption || "Plan image"}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
          />
          {image.caption && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded">
              {image.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}

function DocumentPreview({ doc }: { doc: DocItem }) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [doc.file]);

  const url = doc.file ? objectUrl : doc.previewUrl;
  const fileName = doc.file
    ? doc.file.name
    : doc.previewUrl?.split("/").pop()?.split("?")[0] || "document";

  const isPDF = fileName.toLowerCase().endsWith(".pdf");

  if (!url)
    return <p className="text-xs text-muted-foreground">No file selected</p>;

  return (
    <div className="space-y-2">
      {/* File info */}
      <div className="flex items-center gap-2 text-sm">
        <FileText className="size-4 text-muted-foreground" />
        <span
          className="text-muted-foreground truncate max-w-50"
          title={fileName}
        >
          {fileName}
        </span>
      </div>

      {/* Preview / Actions */}
      <div className="flex gap-2">
        {/* Open in new tab */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Open file
        </a>

        {/* Download */}
        <a
          href={url}
          download={fileName}
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Download
        </a>

        {/* PDF inline preview */}
        {isPDF && (
          <details className="w-full">
            <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
              Preview inline
            </summary>
            <iframe
              src={url}
              className="w-full h-64 mt-2 rounded border"
              title={fileName}
            />
          </details>
        )}
      </div>
    </div>
  );
}

export default function PlanCreationForm({
  mode = "create",
  planId,
  initialData,
}: PlanCreationFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...(initialData ?? {}),
  });

  // Load draft on mount
  useEffect(() => {
    if (mode === "create") {
      const saved = localStorage.getItem("planDraft");
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          setFormData((prev) => ({ ...prev, ...draft }));
          toast.info("Draft loaded");
        } catch (e) {
          console.error("Failed to load draft:", e);
        }
      }
    }
  }, [mode]);

  const handleNext = () =>
    currentStep < STEPS.length && setCurrentStep(currentStep + 1);
  const handlePrev = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSaveDraft = () => {
    localStorage.setItem("planDraft", JSON.stringify(formData));
    toast.success("Draft saved!");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const data = new FormData();

      // Basic fields
      data.append("name", formData.name);
      data.append("planNumber", formData.planNumber);
      data.append("summary", formData.summary);
      data.append("description", formData.description);
      data.append("style", formData.style);
      data.append("bedrooms", formData.bedrooms);
      data.append("baths", formData.baths);
      data.append("floors", formData.floors);
      data.append("garages", formData.garages || "0");
      data.append("sqft", formData.sqft);
      data.append("width", formData.width || "");
      data.append("depth", formData.depth || "");
      data.append("mainFloorArea", formData.mainFloorArea || "");
      data.append("basementArea", formData.basementArea || "");
      data.append("porchArea", formData.porchArea || "");

      // Pricing
      data.append("basePrice", formData.basePrice);
      data.append("pdfPrice", formData.pdfPrice || "");
      data.append("cadPrice", formData.cadPrice || "");
      data.append("unlimitedBuildPrice", formData.unlimitedBuildPrice || "");

      // Rich text
      data.append("fullSpecsAndFeatures", formData.fullSpecsAndFeatures || "");
      data.append("includedItemsHTML", formData.includedItemsHTML || "");

      // Categories
      data.append("badge", formData.badge || "");
      data.append("featured", String(formData.featured));
      data.append("trending", String(formData.trending));
      data.append("topRated", String(formData.topRated));
      data.append("familyPick", String(formData.familyPick));

      // Images
      formData.images.forEach((img) => {
        if (img.file) {
          data.append("images", img.file);
          data.append("imageCategories", img.category);
          data.append("imageCaptions", img.caption || "");
        }
      });

      // Documents
      formData.planDocuments.forEach((doc) => {
        if (doc.file) {
          data.append("documents", doc.file);
          data.append("documentTypes", doc.type);
          data.append("documentDescriptions", doc.description || "");
        }
      });

      // Foundation options
      formData.foundationOptions.forEach((opt) => {
        data.append("foundationLabels", opt.label);
        data.append("foundationPrices", opt.price);
        data.append("foundationDescriptions", opt.description || "");
      });

      // Add-ons
      formData.addOns.forEach((addon) => {
        data.append("addonLabels", addon.label);
        data.append("addonPrices", addon.price);
        data.append("addonDescriptions", addon.description || "");
      });

      // FAQs
      formData.faqs.forEach((faq) => {
        data.append("faqQuestions", faq.question);
        data.append("faqAnswers", faq.answer);
      });

      const result =
        mode === "edit" && planId
          ? await updatePlan(planId, data)
          : await createPlan(data);

      if (result.success) {
        toast.success(
          mode === "edit"
            ? "Plan updated successfully!"
            : "Plan created successfully!",
        );
        localStorage.removeItem("planDraft");
        router.push("/hp-admin/plans");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save plan");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = () =>
    setFormData({
      ...formData,
      images: [
        ...formData.images,
        { file: null, category: "exterior", caption: "" },
      ],
    });
  const removeImage = (i: number) =>
    setFormData({
      ...formData,
      images: formData.images.filter((_, idx) => idx !== i),
    });
  const handleImageFile = (i: number, file: File | null) => {
    const imgs = [...formData.images];
    imgs[i].file = file;
    setFormData({ ...formData, images: imgs });
  };

  const addDocument = () =>
    setFormData({
      ...formData,
      planDocuments: [
        ...formData.planDocuments,
        { file: null, type: "pdf", description: "" },
      ],
    });
  const removeDocument = (i: number) =>
    setFormData({
      ...formData,
      planDocuments: formData.planDocuments.filter((_, idx) => idx !== i),
    });
  const handleDocumentFile = (i: number, file: File | null) => {
    const docs = [...formData.planDocuments];
    docs[i].file = file;
    setFormData({ ...formData, planDocuments: docs });
  };

  const addFoundation = () =>
    setFormData({
      ...formData,
      foundationOptions: [
        ...formData.foundationOptions,
        { label: "", price: "", description: "" },
      ],
    });
  const addAddon = () =>
    setFormData({
      ...formData,
      addOns: [...formData.addOns, { label: "", price: "", description: "" }],
    });
  const addFAQ = () =>
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }],
    });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plan Name *</label>
                  <Input
                    placeholder="Kenya Court Modern"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plan Number *</label>
                  <Input
                    placeholder="1064-280"
                    value={formData.planNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, planNumber: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Style *</label>
              <select
                value={formData.style}
                onChange={(e) =>
                  setFormData({ ...formData, style: e.target.value })
                }
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="">Select style</option>
                {HOUSE_STYLES.map((style) => (
                  <option
                    key={style}
                    value={style.toLowerCase().replace(/\s+/g, "-")}
                  >
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Summary *</label>
              <Input
                placeholder="Brief description for listings"
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                Appears in plan cards
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Description *</label>
              <textarea
                placeholder="Detailed overview..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-32 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Appears in Overview tab
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Categories</label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="rounded border-border"
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.trending}
                    onChange={(e) =>
                      setFormData({ ...formData, trending: e.target.checked })
                    }
                    className="rounded border-border"
                  />
                  <span className="text-sm">Trending</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.topRated}
                    onChange={(e) =>
                      setFormData({ ...formData, topRated: e.target.checked })
                    }
                    className="rounded border-border"
                  />
                  <span className="text-sm">Top Rated</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.familyPick}
                    onChange={(e) =>
                      setFormData({ ...formData, familyPick: e.target.checked })
                    }
                    className="rounded border-border"
                  />
                  <span className="text-sm">Family Pick</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Badge</label>
              <Input
                placeholder="e.g., Best Price, Compact Build"
                value={formData.badge}
                onChange={(e) =>
                  setFormData({ ...formData, badge: e.target.value })
                }
                className="h-10"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Specs</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bedrooms *</label>
                  <Input
                    type="number"
                    placeholder="2"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Baths *</label>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="2"
                    value={formData.baths}
                    onChange={(e) =>
                      setFormData({ ...formData, baths: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Floors *</label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={formData.floors}
                    onChange={(e) =>
                      setFormData({ ...formData, floors: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Garages</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.garages}
                    onChange={(e) =>
                      setFormData({ ...formData, garages: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Dimensions</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Sq Ft *</label>
                  <Input
                    type="number"
                    placeholder="1679"
                    value={formData.sqft}
                    onChange={(e) =>
                      setFormData({ ...formData, sqft: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Width (ft)</label>
                  <Input
                    placeholder="52"
                    value={formData.width}
                    onChange={(e) =>
                      setFormData({ ...formData, width: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Depth (ft)</label>
                  <Input
                    placeholder="65"
                    value={formData.depth}
                    onChange={(e) =>
                      setFormData({ ...formData, depth: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Area Breakdown</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Main Floor</label>
                  <Input
                    type="number"
                    placeholder="1679"
                    value={formData.mainFloorArea}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mainFloorArea: e.target.value,
                      })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Basement</label>
                  <Input
                    type="number"
                    placeholder="1720"
                    value={formData.basementArea}
                    onChange={(e) =>
                      setFormData({ ...formData, basementArea: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Porch</label>
                  <Input
                    type="number"
                    placeholder="300"
                    value={formData.porchArea}
                    onChange={(e) =>
                      setFormData({ ...formData, porchArea: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Plan Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gallery images (exterior, interior, floor plans, 3D)
              </p>

              {formData.images.map((image, i) => (
                <div
                  key={i}
                  className="mb-4 rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium">Image {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="text-destructive"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm">File *</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageFile(i, e.target.files?.[0] || null)
                        }
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Category *</label>
                      <select
                        value={image.category}
                        onChange={(e) => {
                          const imgs = [...formData.images];
                          imgs[i].category = e.target.value;
                          setFormData({ ...formData, images: imgs });
                        }}
                        className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
                      >
                        {IMAGE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Caption</label>
                      <Input
                        placeholder="Front Elevation"
                        value={image.caption}
                        onChange={(e) => {
                          const imgs = [...formData.images];
                          imgs[i].caption = e.target.value;
                          setFormData({ ...formData, images: imgs });
                        }}
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <ImagePreview image={image} />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addImage}
                className="w-full"
              >
                <Upload className="size-4 mr-2" />
                Add Image
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Plan Documents</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload all documents. These will be sent to customers after
                purchase.
              </p>

              {formData.planDocuments.map((doc, i) => (
                <div
                  key={i}
                  className="mb-4 rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium">
                      Document {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDocument(i)}
                      className="text-destructive"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm">Type *</label>
                      <select
                        value={doc.type}
                        onChange={(e) => {
                          const docs = [...formData.planDocuments];
                          docs[i].type = e.target.value;
                          setFormData({ ...formData, planDocuments: docs });
                        }}
                        className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
                      >
                        {DOCUMENT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">File *</label>
                      <Input type="file" className="h-10" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm">Description</label>
                      <Input
                        placeholder="Additional details"
                        value={doc.description}
                        onChange={(e) => {
                          const docs = [...formData.planDocuments];
                          docs[i].description = e.target.value;
                          setFormData({ ...formData, planDocuments: docs });
                        }}
                        className="h-10"
                      />
                    </div>
                  </div>
                  {/* Document Preview  */}
                  <div className="mt-3">
                    <DocumentPreview doc={doc} />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addDocument}
                className="w-full"
              >
                <FilePlus className="size-4 mr-2" />
                Add Document
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Base Pricing (KES)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Price *</label>
                  <Input
                    type="number"
                    placeholder="128000"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, basePrice: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">PDF Set</label>
                  <Input
                    type="number"
                    placeholder="125000"
                    value={formData.pdfPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, pdfPrice: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CAD Files</label>
                  <Input
                    type="number"
                    placeholder="285000"
                    value={formData.cadPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, cadPrice: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unlimited Build</label>
                  <Input
                    type="number"
                    placeholder="185000"
                    value={formData.unlimitedBuildPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unlimitedBuildPrice: e.target.value,
                      })
                    }
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Foundation Options</h3>
              {formData.foundationOptions.map((opt, i) => (
                <div
                  key={i}
                  className="mb-3 grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-3"
                >
                  <Input
                    placeholder="Name"
                    value={opt.label}
                    onChange={(e) => {
                      const opts = [...formData.foundationOptions];
                      opts[i].label = e.target.value;
                      setFormData({ ...formData, foundationOptions: opts });
                    }}
                    className="h-10"
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={opt.price}
                    onChange={(e) => {
                      const opts = [...formData.foundationOptions];
                      opts[i].price = e.target.value;
                      setFormData({ ...formData, foundationOptions: opts });
                    }}
                    className="h-10"
                  />
                  <Input
                    placeholder="Description"
                    value={opt.description}
                    onChange={(e) => {
                      const opts = [...formData.foundationOptions];
                      opts[i].description = e.target.value;
                      setFormData({ ...formData, foundationOptions: opts });
                    }}
                    className="h-10"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFoundation}
              >
                Add Foundation Option
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Add-Ons</h3>
              {formData.addOns.map((addon, i) => (
                <div
                  key={i}
                  className="mb-3 grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-3"
                >
                  <Input
                    placeholder="Name"
                    value={addon.label}
                    onChange={(e) => {
                      const addons = [...formData.addOns];
                      addons[i].label = e.target.value;
                      setFormData({ ...formData, addOns: addons });
                    }}
                    className="h-10"
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={addon.price}
                    onChange={(e) => {
                      const addons = [...formData.addOns];
                      addons[i].price = e.target.value;
                      setFormData({ ...formData, addOns: addons });
                    }}
                    className="h-10"
                  />
                  <Input
                    placeholder="Description"
                    value={addon.description}
                    onChange={(e) => {
                      const addons = [...formData.addOns];
                      addons[i].description = e.target.value;
                      setFormData({ ...formData, addOns: addons });
                    }}
                    className="h-10"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAddon}
              >
                Add Extra
              </Button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Full Specs & Features
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Format with headings, lists. Appears in "Full Specs & Features"
                tab.
              </p>
              <RichTextEditor
                content={formData.fullSpecsAndFeatures}
                onChange={(c) =>
                  setFormData({ ...formData, fullSpecsAndFeatures: c })
                }
                placeholder="Foundation, exterior features, interior layout..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">What's Included</label>
              <p className="text-xs text-muted-foreground mb-2">
                Everything in the plan package. Appears in "What's Included"
                tab.
              </p>
              <RichTextEditor
                content={formData.includedItemsHTML}
                onChange={(c) =>
                  setFormData({ ...formData, includedItemsHTML: c })
                }
                placeholder="Construction drawings, foundation plans, electrical..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">FAQs</label>
              {formData.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="mb-4 rounded-lg border border-border p-4 space-y-3"
                >
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => {
                      const faqs = [...formData.faqs];
                      faqs[i].question = e.target.value;
                      setFormData({ ...formData, faqs });
                    }}
                    className="h-10"
                  />
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => {
                      const faqs = [...formData.faqs];
                      faqs[i].answer = e.target.value;
                      setFormData({ ...formData, faqs });
                    }}
                    className="min-h-20 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFAQ}
              >
                Add FAQ
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const done = currentStep > step.id;
            const active = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full border-2 transition-colors ${done ? "border-green-500 bg-green-500 text-primary-foreground" : active ? "border-green-500/50 bg-green-500/50 text-foreground" : "border-border bg-background text-muted-foreground"}`}
                  >
                    {done ? (
                      <Check className="size-5" />
                    ) : (
                      <Icon className="size-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 hidden text-xs md:block ${active ? "font-medium" : "text-muted-foreground"}`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${done ? "bg-green-500" : "bg-border"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6 md:p-8">
        {renderStep()}

        {/* Navigation */}
        <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4 sm:pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            <ChevronLeft className="size-4 mr-2" />
            Previous
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            <Save className="size-4 mr-2" />
            Save Draft
          </Button>
          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="w-full sm:w-auto order-3"
            >
              Next
              <ChevronRight className="size-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto order-3"
            >
              {isSubmitting ? (
                <>Loading...</>
              ) : (
                <>
                  <Check className="size-4 mr-2" />
                  {mode === "edit" ? "Update Plan" : "Create Plan"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
