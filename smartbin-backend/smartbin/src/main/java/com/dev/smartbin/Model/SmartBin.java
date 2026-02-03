package com.dev.smartbin.Model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name="Smart_Bin")
public class SmartBin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "smart_bin_id", updatable = false, nullable = false)
    private long id;

    @Column
    private String device_id;

    @Column
    private String region;

    @Column
    private String smartbin_location;

    @Column
    private String installationStatus;

    @Column
    private String smartbin_status;

    @Column
    private String smartbin_batteryStatus;

    @Column(
            name = "is_smartbin_onboarded",
            nullable = false,
            columnDefinition = "TINYINT(1)"
    )
    private boolean is_smartbin_Onboarded;


    @Column
    private int percent_filled;

//    /**
//     * 1-to-1 relationship with DEVICE_ONBOARD_REQUEST
//     * SmartBin is the parent entity
//     */
//    @OneToOne(mappedBy = "smartBin", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    private DeviceOnboardRequest deviceOnboardRequest;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDevice_id() {
        return device_id;
    }

    public void setDevice_id(String device_id) {
        this.device_id = device_id;
    }

    public String getSmartbin_location() {
        return smartbin_location;
    }

    public void setSmartbin_location(String smartbin_location) {
        this.smartbin_location = smartbin_location;
    }

    public String getInstallationStatus() {
        return installationStatus;
    }

    public void setInstallationStatus(String installationStatus) {
        this.installationStatus = installationStatus;
    }

    public String getSmartbin_status() {
        return smartbin_status;
    }

    public void setSmartbin_status(String smartbin_status) {
        this.smartbin_status = smartbin_status;
    }

    public String getSmartbin_batteryStatus() {
        return smartbin_batteryStatus;
    }

    public void setSmartbin_batteryStatus(String smartbin_batteryStatus) {
        this.smartbin_batteryStatus = smartbin_batteryStatus;
    }

    public boolean isIs_smartbin_Onboarded() {
        return is_smartbin_Onboarded;
    }

    public void setIs_smartbin_Onboarded(boolean is_smartbin_Onboarded) {
        this.is_smartbin_Onboarded = is_smartbin_Onboarded;
    }

    public int getPercent_filled() {
        return percent_filled;
    }

    public void setPercent_filled(int percent_filled) {
        this.percent_filled = percent_filled;
    }

//    public DeviceOnboardRequest getDeviceOnboardRequest() {
//        return deviceOnboardRequest;
//    }
//
//    public void setDeviceOnboardRequest(DeviceOnboardRequest deviceOnboardRequest) {
//        this.deviceOnboardRequest = deviceOnboardRequest;
//    }


    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    @Override
    public String toString() {
        return "SmartBin{" +
                "id=" + id +
                ", device_id='" + device_id + '\'' +
                ", smartbin_location='" + smartbin_location + '\'' +
                ", installationStatus='" + installationStatus + '\'' +
                ", smartbin_status='" + smartbin_status + '\'' +
                ", smartbin_batteryStatus='" + smartbin_batteryStatus + '\'' +
                ", is_smartbin_Onboarded=" + is_smartbin_Onboarded +
                ", percent_filled=" + percent_filled +
                '}';
    }
}
