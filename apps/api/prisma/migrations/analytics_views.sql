-- apps/api/prisma/migrations/analytics_views.sql
-- Postgres-as-Lake Materialized Views & Refresh Function (Spec §28.4)

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- 1. Receita/custo/margem por mês
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_invoice_monthly AS
SELECT 
  date_trunc('month', "emittedAt") AS month,
  "erpType",
  COUNT(*) AS invoice_count,
  SUM(o."totalBrl") AS revenue,
  AVG(o."totalBrl") AS avg_ticket,
  COUNT(DISTINCT o."customerId") AS unique_customers
FROM "Invoice" i
JOIN "Order" o ON o.id = i."orderId"
WHERE i.status = 'EMITTED'
GROUP BY 1, 2
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_invoice_monthly 
  ON analytics_invoice_monthly(month, "erpType");

-- 2. Performance por produto
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_product_performance AS
SELECT 
  p.id AS product_id,
  p.name,
  c.slug AS category_slug,
  COUNT(DISTINCT o.id) AS order_count,
  COALESCE(SUM(oi.quantity), 0) AS units_sold,
  COALESCE(SUM(oi."totalBrl"), 0) AS revenue,
  AVG(oi."unitPriceBrl") AS avg_price_brl,
  COUNT(DISTINCT r.id) AS review_count,
  AVG(r.rating) AS avg_rating,
  COUNT(DISTINCT w.id) AS wishlist_count
FROM "Product" p
LEFT JOIN "OrderItem" oi ON oi."productId" = p.id
LEFT JOIN "Order" o ON o.id = oi."orderId" AND o.status = 'DELIVERED'
LEFT JOIN "Category" c ON c.id = p."categoryId"
LEFT JOIN "Review" r ON r."productId" = p.id AND r."isApproved" = true
LEFT JOIN "WishlistItem" w ON w."productId" = p.id
GROUP BY p.id, p.name, c.slug
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_product_performance 
  ON analytics_product_performance(product_id);

-- 3. Segmentação RFM (Recency, Frequency, Monetary)
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_customer_rfm AS
SELECT 
  c.id AS customer_id,
  c.email,
  COALESCE(EXTRACT(DAY FROM NOW() - MAX(o."createdAt"))::INT, 999) AS recency_days,
  COUNT(DISTINCT o.id) AS frequency_count,
  COALESCE(SUM(o."totalBrl"), 0) AS monetary_brl,
  CASE
    WHEN EXTRACT(DAY FROM NOW() - MAX(o."createdAt"))::INT < 30 
      AND COUNT(DISTINCT o.id) >= 3 THEN 'CHAMPION'
    WHEN EXTRACT(DAY FROM NOW() - MAX(o."createdAt"))::INT < 90 
      AND COUNT(DISTINCT o.id) >= 2 THEN 'LOYAL'
    WHEN EXTRACT(DAY FROM NOW() - MAX(o."createdAt"))::INT < 30 
      AND COUNT(DISTINCT o.id) = 1 THEN 'POTENTIAL'
    WHEN EXTRACT(DAY FROM NOW() - MAX(o."createdAt"))::INT < 180 THEN 'AT_RISK'
    ELSE 'LOST'
  END AS segment,
  ROW_NUMBER() OVER (
    ORDER BY 
      COALESCE(EXTRACT(DAY FROM NOW() - MAX(o."createdAt")), 999) ASC,
      COUNT(DISTINCT o.id) DESC,
      COALESCE(SUM(o."totalBrl"), 0) DESC
  )::INT AS rfm_score
FROM "Customer" c
LEFT JOIN "Order" o ON o."customerId" = c.id AND o.status IN ('DELIVERED', 'SHIPPED', 'IN_CUSTOMS')
GROUP BY c.id, c.email
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_customer_rfm 
  ON analytics_customer_rfm(customer_id);

-- 4. Elasticidade de preço por estado
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_state_pricing AS
SELECT 
  a.state,
  p.id AS product_id,
  p.name,
  AVG(oi."unitPriceBrl") AS avg_price_brl,
  COUNT(DISTINCT o.id) AS order_count,
  SUM(oi.quantity) AS units_sold
FROM "Order" o
JOIN "OrderItem" oi ON oi."orderId" = o.id
JOIN "Product" p ON p.id = oi."productId"
JOIN "Customer" c ON c.id = o."customerId"
JOIN "Address" a ON a."customerId" = c.id AND a."isDefault" = true
WHERE o.status = 'DELIVERED'
GROUP BY a.state, p.id, p.name
HAVING COUNT(DISTINCT o.id) >= 1
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_state_pricing 
  ON analytics_state_pricing(state, product_id);

CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_invoice_monthly;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_product_performance;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_customer_rfm;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_state_pricing;
END;
$$ LANGUAGE plpgsql;
