package com.dev.smartbin.DTO;

import java.util.Date;

public class DeviceOnboardRequestDTO {

    private String device_id;
    private String deviceOnBoardStatus;
    private Date createdAt;

    public String getDevice_id() {
        return device_id;
    }

    public void setDevice_id(String device_id) {
        this.device_id = device_id;
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

    @Override
    public String toString() {
        return "DeviceOnboardRequestDTO{" +
                "device_id='" + device_id + '\'' +
                ", deviceOnBoardStatus='" + deviceOnBoardStatus + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
