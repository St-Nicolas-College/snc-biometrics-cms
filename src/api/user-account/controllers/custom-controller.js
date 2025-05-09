const { filter } = require("../../../../config/middlewares");

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::user-account.user-account",
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
    },

    async getUserDetails(ctx) {
      try {
        console.log("[getUserList] Incoming Request");
        const { userid } = ctx.params;

        let myPayload = {
          data: [],
          message: "Successfully fetch data!",
          status: "success",
        };
        console.log("Ongoing");

        const result = await strapi
          .documents("api::user-account.user-account")
          .findMany({
            filters: {
              user_id: { $eq: userid },
            },
          });
        console.log("Result");

        return result;

        // if (result) {
        //   console.log("Result 2");
        //   myPayload.data = result;
        //   ctx.status = 200;
        //   return (ctx.body = myPayload);
        // }
      } catch (err) {
        console.log("[getUserDetails] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    async updateUserDetails(ctx) {
      try {
        console.log("[updateUserDetails] Incoming Request");
        const { userid } = ctx.params;
        let { name, department, department_docid, department_id } =
          ctx.request.body;

        let myPayload = {
          data: {},
          message: "Successfully Updated!",
          status: "success",
        };

        const result = await strapi.db
          .query("api::user-account.user-account")
          .update({
            where: { user_id: userid },
            data: {
              name: name,
              department: department,
              department_id: department_docid,
              department_code: {
                connect: [department_id],
              },
            },
          });

        // const result = await strapi
        //   .documents("api::user-account.user-account")
        //   .update({
        //     documentId: doc.id,
        //     data: {
        //       name: name,
        //       department: department,
        //       department_id: department_docid,
        //       department_code: {
        //         connect: [department_id],
        //       },
        //     },
        //   });

        if (result) {
          myPayload.data = result;
          ctx.status = 200;
          return (ctx.body = myPayload);
        }
      } catch (err) {
        console.log("[updateUserDetails] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },
  })
);
