export async function validateWebOn(args) {
  const { domain } = args;
  let manifest;
  const manifestURL = `https://${domain}/nomo_manifest.json`;
  const fallbackManifestURL = `https://webon3.com/${domain}/nomo_manifest.json`;
  try {
    const res = await fetch(manifestURL);
    manifest = await res.json();
  } catch (error1) {
    try {
      const res = await fetch(fallbackManifestURL);
      manifest = await res.json();
    } catch (error2) {
      throw new Error(
        `Failed to fetch ${manifestURL} or ${fallbackManifestURL}: ${error1.message}`
      );
    }
  }
  validateManifest(manifest);
}

function validateManifest(manifest) {
  const webonVersion = manifest.webon_version;
  if (!webonVersion) {
    throw new Error("webon_version is missing");
  }
  if (!isValidSemanticVersion(webonVersion)) {
    throw new Error(
      `webon_version ${webonVersion} does not comply with semantic versioning regexp`
    );
  }

  const webon_id = manifest.webon_id;
  if (!webon_id) {
    throw new Error("webon_id is missing");
  }
  if (!isValidWebOnId(webon_id)) {
    throw new Error(`webon_id ${webon_id} does not comply with regexp`);
  }

  const manifestVersion = manifest.nomo_manifest_version;
  if (!manifestVersion) {
    throw new Error("nomo_manifest_version is missing");
  }
  if (!isValidSemanticVersion(manifestVersion)) {
    throw new Error(
      `nomo_manifest_version ${manifestVersion} does not comply with semantic versioning regexp`
    );
  }

  if (!manifest.webon_name) {
    throw new Error("webon_name is missing");
  }
  if (manifest.webon_name.trim() === "") {
    throw new Error("webon_name is empty");
  }

  const minNomoVersion = manifest.min_nomo_version;
  if (minNomoVersion !== null && minNomoVersion !== undefined) {
    if (!isValidSemanticVersion(minNomoVersion)) {
      throw new Error(
        `min_nomo_version ${minNomoVersion} does not comply with semantic versioning regexp`
      );
    }
  }
}

function isValidWebOnId(webon_id) {
  const webonIdRegExp =
    /^(?:[a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+$/;
  return webonIdRegExp.test(webon_id);
}

function isValidSemanticVersion(version) {
  const pattern = /^(\d+)\.(\d+)\.(\d+)$/;
  return pattern.test(version);
}
