package com.dev.smartbin.Service;

import com.dev.smartbin.DTO.DeviceOnboardRequestDTO;
import com.dev.smartbin.Model.DeviceOnboardRequest;
import com.dev.smartbin.Model.SmartBin;
import com.dev.smartbin.Repository.DeviceOnboardRequestRepo;
import com.dev.smartbin.Repository.SmartBinRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;


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

    public DeviceOnboardRequest saveDeviceOnboardRequest(DeviceOnboardRequestDTO deviceOnboardRequest) {
        logger.info("inside service saveDeviceOnboardRequest");
        Optional<SmartBin> smartBin = smartBinRepo.findSmartBinByDeviceId(deviceOnboardRequest.getDevice_id());

        DeviceOnboardRequest onboardRequest = new DeviceOnboardRequest();
        onboardRequest.setDeviceOnBoardStatus(deviceOnboardRequest.getDeviceOnBoardStatus());
        if (smartBin.isPresent()) {
            onboardRequest.setSmartBin(smartBin.get());
        } else {
            logger.error("saveDeviceOnboardRequest: Incorrect device id passed");
        }
        onboardRequest.setCreatedAt(deviceOnboardRequest.getCreatedAt());
        return deviceOnboardRequestRepo.saveAndFlush(onboardRequest);
    }

    public List<SmartBin> getSmartBinData() {
        logger.info("inside service getSmartBinData");
        return smartBinRepo.findAll();

    }

    public String acceptOnboardRequest(String deviceId) {
        logger.info("inside service acceptOnboardRequest {}", deviceId);
        Optional<DeviceOnboardRequest> deviceOnboardRequestOptional = deviceOnboardRequestRepo.findDeviceOnboardRequestByDeviceId(deviceId);
        if (deviceOnboardRequestOptional.isPresent()) {
            DeviceOnboardRequest onboardRequest = deviceOnboardRequestOptional.get();
            onboardRequest.setDeviceOnBoardStatus("Completed");
            onboardRequest.setUpdatedAt(Date.from(Instant.now()));
            deviceOnboardRequestRepo.saveAndFlush(onboardRequest);

            SmartBin smartBin = onboardRequest.getSmartBin();
            smartBin.setSmartbin_status("Completed");
            smartBinRepo.saveAndFlush(smartBin);

            return "ACCEPTED";
        } else {
            logger.error("acceptOnboardRequest: Incorrect device id passed");
            return "FAILED";
        }

    }

    public String rejectOnboardRequest(String deviceId) {
        logger.info("inside service rejectOnboardRequest");
        Optional<DeviceOnboardRequest> deviceOnboardRequestOptional = deviceOnboardRequestRepo.findDeviceOnboardRequestByDeviceId(deviceId);
        if (deviceOnboardRequestOptional.isPresent()) {
            DeviceOnboardRequest onboardRequest = deviceOnboardRequestOptional.get();
            deviceOnboardRequestRepo.deleteById(onboardRequest.getId());
            smartBinRepo.deleteById(onboardRequest.getSmartBin().getId());
            return "ACCEPTED";
        } else {
            logger.error("rejectOnboardRequest: Incorrect device id passed");
            return "FAILED";
        }

    }

    public List<DeviceOnboardRequest> getAllDeviceOnboardRequest() {
        return deviceOnboardRequestRepo.findAll();
    }
}
