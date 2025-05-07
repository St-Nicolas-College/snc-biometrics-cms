//@ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::department.department",
  ({ strapi }) => ({
    async getDepartmentList(ctx) {
      try {
        console.log("[getDepartmentList] Incoming Request");
        const result = await strapi
          .documents("api::department.department")
          .findMany({
            orderBy: { id: "ASC" },
          });

        if (result) {
          ctx.status = 200;
          return (ctx.body = result);
        }
      } catch (err) {
        console.log("[getDepartmentList] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },
  })
);
