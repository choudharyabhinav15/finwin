package com.db.app.finwin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name="CUSTOMER_GOALS")


public class CustomerGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ID")
    Long id;


    @Column(name="GOAL_DUE_DATE")
    Date dueDate;

    @Column(name="GOAL_AMOUNT")
    Double goalAmount;

    @Column(name="CURRENCY")
    String currency;


    @ManyToMany
    @JoinColumn(name = "CUSTOMER_ID",referencedColumnName = "ID",nullable = false,updatable = false)
    private Customer customer;
}