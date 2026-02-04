package com.dev.smartbin.Repository;

import com.dev.smartbin.Model.Notification;
import com.dev.smartbin.Model.SmartBin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {
}
