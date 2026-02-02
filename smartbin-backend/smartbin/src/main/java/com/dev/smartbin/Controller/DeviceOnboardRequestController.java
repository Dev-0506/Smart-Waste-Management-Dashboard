package com.dev.smartbin.Controller;

import com.dev.smartbin.Model.DeviceOnboardRequest;
import com.dev.smartbin.Model.SmartBin;
import com.dev.smartbin.Service.SmartBinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(path = "/deviceOnboardRequest")
public class DeviceOnboardRequestController {

    @Autowired
    private SmartBinService smartBinService;

    @PostMapping(path = "/save")
    public DeviceOnboardRequest saveDeviceOnboardRequest(@RequestBody DeviceOnboardRequest deviceOnboardRequest) {
        return smartBinService.saveDeviceOnboardRequest(deviceOnboardRequest);
    }

}
