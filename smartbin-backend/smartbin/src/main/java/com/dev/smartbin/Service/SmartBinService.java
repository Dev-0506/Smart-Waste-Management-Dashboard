package com.dev.smartbin.Service;

import com.dev.smartbin.Model.DeviceOnboardRequest;
import com.dev.smartbin.Model.SmartBin;
import com.dev.smartbin.Repository.DeviceOnboardRequestRepo;
import com.dev.smartbin.Repository.SmartBinRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class SmartBinService {

    @Autowired
    private SmartBinRepo smartBinRepo;

    @Autowired
    private DeviceOnboardRequestRepo deviceOnboardRequestRepo;

    private static final Logger logger = LoggerFactory.getLogger(SmartBinService.class);

    public SmartBin saveSmartBinData(SmartBin smartBin) {
        logger.info("inside service saveSmartBinData");
        return smartBinRepo.saveAndFlush(smartBin);
    }

    public DeviceOnboardRequest saveDeviceOnboardRequest(DeviceOnboardRequest deviceOnboardRequest) {
        logger.info("inside service saveDeviceOnboardRequest");
        return deviceOnboardRequestRepo.saveAndFlush(deviceOnboardRequest);
    }

    public List<SmartBin> getSmartBinData() {
        logger.info("inside service getSmartBinData");
        return smartBinRepo.findAll();

    }
}
