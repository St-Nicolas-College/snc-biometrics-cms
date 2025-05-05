// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-account.user-account',
    ({ strapi }) => ({
        async getUserList(ctx) {
            try {
                console.log("[getUserList] Incoming Request");
                const result = await strapi
                  .documents("api::user-account.user-account")
                  .findMany({
                    orderBy: { id: "ASC" },
                  });
        
                if (result) {
                  ctx.status = 200;
                  return (ctx.body = result);
                }
            } catch (err) {
                console.log("[getUserList] Error: ", err.message);
                return ctx.badRequest(err.message, err);
            }
        }
    })
);