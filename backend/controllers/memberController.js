exports.dashboard = (req, res) => {
  return res.json({
    success: true,
    msg: "Member dashboard",
    member: req.member
  });
}