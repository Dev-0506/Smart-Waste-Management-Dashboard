package com.dev.smartbin.Service;

import com.dev.smartbin.DTO.DeviceOnboardRequestDTO;
import com.dev.smartbin.Model.DeviceOnboardRequest;
import com.dev.smartbin.Model.ImmediateActionBin;
import com.dev.smartbin.Model.SmartBin;
import com.dev.smartbin.Repository.DeviceOnboardRequestRepo;
import com.dev.smartbin.Repository.ImmediateActionBinRepo;
import com.dev.smartbin.Repository.SmartBinRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    private ImmediateActionBinRepo immediateActionBinRepo;

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
            smartBin.setSmartbin_status("Active");
            smartBin.setIs_smartbin_Onboarded(true);
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

    public String addGarbageToBin(String deviceId, int fillPercent) {
        if(fillPercent > 100){
            return null;
        }
        Optional<SmartBin> smartBinOpt = smartBinRepo.findSmartBinByDeviceId(deviceId);
        if (smartBinOpt.isPresent()) {
            SmartBin smartBin= smartBinOpt.get();
            smartBin.setPercent_filled(fillPercent);
            SmartBin smartBinResultOutput = smartBinRepo.saveAndFlush(smartBin);

            if(fillPercent > 75){
                takeNecessaryAction(smartBinResultOutput);
            }else{
                logger.info("addGarbageToBin: fillPercent is under Control, No Necessary action");
            }
            return fillPercent +"% Garbage is Added to the Bin "+deviceId;

        } else {
            logger.error("addGarbageToBin: Incorrect device id passed");
            return "Incorrect Device Id Passed";
        }
    }

    private void takeNecessaryAction(SmartBin smartBin) {

        ImmediateActionBin immediateActionBin=new ImmediateActionBin();
        immediateActionBin.setSmartBin(smartBin);
        if(smartBin.getPercent_filled() > 75 && smartBin.getPercent_filled() < 85){
            immediateActionBin.setImmediateAction_status("Medium");
        } else if (smartBin.getPercent_filled() >= 85 && smartBin.getPercent_filled() < 95) {
            immediateActionBin.setImmediateAction_status("High");
        }else {
            immediateActionBin.setImmediateAction_status("Critical");
        }
        immediateActionBinRepo.saveAndFlush(immediateActionBin);
    }

    public List<ImmediateActionBin> getAllImmediateActionBin() {
        List<ImmediateActionBin> immediateActionBins= immediateActionBinRepo.findAll();
        return immediateActionBins.stream().filter(p->"Active".equalsIgnoreCase(p.getSmartBin().getSmartbin_status())).toList();
    }


    @Scheduled(cron = "0 0 * * * ?")
    @Transactional
    public void scheduleBatteryDrainagePerHour() {
        logger.info("ScheduleBatteryDrainagePerHour running now");
        List<SmartBin> smartBinsList = getSmartBinData();
        for (SmartBin bin : smartBinsList) {
            String batteryStr = bin.getSmartbin_batteryStatus();
            if (batteryStr == null) {
                continue; // skip invalid data safely
            }
            int battery;
            try {
                battery = Integer.parseInt(batteryStr);
            } catch (NumberFormatException e) {
                logger.warn("Invalid battery value for deviceId {}: {}",
                        bin.getDevice_id(), batteryStr);
                continue;
            }
            // Drain battery by 1% per hour
            battery = Math.max(battery - 1, 0);
            bin.setSmartbin_batteryStatus(String.valueOf(battery));
        }
        smartBinRepo.saveAll(smartBinsList);
    }

}
