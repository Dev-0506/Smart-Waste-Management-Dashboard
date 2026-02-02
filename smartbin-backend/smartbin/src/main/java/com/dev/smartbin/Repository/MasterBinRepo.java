package com.dev.smartbin.Repository;

import com.dev.smartbin.Model.MasterBins;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MasterBinRepo extends JpaRepository<MasterBins, Long> {
}
