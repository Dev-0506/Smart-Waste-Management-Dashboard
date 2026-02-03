package com.dev.smartbin.Repository;


import com.dev.smartbin.Model.DeviceOnboardRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DeviceOnboardRequestRepo extends JpaRepository<DeviceOnboardRequest, Long> {

    @Query("""
                SELECT d
                FROM DeviceOnboardRequest d
                WHERE d.smartBin.device_id = :device_id
            """)
    Optional<DeviceOnboardRequest> findDeviceOnboardRequestByDeviceId(@Param("device_id") String device_id);

}
