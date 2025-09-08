const Advertisement = require('../models/advertisement');
const Agent = require('../models/agent');

const createAdvertisement = async (req, res) => {
  try {
    const {
      program,
      rating,
      pricePerMinute,
      duration,
      totalPrice,
      date,
      organizationName,
      contactPerson,
      bankDetails,
	  phoneNumber,
    } = req.body;

    if (!program || !rating || !pricePerMinute || !duration || !totalPrice || 
        !date || !organizationName || !contactPerson || !bankDetails || !phoneNumber) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    if (duration < 1) {
      return res.status(400).json({
        message: 'Duration must be at least 1 minute'
      });
    }

    const calculatedPrice = duration * pricePerMinute;
    if (Math.abs(calculatedPrice - totalPrice) > 0.01) {
      return res.status(400).json({
        message: 'Total price calculation mismatch'
      });
    }

    const advertisement = new Advertisement({
      program,
      rating,
      pricePerMinute,
      duration,
      totalPrice,
      date,
      organizationName,
      contactPerson,
      bankDetails,
	  phoneNumber,
      userId: req.user.id 
    });

    const savedAdvertisement = await advertisement.save();

    res.status(201).json({
      message: 'Advertisement order created successfully',
      advertisement: savedAdvertisement
    });

  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({
      message: 'Failed to create advertisement order',
      error: error.message
    });
  }
};

const getAdvertisements = async (req, res) => {
  try {
    const pageSize = +req.query.pagesize || 10;
    const currentPage = +req.query.page || 1;
    const statusFilter = req.query.status;

    let query = Advertisement.find();
    
    if (statusFilter) {
      query = query.where('status').equals(statusFilter);
    }

    if (pageSize && currentPage) {
      query
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    const advertisements = await query
      .populate('userId', 'email') 
      .populate('agentId', 'name commissionPercentage') 
      .sort({ createdAt: -1 }); 

    const advertisementsWithEarnings = advertisements.map(ad => {
      const adObj = ad.toObject();
      if (adObj.agentId && adObj.agentId.commissionPercentage) {
        adObj.agentEarnings = (adObj.totalPrice * adObj.agentId.commissionPercentage) / 100;
        adObj.agentName = adObj.agentId.name;
        adObj.agentCommission = adObj.agentId.commissionPercentage;
      }
      return adObj;
    });

    const countQuery = statusFilter ? 
      Advertisement.countDocuments({ status: statusFilter }) :
      Advertisement.countDocuments();
    
    const count = await countQuery;

    res.status(200).json({
      message: 'Advertisements fetched successfully',
      advertisements: advertisementsWithEarnings,
      maxAdvertisements: count
    });

  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({
      message: 'Failed to fetch advertisements',
      error: error.message
    });
  }
};

const getUserAdvertisements = async (req, res) => {
  try {
    const pageSize = +req.query.pagesize || 10;
    const currentPage = +req.query.page || 1;

    const query = Advertisement.find({ userId: req.user.id });

    if (pageSize && currentPage) {
      query
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    const advertisements = await query
      .populate('agentId', 'name commissionPercentage')
      .sort({ createdAt: -1 });
    
    const count = await Advertisement.countDocuments({ userId: req.user.id });

    res.status(200).json({
      message: 'User advertisements fetched successfully',
      advertisements,
      maxAdvertisements: count
    });

  } catch (error) {
    console.error('Error fetching user advertisements:', error);
    res.status(500).json({
      message: 'Failed to fetch user advertisements',
      error: error.message
    });
  }
};

const updateAdvertisementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value'
      });
    }

    const advertisement = await Advertisement.findById(id);
    if (!advertisement) {
      return res.status(404).json({
        message: 'Advertisement not found'
      });
    }

    advertisement.status = status;
    advertisement.updatedAt = Date.now();
    
    const updatedAdvertisement = await advertisement.save();

    res.status(200).json({
      message: 'Advertisement status updated successfully',
      advertisement: updatedAdvertisement
    });

  } catch (error) {
    console.error('Error updating advertisement status:', error);
    res.status(500).json({
      message: 'Failed to update advertisement status',
      error: error.message
    });
  }
};

const assignAgentToAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        message: 'Agent not found'
      });
    }

    const advertisement = await Advertisement.findById(id);
    if (!advertisement) {
      return res.status(404).json({
        message: 'Advertisement not found'
      });
    }

    advertisement.agentId = agentId;
    advertisement.updatedAt = Date.now();
    
    const updatedAdvertisement = await advertisement.save();
    await updatedAdvertisement.populate('agentId', 'name commissionPercentage');

    res.status(200).json({
      message: 'Agent assigned to advertisement successfully',
      advertisement: updatedAdvertisement
    });

  } catch (error) {
    console.error('Error assigning agent to advertisement:', error);
    res.status(500).json({
      message: 'Failed to assign agent to advertisement',
      error: error.message
    });
  }
};

const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Advertisement.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({
        message: 'Advertisement not found'
      });
    }

    res.status(200).json({
      message: 'Advertisement deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({
      message: 'Failed to delete advertisement',
      error: error.message
    });
  }
};

module.exports = {
  createAdvertisement,
  getAdvertisements,
  getUserAdvertisements,
  updateAdvertisementStatus,
  assignAgentToAdvertisement,
  deleteAdvertisement
};