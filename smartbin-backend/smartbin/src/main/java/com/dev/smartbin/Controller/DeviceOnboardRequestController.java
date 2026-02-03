package com.dev.smartbin.Controller;

import com.dev.smartbin.DTO.DeviceOnboardRequestDTO;
import com.dev.smartbin.Model.DeviceOnboardRequest;
import com.dev.smartbin.Model.SmartBin;
import com.dev.smartbin.Service.SmartBinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(path = "/deviceOnboardRequest")
public class DeviceOnboardRequestController {

    @Autowired
    private SmartBinService smartBinService;

    @GetMapping(path = "/find")
    public List<DeviceOnboardRequest> getAllDeviceOnboardRequest() {
        return smartBinService.getAllDeviceOnboardRequest();
    }

    @PostMapping(path = "/save")
    public DeviceOnboardRequest saveDeviceOnboardRequest(@RequestBody DeviceOnboardRequestDTO deviceOnboardRequest) {
        return smartBinService.saveDeviceOnboardRequest(deviceOnboardRequest);
    }

    @PutMapping(path = "/accept/{deviceId}")
    public String acceptOnboardRequest(@PathVariable String deviceId){
        return smartBinService.acceptOnboardRequest(deviceId);
    }

    @DeleteMapping(path = "/reject/{deviceId}")
    public String rejectOnboardRequest(@PathVariable String deviceId){
        return smartBinService.rejectOnboardRequest(deviceId);
    }

}
