package com.dev.smartbin.Controller;


import com.dev.smartbin.Model.SmartBin;
import com.dev.smartbin.Service.SmartBinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(path = "/smartbin")
public class SmartBinRestController {

    @Autowired
    private SmartBinService smartBinService;

    @PostMapping(path = "/save")
    public SmartBin saveSmartBinData(@RequestBody SmartBin smartBin) {
        return smartBinService.saveSmartBinData(smartBin);
    }

    @GetMapping(path = "/find")
    public List<SmartBin> getSmartBinData() {
        return smartBinService.getSmartBinData();
    }

}
