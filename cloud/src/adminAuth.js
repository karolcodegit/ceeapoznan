const { timingSafeEqual } = require("crypto");

function requireAdminKey(req, res, headerName = "x-admin-key") {
  const expected = process.env.ADMIN_KEY;
  if (typeof expected !== "string" || expected.length === 0) {
    res.status(503).json({ error: "Admin authorization is not configured" });
    return false;
  }

  const supplied = req.headers[headerName];
  if (typeof supplied !== "string") {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  const expectedBytes = Buffer.from(expected);
  const suppliedBytes = Buffer.from(supplied);
  if (
    suppliedBytes.length !== expectedBytes.length ||
    !timingSafeEqual(suppliedBytes, expectedBytes)
  ) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  return true;
}

module.exports = { requireAdminKey };
