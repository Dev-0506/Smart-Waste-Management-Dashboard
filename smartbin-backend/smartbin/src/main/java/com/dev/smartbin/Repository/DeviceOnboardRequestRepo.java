package com.dev.smartbin.Repository;


import com.dev.smartbin.Model.DeviceOnboardRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DeviceOnboardRequestRepo extends JpaRepository<DeviceOnboardRequest, Long> {
}
