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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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

    console.log("Documents to upload:", documentFiles.length);
    for (let i = 0; i < documentFiles.length; i++) {
      console.log(
        `Document ${i}:`,
        documentFiles[i]?.name,
        documentFiles[i]?.size,
      );
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
        console.log("Document uploaded:", file.name);
      }
    }

    // 4. Save foundation options
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

    // 5. Save add-ons
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

    // 6. Save FAQs
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

    revalidatePath("/hp-admin/plans");
    return { success: true, planId };
  } catch (error) {
    console.error("Create plan error:", error);
    return { error: "Failed to create plan" };
  }
}

export async function updatePlan(planId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = generateSlug(name);

    // Update main plan
    await db
      .update(housePlans)
      .set({
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
        mainFloorArea:
          parseInt(formData.get("mainFloorArea") as string) || null,
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
        updatedAt: new Date(),
      })
      .where(eq(housePlans.id, planId));

    revalidatePath("/hp-admin/plans");
    return { success: true };
  } catch (error) {
    console.error("Update plan error:", error);
    return { error: "Failed to update plan" };
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
