import { NextResponse } from "next/server";
import { RemoteConfigTemplate } from "firebase-admin/remote-config";
import { initAdmin } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  const { key, value } = await req.json();

  if (!key || value === undefined) {
    return NextResponse.json(
      { error: "Missing 'key' or 'value' in request body." },
      { status: 400 }
    );
  }

  try {
    const rc = initAdmin();

    console.log("Fetching current Remote Config template...");

    const template: RemoteConfigTemplate = await rc.getTemplate();
    console.log("Current template fetched successfully. ETag:", template.etag);

    const newTemplate = JSON.parse(JSON.stringify(template));

    newTemplate.parameters[key] = {
      defaultValue: {
        value: String(value),
      },
    };

    console.log("Validating updated template...");
    await rc.validateTemplate(newTemplate);
    console.log("Template validated successfully.");

    console.log("Publishing updated template...");

    const updatedTemplate = await rc.publishTemplate(newTemplate);
    console.log(
      "Template published successfully. New ETag:",
      updatedTemplate.etag
    );

    return NextResponse.json({
      status: "updated",
      key,
      value,
      newEtag: updatedTemplate.etag,
    });
  } catch (err: unknown) {
    const error = err as { message?: string; code?: string };
    console.error("Error occurred in updating the flag:", error);
    return NextResponse.json(
      {
        error: "Failed to update Remote Config flag.",
        details: error?.message || "An unknown error occurred.",
        code: error?.code || "unknown",
      },
      { status: 500 }
    );
  }
}
