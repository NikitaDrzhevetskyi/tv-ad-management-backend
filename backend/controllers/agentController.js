const Agent = require('../models/agent');
const Advertisement = require('../models/advertisement');

const createAgent = async (req, res) => {
  try {
    const { name, commissionPercentage } = req.body;

    if (!name || commissionPercentage === undefined) {
      return res.status(400).json({
        message: 'Name and commission percentage are required'
      });
    }

    if (commissionPercentage < 0 || commissionPercentage > 100) {
      return res.status(400).json({
        message: 'Commission percentage must be between 0 and 100'
      });
    }

    const existingAgent = await Agent.findOne({ name: name.trim() });
    if (existingAgent) {
      return res.status(400).json({
        message: 'Agent with this name already exists'
      });
    }

    const agent = new Agent({
      name: name.trim(),
      commissionPercentage: Number(commissionPercentage)
    });

    const savedAgent = await agent.save();

    res.status(201).json({
      message: 'Agent created successfully',
      agent: savedAgent
    });

  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({
      message: 'Failed to create agent',
      error: error.message
    });
  }
};

const getAgents = async (req, res) => {
  try {
    const pageSize = +req.query.pagesize || 10;
    const currentPage = +req.query.page || 1;

    const query = Agent.find();

    if (pageSize && currentPage) {
      query
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    const agents = await query.sort({ createdAt: -1 });
    const count = await Agent.countDocuments();

    const agentsWithCalculations = await Promise.all(
      agents.map(async (agent) => {
        const totalDealValue = await Advertisement.aggregate([
          { $match: { agentId: agent._id } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const dealValue = totalDealValue.length > 0 ? totalDealValue[0].total : 0;
        const totalEarned = (dealValue * agent.commissionPercentage) / 100;

        return {
          ...agent.toJSON(),
          totalDealValue: dealValue,
          totalEarned: totalEarned
        };
      })
    );

    res.status(200).json({
      message: 'Agents fetched successfully',
      agents: agentsWithCalculations,
      maxAgents: count
    });

  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      message: 'Failed to fetch agents',
      error: error.message
    });
  }
};

const getAgentById = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({
        message: 'Agent not found'
      });
    }

    const totalDealValue = await Advertisement.aggregate([
      { $match: { agentId: agent._id } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const dealValue = totalDealValue.length > 0 ? totalDealValue[0].total : 0;
    const totalEarned = (dealValue * agent.commissionPercentage) / 100;

    const agentWithCalculations = {
      ...agent.toJSON(),
      totalDealValue: dealValue,
      totalEarned: totalEarned
    };

    res.status(200).json({
      message: 'Agent fetched successfully',
      agent: agentWithCalculations
    });

  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({
      message: 'Failed to fetch agent',
      error: error.message
    });
  }
};

const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, commissionPercentage } = req.body;

    if (!name || commissionPercentage === undefined) {
      return res.status(400).json({
        message: 'Name and commission percentage are required'
      });
    }

    if (commissionPercentage < 0 || commissionPercentage > 100) {
      return res.status(400).json({
        message: 'Commission percentage must be between 0 and 100'
      });
    }

    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({
        message: 'Agent not found'
      });
    }

    const existingAgent = await Agent.findOne({ 
      name: name.trim(), 
      _id: { $ne: id } 
    });
    if (existingAgent) {
      return res.status(400).json({
        message: 'Agent with this name already exists'
      });
    }

    agent.name = name.trim();
    agent.commissionPercentage = Number(commissionPercentage);
    agent.updatedAt = Date.now();

    const updatedAgent = await agent.save();

    res.status(200).json({
      message: 'Agent updated successfully',
      agent: updatedAgent
    });

  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({
      message: 'Failed to update agent',
      error: error.message
    });
  }
};

const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const advertisementCount = await Advertisement.countDocuments({ agentId: id });
    if (advertisementCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete agent with existing advertisements. Please reassign or remove associated advertisements first.'
      });
    }

    const result = await Agent.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      message: 'Agent deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({
      message: 'Failed to delete agent',
      error: error.message
    });
  }
};

module.exports = {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent
};