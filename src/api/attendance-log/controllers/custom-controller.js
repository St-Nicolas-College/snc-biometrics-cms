//@ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::attendance-log.attendance-log",
  ({ strapi }) => ({
    async getAttendanceLogs(ctx) {
      try {
        console.log("[getAttendanceLogs] Incoming Request");
        const { userid } = ctx.params;
        const myQuery = `
               WITH logs_by_day AS (
                SELECT
                    al.user_id,
                    DATE(al.timestamp) AS log_date,
                    MIN(al.timestamp) AS in_time,
                    MAX(al.timestamp) AS out_time,
                    COUNT(*) AS entries
                FROM attendance_logs al
                GROUP BY al.user_id, DATE(al.timestamp)
                ),
                weekday_shift AS (
                SELECT
                    uws.user_id,
                    st.shift_name,
                    st.shift_start,
                    st.shift_end,
                    st.grace_period_minutes,
                    uws.weekday
                FROM user_weekday_shifts uws
                JOIN shift_types st ON uws.shift_type_id = st.id
                )
                SELECT
                u.name,
                l.user_id,
                l.log_date,
                l.in_time,
                l.out_time,
                ws.shift_name,
                ws.shift_start,
                ws.shift_end,
                ws.grace_period_minutes,
                CASE
                    WHEN l.in_time::time > (ws.shift_start + (ws.grace_period_minutes || ' minutes')::interval)
                    THEN 'Late' ELSE 'On Time'
                END AS late_status,
                CASE
                    WHEN l.out_time::time < ws.shift_end THEN 'Left Early' ELSE 'OK'
                END AS early_leave_status,
                CASE
                    WHEN l.in_time::time > (ws.shift_start + (ws.grace_period_minutes || ' minutes')::interval)
                    THEN FLOOR(
                    EXTRACT(EPOCH FROM (l.in_time::time - ws.shift_start - (ws.grace_period_minutes || ' minutes')::interval)) / 60
                    )
                    ELSE 0
                END AS late_minutes
                FROM logs_by_day l
                JOIN user_accounts u ON u.user_id = l.user_id
                JOIN weekday_shift ws
                ON ws.user_id = l.user_id
                AND EXTRACT(DOW FROM l.log_date) = ws.weekday
                ORDER BY l.user_id, l.log_date DESC`;
        const result = await strapi.db.connection.context.raw(myQuery);
        if (result) {
            ctx.status = 200;
        ctx.body = result.rows;
        }
      } catch (err) {
        console.log("[getAttendanceLogs] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    async getUserAtttendance(ctx) {
        try {
            console.log("[getAttendanceLogs] Incoming Request");
            const { userid } = ctx.params;
            const myQuery = `
                   WITH logs_by_day AS (
                    SELECT
                        al.user_id,
                        DATE(al.timestamp) AS log_date,
                        MIN(al.timestamp) AS in_time,
                        MAX(al.timestamp) AS out_time,
                        COUNT(*) AS entries
                    FROM attendance_logs al
                    GROUP BY al.user_id, DATE(al.timestamp)
                    ),
                    weekday_shift AS (
                    SELECT
                        uws.user_id,
                        st.shift_name,
                        st.shift_start,
                        st.shift_end,
                        st.grace_period_minutes,
                        uws.weekday
                    FROM user_weekday_shifts uws
                    JOIN shift_types st ON uws.shift_type_id = st.id
                    )
                    SELECT
                    u.name,
                    l.user_id,
                    l.log_date,
                    l.in_time,
                    l.out_time,
                    ws.shift_name,
                    ws.shift_start,
                    ws.shift_end,
                    ws.grace_period_minutes,
                    CASE
                        WHEN l.in_time::time > (ws.shift_start + (ws.grace_period_minutes || ' minutes')::interval)
                        THEN 'Late' ELSE 'On Time'
                    END AS late_status,
                    CASE
                        WHEN l.out_time::time < ws.shift_end THEN 'Left Early' ELSE 'OK'
                    END AS early_leave_status,
                    CASE
                        WHEN l.in_time::time > (ws.shift_start + (ws.grace_period_minutes || ' minutes')::interval)
                        THEN FLOOR(
                        EXTRACT(EPOCH FROM (l.in_time::time - ws.shift_start - (ws.grace_period_minutes || ' minutes')::interval)) / 60
                        )
                        ELSE 0
                    END AS late_minutes
                    FROM logs_by_day l
                    JOIN user_accounts u ON u.user_id = l.user_id
                    JOIN weekday_shift ws
                    ON ws.user_id = l.user_id
                    AND EXTRACT(DOW FROM l.log_date) = ws.weekday
                    WHERE u.user_id = '${userid}'
                    ORDER BY l.user_id, l.log_date DESC`;
            const result = await strapi.db.connection.context.raw(myQuery);
            if (result) {
                ctx.status = 200;
            ctx.body = result.rows;
            }
          } catch (err) {
            console.log("[getAttendanceLogs] Error: ", err.message);
            return ctx.badRequest(err.message, err);
          }
    }
  })
);
