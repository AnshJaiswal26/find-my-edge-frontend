import { schemaApi } from "@shared/api/schema.api";
import { SchemaSource } from "@lib/analytics/schema";

/* ---------------- HELPERS ---------------- */

const validateSchema = (schema) => {
  if (!schema) throw new Error("Schema is required");
  if (!schema.label) throw new Error("Schema must have a label");
  if (!schema.semanticType) throw new Error("Schema must have a semantic type");

  if (schema.source === SchemaSource.COMPUTED && !schema.ast) {
    throw new Error("Computed schema must have AST");
  }
};

/* ---------------- SERVICE ---------------- */

export const schemaService = {
  /* -------- CREATE -------- */
  async create(schema) {
    validateSchema(schema);

    const res = await schemaApi.create(schema);

    // normalize response
    return res;
  },

  /* -------- GET ALL -------- */
  async getAll() {
    const res = await schemaApi.getAll();

    return res;
  },

  /* -------- UPDATE -------- */
  async update(id, updates) {
    if (!id) throw new Error("Schema id is required");

    validateSchema(updates);

    const res = await schemaApi.update(id, updates);

    return res;
  },

  /* -------- DELETE -------- */
  async delete(id) {
    if (!id) throw new Error("Schema id is required");

    const res = await schemaApi.delete(id);

    return res;
  },

  /* -------- UPDATE ORDER -------- */
  async updateOrder(order, viewType) {
    if (!order || !Array.isArray(order) || order.length === 0) {
      throw new Error("Order must be a non-empty array");
    }

    if (!viewType) {
      throw new Error("View type is required");
    }

    return await schemaApi.updateOrder(order, viewType);
  },
};
