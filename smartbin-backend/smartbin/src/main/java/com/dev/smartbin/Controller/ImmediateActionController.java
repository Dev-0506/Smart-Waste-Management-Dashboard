package com.dev.smartbin.Controller;


import com.dev.smartbin.Model.DeviceOnboardRequest;
import com.dev.smartbin.Model.ImmediateActionBin;
import com.dev.smartbin.Service.SmartBinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(path = "/immediateActionBin")
public class ImmediateActionController {

    @Autowired
    private SmartBinService smartBinService;

    @GetMapping(path = "/find")
    public List<ImmediateActionBin> getAllImmediateActionBin() {
        return smartBinService.getAllImmediateActionBin();
    }


}
