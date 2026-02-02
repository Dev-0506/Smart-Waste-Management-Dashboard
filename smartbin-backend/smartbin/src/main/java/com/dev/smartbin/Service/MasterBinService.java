package com.dev.smartbin.Service;

import com.dev.smartbin.Model.MasterBins;
import com.dev.smartbin.Repository.MasterBinRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MasterBinService {
    private static final Logger logger = LoggerFactory.getLogger(MasterBinService.class);

    @Autowired
    private MasterBinRepo masterBinRepo;

    public List<MasterBins> findAllBin() {
        logger.info("inside findAllBin");
        return masterBinRepo.findAll();
    }



    public Boolean authenticateDevice(String deviceId, String password) {
        logger.info("inside authenticateDevice");
        return findAllBin().stream()
                .anyMatch(p ->
                        (p.getDevice_id().equals(deviceId) &&
                                p.getDevice_password().equalsIgnoreCase(password))
                );
    }


}
