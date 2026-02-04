package com.dev.smartbin.Model;


import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;

@Entity
@Table(name = "Notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id", updatable = false, nullable = false)
    private long id;

    @Column
    private String type;

    @Column
    private String message;

    @Column
    private String severity;


    @CreatedDate
    @Column(name = "createdAt")
    private Date createdAt;

    @Column(name = "is_read", nullable = false, columnDefinition = "TINYINT(1)")
    private boolean read;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="smart_bin_id", referencedColumnName = "smart_bin_id")
    private SmartBin smartBin;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public SmartBin getSmartBin() {
        return smartBin;
    }

    public void setSmartBin(SmartBin smartBin) {
        this.smartBin = smartBin;
    }

    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", type='" + type + '\'' +
                ", message='" + message + '\'' +
                ", severity='" + severity + '\'' +
                ", createdAt=" + createdAt +
                ", read=" + read +
                ", smartBin=" + smartBin +
                '}';
    }
}
