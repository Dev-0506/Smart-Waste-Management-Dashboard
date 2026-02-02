package com.dev.smartbin.Model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "Device_Onboard_Request")
public class DeviceOnboardRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_onboard_request_id", updatable = false, nullable = false)
    private long id;

    @Column
    private String deviceOnBoardStatus;

    @CreatedDate
    @Column(name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="smart_bin_id", referencedColumnName = "smart_bin_id")
    private SmartBin smartBin;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDeviceOnBoardStatus() {
        return deviceOnBoardStatus;
    }

    public void setDeviceOnBoardStatus(String deviceOnBoardStatus) {
        this.deviceOnBoardStatus = deviceOnBoardStatus;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public SmartBin getSmartBin() {
        return smartBin;
    }

    public void setSmartBin(SmartBin smartBin) {
        this.smartBin = smartBin;
    }

    @Override
    public String toString() {
        return "DeviceOnboardRequest{" +
                "id=" + id +
                ", deviceOnBoardStatus='" + deviceOnBoardStatus + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", smartBin=" + smartBin +
                '}';
    }
}
