"use server";

import { db } from "@/lib/db";
import {
  housePlans,
  planImages,
  planDocuments,
  planOptions,
  planFaqs,
} from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import {
  uploadImage,
  uploadDocument,
  deleteFile,
} from "@/lib/cloudinary/index";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

// ---------- Types for image/document actions ----------
type ImagePayload = {
  id?: string;
  category: string;
  caption: string;
  action: "keep" | "delete" | "new";
};

type DocumentPayload = {
  id?: string;
  type: string;
  description: string;
  action: "keep" | "delete" | "new";
};

// ---------- Helpers ----------
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------- Shared helpers for options & FAQs ----------
async function saveOptions(planId: string, formData: FormData) {
  const foundationLabels = formData.getAll("foundationLabels") as string[];
  const foundationPrices = formData.getAll("foundationPrices") as string[];
  const foundationDescriptions = formData.getAll(
    "foundationDescriptions",
  ) as string[];

  for (let i = 0; i < foundationLabels.length; i++) {
    if (foundationLabels[i]) {
      await db.insert(planOptions).values({
        id: nanoid(),
        planId,
        optionType: "foundation",
        label: foundationLabels[i],
        price: foundationPrices[i] || "0",
        description: foundationDescriptions[i] || null,
        sortOrder: i,
        createdAt: new Date(),
      });
    }
  }

  const addonLabels = formData.getAll("addonLabels") as string[];
  const addonPrices = formData.getAll("addonPrices") as string[];
  const addonDescriptions = formData.getAll("addonDescriptions") as string[];

  for (let i = 0; i < addonLabels.length; i++) {
    if (addonLabels[i]) {
      await db.insert(planOptions).values({
        id: nanoid(),
        planId,
        optionType: "addon",
        label: addonLabels[i],
        price: addonPrices[i] || "0",
        description: addonDescriptions[i] || null,
        sortOrder: i,
        createdAt: new Date(),
      });
    }
  }
}

async function saveFaqs(planId: string, formData: FormData) {
  const faqQuestions = formData.getAll("faqQuestions") as string[];
  const faqAnswers = formData.getAll("faqAnswers") as string[];

  for (let i = 0; i < faqQuestions.length; i++) {
    if (faqQuestions[i]) {
      await db.insert(planFaqs).values({
        id: nanoid(),
        planId,
        question: faqQuestions[i],
        answer: faqAnswers[i] || "",
        sortOrder: i,
        createdAt: new Date(),
      });
    }
  }
}

