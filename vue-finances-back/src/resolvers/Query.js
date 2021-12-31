const { getUserId } = require("./../utils");

function user(_, args, ctx, info) {
  // return prisma.user({ id: args.id });
  const userId = getUserId(ctx);
  return ctx.db.query.user({ where: { id: userId } }, info);
}

module.exports = {
  user,
};
