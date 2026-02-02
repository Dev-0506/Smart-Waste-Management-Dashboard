package com.dev.smartbin.Controller;

import com.dev.smartbin.Model.DeviceOnboardRequest;
import com.dev.smartbin.Model.SmartBin;
import com.dev.smartbin.Service.SmartBinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
