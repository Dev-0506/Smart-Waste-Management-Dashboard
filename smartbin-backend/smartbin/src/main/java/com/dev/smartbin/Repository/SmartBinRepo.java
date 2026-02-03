package com.dev.smartbin.Repository;

import com.dev.smartbin.Model.SmartBin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SmartBinRepo extends JpaRepository<SmartBin, Long> {

    @Query("SELECT s FROM SmartBin s WHERE s.device_id = :device_id")
    Optional<SmartBin> findSmartBinByDeviceId(@Param("device_id") String device_id);

}
