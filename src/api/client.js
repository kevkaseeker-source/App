export const api = {
  entities: {
    DamageReport: {
      async create(data) {
        console.log("Damage report saved:", data);
        return data;
      },

      async list() {
        return [];
      }
    }
  },

  auth: {
    async me() {
      return { id: "local-user" };
    },

    async logout() {
      return true;
    }
  }
};