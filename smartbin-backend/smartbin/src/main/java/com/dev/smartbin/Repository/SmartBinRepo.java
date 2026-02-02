package com.dev.smartbin.Repository;

import com.dev.smartbin.Model.SmartBin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SmartBinRepo extends JpaRepository<SmartBin, Long> {
}
