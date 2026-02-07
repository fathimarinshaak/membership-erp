const MembershipPlan = require('../model/MembershipPlan')


exports.createPlan = async (req, res) => {
  try {
    const { name, durationInDays, price, features, isActive, category } = req.body
    const plan = await MembershipPlan.create({ name, durationInDays, price, features, isActive, category })
    res.status(201).json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" })
  }
}

exports.getPlans = async (req, res) => {
    try {
        const plans = await MembershipPlan.find();
        res.status(200).json(plans);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.updatePlan = async (req, res) => {
  try {
    const { name, durationInDays, price, features, isActive, category } = req.body
    const plan = await MembershipPlan.findByIdAndUpdate(
      req.params.id,
      { name, durationInDays, price, features, isActive, category },
      { new: true }
    );
    res.status(200).json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" })
  }
}

exports.deletePlan = async (req, res) => {
    try {
        await MembershipPlan.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Plan deleted' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server Error' })
    }
}