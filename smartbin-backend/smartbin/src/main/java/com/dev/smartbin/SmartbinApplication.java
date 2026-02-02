package com.dev.smartbin;

import com.dev.smartbin.Model.DeviceOnboardRequest;
import com.dev.smartbin.Model.MasterBins;
import com.dev.smartbin.Model.SmartBin;
import com.dev.smartbin.Repository.DeviceOnboardRequestRepo;
import com.dev.smartbin.Repository.MasterBinRepo;
import com.dev.smartbin.Repository.SmartBinRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@SpringBootApplication
public class SmartbinApplication implements CommandLineRunner {

	@Autowired
	private MasterBinRepo masterBinRepo;

	@Autowired
	private SmartBinRepo smartBinRepo;

	@Autowired
	private DeviceOnboardRequestRepo deviceOnboardRequestRepo;

	public static void main(String[] args) {
		SpringApplication.run(SmartbinApplication.class, args);
	}

	@Override
	@Transactional
	public void run(String... args) throws Exception {

		MasterBins masterBins=new MasterBins();
		masterBins.setDevice_id("SB_1234");
		masterBins.setDevice_password("SB_1234_PASSWORD");

		MasterBins masterBins1=new MasterBins();
		masterBins1.setDevice_id("SB_9876");
		masterBins1.setDevice_password("SB_9876_PASSWORD");

		List<MasterBins> binsList=new ArrayList<>();
		binsList.add(masterBins);
		binsList.add(masterBins1);

		masterBinRepo.saveAllAndFlush(binsList);

		SmartBin smartBin=new SmartBin();
		smartBin.setDevice_id("SB_1234");
		smartBin.setIs_smartbin_Onboarded(Boolean.TRUE);
		smartBin.setSmartbin_location("Mumbai");
		smartBin.setPercent_filled(30);
		smartBin.setSmartbin_status("Pending");
		smartBin.setSmartbin_batteryStatus("Half");
		smartBin.setInstallationStatus("Active");

		smartBinRepo.save(smartBin);

		DeviceOnboardRequest deviceOnboardRequest=new DeviceOnboardRequest();
		deviceOnboardRequest.setDeviceOnBoardStatus("Requested");
		deviceOnboardRequest.setSmartBin(smartBin);
		deviceOnboardRequest.setCreatedAt(Date.from(Instant.now()));

		deviceOnboardRequestRepo.save(deviceOnboardRequest);

	}
}
