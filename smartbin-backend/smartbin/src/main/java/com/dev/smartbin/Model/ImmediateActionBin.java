package com.dev.smartbin.Model;


import jakarta.persistence.*;

@Entity
@Table(name = "Immediate_Action_Bin")
public class ImmediateActionBin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "immediate_action_bin_id", updatable = false, nullable = false)
    private long id;

    @Column
    private String immediateAction_status;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="smart_bin_id", referencedColumnName = "smart_bin_id")
    private SmartBin smartBin;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getImmediateAction_status() {
        return immediateAction_status;
    }

    public void setImmediateAction_status(String immediateAction_status) {
        this.immediateAction_status = immediateAction_status;
    }

    public SmartBin getSmartBin() {
        return smartBin;
    }

    public void setSmartBin(SmartBin smartBin) {
        this.smartBin = smartBin;
    }

    @Override
    public String toString() {
        return "ImmediateActionBin{" +
                "id=" + id +
                ", immediateAction_status='" + immediateAction_status + '\'' +
                ", smartBin=" + smartBin +
                '}';
    }
}
