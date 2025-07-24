package com.db.app.finwin.entity;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name="CUSTOMER_EXPENSE")
public class CustomerExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ID")
    Long id;

    @Column(name ="EXPENSE_ID")
    Long expenseId;

    @Column(name="EXPENSE_AMOUNT")
    Double expenseAmount;
    @ManyToOne
    @JoinColumn(name = "CUSTOMER_ID",referencedColumnName = "ID",nullable = false,updatable = false)
    private Customer customer;

}

