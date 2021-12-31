function user(_, args, ctx, info) {
  // return prisma.user({ id: args.id });
  return ctx.db.query.user({ where: { id: args.id } }, info);
}

module.exports = {
  user,
};