// ---------- CREATE  ----------
export async function createPlan(formData: FormData) {
  try {
    const planId = nanoid();
    const name = formData.get("name") as string;
    const slug = generateSlug(name);

    // 1. Create main plan
    await db.insert(housePlans).values({
      id: planId,
      planNumber: formData.get("planNumber") as string,
      name,
      slug,
      style: formData.get("style") as string,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      bedrooms: parseInt(formData.get("bedrooms") as string),
      baths: formData.get("baths") as string,
      floors: parseInt(formData.get("floors") as string),
      garages: parseInt(formData.get("garages") as string) || 0,
      sqft: parseInt(formData.get("sqft") as string),
      width: formData.get("width") as string,
      depth: formData.get("depth") as string,
      mainFloorArea: parseInt(formData.get("mainFloorArea") as string) || null,
      basementArea: parseInt(formData.get("basementArea") as string) || null,
      porchArea: parseInt(formData.get("porchArea") as string) || null,
      basePrice: formData.get("basePrice") as string,
      pdfPrice: formData.get("pdfPrice") as string,
      cadPrice: formData.get("cadPrice") as string,
      unlimitedBuildPrice: formData.get("unlimitedBuildPrice") as string,
      fullSpecsAndFeatures: formData.get("fullSpecsAndFeatures") as string,
      includedItemsHTML: formData.get("includedItemsHTML") as string,
      badge: formData.get("badge") as string,
      featured: formData.get("featured") === "true",
      trending: formData.get("trending") === "true",
      topRated: formData.get("topRated") === "true",
      familyPick: formData.get("familyPick") === "true",
      published: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Upload and save images
    const imageFiles = formData.getAll("images") as File[];
    const imageCategories = formData.getAll("imageCategories") as string[];
    const imageCaptions = formData.getAll("imageCaptions") as string[];

    for (let i = 0; i < imageFiles.length; i++) {
      if (imageFiles[i] && imageFiles[i].size > 0) {
        const { publicId, url } = await uploadImage(
          imageFiles[i],
          `house-plans/${planId}`,
        );
        await db.insert(planImages).values({
          id: nanoid(),
          planId,
          cloudinaryPublicId: publicId,
          cloudinaryUrl: url,
          category: imageCategories[i] || "exterior",
          caption: imageCaptions[i] || null,
          sortOrder: i,
          createdAt: new Date(),
        });
      }
    }

    // 3. Upload and save documents
    const documentFiles = formData.getAll("documents") as File[];
    const documentTypes = formData.getAll("documentTypes") as string[];
    const documentDescriptions = formData.getAll(
      "documentDescriptions",
    ) as string[];

    for (let i = 0; i < documentFiles.length; i++) {
      if (documentFiles[i] && documentFiles[i].size > 0) {
        const file = documentFiles[i];
        const { publicId, url, size } = await uploadDocument(
          file,
          `plan-documents/${planId}`,
        );
        await db.insert(planDocuments).values({
          id: nanoid(),
          planId,
          documentType: documentTypes[i] || "pdf",
          fileName: file.name,
          cloudinaryPublicId: publicId,
          cloudinaryUrl: url,
          fileSize: size,
          mimeType: file.type,
          description: documentDescriptions[i] || null,
          createdAt: new Date(),
        });
      }
    }

    // 4. Save options & FAQs
    await saveOptions(planId, formData);
    await saveFaqs(planId, formData);

    revalidatePath("/hp-admin/plans");
    return { success: true, planId };
  } catch (error) {
    console.error("Create plan error:", error);
    return { error: "Failed to create plan" };
  }
}

// ---------- UPDATE  ----------
export async function updatePlan(planId: string, formData: FormData) {
  try {
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    const stringFields = [
      "planNumber",
      "name",
      "summary",
      "description",
      "style",
      "baths",
      "badge",
      "width",
      "depth",
      "basePrice",
      "pdfPrice",
      "cadPrice",
      "unlimitedBuildPrice",
      "fullSpecsAndFeatures",
      "includedItemsHTML",
    ];
    for (const field of stringFields) {
      const value = formData.get(field);
      if (value !== null) updates[field] = value as string;
    }

    // Numeric fields
    const numericFields = [
      "bedrooms",
      "floors",
      "garages",
      "sqft",
      "mainFloorArea",
      "basementArea",
      "porchArea",
    ];
    for (const field of numericFields) {
      const value = formData.get(field);
      if (value !== null) {
        updates[field] = parseInt(value as string) || null;
      }
    }

    // Boolean flags
    ["featured", "trending", "topRated", "familyPick"].forEach((field) => {
      const value = formData.get(field);
      if (value !== null) updates[field] = value === "true";
    });

    // Name changed → update slug
    if (updates.name) {
      updates.slug = generateSlug(updates.name as string);
    }

    // Only run update if there's something besides updatedAt
    if (Object.keys(updates).length > 1) {
      await db.update(housePlans).set(updates).where(eq(housePlans.id, planId));
    }

    // --- 2. Process images (keep/delete/new) ---
    const imageActionsJson = formData.get("imageActions") as string;
    if (imageActionsJson) {
      const imagePayload: ImagePayload[] = JSON.parse(imageActionsJson);
      await processImages(planId, imagePayload, formData);
    }

    // --- 3. Process documents (keep/delete/new) ---
    const docActionsJson = formData.get("documentActions") as string;
    if (docActionsJson) {
      const docPayload: DocumentPayload[] = JSON.parse(docActionsJson);
      await processDocuments(planId, docPayload, formData);
    }

    // --- 4. Options – only replace if changed flag is true ---
    if (formData.get("optionsChanged") === "true") {
      await db.delete(planOptions).where(eq(planOptions.planId, planId));
      await saveOptions(planId, formData);
    }

    // --- 5. FAQs – only replace if changed flag is true ---
    if (formData.get("faqsChanged") === "true") {
      await db.delete(planFaqs).where(eq(planFaqs.planId, planId));
      await saveFaqs(planId, formData);
    }

    revalidatePath("/hp-admin/plans");
    return { success: true };
  } catch (error) {
    console.error("Update plan error:", error);
    return { error: "Failed to update plan" };
  }
}

// ---------- Image processor ----------
async function processImages(
  planId: string,
  payload: ImagePayload[],
  formData: FormData,
) {
  const newFiles = formData.getAll("images") as File[];
  const newCategories = formData.getAll("imageCategories") as string[];
  const newCaptions = formData.getAll("imageCaptions") as string[];
  let newIndex = 0;

  for (const item of payload) {
    switch (item.action) {
      case "delete":
        if (item.id) {
          await deleteFile(item.id);
          await db
            .delete(planImages)
            .where(eq(planImages.cloudinaryPublicId, item.id));
        }
        break;

      case "keep":
        if (item.id) {
          // Update caption/category if changed (optional)
          await db
            .update(planImages)
            .set({ category: item.category, caption: item.caption || null })
            .where(eq(planImages.cloudinaryPublicId, item.id));
        }
        break;

      case "new":
        if (newFiles[newIndex] && newFiles[newIndex].size > 0) {
          const { publicId, url } = await uploadImage(
            newFiles[newIndex],
            `house-plans/${planId}`,
          );
          await db.insert(planImages).values({
            id: nanoid(),
            planId,
            cloudinaryPublicId: publicId,
            cloudinaryUrl: url,
            category: newCategories[newIndex] || item.category,
            caption: newCaptions[newIndex] || item.caption || null,
            sortOrder: 99, // appended at end
            createdAt: new Date(),
          });
        }
        newIndex++;
        break;
    }
  }
}

// ---------- Document processor ----------
async function processDocuments(
  planId: string,
  payload: DocumentPayload[],
  formData: FormData,
) {
  const newFiles = formData.getAll("documents") as File[];
  const newTypes = formData.getAll("documentTypes") as string[];
  const newDescriptions = formData.getAll("documentDescriptions") as string[];
  let newIndex = 0;

  for (const item of payload) {
    switch (item.action) {
      case "delete":
        if (item.id) {
          await deleteFile(item.id);
          await db
            .delete(planDocuments)
            .where(eq(planDocuments.cloudinaryPublicId, item.id));
        }
        break;

      case "keep":
        if (item.id) {
          await db
            .update(planDocuments)
            .set({
              documentType: item.type,
              description: item.description || null,
            })
            .where(eq(planDocuments.cloudinaryPublicId, item.id));
        }
        break;

      case "new":
        if (newFiles[newIndex] && newFiles[newIndex].size > 0) {
          const file = newFiles[newIndex];
          const { publicId, url, size } = await uploadDocument(
            file,
            `plan-documents/${planId}`,
          );
          await db.insert(planDocuments).values({
            id: nanoid(),
            planId,
            documentType: newTypes[newIndex] || item.type,
            fileName: file.name,
            cloudinaryPublicId: publicId,
            cloudinaryUrl: url,
            fileSize: size,
            mimeType: file.type,
            description: newDescriptions[newIndex] || item.description || null,
            createdAt: new Date(),
          });
        }
        newIndex++;
        break;
    }
  }
}

export async function deletePlan(planId: string) {
  try {
    // Get all images and documents to delete from Cloudinary
    const images = await db.query.planImages.findMany({
      where: eq(planImages.planId, planId),
    });

    const documents = await db.query.planDocuments.findMany({
      where: eq(planDocuments.planId, planId),
    });

    // Delete from Cloudinary
    for (const image of images) {
      await deleteFile(image.cloudinaryPublicId);
    }

    for (const doc of documents) {
      await deleteFile(doc.cloudinaryPublicId);
    }

    // Delete from database (cascade will handle related records)
    await db.delete(housePlans).where(eq(housePlans.id, planId));

    revalidatePath("/hp-admin/plans");
    return { success: true };
  } catch (error) {
    console.error("Delete plan error:", error);
    return { error: "Failed to delete plan" };
  }
}

export async function publishPlan(planId: string) {
  try {
    await db
      .update(housePlans)
      .set({ published: true, updatedAt: new Date() })
      .where(eq(housePlans.id, planId));

    revalidatePath("/hp-admin/plans");
    return { success: true, message: "Plan published successfully" };
  } catch (error) {
    return { error: "Failed to publish plan" };
  }
}

export async function unpublishPlan(planId: string) {
  try {
    await db
      .update(housePlans)
      .set({ published: false, updatedAt: new Date() })
      .where(eq(housePlans.id, planId));

    revalidatePath("/hp-admin/plans");
    return { success: true, message: "Plan unpublished successfully" };
  } catch (error) {
    return { error: "Failed to unpublish plan" };
  }
}

export async function getPlan(planId: string) {
  try {
    const plan = await db.query.housePlans.findFirst({
      where: eq(housePlans.id, planId),
      with: {
        images: true,
        documents: true,
        options: true,
        faqs: true,
      },
    });

    return { success: true, plan };
  } catch (error) {
    return { error: "Failed to get plan" };
  }
}

export async function getAllPlans() {
  try {
    const plans = await db.query.housePlans.findMany({
      orderBy: [desc(housePlans.createdAt)],
      with: {
        images: {
          limit: 1,
          orderBy: [asc(planImages.sortOrder)],
        },
      },
    });

    return { success: true, plans };
  } catch (error) {
    console.error("getAllPlans error:", error);
    return { error: "Failed to get plans" };
  }
}

// ========== PUBLIC QUERIES FOR CUSTOMER SITE ==========

export async function getPublishedPlans() {
  try {
    const plans = await db.query.housePlans.findMany({
      where: eq(housePlans.published, true),
      orderBy: [desc(housePlans.createdAt)],
      with: {
        images: {
          orderBy: [asc(planImages.sortOrder)],
        },
      },
    });

    return { success: true, plans };
  } catch (error) {
    console.error("Get published plans error:", error);
    return { error: "Failed to get plans" };
  }
}

export async function getFeaturedPlans() {
  try {
    const plans = await db.query.housePlans.findMany({
      where: eq(housePlans.featured, true),
      orderBy: [desc(housePlans.createdAt)],
      with: {
        images: {
          limit: 1,
          orderBy: [asc(planImages.sortOrder)],
        },
      },
    });

    return { success: true, plans };
  } catch (error) {
    console.error("Get featured plans error:", error);
    return { error: "Failed to get featured plans" };
  }
}

export async function getPublicPlan(slug: string) {
  try {
    const plan = await db.query.housePlans.findFirst({
      where: eq(housePlans.slug, slug),
      with: {
        images: {
          orderBy: [asc(planImages.sortOrder)],
        },
        options: {
          orderBy: [asc(planOptions.sortOrder)],
        },
        faqs: {
          orderBy: [asc(planFaqs.sortOrder)],
        },
      },
    });

    if (!plan || !plan.published) {
      return { error: "Plan not found" };
    }

    return { success: true, plan };
  } catch (error) {
    console.error("Get public plan error:", error);
    return { error: "Failed to get plan" };
  }
}
