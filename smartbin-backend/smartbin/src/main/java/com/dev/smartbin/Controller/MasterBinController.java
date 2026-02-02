package com.dev.smartbin.Controller;


import com.dev.smartbin.Model.MasterBins;
import com.dev.smartbin.Repository.MasterBinRepo;
import com.dev.smartbin.Service.MasterBinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(path = "/masterbins")
public class MasterBinController {

    @Autowired
    private MasterBinService masterBinService;

    @GetMapping(path = "/find")
    public List<MasterBins> findAllBin() {
        return masterBinService.findAllBin();
    }

    @GetMapping(path = "/authenticate/{deviceId}/{password}")
    public Boolean authenticateDevice(@PathVariable String deviceId, @PathVariable String password) {
        return masterBinService.authenticateDevice(deviceId, password);
    }
}
