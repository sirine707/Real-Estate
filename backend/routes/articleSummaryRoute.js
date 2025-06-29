import express from "express";
import firecrawlService from "../services/firecrawlService.js";

const router = express.Router();

// GET /api/article-summary?url=...
router.get("/", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res
      .status(400)
      .json({ success: false, message: "Missing url parameter" });
  }
  const result = await firecrawlService.getArticleSummaryFromUrl(url);
  if (result.success) {
    res.json({ success: true, summary: result.summary });
  } else {
    res.status(500).json({ success: false, message: result.message });
  }
});

export default router;
