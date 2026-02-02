package com.dev.smartbin.Model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name="Master_Bin")
public class MasterBins {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "master_bin_id", updatable = false, nullable = false)
    private long id;

    @Column
    private String device_id;

    @Column
    private String device_password;

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

    public String getDevice_password() {
        return device_password;
    }

    public void setDevice_password(String device_password) {
        this.device_password = device_password;
    }

    @Override
    public String toString() {
        return "MasterBins{" +
                "id=" + id +
                ", device_id='" + device_id + '\'' +
                ", device_password='" + device_password + '\'' +
                '}';
    }
}
