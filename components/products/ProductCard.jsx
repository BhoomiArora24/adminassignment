"use client";
import { memo } from "react";
import Link from "next/link";
import { Box, Card, CardActionArea, CardContent, Chip, Rating, Typography } from "@mui/material";
import { titleCase } from "@/lib/api";

// memo: grid re-renders on every pagination/filter change; unchanged cards skip rendering.
export default memo(function ProductCard({ p }) {
  return (
    <Card sx={{ height: "100%", transition: "border-color 150ms", "&:hover": { borderColor: "primary.main" } }}>
      <CardActionArea component={Link} href={`/dashboard/products/${p.id}`} sx={{ height: "100%" }} aria-label={`View details for ${p.title}`}>
        <Box component="img" src={p.thumbnail} alt={p.title} loading="lazy" sx={{ width: "100%", aspectRatio: "1", objectFit: "contain", bgcolor: "#F2F2EC" }} />
        <CardContent>
          <Typography noWrap sx={{ fontWeight: 500 }}>{p.title}</Typography>
          <Chip size="small" label={titleCase(p.category)} sx={{ my: 0.5 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography>${p.price}</Typography><Rating value={p.rating} precision={0.1} size="small" readOnly aria-label={`Rated ${p.rating} out of 5`} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});
