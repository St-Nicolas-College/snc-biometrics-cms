// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::shift-type.shift-type",
  ({ strapi }) => ({
    async getShiftList(ctx) {
      try {
        console.log("[getUgetShiftserList] Incoming Request");
        const { userid } = ctx.params;

        let myPayload = {
          data: [],
          message: "Successfully fetch data!",
          status: "success",
        };
        const result = await strapi
          .documents("api::shift-type.shift-type")
          .findMany({
            filters: {
              user_id: userid,
            },
            orderBy: { id: "ASC" },
          });

        if (result) {
          ctx.status = 200;
          return (ctx.body = result);
        }
      } catch (err) {
        console.log("[getShift] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    async createShift(ctx) {
      try {
        console.log("[createShift] Incoming Request");
        let {
          user_id,
          shift_name,
          shift_start,
          shift_end,
          grace_period,
          is_active,
          weekday,
        } = ctx.request.body;

        let myPayload = {
          data: {},
          message: "Successfully Created!",
          status: "success",
        };

        let existingPayload = {
          message: `"${shift_name}" Shift  already exist!`,
          status: "fail",
        };

        // Check if there is an existing shift record for the current user id
        const checkDuplicate = await strapi
          .documents("api::shift-type.shift-type")
          .findMany({
            where: {
              $and: [
                {
                  user_id: user_id,
                },
                {
                  shift_name: shift_name,
                },
              ],
            },
          });

        if (checkDuplicate.length != 0) {
          console.log("[createShift] Error: ", checkDuplicate);
          return (ctx.body = existingPayload);
        }

        // Create a new shift, if there is no existing record
        const result = await strapi
          .documents("api::shift-type.shift-type")
          .create({
            data: {
              user_id: user_id,
              shift_name: shift_name,
              shift_start: shift_start,
              shift_end: shift_end,
              grace_period_minutes: grace_period,
              is_active: is_active,
            },
          });

        // Create user weekday shift
        await strapi
          .documents("api::user-weekday-shift.user-weekday-shift")
          .create({
            data: {
              user_id: user_id,
              weekday: weekday,
              shift_type_id: result.id,
            },
          });
        if (result) {
          myPayload.data = result;
          ctx.status = 200;
          return (ctx.body = myPayload);
        }
      } catch (err) {
        console.log("[createShift] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    async updateShift(ctx) {
      try {
        console.log("[updateShift] Incoming Request");
        const { documentid } = ctx.params;
        let {
          user_id,
          shift_name,
          shift_start,
          shift_end,
          grace_period,
          is_active,
        } = ctx.request.body;

        let myPayload = {
          data: {},
          message: "Successfully Updated!",
          status: "success",
        };

        
        // Update selected shift
        const result = await strapi
          .documents("api::shift-type.shift-type")
          .update({
            documentId: documentid,
            data: {
              shift_name: shift_name,
              shift_start: shift_start,
              shift_end: shift_end,
              grace_period_minutes: grace_period,
              is_active: is_active,
            },
          });

        if (result) {
          myPayload.data = result;
          ctx.status = 200;
          return (ctx.body = myPayload);
        }
      } catch (err) {
        console.log("[updateShift] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },
  })
);
