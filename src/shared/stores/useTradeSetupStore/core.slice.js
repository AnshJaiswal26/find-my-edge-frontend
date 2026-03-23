import { tradeSetupService } from "../../services/tradeSetup.service";

export const createCoreSlice = (set, get) => ({
  tradeSetupsOrder: [],
  tradeSetupsById: {
    // "setup-1": {
    //   id: "setup-1",
    //   name: "Breakout Reversal",
    //   imageUrl:
    //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqBnJX4nYPZ3YfjKSL9dlGsuG3bdrIGJySQQ&s",
    //   imagePublicId: "xyz",
    //   fieldOrder: [
    //     "field-1",
    //     "field-2",
    //     "field-3",
    //     "field-4",
    //     "field-5",
    //     "field-6",
    //   ],
    //   fieldsById: {
    //     "field-1": {
    //       id: "field-1",
    //       mappedSchemaId: "pnl",
    //       condition: "greaterThan",
    //       expected: 500,
    //       from: 0,
    //       to: 0,
    //       tag: "GOOD",
    //     },
    //     "field-2": {
    //       id: "field-2",
    //       mappedSchemaId: "entryTime",
    //       condition: "isBetween",
    //       expected: 0,
    //       from: parseInputValue("09:30:00", "time"),
    //       to: parseInputValue("11:00:00", "time"),
    //       tag: "GOOD",
    //     },
    //     "field-3": {
    //       id: "field-3",
    //       mappedSchemaId: "duration",
    //       condition: "lessThan",
    //       expected: 1800,
    //       from: 0,
    //       to: 0,
    //       tag: "GOOD",
    //     },
    //     "field-4": {
    //       id: "field-4",
    //       mappedSchemaId: "qty",
    //       condition: "isBetween",
    //       expected: 0,
    //       from: 20,
    //       to: 30,
    //       tag: "GOOD",
    //     },
    //     "field-5": {
    //       id: "field-3",
    //       mappedSchemaId: "pnl",
    //       condition: "greaterThan",
    //       expected: 1200,
    //       from: 0,
    //       to: 0,
    //       tag: "VERY_GOOD",
    //     },
    //     "field-6": {
    //       id: "field-6",
    //       mappedSchemaId: "pnl",
    //       condition: "greaterThan",
    //       expected: 2000,
    //       from: 0,
    //       to: 0,
    //       tag: "EXCELLENT",
    //     },
    //   },
    // },
  },

  isSubmitting: false,

  async addSetupField(setupId, payload) {
    if (!setupId) return;
    set({ isSubmitting: true });

    try {
      const field = await tradeSetupService.addField(setupId, payload);

      set((s) => {
        s.tradeSetupsById[setupId].fieldOrder.push(field.id);
        s.tradeSetupsById[setupId].fieldsById[field.id] = field;
      });

      get().closePopup();
    } catch (err) {
      console.error(err);
    } finally {
      set({ isSubmitting: false });
    }
  },

  async deleteSetupField(setupId, id, index) {
    const fieldId = get().tradeSetupsById[setupId].fieldOrder[index];
    if (id !== fieldId) return;

    set({ isSubmitting: true });

    try {
      await tradeSetupService.deleteField(setupId, fieldId);

      set((s) => {
        s.tradeSetupsById[setupId].fieldOrder.splice(index, 1);
        delete s.tradeSetupsById[setupId].fieldsById[fieldId];
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isSubmitting: false });
    }
  },

  async addTradeSetup(payload) {
    set({ isSubmitting: true });

    try {
      const setup = await tradeSetupService.create(payload);

      set((s) => {
        s.tradeSetupsOrder.push(setup.id);
        s.tradeSetupsById[setup.id] = {
          ...setup,
          fieldOrder: [],
          fieldsById: {},
        };
      });

      get().closePopup();
    } catch (err) {
      console.error(err);
    } finally {
      set({ isSubmitting: false });
    }
  },

  async updateTradeSetup(setupId, payload) {
    if (!setupId) return;

    set({ isSubmitting: true });

    try {
      const updated = await tradeSetupService.update(setupId, payload);

      set((s) => {
        s.tradeSetupsById[setupId] = {
          ...s.tradeSetupsById[setupId],
          ...updated,
        };
      });

      get().closePopup();
    } catch (err) {
      console.error(err);
    } finally {
      set({ isSubmitting: false });
    }
  },

  async deleteTradeSetup(setupId) {
    if (!setupId) return;

    set({ isSubmitting: true });

    try {
      await tradeSetupService.delete(setupId);

      set((s) => {
        delete s.tradeSetupsById[setupId];
        s.tradeSetupsOrder = s.tradeSetupsOrder.filter((id) => id !== setupId);
      });

      get().closePopup(); // optional (only if delete happens in popup)
    } catch (err) {
      console.error(err);
    } finally {
      set({ isSubmitting: false });
    }
  },
});
